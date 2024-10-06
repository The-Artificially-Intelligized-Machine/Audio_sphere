import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const data = { email: email };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/9uz7u1s8g646n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        toast.success("Successfully subscribed!");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="dark"
        transition:Bounce
      />
      <form
        onSubmit={handleSubscribe}
        className="flex justify-center items-baseline pb-2 gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="mt-1 rounded-lg text-white bg-gray-500 opacity-30 p-2 border-none outline-none w-250"
        />
        <button
          type="submit"
          className="p-2 max-w-full text-sm text-center bg-sky-600 rounded-xl"
        >
          Waitlist
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
