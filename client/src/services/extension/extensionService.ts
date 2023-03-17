import {
  MessagePayload,
  MessageType,
  RequestName,
  RequestPayload,
  ResultPayload,
} from 'src/shared/extension/dataBridge'

export const sendMessageOnLoadAndSetupListenerHook = (
  request: RequestPayload,
  listener?: (result?: ResultPayload) => void,
) => {
  let receiveExtensionMessage:
    | ((event: MessageEvent<MessagePayload>) => void)
    | undefined
  if (listener) {
    receiveExtensionMessage = buildExtensionApiListener(
      MessageType.fromExtension,
      request.id,
      request.reqName,
      listener,
    )
  }

  const receiveExtensionLoadedMessage = buildExtensionApiListener(
    MessageType.extensionLoaded,
    null,
    null,
    () => {
      console.info('Extension loaded.')
      sendMessageToExtension(request)
    },
  )

  if (receiveExtensionMessage) {
    window.addEventListener('message', receiveExtensionMessage, false)
  }
  window.addEventListener('message', receiveExtensionLoadedMessage, false)

  // Specify how to clean up after this effect:
  return function cleanup() {
    if (receiveExtensionMessage) {
      window.removeEventListener('message', receiveExtensionMessage)
    }
    window.removeEventListener('message', receiveExtensionLoadedMessage)
  }
}

export function sendMessageToExtension(request?: RequestPayload) {
  console.info(
    `[Client] Sending message to extension, reqName: ${request?.reqName}, id: ${request?.id}, params: ${request?.params}`,
  )
  const messagePayload: MessagePayload = { type: MessageType.fromPage }
  if (request) {
    messagePayload.request = request
  }
  window.postMessage(messagePayload, '*')
}

// null means listen to all
export function buildExtensionApiListener(
  type: MessageType,
  id: string | null,
  reqName: RequestName | null,
  callback: (result?: ResultPayload) => void,
) {
  return (event: MessageEvent<MessagePayload>) => {
    // We only accept messages from ourselves
    if (event.source !== window) {
      return
    }

    // ensure required fields present
    if (!event.data || !event.data.type) {
      return
    }

    if (event.data.type === type) {
      if (
        id &&
        reqName &&
        event.data.request &&
        (id !== event.data.request.id || reqName !== event.data.request.reqName)
      ) {
        // no match, ignore this message
        return
      }
      callback(event.data.result)
    }
  }
}
