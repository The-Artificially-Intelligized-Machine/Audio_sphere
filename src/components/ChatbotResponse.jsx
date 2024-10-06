import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Import Syntax Highlighter
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism"; // You can change the style as needed

const ChatbotResponse = ({ input }) => {
  const [markdown, setMarkdown] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const timeoutDuration = 5000; // Timeout duration in milliseconds (5 seconds, adjustable)

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController(); // To control fetch timeout
      const timeout = setTimeout(() => {
        controller.abort(); // Aborts the fetch request after the specified timeout
        setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
      }, timeoutDuration);

      try {
        const response = await fetch("http://127.0.0.1:5000/endpoint", {
          // Flask server running on port 5000
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }), // Send input in the request body
          signal: controller.signal,
        });

        clearTimeout(timeout); // Clear the timeout if the fetch is successful

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setMarkdown(data.content || ""); // Display content if available, otherwise empty
      } catch (error) {
        if (error.name === "AbortError") {
          setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
        } else {
          setErrorMessage("Error fetching data.");
        }
      }
    };

    if (input) {
      // Only fetch if input is provided
      fetchData();
    }
  }, [input, timeoutDuration]); // Add input as a dependency

  return (
    <div className="markdown-body rounded-lg overflow-auto">
      {errorMessage ? (
        <p className="text-white font-semibold">{errorMessage}</p>
      ) : (
        <>
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={materialLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
          />
        </>
      )}
    </div>
  );
};

export default ChatbotResponse;
