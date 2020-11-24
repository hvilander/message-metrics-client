import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Metric from "./Metric";
import { isCANMessage, isGPSMessage } from "./util/MessageParsing";

const ENDPOINT = "http://127.0.0.1:4001";

/**
 * Takes a given duration in ms and returns a string formated to seconds.
 * @param ms duration in ms
 */
const formatRunTime = (ms) => {
  const seconds = ms / 1000;
  return `${seconds} seconds`;
}


const App = () => {
  const [response, setResponse] = useState(0);
  const [gpsCount, setGPSCount] = useState(0);
  const [canCount, setCANCount] = useState(0);
  const [unidentifiedCount, setUnidentifiedCount] = useState(0);
  const [oldestTS, setOldestTS] = useState(0);
  const [newestTS, setNewestTS] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, { transport: ['websocket'] });
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);

  useEffect(() => {
    if(response && isGPSMessage(response)) {
      setGPSCount(gpsCount + 1);
    }  else if (response && isCANMessage(response)) {
      setCANCount(canCount + 1);
    } else {
      setUnidentifiedCount(unidentifiedCount + 1);
    }

    if (response.ts) {
      const timestamp = new Date(response.ts).getTime();
  
      if (oldestTS === 0 || oldestTS > timestamp) {
          setOldestTS(timestamp);
      }
  
      if (newestTS > 0 || newestTS < timestamp) {
        setNewestTS(timestamp);
      }
    } 
  }, [response])

  return (
    <div>
      <Metric title="Total GPS Messages" value={gpsCount}></Metric>
      <Metric title="Total Can Messages" value={canCount}></Metric>
      <Metric title="Total Unidentified Messages" value={unidentifiedCount}></Metric>
      <Metric title="Total Messages" value={gpsCount + canCount + unidentifiedCount}></Metric>
      <Metric title="Time Range of Timestamps" value={formatRunTime(newestTS - oldestTS)}></Metric>
    </div>
  );
}


export default App;
