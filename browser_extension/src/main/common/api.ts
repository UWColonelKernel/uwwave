import axios, { AxiosResponse } from 'axios'

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export function sendForm(url: string, method: string, data: object): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();

    // Push our data into our FormData object
    for (const [name, value] of Object.entries(data)) {
        formData.append(name, value);
    }

    return axios({
        url,
        method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
}

// const DEFAULT_RETRY_COUNT = 5
//
// export interface HttpResponse {
//     event: ProgressEvent<XMLHttpRequestEventTarget>
//     status: number
//     requestData: object
// }
// export function sendForm(url: string, data: object, retries?: number): Promise<HttpResponse> {
//     return new Promise<HttpResponse>((resolve, reject) => {
//         sendFormCallback(url, data, retries || 5, (response) => {
//             if (response.status >= 400) {
//                 reject(`Failed with response status ${response.status}`)
//             }
//             else {
//                 resolve(response)
//             }
//         })
//     })
// }
//
// // https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
// function sendFormCallback(
//     url: string,
//     data: object,
//     retries: number,
//     callback: (response: HttpResponse) => void
// ): void {
//     const XHR = new XMLHttpRequest();
//     const FD = new FormData();
//
//     // Push our data into our FormData object
//     for (const [name, value] of Object.entries(data)) {
//         FD.append(name, value);
//     }
//
//     // Define what happens on successful data submission
//     XHR.addEventListener('load', (event) => {
//         if (XHR.status === 404) {
//             console.error("Not found.", event);
//             if (retries > 0) {
//                 console.log("Retrying...");
//                 sendFormCallback(url, data, retries - 1, callback);
//             }
//             else {
//                 console.log("No more retries");
//                 callback({ event, status: XHR.status, requestData: data })
//             }
//         } else {
//             callback({ event, status: XHR.status, requestData: data })
//         }
//     });
//
//     // Define what happens in case of error
//     XHR.addEventListener('error', (event) => {
//         console.error("Failed to send form.", event);
//         if (retries > 0) {
//             console.log("Retrying...");
//             sendFormCallback(url, data, retries - 1, callback);
//         }
//         else {
//             console.log("No more retries");
//             callback({ event, status: XHR.status, requestData: data })
//         }
//     });
//
//     // Set up our request
//     XHR.open('POST', url);
//
//     // Send our FormData object; HTTP headers are set automatically
//     XHR.send(FD);
// }
//
// export function getHttp(
//     url: string,
//     onLoad: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void,
//     retries: number,
// ): void {
//     const XHR = new XMLHttpRequest();
//
//     // Define what happens on successful data submission
//     XHR.addEventListener('load', (event) => {
//         if (XHR.status === 404) {
//             console.error("Not found.", event);
//             if (retries > 0) {
//                 console.log("Retrying...");
//                 getHttp(url, onLoad, retries - 1);
//             }
//         } else if (onLoad) {
//             onLoad(event);
//         }
//     });
//
//     // Define what happens in case of error
//     XHR.addEventListener('error', (event) => {
//         console.error("Failed to send form.", event);
//         if (retries > 0) {
//             console.log("Retrying...");
//             getHttp(url, onLoad, retries - 1);
//         }
//     });
//
//     XHR.open("GET", url);
//
//     XHR.send();
// }
