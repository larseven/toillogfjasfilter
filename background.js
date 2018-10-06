console.log('running background!');

// Only purpose of background script is to update badger
chrome.extension.onMessage.addListener(function(message, sender) {
    chrome.browserAction.setBadgeBackgroundColor({
        color: 'lightblue',
        tabId: sender.tab.id
    });

    if(message.removed) {
        chrome.browserAction.setBadgeText({ text: message.removed.toString() });
    }
});