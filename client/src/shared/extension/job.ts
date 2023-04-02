// export enum PostingSections {
//     applicationInformation = 'Application Information',
//     companyInformation = 'Company Information',
//     jobPostingInformation = 'Job Posting Information',
// }
//
// export enum ApplicationInformationFields {
//     deadline = 'Application Deadline',
//     documentsRequired = 'Application Documents Required',
//     method = 'Application Method',
//     // TODO
// }
//
// export enum CompanyInformationFields {
//     division = 'Division',
//     organization = 'Organization',
//     // TODO
// }
//
// export enum JobPostingInformationFields {
//     additionalInfo = 'Additional Information',
//     // TODO
// }
// export interface PostingPageDataCoop {
//     [PostingSections.applicationInformation]: { [key in ApplicationInformationFields]: string }
//     [PostingSections.companyInformation]: { [key in CompanyInformationFields]: string }
//     [PostingSections.jobPostingInformation]: { [key in JobPostingInformationFields]: string }
// }

import { JobBoard } from './jobBoard'

export const JOB_DATA_IDENTIFIER = 'job_'

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

export interface PostingPageData {
  [section: string]: { [key: string]: string }
}

export interface JobPosting {
  jobId: number
  jobBoard: JobBoard
  postingListData: PostingListData
  pageData: PostingPageData
  divisionId?: number
  isForMyProgram?: boolean
}

export function getJobDataKey(jobId: number) {
  return `${JOB_DATA_IDENTIFIER}${jobId.toString()}`
}
