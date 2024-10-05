import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import gifImage from "../assets/AI-ball-Idea-unscreen.gif";
import ChatbotResponse from "./ChatbotResponse";
import "../App.css";

const Speech = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [editableTranscript, setEditableTranscript] = useState("");

  useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    let timer;
    if (listening) {
      timer = setTimeout(() => {
        SpeechRecognition.stopListening();
        addTranscript(editableTranscript);
      }, 5000); // Auto-stop and send after 5 seconds of silence
    }
    return () => clearTimeout(timer);
  }, [listening, editableTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  const handleClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      addTranscript(editableTranscript);
    } else {
      resetTranscript();
      setEditableTranscript("");
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const addTranscript = (text) => {
    if (text.trim()) {
      const response = <ChatbotResponse input={text} />;
      setTranscriptHistory((prevHistory) => [
        ...prevHistory,
        { spoken: text, response },
      ]);
      setEditableTranscript(""); // Clear the editable transcript
      resetTranscript();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-8 gap-4 text-white">
      <button
        onClick={() => {
          handleClick();
          if (!listening) {
            addTranscript(editableTranscript);
          }
        }}
        className={`flex items-center justify-center transition-all duration-300 transform ${
          listening ? "scale-125" : "scale-100"
        }`}
      >
        <img
          loading="lazy"
          src={gifImage}
          alt="Azmth logo"
          className="object-contain mt-5 max-w-full aspect-[1.02] w-[158px]"
        />
      </button>

      <div className="flex items-center w-full max-w-2xl">
        <input
          className="mt-1 rounded-lg text-white bg-gray-700 p-2 border-none outline-none flex-grow"
          value={editableTranscript}
          onChange={(e) => setEditableTranscript(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTranscript(editableTranscript);
            }
          }}
          placeholder="Edit your speech input here..."
        />
      </div>

      <div className="w-full max-w-2xl h-[500px] overflow-y-auto scrollbar-hide">
        {transcriptHistory.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="px-4 py-2 bg-blue-600 rounded-lg text-right">
              {item.spoken}
            </p>
            <div className="px-4 py-2 mt-2 bg-gray-700 rounded-lg text-left">
              {item.response}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Speech;
