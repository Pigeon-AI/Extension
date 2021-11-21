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

export enum SelectorState {
  NoSelection,
  Upload,
  Infer,
  PageSource,
  Listening
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

    this.setState({
      selectorState: newState
    })
  }

  async listenOnce() {
    const speechRecognition = await SpeechRecognition.startListening({ 
      continuous: false,
      language: 'en-US'
    });

    this.setState({
      selectorState: SelectorState.Listening
    })
  }

  async doneListening() {
    console.log("done listening")

    this.setState({
      selectorState: SelectorState.NoSelection
    })

    return;
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
              <Dictaphone wasListening={state.selectorState == SelectorState.Listening} onListenEnd={() => this.doneListening()} />
              <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.listenOnce()}>Use microphone</Button>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.startSelector(SelectorState.Upload)}>Upload Element</Button>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.startSelector(SelectorState.Infer)}>Infer Element</Button>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState != SelectorState.NoSelection} onClick={() => this.startSelector(SelectorState.PageSource)}>Summarize Page</Button>
            </Box>
        	</Grid>
        	<Grid item xs={12}>
          		{state.responseString}
        	</Grid>
          {/* <ImageSuch></ImageSuch> */}
    	</Grid>
    );
  }
}

export default App;
