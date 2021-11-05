// functions to handle messages for popup.js

import { App, SelectorState } from "../../views/Popup/App";
import { uploadControllerUri, inferenceControllerUri } from "../Common/constants";

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
                    console.log("popup.js received message \'upload\'")
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

    // essentially sleep(500)
    // needed so that the highlights have cleared by the time the screenshot
    // is taken
    await new Promise(r => setTimeout(r, 500));

    const imageUri: string = await chrome.tabs.captureVisibleTab();

    console.log("Took a screenshot");

    // add onto the data
    data["imageUri"] = imageUri;

    if(app.state.selectorState == SelectorState.NoSelection) {
        throw "Got selection in bad state"
    }

    const uri = app.state.selectorState == SelectorState.Upload ? uploadControllerUri : inferenceControllerUri;

    // upload the image to the api
    const response: Response = await fetch(uri, {
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