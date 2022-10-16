const postings = "https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm"

var postingsToScrape = -1;
var pageNumber = -1;
var nextPageButton = undefined;

async function main() {
    console.log("running extension main...");
    if (window.location.href === postings) {
        // const searchButton = $('#widgetSearch').find('[type="submit"]');
        // if (searchButton.length > 0) { // home page
        //     searchButton.click();
        //     return;
        // }

        // postings list
        const table = $('#postingsTable');
        table.find('tbody tr').each(function (index, tr) {
            scrapeJobTableRowEntry(tr);
        });

        const startCount = $('#totalOverAllDocs').text();
        const endCount = $('#totalOverAllPacks').text();
        postingsToScrape = Number(endCount) - Number(startCount) + 1;

        const pageNumberElem = $('#currentPageff45d44d8af8');
        pageNumber = pageNumberElem.attr('value');
        nextPageButton = pageNumberElem.parent().find('ul li.active').next();
    }
    // else {
    //     window.location.replace(postings);
    // }
}

function scrapeJobTableRowEntry(tr) {
    // get the form data to open the job posting
    const jobTitleLink = $(tr).find('td:nth-child(4) a');
    const onclick = $(jobTitleLink).attr('onclick');
    const formObjStr = onclick.substring(onclick.indexOf("{"), onclick.indexOf("}") + 1).replace(/\'/g, "\"");
    const formObj = JSON.parse(formObjStr);

    // get the job id
    const jobId = $(tr).find('td:nth-child(3)').text();

    // open the job posting, and scrape it
    const onLoad = (event) => {
        var htmlDoc = $.parseHTML(event.currentTarget.response);
        var postingScrape = scrapeJobPosting(htmlDoc);

        // get data from the table row
        const jobTitle = $(tr).find('td:nth-child(4)').attr('data-totitle');
        const company = $(tr).find('td:nth-child(5)').attr('data-totitle');
        const division = $(tr).find('td:nth-child(6)').attr('data-totitle');
        const openings = $(tr).find('td:nth-child(7)').text().trim();
        // internal status
        const location = $(tr).find('td:nth-child(9)').text().trim();
        const level = $(tr).find('td:nth-child(10)').text().trim();
        const applications = $(tr).find('td:nth-child(11)').text().trim();
        const deadline = $(tr).find('td:nth-child(11)').text().trim();

        const postingListData = {jobTitle, company, division, openings, location, level, applications, deadline};
        
        const data = {};
        data[jobId] = postingScrape;
        data[jobId]["Posting List Data"] = postingListData;
        chrome.storage.local.set(data);
        postingsToScrape -= 1;
        if (postingsToScrape === 0) {
            console.log("Done scraping!");
            console.log(nextPageButton);
            if (nextPageButton !== undefined && !nextPageButton.hasClass('disabled')) {
                
            }
        }
    };
    sendForm(formObj, onLoad, 5);
}

function scrapeJobPosting(htmlDoc) {
    data = {};
    const postingDiv = $(htmlDoc).find('#postingDiv');
    // job posting information
    postingDiv.find('div:nth-child(1) table tbody tr').each(function (index, tr) {
        var key = $(tr).find('td:nth-child(1) strong').text().trim();
        key = key.substring(0, key.length - 1);
        const content = $(tr).find('td:nth-child(2) span');
        if (content.length > 0) {
            const value = content.text().trim();
            data[key] = value;
        }
        else {
            const contentTable = $(tr).find('td:nth-child(2) table');
            if (contentTable.length > 0) {
                var value = [];
                contentTable.find('tbody tr').each(function (index, subTr) {
                    $(subTr).find('td').each(function (index, subTd) {
                        value.push($(subTd).text().trim());
                    });
                });
                data[key] = value;
            }
        }
    });
    
    return data;
}

// https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
function sendForm(data, onLoad, retries) {
    const XHR = new XMLHttpRequest();
    const FD = new FormData();

    // Push our data into our FormData object
    for (const [name, value] of Object.entries(data)) {
        FD.append(name, value);
    }

    // Define what happens on successful data submission
    XHR.addEventListener('load', (event) => {
        if (XHR.status === 404) {
            console.error("Not found.", event);
            if (retries > 0) {
                console.log("Retrying...");
                sendForm(data, onLoad, retries - 1); 
            }
        } else if (onLoad) {
            onLoad(event);
        }
    });

    // Define what happens in case of error
    XHR.addEventListener('error', (event) => {
        console.error("Failed to send form.", event);
        if (retries > 0) {
            console.log("Retrying...");
            sendForm(data, onLoad, retries - 1);
        }
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
    const state = changes["state"];
    if (state !== undefined && state["newValue"] === "ON") {
        main();
    }
});
