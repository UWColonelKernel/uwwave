import { action } from 'webextension-polyfill'
import { ExtensionResource, getResourceUrl } from './runtime'
import { getSyncStorage } from './storage'
import { DAYS_TO_STALE_DATA, MINUTES_TO_FAILED_SCRAPE, ScrapeStatus, UserSyncStorageKeys } from '../shared/userProfile'
import moment from 'moment/moment'

async function setBadgeText() {
    await action.setBadgeText({ text: 'x' })
}

async function setBadgeIcon(iconName: string) {
    await action.setIcon({
        path: {
            16: getResourceUrl(`assets/icons/${iconName}16.png` as ExtensionResource),
            32: getResourceUrl(`assets/icons/${iconName}32.png` as ExtensionResource),
            48: getResourceUrl(`assets/icons/${iconName}48.png` as ExtensionResource),
            128: getResourceUrl(`assets/icons/${iconName}128.png` as ExtensionResource),
        }
    })
}

export async function updateBadge() {
    const status = (await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_STATUS))[UserSyncStorageKeys.LAST_SCRAPE_STATUS]
    const lastScrapeAt = (await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT))[UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT]
    const isDataStale = moment().utc().subtract(DAYS_TO_STALE_DATA, 'day').isAfter(lastScrapeAt)
    const isHeartbeatDead = moment().utc().subtract(MINUTES_TO_FAILED_SCRAPE, 'minute').isAfter(lastScrapeAt)
    switch (status) {
        case ScrapeStatus.PENDING:
            if (isHeartbeatDead) {
                // TODO use error icon
                await setBadgeIcon('non-scrape')
            } else {
                await setBadgeIcon('loading')
            }
            break
        case ScrapeStatus.COMPLETED:
            if (isDataStale) {
                await setBadgeIcon('warning')
            } else {
                await setBadgeIcon('good-2-go')
            }
            break
        case ScrapeStatus.FAILED:
            // TODO use error icon
            await setBadgeIcon('non-scrape')
            break
    }
}
