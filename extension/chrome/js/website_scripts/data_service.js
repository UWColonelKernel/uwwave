req_id_to_response = {
    "get_all_jobs_raw": get_all_jobs_raw,
    "get_job_raw": get_job_raw,
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
        result[data.jobid].jobid = data.jobid;
        window.postMessage({
            type: "CK_EXT_RESP",
            req_id: data.req_id,
            resp: result[data.jobid],
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
