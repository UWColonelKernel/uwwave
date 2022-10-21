chrome.storage.session.get(["state"], (items) => {});

chrome.storage.session.onChanged.addListener(function (changes) {
    const state = changes["state"];
    if (state !== undefined) {
        // scrapeMain();
    }
});

$.get(chrome.runtime.getURL('html/ww_helper.html'), function(data) {
    $($.parseHTML(data)).insertAfter($('main .orbisModuleHeader'));

    // if (window.location.href === dashboard) {
    $.get(chrome.runtime.getURL('html/ww_dashboard.html'), function(data_content) {
        $('#ck_content_container').replaceWith($($.parseHTML(data_content)));

        updateJobCount();
    });
    // }
});
