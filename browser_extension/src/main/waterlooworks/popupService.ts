import { addRuntimeListener, getExtensionId } from '../common/runtime'
import { Runtime } from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender
import { scraper } from './scraper'

const extId = getExtensionId()
const opHandler = (message: any, sender: MessageSender, sendResponse: (...params: any) => void) => {
    if (sender.id != extId || !message?.op) { return; }

    switch(message.op) {
        case "status":
            console.log('Popup requested scraper status');
            sendResponse({
                stage: scraper.stage,
                stageProgress: scraper.stageProgress,
                stageTarget: scraper.stageTarget
            });
            break;
        case "scrape":
            console.log("Popup requested scrape");
            window.dispatchEvent(new Event('ck_scrapeMain'));
            sendResponse();
            break;
        default:
            console.error("Unrecognised message: ", message);
            return;
    }
}

addRuntimeListener(opHandler)
