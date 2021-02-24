import React, { useState, useEffect } from "react";
import * as styled from "./viewer_page.style";
import StreamContainer from "./stream_container/stream_container";
import StreamInfo from "./stream_info/stream_info";
import log from "loglevel";
import reconnectingWebRTCSocket from "../../../../methods/utils/websocket_utils";
import TestButtons from "./test_buttons/test_buttons";
const logger = log.getLogger("ViewerPage");

logger.setLevel("silent");

// some hard coded values for now
// Set this to use a specific peer id instead of a random one
var our_default_id;
var our_id;
var peer_id = 5555;
var ws_server = "10.1.10.6";
var ws_port;

const getOurId = () => {
  return Math.floor(Math.random() * (9000 - 10) + 10).toString();
};

// Fetch the peer id to use
our_id = our_default_id || getOurId();

ws_port = ws_port || "8443";

const ws_url = "ws://" + ws_server + ":" + ws_port;

var client;

const ViewerPage = () => {
  const [streamConnected, setStreamConnected] = useState(false);
  const [myPeerId, setMyPeerId] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [streams, setStreams] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(false);
  const [showTestButtons, setShowTestButtons] = useState(false);

  useEffect(() => {
    startConnection();

    return () => {
      // Disconnect Stream on unmount
      closeConnection();
    };
  }, []);

  const startConnection = () => {
    client = reconnectingWebRTCSocket(ws_url, getOurId(), peer_id);
    client.addRemoteTrackListener(setStreams);
    client.onStateChange(setIsConnected);
    client.addErrorListener(setError);
    client.addStatusListener(setStatus);
  };

  const closeConnection = () => {
    client.close();
    setStreams(null);
  };

  const device = {
    device_name: "RM Vision",
  };

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
        <div
          style={{
            position: "absolute",
            left: "1rem",
          }}
        >
          <styled.Icon
            className="fa fa-retweet"
            onClick={() => {
              resetVideo();
            }}
          />

          <styled.Icon
            className="fa fa-info-circle"
            onClick={() => setShowStreamInfo(!showStreamInfo)}
          />

          <styled.Icon
            className="fa fa-check-circle"
            onClick={() => setShowTestButtons(!showTestButtons)}
          />
        </div>

        <styled.DeviceName>
          {device ? `${device.device_name}` : "Connect to Stream"}
        </styled.DeviceName>

        <styled.LiveText>Live Stream</styled.LiveText>
      </styled.TitleContainer>

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

      {showTestButtons && (
        <TestButtons
          onStartClick={startConnection}
          onCloseClick={closeConnection}
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
