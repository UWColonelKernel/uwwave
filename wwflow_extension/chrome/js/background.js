chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.session.set({"state": "OFF"});
    
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    chrome.storage.session.get("state", (items) => {
        const prevState = items["state"];
        const nextState = prevState === "OFF" ? "ON" : "OFF";
        chrome.storage.session.set({"state": nextState});
    });
});

chrome.storage.session.onChanged.addListener(function (changes) {
    const newState = changes["state"].newValue;
    if (newState) {
        chrome.action.setBadgeText({
            text: newState,
        });
    }
});

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension");
//         if (request.listenSession === true) {
//             chrome.storage.session.onChanged.addListener(function (changes) {
//                 const newState = changes["state"].newValue;
//                 if (newState) {
//                     sendResponse({farewell: "goodbye"});
//                 }
//             });
//         }
//     }
// );

// content script is an untrusted context
chrome.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"});
