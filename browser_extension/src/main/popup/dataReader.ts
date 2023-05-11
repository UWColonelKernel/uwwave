import $ from 'jquery'
import {
    getLocalStorage,
} from '../common/storage'
import { JOB_DATA_IDENTIFIERS } from '../shared/job'
import { JobBoard } from '../shared/jobBoard'
import { DIVISION_DATA_IDENTIFIER } from '../shared/company'

export async function getJobCount(): Promise<number> {
    const results = await getLocalStorage(null)
    const keys = Object.keys(results).filter(
        key => key.indexOf(JOB_DATA_IDENTIFIERS[JobBoard.coop]) !== -1,
    )
    return keys.length
}

export async function getCompanyCount(): Promise<number> {
    const results = await getLocalStorage(null)
    const keys = Object.keys(results).filter(
        key => key.indexOf(DIVISION_DATA_IDENTIFIER) !== -1,
    )
    return keys.length
}

let textFile: string | null = null

export async function exportJSON() {
    const results = await getLocalStorage(null)

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
}

export function setupJsonPickerHandler(key: string, callback: (contentObj: any) => void) {
    const picker = $(`#${key}`)
    picker.change(function (e) {
        // getting a hold of the file reference
        // @ts-ignore TODO remove
        const file = e.target.files[0]

        console.log(e.target)

        // setting up the reader
        const reader = new FileReader()
        reader.readAsText(file)

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            // @ts-ignore TODO remove
            const content = readerEvent.target.result // this is the content!
            // @ts-ignore TODO remove
            const contentObj = JSON.parse(content)
            callback(contentObj)
        }
    })
}

export function openJsonPicker(key: string) {
    const picker = $(`#${key}`)
    picker.trigger('click')
}
