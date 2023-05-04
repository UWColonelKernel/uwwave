import { browserAction } from 'webextension-polyfill'

export function setBadgeText() {
    browserAction.setBadgeText({ text: 'x' })
}
