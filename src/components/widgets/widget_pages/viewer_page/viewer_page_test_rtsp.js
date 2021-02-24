import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  reconnectingSocket,
  useMessages,
  reconnectingWebRTCSocket,
} from "../../../../methods/utils/websocket_utils";

import * as styled from "./viewer_page.style";

// Import components
import ButtonGroup from "../../../basic/button_group/button_group";
import BounceButton from "../../../basic/bounce_button/bounce_button";

import StreamContainer from "./stream_container/stream_container";
import StreamInfo from "./stream_info/stream_info";
import log from "../../../../logger";

const logger = log.getLogger("ViewerPage");

logger.setLevel("silent");

// some hard coded values for now
// Set this to use a specific peer id instead of a random one
var our_default_id;
var our_id;
var peer_id = 5555;
var ws_server = "10.1.10.6";
var ws_port;

const CONNECTION_MAX_ATTEMPTS = 1000;

var rtc_configuration = {
  iceServers: [
    {
      urls: "stun:stun.services.mozilla.com",
    },
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

var connect_attempts = 0;
var peer_connection;
var send_channel;

const getOurId = () => {
  return Math.floor(Math.random() * (9000 - 10) + 10).toString();
};

// Fetch the peer id to use
our_id = our_default_id || getOurId();

ws_port = ws_port || "8443";

const ws_url = "ws://" + ws_server + ":" + ws_port;

var client;

const ViewerPage = () => {
  const locaitons = useSelector((state) => state.locationsReducer.locations);
  const devices = useSelector((state) => state.devicesReducer.devices);

  const [streamConnected, setStreamConnected] = useState(false);

  const [myPeerId, setMyPeerId] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [streams, setStreams] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(true);

  useEffect(() => {
    client = reconnectingWebRTCSocket(ws_url, getOurId(), peer_id);
    client.addRemoteTrackListener(setStreams);
    client.onStateChange(setIsConnected);
    client.addErrorListener(setError);
    client.addStatusListener(setStatus);

    return () => {
      // Disconnect Stream on unmount
      client.close();
    };
  }, []);

  logger.log("streans", streams);

  logger.log("isConnected", isConnected);

  const params = useParams();

  // Set the station and device if there is a associated device
  const station = locaitons[params.stationID];
  let device = {};
  if (station.device_id) device = devices[station.device_id];

  const getVideoElement = () => {
    return document.getElementById("stream");
  };

  const resetVideo = () => {
    // Reset the video element and stop showing the last received frame
    var videoElement = getVideoElement();
    if (videoElement) {
      videoElement.pause();
      videoElement.src = "";
      videoElement.load();
    }
  };

  return (
    <styled.PageContainer>
      <styled.TitleContainer>
        <styled.DeviceName>
          {device ? `${device.device_name}` : "Connect to Stream"}
        </styled.DeviceName>
        <styled.LiveText>Live Stream</styled.LiveText>
      </styled.TitleContainer>

      <button onClick={() => resetVideo()}>CLICK TO RESET</button>

      <button onClick={() => setShowStreamInfo(!showStreamInfo)}>
        Show Info
      </button>

      {showStreamInfo && (
        <StreamInfo
          status={status}
          error={error}
          outID={our_id}
          peerID={peer_id}
          loading={!streamConnected}
          streams={streams}
        />
      )}

      <StreamContainer
        status={status}
        error={error}
        myPeerId={myPeerId}
        loading={!streamConnected}
        streams={streams}
      />
      <styled.ConnectContainer></styled.ConnectContainer>
    </styled.PageContainer>
  );
};

export default ViewerPage;
