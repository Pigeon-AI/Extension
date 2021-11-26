/*global chrome*/

import React from 'react'
import './App.css'
import logo from "./../../images/pidgey_text_50percent.png"
import { handleMessage } from '../../other/Popup/message-handling'
import {
  Grid,
  Button,
  Box
} from '@material-ui/core';
import SpeechRecognition from 'react-speech-recognition'
import { Dictaphone } from '../Other/Dictaphone'
import { azureIntentEndpoint } from '../../other/Common/constants';

export enum SelectorState {
  NoSelection,
  Upload,
  Infer,
  PageSource,
  Listening,
  Title
}

export interface MyState {
  responseString: string,
  selectorState: SelectorState,
  transcript: string | null
}

// const useStyles = () => ({
//     body: {
//         backgroundColor: 'orange',
//     },
//   });

export class App extends React.Component<any, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      responseString: "",
      selectorState: SelectorState.NoSelection,
      transcript: null,
    }
  }

  // Little helper to allow accessing the state of this
  // object from the message-handling.ts file
  // alternatively we could just move those functions to this file
  // and it would be a bit less confusing, but it would make this file kinda long
  handleMessageHelper = handleMessage(this)

  componentDidMount() {
    // Add message listener when component mounts
    chrome.runtime.onMessage.addListener(this.handleMessageHelper);
  }

  componentWillUnmount() {
   // Remove message listener when this component unmounts
   chrome.runtime.onMessage.removeListener(this.handleMessageHelper);
  }

  async startSelector(newState: SelectorState) {
    // only send the script if in a non-selection state
    if (newState == SelectorState.Infer ||
        newState == SelectorState.Upload) {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      console.log("Starting selector shenanigans")

      // execute the script that will call back
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['/static/js/selector.js'],
      });
    }
    else if (newState == SelectorState.PageSource) {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      console.log("Starting summarizer shenanigans")

      // execute the script that will call back
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['/static/js/pageSource.js'],
      });
    }
    else if (newState == SelectorState.Title) {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      console.log("Starting title shenanigans")

      // execute the script that will call back
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['/static/js/pageTitle.js'],
      });
    }

    this.setState({
      selectorState: newState
    })
  }

  async listenOnce() {
    await SpeechRecognition.startListening({ 
      continuous: false,
      language: 'en-US'
    });

    this.setState({
      selectorState: SelectorState.Listening
    })
  }

  async doneListening(spoken: string) {
    const encoded = encodeURIComponent(spoken);

    const uri = azureIntentEndpoint + encoded;

    const response = await fetch(uri);

    const json = await response.json();

    let responseString: string | null = null;

    // bad response
    if (Math.floor(response.status / 100) != 2)
    {
      responseString = "Error, bad response from intent endpoint.";
    }

    // the inference endpoint says the user said something we don't understand
    else if (json.prediction.topIntent == "None")
    {
      responseString = "Sorry, I don't know how to do that.";
    }

    // check for the two bad responses and respond appropriately
    if (responseString !== null)
    {
      this.setState({
        selectorState: SelectorState.NoSelection,
        responseString: responseString
      });

      // send success message to background to speak out loud
      chrome.runtime.sendMessage({
          title: "speak",
          data: responseString,
      });

      return;
    }

    let newState: SelectorState;

    switch (json.prediction.topIntent) {
      case "Summarize":
        responseString = "Getting a summary of the page...";
        newState = SelectorState.PageSource;
        break;

      case "Title":
        responseString = null;
        newState = SelectorState.Title;
        break;

      case "Infer":
        responseString = "Starting inference element selector...";
        newState = SelectorState.Infer;
        break;
    
      default:
        newState = SelectorState.NoSelection;
        console.error("Error got a bad classification")
        break;
    }


    if (responseString)
    {
      // respond appropriately for the two good responses
      this.setState({
        responseString: responseString
      });

      // send success message to background to speak out loud
      chrome.runtime.sendMessage({
          title: "speak",
          data: responseString,
      });
    }

    // now actually get the summary/intent started
    await this.startSelector(newState)

    // background thread will handle the reception of this
  }

  render() {
    const state = this.state;

    return (
      <Grid container spacing={5}>
          <Grid item xs={12}>
              <img src={logo} alt="Pidgey Logo" className="center" height={150} />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
              <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.listenOnce()}>Use microphone</Button>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>Request:</h3>
                <Dictaphone wasListening={state.selectorState == SelectorState.Listening} onListenEnd={(s: string) => this.doneListening(s)} />
                <h3>Response:</h3>
                <span>{state.responseString}</span>
              </div>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.startSelector(SelectorState.Upload)}>Upload Element</Button>
            </Box>
        	</Grid>
    	</Grid>
    );
  }
}

export default App;
