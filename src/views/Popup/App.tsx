/*global chrome*/

import React from 'react'
import Image from 'react-bootstrap/Image'
import './App.css'
import logo from "./../../images/pidgey_text_50percent.png"
import { handleMessage } from '../../other/Popup/message-handling'
import {
  Grid,
  Button,
  Box
} from '@material-ui/core';
import { 
	withStyles } from '@material-ui/core/styles';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export enum SelectorState {
  NoSelection,
  Upload,
  Infer
}

export interface MyState {
  responseString: string,
  selectorState: SelectorState
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
      selectorState: SelectorState.NoSelection
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
    if (this.state.selectorState == SelectorState.NoSelection) {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);

      console.log("Starting selector shenanigans")

      // execute the script that will call back
      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ['/static/js/selector.js'],
      });
    }

    this.setState({
      selectorState: newState
    })
  }

  render() {
    const ImageSuch = (props: { imageSrc: string | null }) => {
      if (props.imageSrc) {
        return <Image src={props.imageSrc} fluid></Image>
      } else {
        return (null)
      }
    }

  const state = this.state;
	const classes = this.props;

    return (
		

      <Grid container spacing={5}>
          <Grid item xs={12}>
              <img src={logo} alt="Pidgey Logo" className="center" height={150} />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState == SelectorState.Upload} onClick={() => this.startSelector(SelectorState.Upload)}>Upload Element</Button>
            </Box>
        	</Grid>
          <Grid item xs={12}>
            <Box textAlign='center'>
                <Button variant="contained" disabled={this.state.selectorState == SelectorState.Infer} onClick={() => this.startSelector(SelectorState.Infer)}>Infer Element</Button>
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
