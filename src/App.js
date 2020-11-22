import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Metric from "./Metric";
import { isCANMessage, isGPSMessage } from "./util/MessageParsing";

const ENDPOINT = "http://127.0.0.1:4001";


let gpsMessageCount = 0;
let canMessageCount = 0;
let unidentifiedMessageCount = 0;
let oldestTS = 0;
let newestTS = 0;
let deltaT = 0;

const inbound = (message) => {
  if (message && isGPSMessage(message)) {
    gpsMessageCount++;
  } else if (message && isCANMessage(message)) {
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
  const [thing, setThing] = useState('0');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, { transport: ['websocket'] });
    socket.on("FromAPI", data => {
      inbound(data);
      setResponse(data);
    });
  }, []);

  return (
    <div>
      <Metric title="Total GPS Messages" value={gpsMessageCount}></Metric>
      <Metric title="Total Can Messages" value={canMessageCount}></Metric>
      <Metric title="Total Unidentified Messages" value={unidentifiedMessageCount}></Metric>
      <Metric title="Total Messages" value={gpsMessageCount + canMessageCount + unidentifiedMessageCount}></Metric>
      <Metric title="Time Range of Timestamps" value={formatRunTime(deltaT)}></Metric>
    </div>
  );
}


export default App;
