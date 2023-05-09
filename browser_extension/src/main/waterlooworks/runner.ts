import $ from 'jquery'
import { ExtensionResource, getResourceUrl } from '../common/runtime'

$.get(getResourceUrl(ExtensionResource.HelperContainer), function (data) {
    $($.parseHTML(data)).insertAfter($('main .orbisModuleHeader'))

    // DEPRECATED
    // $.get(getResourceUrl(ExtensionResource.Dashboard), function (data_content) {
    //     const html = $.parseHTML(data_content)
    //     const node = $(html)
    //     // @ts-ignore
    //     $('#ck_content_container').replaceWith(node) // ts thinks node is an array of nodes but it isn't
    // })

    $.get(getResourceUrl(ExtensionResource.Setup), function (data_content) {
        const html = $.parseHTML(data_content)
        const node = $(html)
        // @ts-ignore
        $('#ck_content_container').replaceWith(node) // ts thinks node is an array of nodes but it isn't

        $('#ck_wave-logo-img').attr('src', getResourceUrl(ExtensionResource.WaveLogo))
        $('#ck_wave-logo-toolbar-img').attr('src', getResourceUrl(ExtensionResource.WaveLogoToolbar))

        $("#ck_outer").on( "click", async function() {
            $("#ck_outer").hide()
        });

        $("#ck_display").on( "click", async function(e) {
            e.stopPropagation()
        });
    })
})
