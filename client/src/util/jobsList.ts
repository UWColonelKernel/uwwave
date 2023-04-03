import { JOB_DATA_IDENTIFIERS } from 'src/shared/extension/job'
import { JobsPageRowData } from 'src/views/JobsPage'
import { JobBoard } from 'src/shared/extension/jobBoard'
import {
  JobPostingCoop,
  JobPostingFulltime,
  JobInfoFieldsCoop,
  JobInfoFieldsFulltime,
  PostingSections,
} from 'src/services/extension/jobKeys'

export function buildCoopJobsListFromExtensionData(
  extensionData: Record<string, any>,
) {
  const jobList: Record<number, JobsPageRowData> = {}
  Object.entries(extensionData).forEach(pair => {
    const key = pair[0]
    if (key.startsWith(JOB_DATA_IDENTIFIERS[JobBoard.coop])) {
      const job: JobPostingCoop = pair[1]

      jobList[job.jobId] = {
        id: job.jobId,
        companyName: job.postingListData.company,
        jobName: job.postingListData.jobTitle,
        appDeadline: job.postingListData.deadline,
        division: job.postingListData.division,
        openings: job.postingListData.openings,
        city: '',
        country: '',
        industryTag: '',
        keywords: [],
      }

      const jobPostingInformation =
        job.pageData[PostingSections.jobPostingInformation]
      if (jobPostingInformation !== undefined) {
        jobList[job.jobId].city =
          jobPostingInformation[JobInfoFieldsCoop.jobCity]
        jobList[job.jobId].country =
          jobPostingInformation[JobInfoFieldsCoop.jobCountry]
      }
    }
  })
  return Object.values(jobList)
}

export function buildFulltimeJobsListFromExtensionData(
  extensionData: Record<string, any>,
) {
  const jobList: Record<number, JobsPageRowData> = {}
  Object.entries(extensionData).forEach(pair => {
    const key = pair[0]
    if (key.startsWith(JOB_DATA_IDENTIFIERS[JobBoard.fulltime])) {
      const job: JobPostingFulltime = pair[1]

      jobList[job.jobId] = {
        id: job.jobId,
        companyName: job.postingListData.company,
        jobName: job.postingListData.jobTitle,
        appDeadline: job.postingListData.deadline,
        division: job.postingListData.division,
        openings: NaN,
        city: job.postingListData.city,
        country: '',
        industryTag: '',
        keywords: [],
      }

      const jobInfo = job.pageData[PostingSections.jobPostingInformation]
      if (jobInfo !== undefined) {
        const region = jobInfo[JobInfoFieldsFulltime.region]
        if (region) {
          jobList[job.jobId].country = region.split('-')[0].trim()
        }
      }
    }
  })
  return Object.values(jobList)
}
