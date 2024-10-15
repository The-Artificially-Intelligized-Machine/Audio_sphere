import { useState, useEffect } from "react";

const ChatbotResponse = ({ input }) => {
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutDuration = 5000;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
        setLoading(false);
      }, timeoutDuration);

      try {
        const response = await fetch(
          "https://server-in-railway-production.up.railway.app/endpoint",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        console.log("Data", data.response);
        setResponseData(JSON.parse(data.response));
      } catch (error) {
        if (error.name === "AbortError") {
          setErrorMessage("Hi, I am Azmath. I am unfortunately unavailable.");
        } else {
          console.error("Error:", error);
          setErrorMessage("Error fetching data.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (input) {
      fetchData();
    }
  }, [input, timeoutDuration]);

  console.log("Response Data", JSON.stringify(responseData));

  return (
    <div className="markdown-body rounded-lg overflow-auto text-white">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : errorMessage ? (
        <p className="font-semibold">{errorMessage}</p>
      ) : responseData ? (
        <div>
          {responseData.TASK && responseData.TASK.length > 0 && (
            <pre className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Tasks</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(responseData.TASK[0]).map((key) => (
                      <th key={key} className="border border-gray-300 p-2">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responseData.TASK.map((task, index) => (
                    <tr key={index}>
                      {Object.values(task).map((value, idx) => (
                        <td key={idx} className="border border-gray-300 p-2">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </pre>
          )}
          {responseData.REMINDER && responseData.REMINDER.length > 0 && (
            <pre className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Reminders</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Time</th>
                    <th className="border border-gray-300 p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.REMINDER.map((reminder, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{reminder.time}</td>
                      <td className="border border-gray-300 p-2">{reminder.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </pre>
          )}
          {responseData.NOTE && responseData.NOTE.length > 0 && (
            <pre className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Notes</h3>
              <ol className="list-decimal list-inside">
                {responseData.NOTE.map((note, index) => (
                  <li key={index} className="mb-2">{note.description}</li>
                ))}
              </ol>
            </pre>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ChatbotResponse;