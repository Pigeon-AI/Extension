import React from 'react'
import { useSpeechRecognition } from 'react-speech-recognition'

const transcribing = true;
const clearTranscriptOnListen = true;

export const Dictaphone = (props: {wasListening: boolean, onListenEnd: (spoken: string) => void}) => {
  const {
    transcript,
    listening,
  } = useSpeechRecognition({ transcribing, clearTranscriptOnListen });

  // call callback function
  if (props.wasListening && !listening)
  {
    // slight delay so it's not too fast
    setTimeout(() => props.onListenEnd(transcript), 50);
  }

  return (
    <span>{transcript}</span>
  )
}
