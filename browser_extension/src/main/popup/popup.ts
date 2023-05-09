import $ from 'jquery'
import * as browser from 'webextension-polyfill'
import { addLocalStorageListener } from '../common/storage'

enum BackgroundColors {
    GREY = 'grey-bg',
    BLUE = 'blue-bg',
}

enum Views {
    NOT_ON_WW = 'not-on-ww',
    ON_WW_FIRST_TIME = 'on-ww-first-time',
    SETTINGS = 'settings',
}

async function trySendMessageToWaterlooWorks(op: string): Promise<boolean> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    var activeTab = tabs[0];
    var activeTabId = activeTab.id;
    var success = false;
    if (activeTabId) {
        console.log('sending');
        try {
            await browser.tabs.sendMessage(activeTabId, { op })
            success = true
        } catch { /* empty */ }
    }
    return success
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

async function showCurrentView() {
    resetViews()

    const mainContainer = $("#main-container")

    if (!isDataAvailable) {
        // First time user
        if (isOnWaterlooWorks) {
            mainContainer.addClass(BackgroundColors.BLUE)
        } else {
            mainContainer.addClass(BackgroundColors.GREY)
        }

        if (isSettingsOpen) {
            showView(Views.SETTINGS)
        } else if (isOnWaterlooWorks) {
            showView(Views.ON_WW_FIRST_TIME)
        } else {
            showView(Views.NOT_ON_WW)
        }
    } else {
        // Not first time user, need to check staleness of data
    }
}

let isDataAvailable = false
let isOnWaterlooWorks = false
let isSettingsOpen = false

async function main() {
    isOnWaterlooWorks = await trySendMessageToWaterlooWorks('confirm')
    await showCurrentView()
}

main().then()

$("#scrape-main-button").on( "click", async function() {
    console.log('Triggering scrape main event')
    await trySendMessageToWaterlooWorks('scrape')
});

$("#settings-button").on( "click", async function() {
    console.log('Toggling settings')
    isSettingsOpen = !isSettingsOpen
    await showCurrentView()
});

addLocalStorageListener(function (changes) {
    console.log('asdf')
})
