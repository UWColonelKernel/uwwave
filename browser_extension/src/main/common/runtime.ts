import { runtime } from 'webextension-polyfill'

export enum ExtensionResource {
    HelperContainer = 'resources/html/ww_helper.html',
    Dashboard = 'resources/html/ww_dashboard.html',
}

export function getResourceUrl(resource: ExtensionResource) {
    return runtime.getURL(resource)
}
