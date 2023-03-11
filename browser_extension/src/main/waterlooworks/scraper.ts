import $ from 'jquery'
import { RequestMethod, sendForm } from '../common/api'
import axios, { AxiosResponse } from 'axios'
import {
    scrapeJobBoardHome, scrapeJobTableRowCoop, scrapeJobTableRowFulltime, scrapeJobTableRowOther,
    scrapePostingsTable,
    scrapeQuickSearches,
} from './scraperUtil'

const DASHBOARD_URL = "https://waterlooworks.uwaterloo.ca/myAccount/dashboard.htm"

enum ScrapeStage {
    standby,
    defaultSearch,
    forMyProgram,
    viewed,
    workTermRatings,
    finished,
}

enum JobBoard {
    coop ,
    fulltime,
    other,
}

interface JobBoardSpec {
    url: string
}

const JOB_BOARD_SPEC: { [jobBoard in JobBoard]: JobBoardSpec } = {
    [JobBoard.coop]: {
        url: "https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm"
    },
    [JobBoard.fulltime]: {
        url: "https://waterlooworks.uwaterloo.ca/myAccount/hire-waterloo/full-time-jobs/jobs-postings.htm"
    },
    [JobBoard.other]: {
        url: "https://waterlooworks.uwaterloo.ca/myAccount/hire-waterloo/other-jobs/jobs-postings.htm"
    }
}

interface PostingsTableRequestData {
    action: string
    page: number
    performNewSearch?: boolean
}

class Scraper {
    public stage: ScrapeStage = ScrapeStage.standby
    public stageProgress: number = 0
    public stageTarget: number = 1
    public jobBoard: JobBoard = JobBoard.coop

    private advanceStage() {
        this.stageProgress = 0 // progress resets to 0
        this.stageTarget = 1 // need to be greater than 0 to avoid divide by 0 and allow entry into while loop
        this.stage += 1
    }

    private scraperSendForm(data: object): Promise<AxiosResponse<any, any>> {
        return sendForm(JOB_BOARD_SPEC[this.jobBoard].url, RequestMethod.POST, data)
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
            console.warn(`Failed to scrape job with html: ${$(tableRow).html()}}`)
            return
        }

        console.log(`Scraped job with ID ${rowScrape.jobId}`)
    }

    private async scrapeAllPages(searchAction: string) {
        let page = 1

        while (this.stageProgress < this.stageTarget) {
            // Pull the postings table
            const requestData: PostingsTableRequestData = { action: searchAction, page }
            if (page === 1) {
                requestData.performNewSearch = true
            }
            const postingsTableResp = await this.scraperSendForm(requestData);
            const postingsTableDoc = $.parseHTML(postingsTableResp.data)
            const scrapeResult = scrapePostingsTable(postingsTableDoc)
            if (page != scrapeResult.pageNumber) {
                console.log(`${this.stage}) No more pages to scrape. Actual page ${scrapeResult.pageNumber}. Requested page ${page}.`);
                break;
            }

            // Set stage target on first page
            if (page === 1) {
                this.stageTarget = scrapeResult.totalCount
            }

            // Scrape the jobs
            const scrapeJobPromises: Promise<void>[] = []

            const table = $(postingsTableDoc).find('#postingsTable');
            table.find('tbody tr').each((_, tableRow) => {
                const scrapeJobPromise = this.scrapeJob(tableRow).then(() => { this.stageProgress += 1 })
                scrapeJobPromises.push(scrapeJobPromise)
            });

            await Promise.all(scrapeJobPromises)

            // Next page
            page += 1
        }
    }

    public async scrapeJobBoard() {
        const jobBoardHomeResp = await axios.get(JOB_BOARD_SPEC[this.jobBoard].url)
        const jobBoardHomeDoc = $.parseHTML(jobBoardHomeResp.data, document, true);

        this.stage = ScrapeStage.standby

        const jobBoardHomeScrape = scrapeJobBoardHome(jobBoardHomeDoc);
        if (!jobBoardHomeScrape.searchAction || !jobBoardHomeScrape.reloadQuickSearchAction) {
            console.error(`Unable to scrape job board home for necessary form actions!`);
            return;
        }

        const quickSearchResp = await this.scraperSendForm({ action: jobBoardHomeScrape.reloadQuickSearchAction });
        const quickSearchDoc = $.parseHTML(quickSearchResp.data)
        const quickSearchScrape = scrapeQuickSearches(quickSearchDoc);

        this.advanceStage()
        console.log(`${this.stage}) Scraping jobs available from default search`);
        await this.scrapeAllPages(jobBoardHomeScrape.searchAction)

        this.advanceStage()
        console.log(`${this.stage}) Scraping to tag For My Program jobs`)
        if (quickSearchScrape.forMyProgramAction) {
            console.log(`${this.stage}) "For My Program" action found, scraping`)
            await this.scrapeAllPages(quickSearchScrape.forMyProgramAction)
        } else {
            console.warn(`${this.stage}) "For My Program" action not found, skipping`)
        }

        this.advanceStage()
        console.log(`${this.stage}) Scraping Viewed jobs`);
        if (quickSearchScrape.viewedAction) {
            console.log(`${this.stage}) "Viewed" action found, scraping`)
            await this.scrapeAllPages(quickSearchScrape.viewedAction)
        } else {
            console.warn(`${this.stage}) "Viewed" action not found, skipping`)
        }

        console.log('Scraping done!');
    }
}

const scraper = new Scraper()
scraper.jobBoard = JobBoard.fulltime

const scrapeMain = () => {
    if (scraper.stage === ScrapeStage.standby || scraper.stage === ScrapeStage.finished) {
        console.log("Starting scraper...")
        scraper.scrapeJobBoard().then(() => {})
    } else {
        console.log("Scraper still running, please wait...");
    }
}

window.addEventListener("ck_scrapeMain", scrapeMain);

