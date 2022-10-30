console.log("data service");

window.addEventListener("message", (event) => {
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }
  
    if (event.data.type && (event.data.type === "WWFLOW_FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        if (!event.data.req_type) {
            return;
        }
        if (event.data.req_type === "get_data") {
            chrome.storage.local.get(function(result) {
                window.postMessage({
                    type: "WWFLOW_EXT_RESP",
                    req_type: event.data.req_type,
                    text: "Content script data",
                    resp: result,
                }, "*");
            });
        }
    }
}, false);

window.postMessage({ type: "WWFLOW_EXT_LOADED", text: "Content script loaded!" }, "*");
