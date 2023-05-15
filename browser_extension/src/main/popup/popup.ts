import $ from 'jquery'
import * as browser from 'webextension-polyfill'
import { addLocalStorageListener, clearLocalStorage, getSyncStorage, setLocalStorage } from '../common/storage'
import { exportJSON, getCompanyCount, getJobCount, openJsonPicker, setupJsonPickerHandler } from './dataReader'
import { getExtensionVersion } from '../common/runtime'
import { ScrapeStage, terminalScrapeStages, waitingScrapeStages } from '../waterlooworks/scraper'
import { updateBadge } from '../common/icon'
import { DAYS_TO_STALE_DATA, MINUTES_TO_FAILED_SCRAPE, ScrapeStatus, UserSyncStorageKeys } from '../shared/userProfile'
import moment from 'moment'

enum BackgroundColors {
    GREY = 'grey-bg',
    BLUE = 'blue-bg',
    RED = 'red-bg',
    GREEN = 'green-bg',
    YELLOW = 'yellow-bg',
}

enum Views {
    NOT_ON_WW = 'not-on-ww',
    ON_WW_FIRST_TIME = 'on-ww-first-time',
    WW_SCRAPE_IN_PROGRESS = 'ww-scrape-in-progress',
    WW_SCRAPE_FAILED = 'ww-scrape-failed',
    WW_SCRAPE_COMPLETED = 'ww-scrape-completed',
    SETTINGS = 'settings',
    LOADING = 'loading',
    GENERAL_STATUS = 'general-status',
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

function showView(view: Views) {
    for (const view of Object.values(Views)) {
        $(`#${view}`).hide()
    }
    $(`#${view}`).show()
}

function setBgColor(bgColor: BackgroundColors) {
    const mainContainer = $("#main-container")
    for (const bgColor of Object.values(BackgroundColors)) {
        mainContainer.removeClass(bgColor)
    }
    mainContainer.addClass(bgColor)
}

function isScrapeActive() {
    return scraperStatus?.stage !== undefined && !waitingScrapeStages.includes(scraperStatus.stage)
}

function getTimeDiffString(timeRecent: string, timeOld: string) {
    const timeDiffSeconds = moment(timeRecent).utc().diff(timeOld, 'second')
    let timeDiffString
    if (timeDiffSeconds < 60) { // 1 min
        timeDiffString = `${moment(timeRecent).utc().diff(timeOld, 'second')} seconds ago`
    } else if (timeDiffSeconds < 3600) { // 1 hr
        timeDiffString = `${moment(timeRecent).utc().diff(timeOld, 'minute')} minutes ago`
    } else if (timeDiffSeconds < 86400) { // 1 day
        timeDiffString = `${moment(timeRecent).utc().diff(timeOld, 'hour')} hours ago`
    } else {
        timeDiffString = `${moment(timeRecent).utc().diff(timeOld, 'day')} days ago`
    }
    return timeDiffString
}

function showCurrentView() {
    const isDataAvailable = jobCount > 0
    const isOnWaterlooWorks = scraperStatus !== null
    const isScraping = initiatedScrape || isScrapeActive()

    if (isOnWaterlooWorks) {
        setBgColor(BackgroundColors.BLUE)
    } else {
        if (!isDataAvailable || !lastSuccessfulScrapeAt) {
            setBgColor(BackgroundColors.GREY)
        } else {
            const isDataStale = moment().utc().subtract(DAYS_TO_STALE_DATA, 'day').isAfter(lastSuccessfulScrapeAt)
            if (isDataStale) {
                setBgColor(BackgroundColors.YELLOW)
            } else {
                setBgColor(BackgroundColors.BLUE)
            }
        }
    }

    if (isSettingsOpen) {
        // Settings
        showView(Views.SETTINGS)

        const version = getExtensionVersion()
        $("#version-number").text(version)
        $("#job-count").text(jobCount)
        $("#company-count").text(companyCount)
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
            showView(Views.GENERAL_STATUS)
            if (isOnWaterlooWorks) {
                $('#general-scrape-button').show()
                $('#general-ww-button').hide()
            } else {
                $('#general-scrape-button').hide()
                $('#general-ww-button').show()
            }

            const isDataStale = moment().utc().subtract(DAYS_TO_STALE_DATA, 'day').isAfter(lastSuccessfulScrapeAt)
            const isHeartbeatDead = moment(lastSuccessfulScrapeAt).utc().subtract(MINUTES_TO_FAILED_SCRAPE, 'minute').isAfter(lastScrapeHeartbeatAt)

            $('#last-success-scrape-time-label').text(getTimeDiffString(moment().utc().toISOString(), lastSuccessfulScrapeAt))
            $('#last-scrape-time-label').text(getTimeDiffString(lastScrapeAt, lastSuccessfulScrapeAt))

            if ((isHeartbeatDead && lastScrapeStatus === ScrapeStatus.PENDING) || lastScrapeStatus === ScrapeStatus.FAILED) {
                $('#last-scrape-error-label').show()
            } else {
                $('#last-scrape-error-label').hide()
            }

            if (isDataStale) {
                $('#last-scrape-warning-icon').show()
                $('#last-scrape-warning-label').show()
                $('#last-scrape-check-icon').hide()
            } else {
                $('#last-scrape-warning-icon').hide()
                $('#last-scrape-warning-label').hide()
                $('#last-scrape-check-icon').show()
            }
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

async function loadDataAndUpdateView(updateCounts = true, updateScraperStatus = true) {
    if (updateCounts) {
        jobCount = await getJobCount()
        companyCount = await getCompanyCount()
    }
    if (updateScraperStatus) {
        scraperStatus = await trySendMessageToWaterlooWorks('status')
    }
    lastScrapeAt = (await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT))[UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT]
    lastScrapeHeartbeatAt = (await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT))[UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT]
    lastSuccessfulScrapeAt = (await getSyncStorage(UserSyncStorageKeys.LAST_SUCCESSFUL_SCRAPE_AT))[UserSyncStorageKeys.LAST_SUCCESSFUL_SCRAPE_AT]
    lastScrapeStatus = (await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_STATUS))[UserSyncStorageKeys.LAST_SCRAPE_STATUS]

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
let lastScrapeAt = ''
let lastScrapeHeartbeatAt = ''
let lastSuccessfulScrapeAt = ''
let lastScrapeStatus: ScrapeStatus | undefined = undefined

// state
let isSettingsOpen = false
let initiatedScrape = false

const JSON_PICKER_KEY = 'ck_importJsonPicker_popup'

async function main() {
    // update badge
    updateBadge().then()

    // First hide all and show blank
    showView(Views.LOADING)
    setBgColor(BackgroundColors.BLUE)

    // Then pull data and update view
    await loadDataAndUpdateView()
    if (isScrapeActive()) {
        initiatedScrape = true
        pollScrapeStatus()
    }
}

main().then()
updateBadge().then()

$(".scrape-main-button").on( "click", async function() {
    console.log('Triggering scrape main event')
    initiatedScrape = true
    showCurrentView()
    pollScrapeStatus()
    await trySendMessageToWaterlooWorks('scrape')
});

$("#scrape-failed-button").on( "click", async function() {
    console.log('Returning to main screen')
    initiatedScrape = false
    showCurrentView()
});

$("#settings-button").on( "click", async function() {
    console.log('Toggling settings')
    isSettingsOpen = !isSettingsOpen
    showCurrentView()
    await loadDataAndUpdateView(true, false)
});

$("#import-data-button").on( "click", async function() {
    console.log('Importing data')
    openJsonPicker(JSON_PICKER_KEY)
});
setupJsonPickerHandler(JSON_PICKER_KEY, async function(contentObj) {
    console.log('Received imported data')
    await setLocalStorage(contentObj)
    await loadDataAndUpdateView(true, false)
    console.log('Done importing data')
})

$("#export-data-button").on( "click", async function() {
    console.log('Importing data')
    await exportJSON()
});

$("#clear-data-button").on( "click", async function() {
    console.log('Clearing data')
    await clearLocalStorage()
    await loadDataAndUpdateView(true, false)
});

addLocalStorageListener(async function (changes) {
    jobCount = await getJobCount()
})
