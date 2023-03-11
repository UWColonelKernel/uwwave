// Calling the action gives you links to "For My Program", "Applied To", "Shortlist", "Viewed", etc.
import $ from 'jquery'
import { PostingListData, PostingListDataCoop, PostingListDataFulltime, PostingListDataOther } from '../types/job.types'

// Glossary of pages
// Job board home: page with "search" button and quick search links
// Job postings table: page with table of up to 100 jobs
// Job table row: one row in the job postings table, corresponds to one job
// Job posting: page with the information on a specific job
// Work term rating: sub-page with the information on a company "division"

export interface JobBoardHomeScrape {
    reloadQuickSearchAction: string | undefined
    searchAction: string | undefined
}
export interface PostingsTableScrape {
    pageNumber: number
    startCount: number
    endCount: number
    totalCount: number
}

export interface QuickSearchesScrape {
    forMyProgramAction: string | undefined
    viewedAction: string | undefined
}

interface JobTableRowScrapeBase {
    jobId: number
    formObj: object
}
export interface JobTableRowScrapeCoop extends JobTableRowScrapeBase {
    postingListData: PostingListDataCoop
}
export interface JobTableRowScrapeFulltime extends JobTableRowScrapeBase {
    postingListData: PostingListDataFulltime
}
export interface JobTableRowScrapeOther extends JobTableRowScrapeBase {
    postingListData: PostingListDataOther
}

export function scrapeJobBoardHome(jobBoardHome: any): JobBoardHomeScrape {
    let reloadQuickSearchAction: string | undefined;
    $(jobBoardHome).find('script').each(function (index, script) {
        const text = $(script).text();
        const funcIndex = text.indexOf("function reloadQuickSearchCounts");
        if (funcIndex !== -1) {
            const searchStr = "request.action = ";
            const actionIndex = text.indexOf(searchStr, funcIndex);
            const start = text.indexOf('"', actionIndex);
            const end = text.indexOf('"', start + 1);

            reloadQuickSearchAction = text.substring(start+1, end);
        }
    });
    const searchAction = $(jobBoardHome).find('#widgetSearch input[name="action"]').attr('value');

    return { reloadQuickSearchAction, searchAction };
}

function getActionFromQuickSearchName(quickSearches: any, identifier: string): string | undefined {
    const link = $(quickSearches).find(`tr a:contains("${identifier}")`);
    const onclick = $(link).attr('onclick');
    if (!onclick) {
        return undefined
    }
    const offset = "displayQuickSearch('".length;
    const start = onclick.indexOf("displayQuickSearch('") + offset;
    const end = onclick.indexOf("'", start);
    return onclick.substring(start, end);
}

export function scrapeQuickSearches(quickSearches: any): QuickSearchesScrape {
    const forMyProgramAction = getActionFromQuickSearchName(quickSearches, "For My Program")
    const viewedAction = getActionFromQuickSearchName(quickSearches, "Viewed")

    return { forMyProgramAction, viewedAction }
}

export function scrapePostingsTable(postingsTable: any): PostingsTableScrape {
    const pageNumberElem = $(postingsTable).find('#currentPageff45d44d8af8');
    const pageNumber = Number(pageNumberElem.attr('value'));

    const startCount = Number($(postingsTable).find('#totalOverAllDocs').text());
    const endCount = Number($(postingsTable).find('#totalOverAllPacks').text());

    const totalCount = Number($(postingsTable).find('#postingsTablePlaceholder div.orbis-posting-actions span').eq(0).text());

    return { pageNumber, startCount, endCount, totalCount }
}

export function computeNumberPostingsToScrape(scrape: PostingsTableScrape): number {
    return scrape.endCount - scrape.startCount + 1;
}

function getJobTableCellValue(tableRow: any, position: number, useDataToTitleAttr: boolean): string | undefined {
    if (useDataToTitleAttr) {
        return $(tableRow).find(`td:nth-child(${position})`).attr('data-totitle')
    } else {
        return $(tableRow).find(`td:nth-child(${position})`).text().trim();
    }
}

function getJobTableRowIdAndFormObj(tableRow: any, jobIdPos: number, linkPos: number): JobTableRowScrapeBase | undefined {
    // get job ID
    const jobIdStr = getJobTableCellValue(tableRow, jobIdPos, false);
    if (!jobIdStr) {
        return undefined
    }
    const jobId = Number(jobIdStr)

    // get the form data to open the job posting
    const jobTitleLink = $(tableRow).find(`td:nth-child(${linkPos}) a`);
    const onclick = $(jobTitleLink).attr('onclick');
    if (!onclick) {
        return undefined
    }
    const formObjStr = onclick.substring(onclick.indexOf("{"), onclick.indexOf("}") + 1).replace(/'/g, '"');
    const formObj = JSON.parse(formObjStr);
    if (!formObj) {
        return undefined
    }

    return { jobId, formObj }
}

export function scrapeJobTableRowCoop(tableRow: any): JobTableRowScrapeCoop | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataCoop = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || "",
        company: getJobTableCellValue(tableRow, 5, true) || "",
        division: getJobTableCellValue(tableRow, 6, true) || "",
        openings: Number(getJobTableCellValue(tableRow, 7, false) || ""),
        internalStatus: getJobTableCellValue(tableRow, 8, false) || "",
        location: getJobTableCellValue(tableRow, 9, false) || "",
        level: getJobTableCellValue(tableRow, 10, false) || "",
        applications: Number(getJobTableCellValue(tableRow, 11, false) || ""),
        deadline: getJobTableCellValue(tableRow, 12, false) || "",
    }

    return { jobId, formObj, postingListData }
}

export function scrapeJobTableRowFulltime(tableRow: any): JobTableRowScrapeFulltime | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataFulltime = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || "",
        company: getJobTableCellValue(tableRow, 5, true) || "",
        division: getJobTableCellValue(tableRow, 6, true) || "",
        positionType: getJobTableCellValue(tableRow, 7, false) || "",
        internalStatus: getJobTableCellValue(tableRow, 8, false) || "",
        city: getJobTableCellValue(tableRow, 9, false) || "",
        deadline: getJobTableCellValue(tableRow, 10, false) || "",
    }

    return { jobId, formObj, postingListData }
}

export function scrapeJobTableRowOther(tableRow: any): JobTableRowScrapeOther | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataOther = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || "",
        company: getJobTableCellValue(tableRow, 5, true) || "",
        division: getJobTableCellValue(tableRow, 6, true) || "",
        positionType: getJobTableCellValue(tableRow, 7, false) || "",
        internalStatus: getJobTableCellValue(tableRow, 8, false) || "",
        location: getJobTableCellValue(tableRow, 9, false) || "",
        city: getJobTableCellValue(tableRow, 10, false) || "",
        deadline: getJobTableCellValue(tableRow, 11, false) || "",
    }

    return { jobId, formObj, postingListData }
}
