import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Speech from "./components/Speech";
import "./App.css"

const SignInPage = () => {
  return (
    <main className="flex flex-col h-screen text-white bg-transparent">
      {/* Header section */}
      <Header className="fixed top-0 left-0 w-full z-10" />
      
      {/* Speech component (Scrollable area) */}
      <div className="flex-grow pt-1 pb-1 overflow-hidden">
        <Speech />
      </div>
      
      {/* Footer section */}
      <Footer className="fixed bottom-0 left-0 w-full z-10" />
    </main>
  );
};

export default SignInPage;