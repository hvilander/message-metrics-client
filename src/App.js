import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    console.log('is this on');
    const socket = socketIOClient(ENDPOINT, { transport: ['websocket'] });
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  /**
   * Takes in a Date object and formats to 24 hour time
   *
   */
  const formatTime = (date) => {
    const a = new Date(date)
    const hours = a.getHours();
    const mins = a.getMinutes();
    return `${hours}:${mins}`
  }

  return (
    <p>
      It is <time dateTime={formatTime(response)}>{formatTime(response)}</time>
    </p>
  );
}


export default App;
