/*global chrome*/

import React from 'react'
import './App.css'

interface MyState {
  record: boolean
  stream: MediaStream | null
}

export class App extends React.Component<any, MyState> {

  constructor(props: any) {
    super(props);
    this.state = {
      record: false,
      stream: null
    }
  }

  startRecording = async () => {

    const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    const queryOptions = { active: true, currentWindow: true };
    const [currentTab] = await chrome.tabs.query(queryOptions);

    const imageUri = await chrome.tabs.captureVisibleTab();
    console.log(imageUri);

    this.setState({ record: true, stream: media });
  }

  stopRecording = () => {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    this.setState({ record: false });
  }

  onData(recordedBlob: any) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob: any) {
    console.log('recordedBlob is: ', recordedBlob);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Popup page</p>
          <button onClick={this.startRecording} disabled={this.state.record} type="button">Start</button>
          <button onClick={this.stopRecording} disabled={!this.state.record} type="button">Stop</button>
        </header>
      </div>
    );
  }
}

export default App
