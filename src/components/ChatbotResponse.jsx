import { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Import Syntax Highlighter
// import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism"; // You can change the style as needed


const ChatbotResponse = ({ input }) => {
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const timeoutDuration = 5000; // Timeout duration in milliseconds (5 seconds, adjustable)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      const controller = new AbortController(); // To control fetch timeout
      const timeout = setTimeout(() => {
        controller.abort(); // Aborts the fetch request after the specified timeout
        setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
        setLoading(false); // Stop loading
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
        setResponseData(JSON.parse(data.response)); // Set the response data
      } catch (error) {
        if (error.name === "AbortError") {
          setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
        } else {
          setErrorMessage("Error fetching data.");
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (input) {
      // Only fetch if input is provided
      fetchData();
    }
  }, [input, timeoutDuration]); // Add input as a dependency

  return (
    <div className="markdown-body rounded-lg overflow-auto">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : errorMessage ? (
        <p className="text-white font-semibold">{errorMessage}</p>
      ) : (
        responseData && (
          <div>
            {responseData.TASK.length > 0 && (
              <div>
                <h3 className='font-semibold'>Tasks</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.TASK.map((task, index) => (
                      <tr key={index}>
                        <td>{task.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {responseData.REMINDER.length > 0 && (
              <div>
                <h3 className='font-semibold'>Reminders</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.REMINDER.map((reminder, index) => (
                      <tr key={index}>
                        <td>{reminder.time}</td>
                        <td>{reminder.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {responseData.NOTE.length > 0 && (
              <div>
                <h3 className='font-semibold'>Notes</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.NOTE.map((note, index) => (
                      <tr key={index}>
                        <td>{note.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ChatbotResponse;