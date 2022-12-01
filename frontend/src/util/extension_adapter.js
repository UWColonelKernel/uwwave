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
    const jobList = {};
    for (const [key, value] of Object.entries(jobs)) {
        // @ts-ignore
        if (isNaN(key)) {
            continue;
        }

        jobList[key] = {
            id: key,
            companyName: value["Posting List Data"].company,
            jobName: value["Posting List Data"].jobTitle,
            location: value["Posting List Data"].location,
            openings: value["Posting List Data"].openings,
            level: value["Posting List Data"].level,
            appDeadline: value["Posting List Data"].deadline,
            division: value["Posting List Data"].division,
        };

        const jobPostingInfo = value["Job Posting Information"];
        if (jobPostingInfo !== undefined) {
            jobList[key].city = jobPostingInfo["Job - City"];
            jobList[key].country = jobPostingInfo["Job - Country"];
        }
    }
    return jobList;
}

export function convertRawJobsForJobListSearch(rawJobs) {
    const jobList = {};
    for (const [key, value] of Object.entries(rawJobs)) {
        // @ts-ignore
        if (isNaN(key)) {
            continue;
        }

        jobList[key] = {
            id: key,
            companyName: value["Posting List Data"].company,
            jobName: value["Posting List Data"].jobTitle,
        };

        const jobPostingInfo = value["Job Posting Information"];
        if (jobPostingInfo !== undefined) {
            jobList[key].jobSummary = jobPostingInfo["Job Summary"];
            jobList[key].jobResponsibilities = jobPostingInfo["Job Responsibilities"];
            jobList[key].requiredSkills = jobPostingInfo["Required Skills"];
        }
    }
    return jobList;
}

function durationToTag(duration) {
    if (duration.includes('4 month')) {
        return '4 month';
    }
    if (duration.includes('8 month')) {
        if (duration.includes('preferred')) {
            return '8 month preferred';
        }
        if (duration.includes('required')) {
            return '8 month required';
        }
    }
    if (duration.includes('2 work term')) {
        if (duration.includes('preferred')) {
            return '2 work terms preferred';
        }
        if (duration.includes('required')) {
            return '2 work terms required';
        }
    }
}

export const TagCategories = {
    "app_docs_tags" : 0,
    "duration_tags": 1,
    "special_reqs_tags": 2,
    // "industry_tags": 3,
}
export function tagCategoryToDisplayName(category) {
    const {
        app_docs_tags,
        duration_tags,
        special_reqs_tags,
        // industry_tags,
    } = TagCategories
    switch(TagCategories[category]){
        case app_docs_tags:
            return "Documents Required"
        case duration_tags:
            return "Work Term Duration"
        case special_reqs_tags:
            return "Special Requirements"
        // case industry_tags:
        //     return "Industry"
        default:
            return category
    }
}

const appDocsTextToTag = {
    'University of Waterloo Co-op Work History': 'Co-op Work History',
    'Resume': 'Resume',
    'Grade Report': 'Grade Report',
    'Cover Letter': 'Cover Letter',
    'Other': 'Other - per job posting'
}

const specialReqsTextToTag = {
    'SWPP': "Canada SWPP or Summer Jobs",
    'fully vaccinated': "Fully vaccinated",
    'eligible to work in the USA': "USA work eligibility",
    'USA visa': "USA work eligibility",
    'This job requires you to work remotely from CANADA': "Must be remote from Canada",
    'Security Clearance': "Security clearance",
    "driver's license": "Driver's license",
    "drivers license": "Driver's license"
}

function lookupTags(text, mapping) {
    const tags = [];
    // normalize to deal with resume accents
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    Object.keys(mapping).forEach(lookup => {
        if (text.includes(lookup.toLowerCase())) {
            tags.push(mapping[lookup]);
        }
    });
    return Array.from(new Set(tags));
}

export function convertRawJobsForJobListFilter(rawJobs, jobTagData = {}) {
    for (const [key, value] of Object.entries(rawJobs)) {
        // @ts-ignore
        if (isNaN(key)) {
            continue;
        }

        if (!(key in jobTagData)) {
            jobTagData[key] = {
                app_docs_tags: [],
                duration_tags: [],
                special_reqs_tags: [],
            };
        }

        jobTagData[key].app_docs_tags = [];
        jobTagData[key].duration_tags = [];
        jobTagData[key].special_reqs_tags = [];

        const appInfo = value["Application Information"];
        const jobPostingInfo = value["Job Posting Information"];
        if (appInfo !== undefined) {
            const appDocsText = appInfo["Application Documents Required"];
            if (appDocsText !== undefined) {
                jobTagData[key].app_docs_tags = lookupTags(appDocsText, appDocsTextToTag);
            }

            const additionalText = appInfo["Additional Application Information"];
            if (additionalText !== undefined) {
                jobTagData[key].special_reqs_tags = jobTagData[key].special_reqs_tags.concat(lookupTags(additionalText, specialReqsTextToTag));

                // check external application
                if ((additionalText.includes('https://') || additionalText.includes('http://'))
                        && additionalText.toLowerCase().includes('apply')) {
                    jobTagData[key].special_reqs_tags.push("External application");
                }
            }
        }
        if (jobPostingInfo !== undefined) {
            const duration = jobPostingInfo["Work Term Duration"];
            if (duration !== undefined) {
                jobTagData[key].duration_tags = durationToTag(duration);
            }

            const specialReqsText = jobPostingInfo["Special Job Requirements"];
            if (specialReqsText !== undefined) {
                jobTagData[key].special_reqs_tags = jobTagData[key].special_reqs_tags.concat(lookupTags(specialReqsText, specialReqsTextToTag));
            }
        }

        // dedupe special_reqs_tags
        jobTagData[key].special_reqs_tags = Array.from(new Set(jobTagData[key].special_reqs_tags));
    }
    return jobTagData;
}
