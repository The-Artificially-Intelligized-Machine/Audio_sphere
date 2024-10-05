import React from 'react';
import SignInPage from './SignInPage';
import "./App.css"
import "./assets/bg_video.mp4"

// App component
const App = () => {
  return (
    <div className="relative h-screen">
      {/* Video Background */}
      <div className="video-background fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover brightness-50"
          // src="https://res.cloudinary.com/dh4ek4xgy/video/upload/f_auto:video,q_auto/zzgkzqhjpaygzgt35jlr"
          src="./assets/bg_video.mp4"
          playsInline
          autoPlay
          muted
          loop
        ></video>
      </div>

      {/* SignInPage component */}
      <div className="relative z-10">
        <SignInPage />
      </div>
    </div>
  );
}

export default App;
