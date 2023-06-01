// create default fields
const defaultOptions = [
    {
        title: 'Meeting goals',
        description: '<b>Goal:</b>'
    },
    {
        title: '1:1',
        description: '<b>Areas to cover:</b><br><ul><li>Area 1</li><li>Area 2</li><li>Area 3</li></ul>'
    }
];

// create default options to storage
function createDefaultOptions() {
    chrome.storage.sync.set({ 'options': defaultOptions }, function () {
        console.log('Options saved: ' + defaultOptions);
    });
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        // This is a first install!
        createDefaultOptions();

    } else if (details.reason == "update") {
        // This is an update!
        // create defaults only if not set any
        chrome.storage.sync.get(['options'], function(result) {
            if (result.options.length == 0) {
                createDefaultOptions();
            }
        });
    }
});