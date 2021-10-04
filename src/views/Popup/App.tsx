/*global chrome*/

import React from 'react'
import Image from 'react-bootstrap/Image'
import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface MyState {
  imageSrc: string | null
}

export class App extends React.Component<any, MyState> {

  constructor(props: any) {
    super(props);
    this.state = {
      imageSrc: null
    }

  }


  componentDidMount() {
    // Add message listener when component mounts
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  componentWillUnmount() {
   // Remove message listener when this component unmounts
   chrome.runtime.onMessage.removeListener(this.handleMessage);
  }

  handleScreenshot = async (x: number, y: number) => {
    const imageUri: string = await chrome.tabs.captureVisibleTab();

    console.log(imageUri);

    this.setState({
      imageSrc: imageUri
    });
  }

  handleMessage = async (
    // the actual message received
    message: { title: string, data: any },

    // the sender of the message
    sender: chrome.runtime.MessageSender,

    // function handle to send response back to sender
    sendResponse: (arg0: any) => void) => {

      console.log(this);

    switch (message.title) {
      case "screenshot":
        console.log("popup.js received message \'screenshot\'")
        await this.handleScreenshot(message.data.x, message.data.y)
        sendResponse("Success!");
        break;
    
      default:
        console.log("popup.js received message \'" + message.title + "\', doing nothing")
        break;
    }
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
        <Row>
          <Col>
            <ImageSuch imageSrc={this.state.imageSrc}></ImageSuch>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App
