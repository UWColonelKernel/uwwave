import { Runtime, runtime } from 'webextension-polyfill'
import * as browser from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender

export enum ExtensionResource {
    HelperContainer = 'resources/html/ww_helper.html',
    Dashboard = 'resources/html/ww_dashboard.html',
    Setup = 'resources/html/ww_setup.html',
    WaveLogo = 'assets/waterlooworks/wave_logo_black.png',
    WaveLogoToolbar = 'assets/waterlooworks/wave_logo_toolbar.png',
}

export function getResourceUrl(resource: ExtensionResource) {
    return runtime.getURL(resource)
}

export function getExtensionId() {
    return browser.runtime.id
}

export function getExtensionVersion() {
    return browser.runtime.getManifest().version
}

export function addRuntimeListener(
    listener: (
        message: any,
        sender: MessageSender,
        sendResponse: (...params: any) => void,
    ) => void,
) {
    browser.runtime.onMessage.addListener(listener)
}
