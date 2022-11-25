export function convertRawJobForJobPage(rawJob) {
    const jobId = Object.keys(rawJob)[0]
    const respData = {
        jobId: jobId,
        companyName: rawJob[jobId]["Company Information"]["Organization"],
        positionTitle: rawJob[jobId]["Job Posting Information"]["Job Title"],
        jobOpenings: rawJob[jobId]["Job Posting Information"]["Job Openings"],
        jobSummary: rawJob[jobId]["Job Posting Information"]["Job Summary"],
        jobResponsibilities: rawJob[jobId]["Job Posting Information"]["Job Responsibilities"],
        requiredSkills: rawJob[jobId]["Job Posting Information"]["Required Skills"],
        compensation: rawJob[jobId]["Job Posting Information"]["Compensation and Benefits Information"]
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
        })
    }
    return jobList;
}
