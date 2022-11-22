var coopHomeDoc = undefined
var runState = -1;
var stateTarget = [0, 0, 0, 0];
var stateProgress = [0, 0, 0, 0];
const totalNumberOfStates = 4;
const baseProgress = 10;

var workTermRatingRequests = [];
var scrapeViewed = false;

function scrapeMain() {
    if (runState === -1) {
        console.log("Starting scraper...");

        $('#ck_scrapeProgress').show();

        runState = 0;
        stateTarget = [0, 0, 0, 0];
        stateProgress = [0, 0, 0, 0];
        workTermRatingRequests = [];
        scrapeViewed = $('#ck_scrapeViewedCheckbox').prop('checked');
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
        case 3:
            if (stateTarget[0] === stateProgress[0] && stateTarget[1] === stateProgress[1] && stateTarget[2] === stateProgress[2]) {
                if (stateTarget[3] === 0) {
                    progressMessage = "Scraping company work term ratings";
                }
                else {
                    progressMessage = `Viewed ${stateProgress[3]} / ${stateTarget[3]} company work term ratings`;
                }
                break;
            }
            // FALL THROUGH
        case 2:
            if (stateTarget[0] === stateProgress[0] && stateTarget[1] === stateProgress[1]) {
                if (stateTarget[2] === 0) {
                    progressMessage = "Scraping 'Viewed'...";
                }
                else {
                    progressMessage = `Viewed ${stateProgress[2]} / ${stateTarget[2]} jobs`;
                }
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

    // Find quick search links
    const reloadQuickSearchCountsAction = getReloadQuickSearchCountsAction();

    switch (runState) {
        case 0:
            console.log(`${runState}) Scraping jobs available from default search`);
            const searchAction = $(coopHomeDoc).find('#widgetSearch input[name="action"]').attr('value');
            sendForm({action: searchAction, page: 1}, onLoadPostingsTable, 5);
            break;
        case 1:
            console.log(`${runState}) Scraping to find For My Program jobs`)

            // Load and scrape "For my program"
            function onLoadQuickSearchesForMyProgram(event, data) {
                var htmlDoc = $.parseHTML(event.currentTarget.response);

                const forMyProgramLink = $(htmlDoc).find('tr:nth-child(1) a');
                const action = getActionFromQuickSearchLink(forMyProgramLink);

                // isForMyProgram is used to tag the jobs
                sendForm({action, page: 1, performNewSearch: true, isForMyProgram: true}, onLoadPostingsTable, 5);
            }

            sendForm({action: reloadQuickSearchCountsAction}, onLoadQuickSearchesForMyProgram, 5);
            break;
        case 2:
            console.log(`${runState}) Scraping to find Viewed jobs`);

            // Load and scrape "Viewed"
            function onLoadQuickSearchesViewed(event, data) {
                var htmlDoc = $.parseHTML(event.currentTarget.response);

                const viewedLink = $(htmlDoc).find('tr:nth-child(4) a');
                const action = getActionFromQuickSearchLink(viewedLink);

                // isForMyProgram is used to tag the jobs
                sendForm({action, page: 1, performNewSearch: true, isViewed: true}, onLoadPostingsTable, 5);
            }

            if (scrapeViewed) {
                sendForm({action: reloadQuickSearchCountsAction}, onLoadQuickSearchesViewed, 5);
            }
            else {
                // skip this stage
                stateTarget[2] = 1;
                stateProgress[2] = 1;
                runState += 1;
                runSearch();
            }

            break;
        case 3:
            console.log(`${runState}) Scraping work term ratings`);

            stateTarget[3] = workTermRatingRequests.length;

            const limit = Math.min(workTermRatingRequests.length, 100);

            const doneScrapeRating = () => {
                stateProgress[3] += 1;
                updateProgressBar();
                if (stateProgress[3] === stateTarget[3]) {
                    console.log(`${runState}) Done scraping work term ratings.`);
                    runState += 1;
                    runSearch();
                } else if (limit - 1 + stateProgress[3] < stateTarget[3]) {
                    const wtrForm = workTermRatingRequests[limit - 1 + stateProgress[3]];
                    openJobWorkTermRatings(wtrForm.formObj, wtrForm.jobId, doneScrapeRating);
                }
            }

            if (limit === 0) {
                // skip this stage
                stateTarget[3] = 1;
                stateProgress[3] = 1;
                runState += 1;
                runSearch();
            }

            for (var i = 0; i < limit; i += 1) {
                const wtrForm = workTermRatingRequests[i];
                openJobWorkTermRatings(wtrForm.formObj, wtrForm.jobId, doneScrapeRating);
            }

            break;
        default:
            // done, update before resetting variables
            window.dispatchEvent(new Event('ck_loadJobCount'));
            updateProgressBar();
            runState = -1;
            return;
    }
    updateProgressBar();
}

// Calling the action gives you links to "For My Program", "Applied To", "Shortlist", "Viewed", etc.
function getReloadQuickSearchCountsAction() {
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
    return reloadQuickSearchCountsAction;
}

function getActionFromQuickSearchLink(link) {
    const onclick = $(link).attr('onclick');
    const offset = "displayQuickSearch('".length;
    const start = onclick.indexOf("displayQuickSearch('") + offset;
    const end = onclick.indexOf("'", start);
    const action = onclick.substring(start, end);
    return action;
}

function onLoadPostingsTable(event, data) {
    const tempRunState = runState; // save before it gets changed

    console.log(`${tempRunState}) Scraping page ${data["page"]}`);

    var htmlDoc = $.parseHTML(event.currentTarget.response);

    const pageNumberElem = $(htmlDoc).find('#currentPageff45d44d8af8');
    const pageNumber = pageNumberElem.attr('value');

    if (pageNumber != data["page"]) { // not strict equality
        console.log(`${tempRunState}) No more pages to scrape. Actual page ${pageNumber}. Requested page ${data["page"]}.`);
        return;
    }

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
            console.log(`${tempRunState}) Done scraping page ${pageNumber}.`);
        }
        if (stateProgress[tempRunState] === stateTarget[tempRunState]) {
            console.log(`${tempRunState}) Done scraping jobs in this stage.`)
            runState += 1;
            runSearch();
        }
        else if (postingsToScrape === 0) {
            // Need to load pages individually as the server can only serve one page at a time
            sendForm({...data, page: data["page"] + 1}, onLoadPostingsTable, 5);
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
    const isForMyProgram = data.isForMyProgram === true;
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
    const onLoad = (event, data2) => {
        var htmlDoc = $.parseHTML(event.currentTarget.response);
        var postingScrape = scrapeJobPosting(htmlDoc);
        if (data.isViewed || !scrapeViewed) {
            queueJobWorkTermRatingTabRequest(htmlDoc, jobId);
        }

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
        chrome.storage.local.set(storeData, () => {
            if (callback) {
                callback();
            }
        });
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

function readVariableSingleQuote(text, searchStr) {
    var actionIndex = text.indexOf(searchStr);
    if (actionIndex !== -1) {
        actionIndex += searchStr.length;
        const start = text.indexOf('\'', actionIndex);
        const end = text.indexOf('\'', start + 1);
        return text.substring(start+1, end);
    } else {
        return "";
    }
}

// pass in job posting html doc
function queueJobWorkTermRatingTabRequest(htmlDoc, jobId) {
    const workTermRatingButton = $(htmlDoc).find('ul.nav-pills li').last().find('a')[0];

    const onclick = $(workTermRatingButton).attr('onclick');
    if (onclick === undefined) {
        return;
    }
    const formObjStr = onclick.substring(onclick.indexOf("{"), onclick.indexOf("}") + 1).replace(/\'/g, "\"");
    const formObj = JSON.parse(formObjStr);

    workTermRatingRequests.push({formObj, jobId});
}

function openJobWorkTermRatings(formObj, jobId, callback) {
    const onLoadWorkTermRatingsTab = (event, data) => {
        var workTermRatingContainerHtmlDoc = $.parseHTML(event.currentTarget.response, document, true);  // last param true to include scripts

        var reportHolder = "";
        var reportHolderId = "";
        var reportHolderField = "";
        var workTermRatingAction = "";
        
        $(workTermRatingContainerHtmlDoc).find('ul.nav-pills').siblings('script').each(function (index, script) {
            const text = $(script).text();
            const holderTemp = readVariableSingleQuote(text, "reportParams.reportHolder = ");
            if (holderTemp !== "") {
                reportHolder = holderTemp;
            }
            const holderIdTemp = readVariableSingleQuote(text, "reportParams.reportHolderId = ");
            if (holderIdTemp !== "") {
                reportHolderId = holderIdTemp;
            }
            const holderFieldTemp = readVariableSingleQuote(text, "reportParams.reportHolderField = ");
            if (holderFieldTemp !== "") {
                reportHolderField = holderFieldTemp;
            }
            const actionTemp = readVariableSingleQuote(text, "'action':");
            if (actionTemp !== "") {
                workTermRatingAction = actionTemp;
            }
        });

        if (reportHolder === "" || reportHolderId === "" || reportHolderField === "" || workTermRatingAction === "") {
            if (callback) {
                callback();
            }
            return;
        }

        const workTermRatingFormObj = {
            reportHolder, 
            reportHolderId, 
            reportHolderField, 
            action: workTermRatingAction
        };

        // open the work term rating, and scrape it
        const onLoadWorkTermRatings = (event2, data2) => {
            var workTermRatingsHtmlDoc = $.parseHTML(event2.currentTarget.response, document, true); // scripts contain charts
            var workTermRatingScrape = scrapeWorkTermRatings(workTermRatingsHtmlDoc);

            const storeData = {};
            storeData["division_" + reportHolderId] = workTermRatingScrape;

            chrome.storage.local.set(storeData, () => {
                // update the job's division field (company)
                chrome.storage.local.get(jobId, function (response) {
                    response[jobId]["Division ID"] = reportHolderId;
                    const storeDataJob = {};
                    storeDataJob[jobId] = response[jobId];
                    chrome.storage.local.set(storeDataJob, () => {
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
        };

        sendForm(workTermRatingFormObj, onLoadWorkTermRatings, 5);
    }
    sendForm(formObj, onLoadWorkTermRatingsTab, 5);
}

function scrapeWorkTermRatings(htmlDoc) {
    const ratingData = {graphs: {}};

    $(htmlDoc).find('div.boxContent > div.row').each((index, dataRow) => {
        const dataKeyOrg = "organization";
        const dataKeyDiv = "division";
        const dataKeyHireHistory = "hire_history";
        if (index === 0) {
            const searchStr = "Organization:";
            const labelText = $(dataRow).find('div strong').parent().text();
            ratingData[dataKeyOrg] = labelText.substring(labelText.indexOf(searchStr) + searchStr.length).trim();
        }
        else if (index === 1) {
            const searchStr = "Division:";
            const labelText = $(dataRow).find('div strong').parent().text();
            const orgAndDiv = labelText.substring(labelText.indexOf(searchStr) + searchStr.length).trim();
            ratingData[dataKeyDiv] = orgAndDiv.substring(ratingData[dataKeyOrg].length).replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
        }
        else if (index === 2) {
            ratingData[dataKeyHireHistory] = {};
            var hireHistoryHeaders = [];
            var hireHistoryOrganization = [];
            var hireHistoryDivision = [];
            $(dataRow).find('table thead th').each((i, dataPoint) => {
                hireHistoryHeaders.push($(dataPoint).text());
            });
            $(dataRow).find('table tbody tr:nth-child(1) td').each((i, dataPoint) => {
                hireHistoryOrganization.push($(dataPoint).text());
            });
            $(dataRow).find('table tbody tr:nth-child(2) td').each((i, dataPoint) => {
                hireHistoryDivision.push($(dataPoint).text());
            });
            for (var i = 2; i < hireHistoryHeaders.length; i += 1) {
                ratingData[dataKeyHireHistory][hireHistoryHeaders[i]] = {
                    organization: hireHistoryOrganization[i],
                    division: hireHistoryDivision[i]
                }
            }
        }
        else if (index >= 3) {
            $(dataRow).find('script').each((i, script) => {
                const text = $(script).text();
                const searchStr = "orbisChart(";
                const start = text.indexOf(searchStr) + searchStr.length;
                const end = text.indexOf(");", start);
                const objStr = text.substring(start, end);

                const plotOptionsStart = objStr.indexOf("plotOptions:");
                const plotOptionsEnd = objStr.indexOf("credits:");

                const fixed = objStr.substring(0, plotOptionsStart) + objStr.substring(plotOptionsEnd);

                const graphObj = JSON5.parse(fixed);

                if (graphObj !== undefined && graphObj.series !== undefined) {
                    const dataObj = {
                        series: graphObj.series
                    };
    
                    const title = graphObj.title.text
                                    .replace(ratingData[dataKeyOrg], "") // org name
                                    .replace(ratingData[dataKeyDiv], "") // division name
                                    .replace("<br>", " ") // newlines
                                    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ""); // trim non alphanumeric chars
                    if (graphObj.xAxis !== undefined && graphObj.xAxis.categories !== undefined) {
                        dataObj.categories = graphObj.xAxis.categories;
                    }

                    ratingData.graphs[title] = dataObj;
                }

            });
        }
    });

    return ratingData;
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