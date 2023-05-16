import BusinessIcon from '@mui/icons-material/Business'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotesIcon from '@mui/icons-material/Notes'
import HandshakeIcon from '@mui/icons-material/Handshake'
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500'
import FactoryIcon from '@mui/icons-material/Factory'

export enum SearchTypes {
  'All' = 0,
  'JobTitle',
  'CompanyName',
  'JobSummary',
  'JobResponsibilities',
  'RequiredSkills',
  'Industry',
}

export const getSearchTypeName = (type: SearchTypes) => {
  switch (type) {
    case SearchTypes.JobTitle:
      return 'Job Title'
    case SearchTypes.CompanyName:
      return 'Company Name'
    case SearchTypes.JobSummary:
      return 'Job Summary'
    case SearchTypes.JobResponsibilities:
      return 'Responsibilities'
    case SearchTypes.RequiredSkills:
      return 'Skills'
    case SearchTypes.Industry:
      return 'Industry'
    default:
      return 'All'
  }
}

export const getSearchTypeField = (type: SearchTypes) => {
  switch (type) {
    case SearchTypes.JobTitle:
      return 'jobName'
    case SearchTypes.CompanyName:
      return 'companyName'
    case SearchTypes.JobSummary:
      return 'jobSummary'
    case SearchTypes.JobResponsibilities:
      return 'jobResponsibilities'
    case SearchTypes.RequiredSkills:
      return 'requiredSkills'
    case SearchTypes.Industry:
      return 'industry_tags'
    default:
      return ''
  }
}

export const getSearchTypeIcon = (type: SearchTypes) => {
  switch (type) {
    case SearchTypes.JobTitle:
      return <AccountCircleIcon />
    case SearchTypes.CompanyName:
      return <BusinessIcon />
    case SearchTypes.JobSummary:
      return <NotesIcon />
    case SearchTypes.JobResponsibilities:
      return <HandshakeIcon />
    case SearchTypes.RequiredSkills:
      return <StarBorderPurple500Icon />
    case SearchTypes.Industry:
      return <FactoryIcon />
    default:
      return null
  }
}
