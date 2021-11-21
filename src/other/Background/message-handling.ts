// functions to handle messages for background.js

import { uploadControllerUri, inferenceControllerUri, summaryControllerUri } from "../Common/constants";

// functor to generate a function when passed an App
export const handleMessage = async (
        // the actual message received
        message: { title: string, data: any },

        // the sender of the message
        sender: chrome.runtime.MessageSender,

        // function handle to send response back to sender
        sendResponse: (arg0: any) => void) => {

        switch (message.title) {
            case "speak":
                console.log("background.js received message \'speak\'");
                chrome.tts.speak(message.data);
                break;

            default:
                console.log("background.js received message \'" + message.title + "\', doing nothing")
                break;
    };
}
