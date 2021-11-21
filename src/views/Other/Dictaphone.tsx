import React from 'react'
import { useSpeechRecognition } from 'react-speech-recognition'

const transcribing = true;
const clearTranscriptOnListen = true;

export const Dictaphone = (props: {wasListening: boolean, onListenEnd: () => void}) => {
  const {
    transcript,
    listening,
  } = useSpeechRecognition({ transcribing, clearTranscriptOnListen });

  // call callback function
  if (props.wasListening && !listening)
  {
    // slight delay so it's not too fast
    setTimeout(() => props.onListenEnd(), 50);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>listening: {listening ? 'on' : 'off'}</span>
      <span>{transcript}</span>
    </div>
  )
}
