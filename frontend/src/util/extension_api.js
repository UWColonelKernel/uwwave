export function buildExtensionApiListener(requests) {
    return (event) => {
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }

        // ensure required fields present
        if (!event.data || !event.data.type) {
            return;
        }
    
        if (event.data.type === "CK_EXT_LOADED") {
            Object.keys(requests).forEach((req_id) => {
                window.postMessage({ type: "CK_FROM_PAGE", req_id, ...requests[req_id] }, "*");
            });
        }
        if (event.data.type === "CK_EXT_RESP") {
            if (!event.data.req_id) {
                console.warn("Extension response does not contain req_type.");
                return;
            }
            const callback = requests[event.data.req_id].callback;
            if (callback) {
                callback(event.data.resp);
            }
        }
    }
}


