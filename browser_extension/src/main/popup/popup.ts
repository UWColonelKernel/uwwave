import $ from 'jquery'
import * as browser from 'webextension-polyfill'
import {
    addLocalStorageListener,
    clearLocalStorage,
    getSyncStorage,
    setLocalStorage,
    setSyncStorageByKey,
} from '../common/storage'
import {
    exportJSON,
    getCompanyCount,
    getJobCount,
    openJsonPicker,
    setupJsonPickerHandler,
} from './dataReader'
import { getExtensionVersion } from '../common/runtime'
import {
    ScrapeStage,
    terminalScrapeStages,
    waitingScrapeStages,
} from '../waterlooworks/scraper'
import { updateBadge } from '../common/icon'
import {
    AppStatusOverview,
    DataStatus,
    getJobBoardSetting,
    getTargetSearchActionSetting,
    ScrapeStatus,
    TargetSearchAction,
    UserSyncStorageKeys,
} from '../shared/userProfile'
import { getAppStatus, warningDataStatuses } from '../common/appStatus'
import { JobBoard } from '../shared/jobBoard'

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
    var activeTab = tabs[0]
    var activeTabId = activeTab.id
    var result = null
    if (activeTabId) {
        console.log('sending')
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
    const mainContainer = $('#main-container')
    for (const bgColor of Object.values(BackgroundColors)) {
        mainContainer.removeClass(bgColor)
    }
    mainContainer.addClass(bgColor)
}

function isScrapeActive() {
    return (
        scraperStatus?.stage !== undefined &&
        !waitingScrapeStages.includes(scraperStatus.stage)
    )
}

async function updateSettingSelections() {
    // dropdowns
    const targetSearchAction = await getTargetSearchActionSetting()
    $('#target-search-select').val(targetSearchAction)

    const targetJobBoard = await getJobBoardSetting()
    $('#job-board-select').val(targetJobBoard)

    let jobBoardLabel = ''
    switch (targetJobBoard) {
        case JobBoard.coop:
            jobBoardLabel = 'Co-op'
            break
        case JobBoard.fulltime:
            jobBoardLabel = 'Full-time'
            break
        case JobBoard.other:
            jobBoardLabel = 'Other'
            break
    }
    $('#job-board-label').text(jobBoardLabel)
}

function showCurrentView() {
    const isOnWaterlooWorks = scraperStatus !== null
    const isScraping = initiatedScrape || isScrapeActive()

    updateBadge().then()

    if (appStatus.dataStatus === DataStatus.NO_DATA) {
        if (isOnWaterlooWorks) {
            setBgColor(BackgroundColors.BLUE)
        } else {
            setBgColor(BackgroundColors.GREY)
        }
    } else {
        if (warningDataStatuses.includes(appStatus.dataStatus)) {
            setBgColor(BackgroundColors.YELLOW)
        } else {
            setBgColor(BackgroundColors.BLUE)
        }
    }

    // Fill the data into the labels
    $('.last-scrape-error-label-text').text(appStatus.scrapeError)
    if (appStatus.scrapeError) {
        $('.last-scrape-error-label').show()
    } else {
        $('.last-scrape-error-label').hide()
    }
    if (isOnWaterlooWorks) {
        $('#general-scrape-button').show()
        $('#general-ww-button').hide()
    } else {
        $('#general-scrape-button').hide()
        $('#general-ww-button').show()
    }
    $('#last-success-scrape-label').text(appStatus.dataAgeMessage)
    if (warningDataStatuses.includes(appStatus.dataStatus)) {
        $('#last-scrape-warning-icon').show()
        $('#last-scrape-warning-label').show()
        $('#last-scrape-check-icon').hide()
    } else {
        $('#last-scrape-warning-icon').hide()
        $('#last-scrape-warning-label').hide()
        $('#last-scrape-check-icon').show()
    }

    // Determine which page to show
    if (isSettingsOpen) {
        // Settings
        showView(Views.SETTINGS)

        const version = getExtensionVersion()
        $('#version-number').text(version)
        $('#job-count').text(jobCount)
        $('#company-count').text(companyCount)
    } else if (isScraping) {
        // Scraping, show progress
        if (scraperStatus?.stage === ScrapeStage.failed) {
            setBgColor(BackgroundColors.RED)
            showView(Views.WW_SCRAPE_FAILED)
        } else if (
            scraperStatus?.stage === ScrapeStage.finished &&
            appStatus.scrapeStatus === ScrapeStatus.COMPLETED
        ) {
            setBgColor(BackgroundColors.GREEN)
            showView(Views.WW_SCRAPE_COMPLETED)
        } else {
            showView(Views.WW_SCRAPE_IN_PROGRESS)
            updateProgressBar()
        }
    } else {
        // Not scraping, show pages
        if (appStatus.dataStatus === DataStatus.NO_DATA) {
            // First time user
            if (isOnWaterlooWorks) {
                showView(Views.ON_WW_FIRST_TIME)
            } else {
                showView(Views.NOT_ON_WW)
            }
        } else {
            // Not first time user, need to check staleness of data
            showView(Views.GENERAL_STATUS)
        }
    }
}

function updateProgressBar() {
    const numStages = ScrapeStage.finished - 1
    let percent = 0
    if (scraperStatus) {
        percent =
            ((Math.max(scraperStatus.stage - 1, 0) +
                scraperStatus.stageProgress / scraperStatus.stageTarget) /
                numStages) *
            100
    }

    if (percent >= 50) {
        $('#progress-circle-right').css('transform', `rotate(180deg)`)
    } else {
        $('#progress-circle-right').css(
            'transform',
            `rotate(${(percent / 50) * 180}deg)`,
        )
    }

    if (percent > 50) {
        $('#progress-circle-left').css(
            'transform',
            `rotate(${((percent - 50) / 50) * 180}deg)`,
        )
    } else {
        $('#progress-circle-left').css('transform', `rotate(0deg)`)
    }

    $('#progress-label').text(`${percent.toFixed(1).toString()}%`)

    let newMessage
    switch (scraperStatus?.stage) {
        case ScrapeStage.standby:
            newMessage = 'Starting...'
            break
        case ScrapeStage.jobPostings:
            newMessage = 'Fetching jobs...'
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

async function loadDataAndUpdateView(
    updateCounts = true,
    updateScraperStatus = true,
) {
    if (updateCounts) {
        jobCount = await getJobCount()
        companyCount = await getCompanyCount()
    }
    if (updateScraperStatus) {
        scraperStatus = await trySendMessageToWaterlooWorks('status')
    }

    appStatus = await getAppStatus(jobCount)

    await updateSettingSelections()

    showCurrentView()
}

function pollScrapeStatus() {
    if (pollScrapeInterval) {
        return
    }
    pollScrapeInterval = setInterval(async () => {
        await loadDataAndUpdateView(false)
        if (
            scraperStatus?.stage !== undefined &&
            terminalScrapeStages.includes(scraperStatus.stage)
        ) {
            clearInterval(pollScrapeInterval)
        }
    }, 3000)
}

// global vars
let pollScrapeInterval: undefined | number = undefined
let scraperStatus: null | {
    stage: ScrapeStage
    stageProgress: 0
    stageTarget: 1
} = null
let jobCount = 0
let companyCount = 0
let appStatus: AppStatusOverview

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

async function clearLastScrapeStatus() {
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_STATUS, '')
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT, '')
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT, '')
}

$('.scrape-main-button').on('click', async function () {
    console.log('Triggering scrape main event')
    initiatedScrape = true
    if (scraperStatus) {
        scraperStatus.stage = ScrapeStage.standby
        scraperStatus.stageProgress = 0
        scraperStatus.stageTarget = 1
    }
    showCurrentView()
    pollScrapeStatus()
    await trySendMessageToWaterlooWorks('scrape')
})

$('#scrape-failed-button').on('click', async function () {
    console.log('Returning to main screen')
    initiatedScrape = false
    showCurrentView()
})

$('#settings-button').on('click', async function () {
    console.log('Toggling settings')
    isSettingsOpen = !isSettingsOpen
    showCurrentView()
    await loadDataAndUpdateView(true, false)
})

$('#import-data-button').on('click', async function () {
    console.log('Importing data')
    openJsonPicker(JSON_PICKER_KEY)
})
setupJsonPickerHandler(JSON_PICKER_KEY, async function (contentObj) {
    console.log('Received imported data')
    await clearLocalStorage()
    await clearLastScrapeStatus()
    await setLocalStorage(contentObj)
    await loadDataAndUpdateView(true, false)
    console.log('Done importing data')
})

$('#export-data-button').on('click', async function () {
    console.log('Importing data')
    await exportJSON()
})

$('#clear-data-button').on('click', async function () {
    console.log('Clearing data')
    await clearLocalStorage()
    await clearLastScrapeStatus()
    await loadDataAndUpdateView(true, false)
})

$('.last-scrape-error-icon').on('click', async function () {
    console.log('Clearing last scrape status')
    await clearLastScrapeStatus()
    await loadDataAndUpdateView(false, false)
})

addLocalStorageListener(async function (changes) {
    jobCount = await getJobCount()
})

$('#target-search-select').on('change', async function () {
    const val = $('#target-search-select').val()
    await setSyncStorageByKey(
        UserSyncStorageKeys.SETTING_TARGET_SEARCH_ACTION,
        val,
    )
})

$('#job-board-select').on('change', async function () {
    const val = $('#job-board-select').val()
    await setSyncStorageByKey(
        UserSyncStorageKeys.SETTING_TARGET_JOB_BOARD,
        Number(val),
    )
    await loadDataAndUpdateView(true, false)
})
