chrome.storage.local.onChanged.addListener(function (changes) {
    $('#ck_loadJobCountButton').show();
});

function updateJobCount() {
    chrome.storage.local.get(function(results) {
        const keys = Object.keys(results).filter((key) => key.indexOf("division") === -1);
        $('#ck_scrapeCount').text(keys.length === 0 ? "0" : keys.length);
        $('#ck_loadJobCountButton').hide();
    });
}

window.addEventListener("ck_exportJSON", exportJSON);
window.addEventListener("ck_importJSON", importJSON);
window.addEventListener("ck_clearData", clearData);
window.addEventListener("ck_loadJobCount", updateJobCount);

var textFile = null;

function exportJSON() {
    chrome.storage.local.get(function(results) {
        var text = JSON.stringify(results);
        
        var data = new Blob([text], {type: 'application/json'});
    
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
    
        // use textFile as href
        textFile = window.URL.createObjectURL(data);
    
        // click download
        // https://stackoverflow.com/a/21016088
        var link = document.createElement('a');
        link.href = textFile;
        link.download = "ww_data.json";
        link.target = "_blank";
        document.body.appendChild(link);
        window.requestAnimationFrame(function () {
            var event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
        });
    });
}

function importJSON() {
    const picker = $('#ck_importJSONpicker');
    picker.change(function(e) {
        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file);

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            const content = readerEvent.target.result; // this is the content!
            const contentObj = JSON.parse(content);
            chrome.storage.local.set(contentObj, () => {
                updateJobCount();
            });
        }
    });
    picker.trigger('click');
}

function clearData() {
    chrome.storage.local.clear(() => {
        updateJobCount();
    });
}
