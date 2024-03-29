export const DAYS_TO_STALE_DATA = 2
export const MINUTES_TO_FAILED_SCRAPE = 1

export enum UserSyncStorageKeys {
  LAST_SCRAPE_INITIATED_AT = 'LAST_SCRAPE_INITIATED_AT',
  LAST_SCRAPE_HEARTBEAT_AT = 'LAST_SCRAPE_HEARTBEAT_AT',
  LAST_SCRAPE_STATUS = 'LAST_SCRAPE_STATUS',
  SETTING_TARGET_JOB_BOARD = 'SETTING_TARGET_JOB_BOARD',
  SETTING_TARGET_SEARCH_ACTION = 'SETTING_TARGET_SEARCH_ACTION',
}

export enum LocalStorageMetadataKeys {
  SCRAPE_AT = 'SCRAPE_AT',
}

export enum TargetSearchAction {
  FOR_MY_PROGRAM = 'FOR_MY_PROGRAM',
  DEFAULT_SEARCH = 'DEFAULT_SEARCH',
  VIEWED = 'VIEWED',
}

export enum BadgeIconName {
  error = 'error',
  warning = 'warning',
  ok = 'good-2-go',
  loading = 'loading',
  greyIcon = 'non-scrape',
  blueIcon = 'wave-icon',
}

export enum ScrapeStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum DataStatus {
  NO_DATA = 'NO_DATA', // no data, no scrape date
  INCOMPLETE_DATA = 'INCOMPLETE_DATA', // data, no scrape date
  STALE_DATA = 'STALE_DATA', // scrape date is old
  GOOD_DATA = 'GOOD_DATA', // scrape date is recent
}

export interface AppStatusOverview {
  dataStatus: DataStatus
  dataAgeMessage: string
  badgeIcon: BadgeIconName
  scrapeStatus: ScrapeStatus
  scrapeError: string
}
