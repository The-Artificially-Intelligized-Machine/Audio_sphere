import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Import Syntax Highlighter
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism"; // You can change the style as needed

// Custom CSS styles for the markdown rendering
const markdownStyles = `
  .markdown-body {
    padding: 16px; /* Add some padding */
    border-radius: 8px; /* Round the corners */
  }

  table {
    width: 100%;
    border-collapse: collapse; /* Remove gaps between table borders */
    margin: 16px 0; /* Add some margin */
    border: 1px solid #fff; /* Add border to the table */
    border-radius: 8px; /* Round the table corners */
    overflow: hidden; /* Ensure borders are rounded */
  }

  th, td {
    border: 1px solid #fff; /* Add border to table cells */
    padding: 8px; /* Add padding inside cells */
    text-align: left; /* Align text to the left */
  }

  th {
    font-weight: bold; /* Bold text for headers */
  }

  tr:nth-child(even) {
  }

  pre {
    background-color: #0B192C;
    // padding: 10px;
    // opacity:5%;
    padding: 12px; /* Add padding */
    border-radius: 8px; /* Round corners */
    overflow-x: auto; /* Enable horizontal scrolling */
  }

  code {
    // opacity:100%;
    font-family: 'Courier New', monospace; /* Use a monospace font for code */
  }
`;

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
        const response = await fetch("http://localhost:5000/endpoint", {
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
          <style>{markdownStyles}</style> {/* Inject custom styles */}
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
