// This is a content script that gets injected into the website by App.tsx

console.log('Page source extractor injected into website.');
export {}

// send success message to take the screenshot
chrome.runtime.sendMessage({
    title: "pageTitle",
    data: {
        pageTitle: document.title
    }
});
