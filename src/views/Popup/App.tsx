/*global chrome*/

import React from 'react'
import Image from 'react-bootstrap/Image'
import './App.css'
import { handleMessage } from './message-handling'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface MyState {
}

export class App extends React.Component<any, MyState> {

  constructor(props: any) {
    super(props);
    this.state = {
    }

  }


  componentDidMount() {
    // Add message listener when component mounts
    chrome.runtime.onMessage.addListener(handleMessage);
  }

  componentWillUnmount() {
   // Remove message listener when this component unmounts
   chrome.runtime.onMessage.removeListener(handleMessage);
  }

  async startSelector() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    console.log("Starting selector shenanigans")

    // execute the script that will call back
    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ['/static/js/selector.js'],
    });
  }

  render() {
    const ImageSuch = (props: { imageSrc: string | null }) => {
      if (props.imageSrc) {
        return <Image src={props.imageSrc} fluid></Image>
      } else {
        return (null)
      }
    }

    return (
      <Container>
        <Row>
          <Col>
            <p>Popup page</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <button onClick={this.startSelector} type="button">Select Element</button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App
