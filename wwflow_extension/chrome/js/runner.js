const postings = "https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm"

async function main() {
    console.log("running extension main...");
    if (window.location.href === postings) {
        const searchButton = $('#widgetSearch').find('[type="submit"]');
        if (searchButton.length > 0) { // home page
            searchButton.click();
            return;
        }

        // postings list
        const table = $('#postingsTable');
        table.find('tbody tr').each(function (index, tr) {
            // link that opens job posting
            const jobTitleLink = $(tr).find('td:nth-child(4) a');
            const onclick = $(jobTitleLink).attr('onclick');
            const formObjStr = onclick.substring(onclick.indexOf("{"), onclick.indexOf("}") + 1).replace(/\'/g, "\"");
            console.log(formObjStr);
            const formObj = JSON.parse(formObjStr);
            console.log(formObj);
            sendForm(formObj);
        });
    }
    else {
        window.location.replace(postings);
    }
}

// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
function sendForm(data) {
    const XHR = new XMLHttpRequest();
    const FD = new FormData();

    // Push our data into our FormData object
    for (const [name, value] of Object.entries(data)) {
        FD.append(name, value);
    }

    // Define what happens on successful data submission
    XHR.addEventListener('load', (event) => {
        // console.log(event.currentTarget.response);
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(event.currentTarget.response, 'text/html');
        console.log(htmlDoc);
    });

    // Define what happens in case of error
    XHR.addEventListener('error', (event) => {
        console.log("Form send error!", event);
    });

    // Set up our request
    XHR.open('POST', postings);

    // Send our FormData object; HTTP headers are set automatically
    XHR.send(FD);
}

chrome.storage.session.get(["state"], (items) => {
    const state = items["state"];
    if (state === "ON") {
        main();
    }
});

chrome.storage.session.onChanged.addListener(function (changes) {
    const state = changes["state"]["newValue"];
    if (state === "ON") {
        main();
    }
});

// chrome.runtime.sendMessage({listenSession: true}, function(response) {
//     console.log(response);
// });

