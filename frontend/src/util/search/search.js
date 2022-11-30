import React from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotesIcon from '@mui/icons-material/Notes';
import HandshakeIcon from '@mui/icons-material/Handshake';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

//simulate enum
export const SearchTypes = {
    "All" : 0,
    "JobTitle": 1,
    "CompanyName": 2,
    "JobSummary": 3,
    "JobResponsibilities": 4,
    "RequiredSkills": 5
}

export const getSearchTypeName = (type) => {
    const {
        JobTitle,
        CompanyName,
        JobSummary,
        JobResponsibilities,
        RequiredSkills
    } = SearchTypes
    switch(type){
        case JobTitle:
            return "Job Title"
        case CompanyName:
            return "Company Name"
        case JobSummary:
            return "Job Summary"
        case JobResponsibilities:
            return "Responsibilities"
        case RequiredSkills:
            return "Skills"
        default:
            return "All"
    }
}

export const getSearchTypeField = (type) => {
    const {
        JobTitle,
        CompanyName,
        JobSummary,
        JobResponsibilities,
        RequiredSkills
    } = SearchTypes
    switch(type){
        case JobTitle:
            return "jobName"
        case CompanyName:
            return "companyName"
        case JobSummary:
            return "jobSummary" // TODO
        case JobResponsibilities:
            return "jobResponsibilities" // TODO
        case RequiredSkills:
            return "requiredSkills" // TODO
        default:
            return ""
    }
}

export const getSearchTypeIcon = (type) => {
    const {
        JobTitle,
        CompanyName,
        JobSummary,
        JobResponsibilities,
        RequiredSkills
    } = SearchTypes
    switch(type){
        case JobTitle:
            return <AccountCircleIcon/>
        case CompanyName:
            return <BusinessIcon/>
        case JobSummary:
            return <NotesIcon/>
        case JobResponsibilities:
            return <HandshakeIcon/>
        case RequiredSkills:
            return <StarBorderPurple500Icon/>
        default:
            return null
    }
}