import { JobBoard } from './jobBoard'

export const JOB_DATA_IDENTIFIERS = {
    [JobBoard.coop]: 'coopJob_',
    [JobBoard.fulltime]: 'fulltimeJob_',
    [JobBoard.other]: 'otherJob_',
}

export interface PostingListDataCoop {
    jobTitle: string
    company: string
    division: string
    openings: number
    internalStatus: string
    location: string
    level: string
    applications: number
    deadline: string
}

export interface PostingListDataFulltime {
    jobTitle: string
    company: string
    division: string
    positionType: string
    internalStatus: string
    city: string
    deadline: string
}

export interface PostingListDataOther {
    jobTitle: string
    company: string
    division: string
    positionType: string
    internalStatus: string
    location: string
    city: string
    deadline: string
}

export type PostingListData =
    | PostingListDataCoop
    | PostingListDataFulltime
    | PostingListDataOther

export interface JobPosting {
    jobId: number
    jobBoard: JobBoard
    postingListData: PostingListData
    pageData: any // [section: string]: { [key: string]: string }
    divisionId?: number
    isForMyProgram?: boolean
}

export function getJobDataKey(jobId: number, jobBoard: JobBoard) {
    return `${JOB_DATA_IDENTIFIERS[jobBoard]}}${jobId.toString()}`
}
