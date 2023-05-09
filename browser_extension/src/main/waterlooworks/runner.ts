import $ from 'jquery'
import { ExtensionResource, getResourceUrl } from '../common/runtime'

$.get(getResourceUrl(ExtensionResource.HelperContainer), function (data) {
    $($.parseHTML(data)).insertAfter($('main .orbisModuleHeader'))

    $.get(getResourceUrl(ExtensionResource.Dashboard), function (data_content) {
        const html = $.parseHTML(data_content)
        const node = $(html)
        // @ts-ignore
        $('#ck_content_container').replaceWith(node) // ts thinks node is an array of nodes but it isn't
    })
})
