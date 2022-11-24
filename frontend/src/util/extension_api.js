export function buildExtensionApiListener(req_id_to_callback) {
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
            Object.keys(req_id_to_callback).forEach((req_id) => {
                window.postMessage({ type: "CK_FROM_PAGE", req_id }, "*");
            });
        }
        if (event.data.type === "CK_EXT_RESP") {
            if (!event.data.req_id) {
                console.warn("Extension response does not contain req_type.");
                return;
            }
            const callback = req_id_to_callback[event.data.req_id];
            if (callback) {
                callback(event.data.resp);
            }
        }
    }
}


