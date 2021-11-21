/*global chrome*/

import { handleMessage } from "./other/Background/message-handling";

console.log('Hello Background');
export { }

// runs in the background

// Add a listener to make the welcome page that gets our mic permissions
chrome.runtime.onInstalled.addListener(async (details: any) => {
    const newTab = await chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html"),
        active: true
    });
});

// listen for messages
chrome.runtime.onMessage.addListener(handleMessage);
