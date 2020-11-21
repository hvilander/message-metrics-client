import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";


let gpsMessageCount = 0;
let canMessageCount = 0;
let unidentifiedMessageCount = 0;
let oldestTS = 0;
let newestTS = 0;
let deltaT = 0;

let limitedPackets = 0;

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


    //oldestTS = oldestTS < timestamp ? timestamp : oldestTS;
    //newestTS = newestTS && newestTS > timestamp ? newestTS : timestamp;
    deltaT = newestTS - oldestTS;
  }

  if (limitedPackets < 0) {
    limitedPackets++;
    //console.log(message);



    const aTS = message.ts;
    console.log(new Date(aTS).getTime());
  }


}

function App() {
  const [response, setResponse] = useState("");

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
      <p>{`runtime (from oldest timestamp to newest) - ${deltaT}`}</p>
      <p>{`oldestTS: ${oldestTS}`}</p>
      <p>{`newestTS: ${newestTS}`}</p>
    </div>
  );
}


export default App;
