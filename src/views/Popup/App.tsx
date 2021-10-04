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

  async startSelector() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    console.log("Starting selector shenanigans")

    // handle messages received
    chrome.runtime.onMessage.addListener(
      (message: { title: string, data: any }, sender, sendResponse: (arg0: any) => void) => {
      new Promise(async (send) => {

        console.log("popup.js received message.")

        const takeImage = chrome.tabs.captureVisibleTab();

        console.log("Title: " + message.title);
        console.log("Data: " + message.data);

        // take screenshot
        const imageUri = await takeImage;

        this.state = {
          imageSrc: imageUri
        }

        send({
          data: "Success!"
        });
      })
      .then(sendResponse)
      .catch(err => {
        console.error(err);
      })

      return true;
    });

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
