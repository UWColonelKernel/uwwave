import $ from 'jquery'
import { getHttp, RequestMethod, sendForm } from '../common/api'
import { AxiosResponse } from 'axios'
import {
    scrapeJobBoardHome,
    scrapeJobPostingForWtrButtonAction,
    scrapeJobPostingPage,
    scrapeJobTableRowCoop,
    scrapeJobTableRowFulltime,
    scrapeJobTableRowOther,
    scrapePostingsTable,
    scrapeQuickSearches,
    scrapeWorkTermRating,
    scrapeWorkTermRatingButton,
} from './scraperUtil'
import { updateLocalStorage } from '../common/storage'
import asyncPool from 'tiny-async-pool'
import { getJobDataKey, JobPosting } from '../shared/job'
import { getCompanyDivisionDataKey } from '../shared/company'
import { JOB_BOARD_SPEC, JobBoard } from '../shared/jobBoard'

const DASHBOARD_URL =
    'https://waterlooworks.uwaterloo.ca/myAccount/dashboard.htm'

enum ScrapeStage {
    standby,
    defaultSearch,
    forMyProgram,
    viewed,
    workTermRatings,
    finished,
}

interface PostingsTableRequestData {
    action: string
    page: number
    performNewSearch?: boolean
}

interface WorkTermRatingButtonRequest {
    formObj: object
    jobId: number
}

class Scraper {
    public stage: ScrapeStage = ScrapeStage.standby
    public stageProgress: number = 0
    public stageTarget: number = 1
    public jobBoard: JobBoard = JobBoard.coop
    public pendingWorkTermRatings: WorkTermRatingButtonRequest[] = []

    private advanceStage() {
        this.stageProgress = 0 // progress resets to 0
        this.stageTarget = 1 // need to be greater than 0 to avoid divide by 0 and allow entry into while loop
        this.stage += 1
    }

    private scraperSendForm(data: object): Promise<AxiosResponse<any, any>> {
        return sendForm(
            JOB_BOARD_SPEC[this.jobBoard].url,
            RequestMethod.POST,
            data,
        )
    }

    private async scrapeJob(tableRow: HTMLElement) {
        let rowScrape
        switch (this.jobBoard) {
            case JobBoard.coop:
                rowScrape = scrapeJobTableRowCoop(tableRow)
                break
            case JobBoard.fulltime:
                rowScrape = scrapeJobTableRowFulltime(tableRow)
                break
            case JobBoard.other:
                rowScrape = scrapeJobTableRowOther(tableRow)
                break
        }
        if (!rowScrape) {
            console.warn(
                `Failed to scrape job with html: ${$(tableRow).html()}}`,
            )
            return
        }

        if (this.stage !== ScrapeStage.forMyProgram) {
            const jobPostingResp = await this.scraperSendForm(rowScrape.formObj)
            const jobPostingDoc = $.parseHTML(jobPostingResp.data)
            const scrapeResult = scrapeJobPostingPage(jobPostingDoc)
            await updateLocalStorage(
                getJobDataKey(rowScrape.jobId, this.jobBoard),
                {
                    jobId: rowScrape.jobId,
                    jobBoard: this.jobBoard,
                    postingListData: rowScrape.postingListData,
                    pageData: scrapeResult,
                } as JobPosting,
            )
            const wtrScrapeResult =
                scrapeJobPostingForWtrButtonAction(jobPostingDoc)
            if (wtrScrapeResult) {
                this.pendingWorkTermRatings.push({
                    jobId: rowScrape.jobId,
                    formObj: wtrScrapeResult,
                })
            }
        } else {
            await updateLocalStorage(
                getJobDataKey(rowScrape.jobId, this.jobBoard),
                {
                    isForMyProgram: true,
                },
            )
        }

        console.log(`Scraped job with ID ${rowScrape.jobId}`)
    }

    // Must be closure to run in async pool
    private scrapeWorkTermRating = async (
        wtrButtonRequest: WorkTermRatingButtonRequest,
    ) => {
        const workTermRatingButtonResp = await this.scraperSendForm(
            wtrButtonRequest.formObj,
        )
        const workTermRatingButtonDoc = $.parseHTML(
            workTermRatingButtonResp.data,
            document,
            true,
        )
        const workTermRatingButtonScrape = scrapeWorkTermRatingButton(
            workTermRatingButtonDoc,
        )
        if (!workTermRatingButtonScrape) {
            return
        }

        const workTermRatingResp = await this.scraperSendForm(
            workTermRatingButtonScrape,
        )
        const workTermRatingDoc = $.parseHTML(
            workTermRatingResp.data,
            document,
            true,
        )
        const workTermRatingScrape = scrapeWorkTermRating(workTermRatingDoc)
        if (!workTermRatingScrape) {
            return
        }

        await updateLocalStorage(
            getCompanyDivisionDataKey(
                workTermRatingButtonScrape.reportHolderId,
            ),
            workTermRatingScrape,
        )
        await updateLocalStorage(
            getJobDataKey(wtrButtonRequest.jobId, this.jobBoard),
            {
                divisionId: workTermRatingButtonScrape.reportHolderId,
            },
        )

        console.log(
            `Scraped company with division ID ${workTermRatingButtonScrape.reportHolderId}`,
        )
    }

    private async scrapeAllPages(searchAction: string) {
        let page = 1

        while (this.stageProgress < this.stageTarget) {
            // Pull the postings table
            const requestData: PostingsTableRequestData = {
                action: searchAction,
                page,
            }
            if (page === 1) {
                requestData.performNewSearch = true
            }
            const postingsTableResp = await this.scraperSendForm(requestData)
            const postingsTableDoc = $.parseHTML(postingsTableResp.data)
            const scrapeResult = scrapePostingsTable(postingsTableDoc)
            if (page != scrapeResult.pageNumber) {
                console.log(
                    `${this.stage}) No more pages to scrape. Actual page ${scrapeResult.pageNumber}. Requested page ${page}.`,
                )
                break
            }

            // Set stage target on first page
            if (page === 1) {
                this.stageTarget = scrapeResult.totalCount
            }

            // Scrape the jobs
            const scrapeJobPromises: Promise<void>[] = []

            const table = $(postingsTableDoc).find('#postingsTable')
            table.find('tbody tr').each((_, tableRow) => {
                const scrapeJobPromise = this.scrapeJob(tableRow).then(() => {
                    this.stageProgress += 1
                })
                scrapeJobPromises.push(scrapeJobPromise)
            })

            await Promise.all(scrapeJobPromises)

            console.log(`Done scraping page. Progress: ${this.stageProgress}`)

            // Next page
            page += 1
        }
    }

    public async scrapeJobBoard() {
        const scrapeViewed = $('#ck_scrapeViewedCheckbox').prop('checked')

        const jobBoardHomeResp = await getHttp(
            JOB_BOARD_SPEC[this.jobBoard].url,
        )
        const jobBoardHomeDoc = $.parseHTML(
            jobBoardHomeResp.data,
            document,
            true,
        )

        this.stage = ScrapeStage.standby

        const jobBoardHomeScrape = scrapeJobBoardHome(jobBoardHomeDoc)
        if (
            !jobBoardHomeScrape.searchAction ||
            !jobBoardHomeScrape.reloadQuickSearchAction
        ) {
            throw `Unable to scrape job board home for necessary form actions`
        }

        const quickSearchResp = await this.scraperSendForm({
            action: jobBoardHomeScrape.reloadQuickSearchAction,
        })
        const quickSearchDoc = $.parseHTML(quickSearchResp.data)
        const quickSearchScrape = scrapeQuickSearches(quickSearchDoc)

        this.advanceStage()
        console.log(
            `${this.stage}) Scraping jobs available from default search`,
        )
        await this.scrapeAllPages(jobBoardHomeScrape.searchAction)

        this.advanceStage()
        console.log(`${this.stage}) Scraping to tag For My Program jobs`)
        if (quickSearchScrape.forMyProgramAction) {
            console.log(
                `${this.stage}) "For My Program" action found, scraping`,
            )
            await this.scrapeAllPages(quickSearchScrape.forMyProgramAction)
        } else {
            console.warn(
                `${this.stage}) "For My Program" action not found, skipping`,
            )
        }

        this.advanceStage()
        if (scrapeViewed) {
            console.log(
                `${this.stage}) Scrape "Viewed" is checked, scraping "Viewed" jobs`,
            )
            if (quickSearchScrape.viewedAction) {
                console.log(`${this.stage}) "Viewed" action found, scraping`)
                await this.scrapeAllPages(quickSearchScrape.viewedAction)
            } else {
                console.warn(
                    `${this.stage}) "Viewed" action not found, skipping`,
                )
            }
        } else {
            console.log(
                `${this.stage}) Scrape "Viewed" is not checked, skipping`,
            )
        }

        this.advanceStage()
        console.log(`${this.stage}) Scraping work term ratings`)
        for await (const result of asyncPool(
            100,
            this.pendingWorkTermRatings,
            this.scrapeWorkTermRating,
        )) {
            /* empty */
        }

        this.advanceStage()
        console.log('Scraping done!')
    }
}

const scraper = new Scraper()
scraper.jobBoard = JobBoard.coop

const scrapeMain = () => {
    if (
        scraper.stage === ScrapeStage.standby ||
        scraper.stage === ScrapeStage.finished
    ) {
        console.log('Starting scraper...')
        scraper.scrapeJobBoard().then(() => {})
    } else {
        console.log('Scraper still running, please wait...')
    }
}

const clickScrapeMain = () => {
    console.log('Clicked scrape main button')
    // hide the first time screen
    $("#ck_screen-1").hide()

    // scrapeMain()

    // show completed screen
    $("#ck_screen-2").show()
}

window.addEventListener('ck_scrapeMain', scrapeMain)
window.addEventListener('ck_clickScrapeMain', clickScrapeMain)
