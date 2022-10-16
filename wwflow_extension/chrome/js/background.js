chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.session.set({"state": "OFF"});
    
    // chrome.action.setBadgeText({
    //     text: "OFF",
    // });
});

chrome.action.onClicked.addListener(async (tab) => {
    chrome.storage.session.get("state", (items) => {
        const prevState = items["state"];
        const nextState = prevState === "OFF" ? "ON" : "OFF";
        chrome.storage.session.set({"state": nextState});
    });
});

chrome.storage.session.onChanged.addListener(function (changes) {
    // const newState = changes["state"].newValue;
    // if (newState) {
    //     chrome.action.setBadgeText({
    //         text: newState,
    //     });
    // }
});

// content script is an untrusted context
chrome.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"});
