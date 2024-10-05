import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import gifImage from "./assets/AI-ball-Idea-unscreen.gif"; // Ensure this path is correct
import ChatbotResponse from "./ChatbotResponse"; // Import your ChatbotResponse component
import "./App.css";

const Speech = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const [transcriptHistory, setTranscriptHistory] = useState([]); // Array to hold stacked transcripts
  const [editableTranscript, setEditableTranscript] = useState(""); // State for editable transcript

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  const handleClick = () => {
    if (listening) {
      SpeechRecognition.stopListening(); // Stop listening
      setEditableTranscript(transcript); // Set editable transcript to current transcript
    } else {
      SpeechRecognition.startListening({ continuous: true }); // Start continuous listening
    }
  };

  // Function to add the current transcript and its response to the history
  const addTranscript = () => {
    if (editableTranscript) {
      const response = <ChatbotResponse input={editableTranscript} />; // Get response from ChatbotResponse
      setTranscriptHistory((prevHistory) => [
        ...prevHistory,
        { spoken: editableTranscript, response },
      ]);
      setEditableTranscript(""); // Clear the editable transcript after adding it to history
      resetTranscript(); // Reset transcript after adding it to history
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-8 gap-4 text-red sticky top-0">
      {/* Button as image to start/stop listening */}
      <button
        onClick={handleClick}
        className={`flex items-center justify-center transition-all duration-300 transform ${
          listening ? "scale-125" : "scale-100"
        }`}
      >
        <img
          loading="lazy"
          src={gifImage} // Use the imported GIF here
          alt="Azmth logo"
          className="object-contain mt-5 max-w-full aspect-[1.02] w-[158px]"
        />
      </button>

      {/* Editable input for speech transcript */}
      <div>
        <input
          className="mt-1 rounded-lg text-white bg-gray-500 opacity-30 p-2 border-none outline-none w-80 mr-1"
          value={editableTranscript} // Controlled input
          onChange={(e) => setEditableTranscript(e.target.value)} // Update state on change
          placeholder="Edit your speech input here..."
        />

        {/* Button to submit the edited input */}
        <button
          onClick={addTranscript}
          className="mt-2 px-4 py-2 bg-blue-600 rounded-lg"
        >
          Send
        </button>
      </div>

      {/* Display stacked transcripts and responses */}
      <div className="w-full max-w-2xl h-[300px] overflow-y-auto scrollbar-hide">
        {" "}
        {/* Hide scrollbar */}
        {transcriptHistory.map((item, index) => (
          <div key={index}>
            <p className="px-2 py-1 rounded-lg shadow-inner text-right">
              {item.spoken}
            </p>
            <div className="px-2 py-1 mt-1 rounded-lg shadow-inner backdrop-blur-md text-left">
              {item.response} {/* Render the response component */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Speech;
