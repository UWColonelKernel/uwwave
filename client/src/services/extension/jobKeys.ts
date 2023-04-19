import {
  JobPosting,
  PostingListDataCoop,
  PostingListDataFulltime,
} from 'src/shared/extension/job'
import { JobBoard } from 'src/shared/extension/jobBoard'

export enum PostingSections {
  applicationInformation = 'Application Information', // for coop
  applicationDelivery = 'Application Delivery', // not for coop
  companyInformation = 'Company Information', // for coop
  companyInfo = 'Company Info', // not for coop
  jobPostingInformation = 'Job Posting Information', // for all jobs
}

export enum CompanyInfoFields {
  division = 'Division',
  organization = 'Organization',
}

// As of Nov 20, 2022, these are the only fields
export enum AppInfoFields {
  deadline = 'Application Deadline',
  documentsRequired = 'Application Documents Required',
  additionalInfo = 'Additional Application Information',
  method = 'Application Method',
}

// As of Nov 20, 2022, these are most of the fields
// The scraper didn't fully scrape properly, so this will need updating - TODO
export enum JobInfoFieldsCoop {
  additionalInformation = 'Additional Information',
  additionalJobIdentifiers = 'Additional Job Identifiers',
  affiliation = 'Affiliation',
  anticipatedStartDate = 'Anticipated start date',
  category = 'Category',
  company = 'Company',
  compensationGroup = 'Compensation Group',
  compensationAndBenefitsInformation = 'Compensation and Benefits Information',
  currentWorkTerm = 'Current Work Term',
  department = 'Department',
  division = 'Division',
  duration = 'Duration',
  employerInternalJobNumber = 'Employer Internal Job Number',
  employmentType = 'Employment Type',
  hiringManagerOrSupervisor = 'Hiring manager/Supervisor',
  hoursOfWorkBiWeekly = 'Hours of Work (bi-weekly)',
  jobAddressLineOne = 'Job - Address Line One',
  jobAddressLineTwo = 'Job - Address Line Two',
  jobCity = 'Job - City',
  jobCountry = 'Job - Country',
  jobPostalOrZipCode = 'Job - Postal Code / Zip Code (X#X #X#)',
  jobProvinceOrState = 'Job - Province / State',
  jobCategoryNoc = 'Job Category (NOC)',
  jobClassificationTitle = 'Job Classification Title',
  jobId = 'Job ID',
  jobLocation = 'Job Location (if exact address unknown or multiple locations)',
  jobResponsibilities = 'Job Responsibilities',
  jobSummary = 'Job Summary',
  jobTerm = 'Job Term',
  jobTitle = 'Job Title',
  jobType = 'Job Type',
  level = 'Level',
  location = 'Location',
  numberOfJobOpenings = 'Number of Job Openings',
  numberOfPositionsOpen = 'Number of Positions Open',
  organization = 'Organization',
  positionTitle = 'Position Title',
  region = 'Region',
  reportsTo = 'Reports to',
  requiredSkills = 'Required Skills',
  salary = 'Salary',
  specialJobRequirements = 'Special Job Requirements',
  targetedDegreesAndDisciplines = 'Targeted Degrees and Disciplines',
  transportationAndHousing = 'Transportation and Housing',
  workLocation = 'Work Location',
  workTerm = 'Work Term',
  workTermDuration = 'Work Term Duration',
}

// As of Mar 17, 2023, these are the only fields
export enum AppDeliveryFields {
  additionalInfo = 'Additional Application Information',
  deadline = 'Application Deadline',
  delivery = 'Application Delivery',
  documentsRequired = 'Application Documents Required',
  ifByWebsiteGoTo = 'If by Website, go to',
  ifByEmailSendTo = 'If by eMail, send to',
}

// As of Mar 17, 2023, these are the only fields
export enum JobInfoFieldsFulltime {
  additionalInfo = 'Additional Information',
  careerDevelopmentAndTraining = 'Career Development and Training',
  compensationAndBenefits = 'Compensation and Benefits',
  employerInternalJobNumber = 'Employer Internal Job Number',
  jobCategoryNoc = 'Job Category (NOC)',
  jobOpenings = 'Job Openings',
  jobResponsibilities = 'Job Responsibilities',
  jobSummary = 'Job Summary',
  jobTitle = 'Job Title',
  level = 'Level',
  otherJobDetails = 'Other Job Details',
  positionType = 'Position Type',
  region = 'Region',
  requiredSkills = 'Required Skills',
  startDate = 'Start Date',
  targetedDegreesAndDisciplines = 'Targeted Degrees and Disciplines',
  termPosted = 'Term Posted',
  transportationAndHousing = 'Transportation and Housing',
}

export interface PostingPageDataCoop {
  [PostingSections.applicationInformation]: {
    [key in AppInfoFields]: string
  }
  [PostingSections.companyInformation]: {
    [key in CompanyInfoFields]: string
  }
  [PostingSections.jobPostingInformation]: {
    [key in JobInfoFieldsCoop]: string
  }
}

export interface PostingPageDataFulltime {
  [PostingSections.applicationDelivery]: {
    [key in AppInfoFields]: string
  }
  [PostingSections.companyInfo]: {
    [key in CompanyInfoFields]: string
  }
  [PostingSections.jobPostingInformation]: {
    [key in JobInfoFieldsFulltime]: string
  }
}

export interface JobPostingCoop extends JobPosting {
  jobBoard: JobBoard.coop
  postingListData: PostingListDataCoop
  pageData: PostingPageDataCoop
}

export interface JobPostingFulltime extends JobPosting {
  jobBoard: JobBoard.fulltime
  postingListData: PostingListDataFulltime
  pageData: PostingPageDataFulltime
}
