export function convertRawJobForJobPage(rawJob) {
    const respData = {
        jobId: rawJob.jobid,
        companyName: rawJob["Company Information"]["Organization"],
        positionTitle: rawJob["Job Posting Information"]["Job Title"],
        jobOpenings: rawJob["Job Posting Information"]["Job Openings"],
        jobSummary: rawJob["Job Posting Information"]["Job Summary"],
        jobResponsibilities: rawJob["Job Posting Information"]["Job Responsibilities"],
        requiredSkills: rawJob["Job Posting Information"]["Required Skills"],
        compensation: rawJob["Job Posting Information"]["Compensation and Benefits Information"],
    }
    return respData;
}

export function convertRawJobsForJobList(jobs) {
    const jobList = [];
    for (const [key, value] of Object.entries(jobs)) {
        if (isNaN(key)) {
            continue;
        }
        jobList.push({
            id: key,
            companyName: value["Posting List Data"].company,
            jobName: value["Posting List Data"].jobTitle,
            location: value["Posting List Data"].location,
            openings: value["Posting List Data"].openings,
            level: value["Posting List Data"].level,
            appDeadline: value["Posting List Data"].deadline,
            division: value["Posting List Data"].division
        })
    }
    return jobList;
}
