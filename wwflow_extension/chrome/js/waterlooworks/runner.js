chrome.storage.session.get(["state"], (items) => {});

chrome.storage.session.onChanged.addListener(function (changes) {
    const state = changes["state"];
    if (state !== undefined) {
        // scrapeMain();
    }
});

$.get(chrome.runtime.getURL('html/ww_helper.html'), function(data) {
    $($.parseHTML(data)).prependTo('main');

    if (window.location.href === dashboard) {
        $.get(chrome.runtime.getURL('html/ww_dashboard.html'), function(data_content) {
            $($.parseHTML(data_content)).prependTo('#ck_content_container');

            updateJobCount();
        });
    }
});
