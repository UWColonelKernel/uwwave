import $ from 'jquery'
import {
    addLocalStorageListener,
    clearLocalStorage,
    getLocalStorage,
    setLocalStorage,
} from '../common/storage'
import { JOB_DATA_IDENTIFIERS } from '../shared/job'
import { JobBoard } from '../shared/jobBoard'

addLocalStorageListener(function (changes) {
    $('#ck_loadJobCountButton').show()
})

function updateJobCount() {
    getLocalStorage(null).then(results => {
        const keys = Object.keys(results).filter(
            key => key.indexOf(JOB_DATA_IDENTIFIERS[JobBoard.fulltime]) !== -1,
        )
        $('#ck_scrapeCount').text(keys.length === 0 ? '0' : keys.length)
        $('#ck_loadJobCountButton').hide()
    })
}

window.addEventListener('ck_exportJSON', exportJSON)
window.addEventListener('ck_importJSON', importJSON)
window.addEventListener('ck_clearData', clearData)
window.addEventListener('ck_loadJobCount', updateJobCount)

let textFile: string | null = null

function exportJSON() {
    getLocalStorage(null).then(results => {
        const text = JSON.stringify(results)

        const data = new Blob([text], { type: 'application/json' })

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile)
        }

        // use textFile as href
        textFile = window.URL.createObjectURL(data)

        // click download
        // https://stackoverflow.com/a/21016088
        const link = document.createElement('a')
        link.href = textFile
        link.download = 'ww_data.json'
        link.target = '_blank'
        document.body.appendChild(link)
        window.requestAnimationFrame(function () {
            const event = new MouseEvent('click')
            link.dispatchEvent(event)
            document.body.removeChild(link)
        })
    })
}

function importJSON() {
    const picker = $('#ck_importJSONpicker')
    picker.change(function (e) {
        // getting a hold of the file reference
        // @ts-ignore TODO remove
        const file = e.target.files[0]

        // setting up the reader
        const reader = new FileReader()
        reader.readAsText(file)

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            // @ts-ignore TODO remove
            const content = readerEvent.target.result // this is the content!
            // @ts-ignore TODO remove
            const contentObj = JSON.parse(content)
            setLocalStorage(contentObj).then(() => {
                updateJobCount()
            })
        }
    })
    picker.trigger('click')
}

function clearData() {
    clearLocalStorage().then(() => {
        updateJobCount()
    })
}
