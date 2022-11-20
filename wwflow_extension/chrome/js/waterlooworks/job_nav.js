
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params[queryParamJobId] !== undefined && params[queryParamRedirect] === "coop" && window.location.href.split('?')[0] !== postings) {
    // replace old url in history
    window.location.replace(postings + "?" + urlSearchParams.toString());
} else if (params[queryParamJobId] !== undefined) {
    const jobIdField = document.querySelector('form#searchByPostingNumberForm input#postingId');
    if (jobIdField) { // on coop postings home, redirect
        // jquery .val() doesn't work, use vanilla js .value
        document.querySelector('form#searchByPostingNumberForm input#postingId').value = params[queryParamJobId];

        // consume job id field so that we don't get stuck in redirect loop
        delete params[queryParamJobId];
        const urlSearchParamsUpdated = new URLSearchParams(params);

        // submit form to redirect
        $('form#searchByPostingNumberForm').prop("action", postings + "?" + urlSearchParamsUpdated.toString());
        $('form#searchByPostingNumberForm').submit();
    }
} else { // might be on job specific page
    const jobNameElement = $('h1.dashboard-header__profile-information-name');
    if (jobNameElement.length > 0) {
        const jobId = jobNameElement.text().split("-")[0].trim();
        if (!isNaN(jobId)) { // successfully got jobid, on job specific page
            params[queryParamJobId] = jobId;
            const urlSearchParamsUpdated = new URLSearchParams(params);

            history.replaceState({}, '', postings + "?" + urlSearchParamsUpdated.toString());
        }
    }
}


