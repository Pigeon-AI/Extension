/*global chrome*/

console.log('Hello Background');
export { }

chrome.runtime.onInstalled.addListener(async (details: any) => {
    const newTab = await chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html"),
        active: true
    });
});
