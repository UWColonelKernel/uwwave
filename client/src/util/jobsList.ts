import { JOB_DATA_IDENTIFIERS } from 'src/shared/extension/job'
import { JobsPageRowData } from 'src/views/JobsListPage'
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
        jobSummary: '',
        jobResponsibilities: '',
        requiredSkills: '',
        compensationAndBenefitsInformation: '',
      }

      const jobPostingInformation =
        job.pageData[PostingSections.jobPostingInformation]
      if (jobPostingInformation !== undefined) {
        jobList[job.jobId].city =
          jobPostingInformation[JobInfoFieldsCoop.jobCity]
        jobList[job.jobId].country =
          jobPostingInformation[JobInfoFieldsCoop.jobCountry]
        jobList[job.jobId].jobSummary =
          jobPostingInformation[JobInfoFieldsCoop.jobSummary]
        jobList[job.jobId].jobResponsibilities =
          jobPostingInformation[JobInfoFieldsCoop.jobResponsibilities]
        jobList[job.jobId].requiredSkills =
          jobPostingInformation[JobInfoFieldsCoop.requiredSkills]
        jobList[job.jobId].compensationAndBenefitsInformation =
          jobPostingInformation[
            JobInfoFieldsCoop.compensationAndBenefitsInformation
          ] ?? ''
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
        jobSummary: '',
        jobResponsibilities: '',
        requiredSkills: '',
        compensationAndBenefitsInformation: '',
      }

      const jobInfo = job.pageData[PostingSections.jobPostingInformation]
      if (jobInfo !== undefined) {
        const region = jobInfo[JobInfoFieldsFulltime.region]
        if (region) {
          jobList[job.jobId].country = region.split('-')[0].trim()
        }
        jobList[job.jobId].jobSummary =
          jobInfo[JobInfoFieldsFulltime.jobSummary]
        jobList[job.jobId].jobResponsibilities =
          jobInfo[JobInfoFieldsFulltime.jobResponsibilities]
        jobList[job.jobId].requiredSkills =
          jobInfo[JobInfoFieldsFulltime.requiredSkills]
        jobList[job.jobId].compensationAndBenefitsInformation =
          jobInfo[JobInfoFieldsFulltime.compensationAndBenefits]
      }
    }
  })
  return Object.values(jobList)
}

export function buildCoopJobWithJobID(
  extensionData: Record<string, any>,
  jobId: number,
) {
  console.log(extensionData)
  const jobInfo = extensionData[`coopJob_${jobId}`]
  if (Object.keys(extensionData).length === 0) {
    return null
  }
  const job: JobsPageRowData = {
    id: jobId,
    companyName: jobInfo.postingListData.company,
    jobName: jobInfo.postingListData.jobTitle,
    appDeadline: jobInfo.postingListData.deadline,
    division: jobInfo.postingListData.division,
    openings: jobInfo.postingListData.openings,
    city: jobInfo.postingListData.city,
    country: '',
    industryTag: '',
    keywords: [],
    jobSummary: '',
    jobResponsibilities: '',
    requiredSkills: '',
    compensationAndBenefitsInformation: '',
  }
  const jobPostingInformation =
    jobInfo.pageData[PostingSections.jobPostingInformation]
  if (jobPostingInformation !== undefined) {
    job.city = jobPostingInformation[JobInfoFieldsCoop.jobCity]
    job.country = jobPostingInformation[JobInfoFieldsCoop.jobCountry]
    job.jobSummary = jobPostingInformation[JobInfoFieldsCoop.jobSummary]
    job.jobResponsibilities =
      jobPostingInformation[JobInfoFieldsCoop.jobResponsibilities]
    job.requiredSkills = jobPostingInformation[JobInfoFieldsCoop.requiredSkills]
    job.compensationAndBenefitsInformation =
      jobPostingInformation[
        JobInfoFieldsCoop.compensationAndBenefitsInformation
      ] ?? ''
  }
  console.log(job)

  return job
}
