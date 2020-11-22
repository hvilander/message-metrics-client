import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";


let gpsMessageCount = 0;
let canMessageCount = 0;
let unidentifiedMessageCount = 0;
let oldestTS = 0;
let newestTS = 0;
let deltaT = 0;

const inbound = (message) => {
  if (message && message.gps_id && message.latitude  && message.longitude && message.groundspeed && message.truecourse) {
    gpsMessageCount++;
  } else if (message && message.message_id && message.dlc && message.payload) {
    canMessageCount++;
  } else {
    unidentifiedMessageCount++;
  }

  if (message.ts) {
    const timestamp = new Date(message.ts).getTime();

    if (oldestTS === 0 || oldestTS > timestamp) {
        oldestTS = timestamp;
    }

    if (newestTS > 0 || newestTS < timestamp) {
      newestTS = timestamp;
    }

    deltaT = newestTS - oldestTS;
  }
}

/**
 * Takes a given duration in ms and returns a string formated to seconds.
 * @param ms duration in ms
 */
const formatRunTime = (ms) => {
  const seconds = ms / 1000;
  return `${seconds} seconds`;
}


function App() {
  const [response, setResponse] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, { transport: ['websocket'] });
    socket.on("FromAPI", data => {
      inbound(data);
      setResponse(data);
    });
  }, []);





  return (
    <div>
      <p>{`Total GPS messsages - ${gpsMessageCount}`}</p>
      <p>{`Total CAN messsages - ${canMessageCount}`}</p>
      <p>{`Total unidentified messsages - ${unidentifiedMessageCount}`}</p>
      <p>{`Total processed messages - ${gpsMessageCount + canMessageCount + unidentifiedMessageCount}`}</p>
      <p>{`runtime (from oldest timestamp to newest) - ${formatRunTime(deltaT)}`}</p>
      <p>{`oldestTS: ${oldestTS}`}</p>
      <p>{`newestTS: ${newestTS}`}</p>
    </div>
  );
}


export default App;
