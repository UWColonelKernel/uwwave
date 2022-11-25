req_id_to_response = {
    "get_all_jobs_raw": get_all_jobs_raw,
    "get_job_raw": get_job_raw,
    "get_job_list": get_job_list,
    "get_job_page": get_job_page
}

function get_all_jobs_raw(data) {
    chrome.storage.local.get(function(result) {
        window.postMessage({
            type: "CK_EXT_RESP",
            req_id: data.req_id,
            resp: result,
        }, "*");
    });
}

// needs data.jobid set
function get_job_raw(data) {
    chrome.storage.local.get(data.jobid, function(result) {
        window.postMessage({
            type: "CK_EXT_RESP",
            req_id: data.req_id,
            resp: result,
        }, "*");
    });
}

function get_job_list(data) {
    chrome.storage.local.get(function(result) {
        const jobList = [];
        for (const [key, value] of Object.entries(result)) {
            if (isNaN(key)) {
                continue;
            }
            jobList.push({
                id: key,
                companyName: value["Posting List Data"].company,
                jobName: value["Posting List Data"].jobTitle,
            })
        }

        window.postMessage({
            type: "CK_EXT_RESP",
            req_id: data.req_id,
            resp: jobList,
        }, "*");
    });
}

function get_job_page(data) {
    chrome.storage.local.get(data.jobid, function(result) {
        const respData = {
            companyName: result["Company Information"]["Organization"],
            positionTitle: result["Job Posting Information"]["Job Title"],
            jobOpenings: result["Job Posting Information"]["Job Title"],
            jobId: data.jobid,
            jobSummary: result["Job Posting Information"]["Job Summary"],
            jobResponsibilities: result["Job Posting Information"]["Job Responsibilites"],
            requiredSkills: result["Job Posting Information"]["Required Skills"],
            compensation: result["Job Posting Information"]["Compensation and Benefits"]
        }

        window.postMessage({
            type: "CK_EXT_RESP",
            req_id: data.req_id,
            resp: respData,
        }, "*");
    });
}

window.addEventListener("message", (event) => {
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    // ensure required fields present
    if (!event.data || !event.data.type || !event.data.req_id) {
        return;
    }
  
    if (event.data.type && (event.data.type === "CK_FROM_PAGE")) {
        const responseFunc = req_id_to_response[event.data.req_id];
        if (responseFunc) {
            responseFunc(event.data);
        }
    }
}, false);

window.postMessage({ type: "CK_EXT_LOADED" }, "*");
