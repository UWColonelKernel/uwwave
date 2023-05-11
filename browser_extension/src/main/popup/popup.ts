import $ from 'jquery'
import * as browser from 'webextension-polyfill'
import { addLocalStorageListener, setLocalStorage } from '../common/storage'
import { exportJSON, getCompanyCount, getJobCount, openJsonPicker, setupJsonPickerHandler } from './dataReader'
import { getExtensionVersion } from '../common/runtime'
import { ScrapeStage, terminalScrapeStages } from '../waterlooworks/scraper'

enum BackgroundColors {
    GREY = 'grey-bg',
    BLUE = 'blue-bg',
    RED = 'red-bg',
    GREEN = 'green-bg',
}

enum Views {
    NOT_ON_WW = 'not-on-ww',
    ON_WW_FIRST_TIME = 'on-ww-first-time',
    WW_SCRAPE_IN_PROGRESS = 'ww-scrape-in-progress',
    WW_SCRAPE_FAILED = 'ww-scrape-failed',
    WW_SCRAPE_COMPLETED = 'ww-scrape-completed',
    SETTINGS = 'settings',
    LOADING = 'loading'
}

async function trySendMessageToWaterlooWorks(op: string): Promise<any> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    var activeTab = tabs[0];
    var activeTabId = activeTab.id;
    var result = null;
    if (activeTabId) {
        console.log('sending');
        try {
            result = await browser.tabs.sendMessage(activeTabId, { op })
        } catch {
            result = null
        }
    }
    return result
}

function resetViews() {
    const mainContainer = $("#main-container")
    for (const bgColor of Object.values(BackgroundColors)) {
        mainContainer.removeClass(bgColor)
    }
    for (const view of Object.values(Views)) {
        $(`#${view}`).hide()
    }
}

function showView(view: Views) {
    $(`#${view}`).show()
}

function setBgColor(bgColor: BackgroundColors) {
    $("#main-container").addClass(bgColor)
}

function isScrapeActive() {
    return scraperStatus?.stage !== undefined && scraperStatus.stage !== ScrapeStage.standby
}

function showCurrentView() {
    resetViews()

    const isDataAvailable = jobCount > 0
    const isOnWaterlooWorks = scraperStatus !== null
    const isScraping = initiatedScrape || isScrapeActive()

    if (isOnWaterlooWorks) {
        setBgColor(BackgroundColors.BLUE)
    } else {
        setBgColor(BackgroundColors.GREY)
    }

    if (isSettingsOpen) {
        // Settings
        showView(Views.SETTINGS)
    } else if (isScraping) { // todo just store most recent scrape status and show that
        // Scraping, show progress
        if (scraperStatus?.stage === ScrapeStage.failed) {
            setBgColor(BackgroundColors.RED)
            showView(Views.WW_SCRAPE_FAILED)
        } else if (scraperStatus?.stage === ScrapeStage.finished) {
            setBgColor(BackgroundColors.GREEN)
            showView(Views.WW_SCRAPE_COMPLETED)
        } else {
            showView(Views.WW_SCRAPE_IN_PROGRESS)
            updateProgressBar()
        }
    } else {
        // Not scraping, show pages
        if (!isDataAvailable) {
            // First time user
            if (isOnWaterlooWorks) {
                showView(Views.ON_WW_FIRST_TIME)
            } else {
                showView(Views.NOT_ON_WW)
            }
        } else {
            // Not first time user, need to check staleness of data
            showView(Views.ON_WW_FIRST_TIME)
        }
    }
}

function updateProgressBar() {
    const numStages = ScrapeStage.finished - 1
    let percent = 0
    if (scraperStatus) {
        percent = (Math.max(scraperStatus.stage - 1, 0) + scraperStatus.stageProgress / scraperStatus.stageTarget) / numStages * 100
    }

    if (percent >= 50) {
        $('#progress-circle-right').css('transform', `rotate(180deg)`)
    } else {
        $('#progress-circle-right').css('transform', `rotate(${percent / 50 * 180}deg)`)
    }

    if (percent > 50) {
        $('#progress-circle-left').css('transform', `rotate(${(percent - 50) / 50 * 180}deg)`)
    } else {
        $('#progress-circle-left').css('transform', `rotate(0deg)`)
    }

    $('#progress-label').text(`${percent.toFixed(1).toString()}%`)

    let newMessage
    switch (scraperStatus?.stage) {
        case ScrapeStage.standby:
            newMessage = 'Starting...'
            break
        case ScrapeStage.defaultSearch:
            newMessage = 'Fetching all jobs...'
            break
        case ScrapeStage.forMyProgram:
            newMessage = 'Tagging ForMyProgram jobs...'
            break
        case ScrapeStage.viewed:
            newMessage = 'Fetching all viewed jobs...'
            break
        case ScrapeStage.workTermRatings:
            newMessage = 'Fetching company ratings...'
            break
        default:
            newMessage = '...'
            break
    }
    $('#progress-label-message').text(newMessage)
}

async function loadDataAndUpdateView(updateCounts = true) {
    if (updateCounts) {
        jobCount = await getJobCount()
        companyCount = await getCompanyCount()
    }
    scraperStatus = await trySendMessageToWaterlooWorks('status')

    showCurrentView()
}

function pollScrapeStatus() {
    if (pollScrapeInterval) {
        return
    }
    pollScrapeInterval = setInterval(async () => {
        await loadDataAndUpdateView(false)
        if (scraperStatus?.stage !== undefined && terminalScrapeStages.includes(scraperStatus.stage)) {
            clearInterval(pollScrapeInterval)
        }
    }, 3000)
}

// global vars
let pollScrapeInterval: undefined | number = undefined
let scraperStatus: null | {
    stage: ScrapeStage,
    stageProgress: 0,
    stageTarget: 1,
} = null
let jobCount = 0
let companyCount = 0

// state
let isSettingsOpen = false
let initiatedScrape = false

const JSON_PICKER_KEY = 'ck_importJsonPicker_popup'

async function main() {
    // First hide all and show blank
    resetViews()
    showView(Views.LOADING)
    setBgColor(BackgroundColors.BLUE)

    // Then pull data and update view
    await loadDataAndUpdateView()
    if (isScrapeActive()) {
        pollScrapeStatus()
    }

    const version = getExtensionVersion()
    $("#version-number").text(version)
    $("#job-count").text(jobCount)
    $("#company-count").text(companyCount)
}

main().then()

$("#scrape-main-button").on( "click", async function() {
    console.log('Triggering scrape main event')
    await trySendMessageToWaterlooWorks('scrape')
    initiatedScrape = true
    showCurrentView()
    pollScrapeStatus()
});

$("#scrape-end-button").on( "click", async function() {
    console.log('Returning to main screen')
    initiatedScrape = false
    showCurrentView()
});

$("#settings-button").on( "click", async function() {
    console.log('Toggling settings')
    isSettingsOpen = !isSettingsOpen
    await showCurrentView()
});

$("#import-data-button").on( "click", async function() {
    console.log('Importing data')
    openJsonPicker(JSON_PICKER_KEY)
});

$("#export-data-button").on( "click", async function() {
    console.log('Importing data')
    await exportJSON()
});

setupJsonPickerHandler(JSON_PICKER_KEY, async function(contentObj) {
    console.log('Received imported data')
    await setLocalStorage(contentObj)
    console.log('Done importing data')
})

addLocalStorageListener(async function (changes) {
    jobCount = await getJobCount()
})
