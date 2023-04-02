import $ from 'jquery'

chrome.storage.session.get(['state'], items => {})

chrome.storage.session.onChanged.addListener(function (changes) {
    const state = changes['state']
    if (state !== undefined) {
        // scrapeMain();
    }
})

$.get(chrome.runtime.getURL('resources/html/ww_helper.html'), function (data) {
    $($.parseHTML(data)).insertAfter($('main .orbisModuleHeader'))

    $.get(
        chrome.runtime.getURL('resources/html/ww_dashboard.html'),
        function (data_content) {
            const html = $.parseHTML(data_content)
            const node = $(html)
            // @ts-ignore
            $('#ck_content_container').replaceWith(node) // ts thinks node is an array of nodes but it isn't
        },
    )
})
