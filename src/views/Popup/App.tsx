import React from 'react'
import './App.css'

interface MyState {
  record: boolean
}

export class App extends React.Component<any, MyState> {

  constructor(props: any) {
    super(props);
    this.state = {
      record: false
    }
  } 

  startRecording = () => {
    this.setState({ record: true });
  }
 
  stopRecording = () => {
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
