// functions to handle messages for popup.js

import { imageControllerUri } from "../Common/constants";

export const handleMessage = async (
    // the actual message received
    message: { title: string, data: any },

    // the sender of the message
    sender: chrome.runtime.MessageSender,

    // function handle to send response back to sender
    sendResponse: (arg0: any) => void) => {

        switch (message.title) {
            case "screenshot":
                console.log("popup.js received message \'screenshot\'")
                await handleScreenshot(message.data.x, message.data.y)
                sendResponse("Success!");
                break;

            default:
                console.log("popup.js received message \'" + message.title + "\', doing nothing")
                break;
    }
}

const handleScreenshot = async (x: number, y: number) => {
    const imageUri: string = await chrome.tabs.captureVisibleTab();

    console.log(imageUri);

    const requestData = {
        x: x,
        y: y,
        imageUri: imageUri
    };

    // upload the image to the api
    const response: Response = await fetch(imageControllerUri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const bodyText = await response.text();

    console.log("Received successful response:\n" + bodyText)
}