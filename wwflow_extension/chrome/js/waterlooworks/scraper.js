var coopHomeDoc = undefined
var runState = -1;
var stateTarget = [0, 0];
var stateProgress = [0, 0];
const totalNumberOfStates = 2;
const baseProgress = 10;

function scrapeMain() {
    if (runState === -1) {
        console.log("Starting scraper...");

        $('#ck_scrapeProgress').show();

        runState = 0;
        stateTarget = [0, 0];
        stateProgress = [0, 0];
        getHttp(postings, onLoadCoopHome, 5);
    }
    else {
        console.log("Scraper still running, please wait...");
    }
}

window.addEventListener("ck_scrapeMain", scrapeMain);

function onLoadCoopHome(event) {
    coopHomeDoc = $.parseHTML(event.currentTarget.response, document, true);
    runSearch();
}

function updateProgressBar() {
    const progressPerStage = ((100 - baseProgress)/totalNumberOfStates);
    var progressValue = 0;
    stateTarget.forEach((target, index) => {
        if (target > 0) {
            progressValue += progressPerStage * (stateProgress[index]/target);
        }
    });
    progressValue += baseProgress;

    var progressMessage = "";
    switch (runState) {
        default:
            if (progressValue >= 100) {
                progressMessage = "Done!";
                break;
            }
            // FALL THROUGH
        case 1:
            if (stateTarget[0] === stateProgress[0]) {
                if (stateTarget[1] === 0) {
                    progressMessage = "Scanning 'For My Program'...";
                }
                else {
                    progressMessage = `Scanned ${stateProgress[1]} / ${stateTarget[1]} jobs`;
                }
                break;
            }
            // FALL THROUGH
        case 0:
            if (stateTarget[0] === 0) {
                progressMessage = "Starting...";
            }
            else {
                progressMessage = `Viewed ${stateProgress[0]} / ${stateTarget[0]} jobs`;
            }
            break;
    }
    $('#ck_scrapeProgressBar').text(progressMessage);
    $('#ck_scrapeProgressBar').css('width', `${progressValue}%`);
    $('#ck_scrapeProgressBar').attr('aria-valuenow', progressValue);
}

// Runs when all pages have been loaded for a run
function runSearch() {
    scrapedJobs = 0;
    jobsCount = -1;
    switch (runState) {
        case 0:
            console.log("Scraping all jobs");
            const searchAction = $(coopHomeDoc).find('#widgetSearch input[name="action"]').attr('value');
            sendForm({action: searchAction, page: 1}, onLoadPostingsTable, 5);
            break;
        case 1:
            console.log("Scraping to find For My Program jobs")
            // Find "For my program" link
            var reloadQuickSearchCountsAction = "";
            $(coopHomeDoc).find('script').each(function (index, script) {
                const text = $(script).text();
                const funcIndex = text.indexOf("function reloadQuickSearchCounts");
                if (funcIndex !== -1) {
                    const searchStr = "request.action = ";
                    const actionIndex = text.indexOf(searchStr, funcIndex);
                    const start = text.indexOf('\"', actionIndex);
                    const end = text.indexOf('\"', start + 1);
                    
                    reloadQuickSearchCountsAction = text.substring(start+1, end);
                }
            });
            sendForm({action: reloadQuickSearchCountsAction}, onLoadQuickSearches, 5);
            break;
        default:
            // done, update before resetting variables
            updateProgressBar();
            runState = -1;
            return;
    }
    updateProgressBar();
}

// "For my program" action
function onLoadQuickSearches(event, data) {
    var htmlDoc = $.parseHTML(event.currentTarget.response);

    const forMyProgramLink = $(htmlDoc).find('tr:nth-child(1) a');
    const onclick = $(forMyProgramLink).attr('onclick');
    const offset = "displayQuickSearch('".length;
    const start = onclick.indexOf("displayQuickSearch('") + offset;
    const end = onclick.indexOf("'", start);
    const action = onclick.substring(start, end);

    // isForMyProgram is used to tag the jobs
    sendForm({action, page: 1, performNewSearch: true, isForMyProgram: true}, onLoadPostingsTable, 5);
}

function onLoadPostingsTable(event, data) {
    const tempRunState = runState; // save before it gets changed

    console.log(`Scraping page ${data["page"]}`);

    var htmlDoc = $.parseHTML(event.currentTarget.response);

    const pageNumberElem = $(htmlDoc).find('#currentPageff45d44d8af8');
    const pageNumber = pageNumberElem.attr('value');

    if (pageNumber != data["page"]) { // not strict equality
        console.log(`No more pages to scrape. Actual page ${pageNumber}. Requested page ${data["page"]}.`);
        runState += 1;
        runSearch();
        return;
    }

    // Need to load pages individually as the server can only serve one page at a time
    sendForm({...data, page: data["page"] + 1}, onLoadPostingsTable, 5);

    const startCount = $(htmlDoc).find('#totalOverAllDocs').text();
    const endCount = $(htmlDoc).find('#totalOverAllPacks').text();
    var postingsToScrape = Number(endCount) - Number(startCount) + 1;

    const jobsCount = $(htmlDoc).find('#postingsTablePlaceholder div.orbis-posting-actions span').eq(0).text();
    stateTarget[tempRunState] = Number(jobsCount);

    const doneScrapeRow = () => {
        postingsToScrape -= 1;
        stateProgress[tempRunState] += 1;
        updateProgressBar();
        if (postingsToScrape === 0) {
            console.log(`Done scraping page ${pageNumber}.`);
        }
    }

    // postings list
    const table = $(htmlDoc).find('#postingsTable');
    table.find('tbody tr').each(function (index, tr) {
        scrapeJobTableRowEntry(tr, data, doneScrapeRow);
    });
}

function scrapeJobTableRowEntry(tr, data, callback) {
    // get the job id
    const jobId = $(tr).find('td:nth-child(3)').text();

    // are we scanning for isForMyProgram only?
    const isForMyProgram = data["isForMyProgram"] === true;
    if (isForMyProgram) {
        chrome.storage.local.get(jobId, function(result){
            result[jobId]["isForMyProgram"] = isForMyProgram;
            chrome.storage.local.set(result);
            if (callback) {
                callback();
            }
        });
        return;
    }

    // get the form data to open the job posting
    const jobTitleLink = $(tr).find('td:nth-child(4) a');
    const onclick = $(jobTitleLink).attr('onclick');
    const formObjStr = onclick.substring(onclick.indexOf("{"), onclick.indexOf("}") + 1).replace(/\'/g, "\"");
    const formObj = JSON.parse(formObjStr);

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
        const deadline = $(tr).find('td:nth-child(12)').text().trim();

        const postingListData = {jobTitle, company, division, openings, location, level, applications, deadline};
        
        const storeData = {};
        storeData[jobId] = postingScrape;
        storeData[jobId]["Posting List Data"] = postingListData;
        chrome.storage.local.set(storeData);
        if (callback) {
            callback();
        }
    };
    sendForm(formObj, onLoad, 5);
}

function scrapeJobPosting(htmlDoc) {
    data = {};

    function processTableRow(index, tr) {
        var ret = {};
        var key = $(tr).find('td:nth-child(1) strong').text().trim();
        key = key.substring(0, key.length - 1);
        const content = $(tr).find('td:nth-child(2) span');
        if (content.length > 0) {
            const value = content.html().trim();
            ret[key] = value;
            return ret;
        }

        const contentPlain = $(tr).find('td:nth-child(2)');
        if (contentPlain.length > 0) {
            const value = contentPlain.html().trim();
            ret[key] = value;
            return ret;
        }

        const contentTable = $(tr).find('td:nth-child(2) table');
        if (contentTable.length > 0) {
            var value = [];
            contentTable.find('tbody tr').each(function (index, subTr) {
                $(subTr).find('td').each(function (index, subTd) {
                    value.push($(subTd).text().trim());
                });
            });
            ret[key] = value;
            return ret;
        }

        return ret;
    }

    const postingDiv = $(htmlDoc).find('#postingDiv');
    postingDiv.find('> div').each(function(index, div) {
        const header = $(div).find('> div').eq(0).text().trim();
        $(div).find('div > table tbody tr').each(function (index, tr) {
            const pair = processTableRow(index, tr);
            data[header] = {...data[header], ...pair};
        });
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
            onLoad(event, data);
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

function getHttp(url, onLoad, retries) {
    const XHR = new XMLHttpRequest();

    // Define what happens on successful data submission
    XHR.addEventListener('load', (event) => {
        if (XHR.status === 404) {
            console.error("Not found.", event);
            if (retries > 0) {
                console.log("Retrying...");
                getHttp(url, onLoad, retries - 1); 
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
            getHttp(url, onLoad, retries - 1);
        }
    });
    
    XHR.open("GET", url);

    XHR.send();
}