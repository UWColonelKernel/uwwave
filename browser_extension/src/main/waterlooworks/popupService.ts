import { addRuntimeListener, getExtensionId } from '../common/runtime'
import { Runtime } from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender

const extId = getExtensionId()
const opHandler = (message: any, sender: MessageSender, sendResponse: () => void) => {
    if (sender.id != extId || !message?.op) { return; }

    switch(message.op) {
        case "confirm":
            console.log('Popup opened');
            break;
        case "scrape":
            console.log("Popup requested scrape");
            window.dispatchEvent(new Event('ck_scrapeMain'));
            break;
        default:
            console.error("Unrecognised message: ", message);
            return;
    }

    sendResponse();
}

addRuntimeListener(opHandler)
