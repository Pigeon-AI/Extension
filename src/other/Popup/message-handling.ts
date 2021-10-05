// functions to handle messages for popup.js

import App from "../../views/Popup/App";
import { imageControllerUri } from "../Common/constants";

// functor to generate a function when passed an App
export const handleMessage = (app: App) => {
    return async (
        // the actual message received
        message: { title: string, data: any },

        // the sender of the message
        sender: chrome.runtime.MessageSender,

        // function handle to send response back to sender
        sendResponse: (arg0: any) => void) => {

            switch (message.title) {
                case "screenshot":
                    console.log("popup.js received message \'screenshot\'")
                    await handleScreenshot(message.data, app)
                    sendResponse("Success!");
                    break;

                default:
                    console.log("popup.js received message \'" + message.title + "\', doing nothing")
                    break;
        }
    }
}

const handleScreenshot = async (data: any, app: App) => {
    const imageUri: string = await chrome.tabs.captureVisibleTab();

    console.log("Took a screenshot");

    // add onto the data
    data["imageUri"] = imageUri;

    // upload the image to the api
    const response: Response = await fetch(imageControllerUri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const bodyText = await response.text();

    console.log("Received successful response:\n" + bodyText)

    app.setState({
        responseString: bodyText
    });
}