/*global chrome*/

console.log('Hello Background');
export { }

// chrome.tabs.query({ title: 'Example' }, (tabs) => {
//     if (!tabs.length) {
//         response({ error: "Need a tab open" });
//     } else {
//         var tab = tabs[0];

//         var pending_id = chrome.desktopCapture.chooseDesktopMedia(['screen'], tab, function (stream) {

//             if (chrome.runtime.lastError) {
//                 console.log(chrome.runtime.lastError);
//                 response({ error: chrome.runtime.lastError });
//             } else if (!stream) {
//                 console.log('unkown error. no stream id');
//                 response({ error: 'No stream id' });
//             } else {
//                 navigator.webkitGetUserMedia({
//                     audio: false, video: {
//                         mandatory: {
//                             chromeMediaSource: "tab",
//                             chromeMediaSourceId: stream,
//                             maxWidth: window.screen.width,
//                             maxHeight: window.screen.height
//                         }
//                     }
//                 }, (stream) => {
//                     var src = URL.createObjectURL(stream);
//                     response({ error: false, src: src });
//                 }, (error) => {
//                     console.log(error, chrome.runtime.lastError);
//                     response({ error: 'Could not get screen shot' });
//                 });
//             }
//         });
//     }
// });

chrome.runtime.onInstalled.addListener(async (details: any) => {
    const newTab = await chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html"),
        active: true
    });
});
