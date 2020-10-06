import React, { useState, useEffect } from 'react';
// import './App.css';
import * as styled from './stream_container.style'

// const StreamContainer = () => {

//     // Should put a ping here every second to tell the stream that we a still watching and cancel if we are not anymore
//     const jsmpeg = require('jsmpeg')

//     const url = 'rtsp://10.1.10.11:8554/ds-test'

//     const canvas = document.getElementById('video-canvas')

//     const player = new jsmpeg(url, { canvas: canvas, autoplay: true, loop: true })

//     // const client = new WebSocket('rtsp://10.1.10.11:8554/ds-test')
//     // const player = new jsmpeg(client, { canvas: document.getElementById('canvas') })

//     player.play();

//     return (
//         <styled.VideoContainer>
//             <p>Stream Container</p>
//             {/* <video
//                 controls
//                 // autoPlay
//                 src={{ uri: 'rtsp://10.1.10.11:8554/ds-test' }}
//                 type="video/mp4; codecs=hevc"

//             >
//             </video> */}
//             <canvas id='video-canvas'></canvas>
//         </styled.VideoContainer>

//     )
// }

// export default StreamContainer



// Set this to use a specific peer id instead of a random one
var default_peer_id = 8887;
var ws_server = "10.1.10.11";
var ws_port;

var rtc_configuration = {
  iceServers: [
    {
      urls: "stun:stun.services.mozilla.com"
    },
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

var connect_attempts = 0;
var peer_connection;
var send_channel;
var ws_conn;

const StreamContainer = () => {

  // const [connected, setConnected] = useState(false);
  const [myPeerId, setMyPeerId] = useState("None");
  const [error, setError] = useState("None");
  const [status, setStatus] = useState("None");

  useEffect(() => {
    // code to run on component mount

  }, [])

  const handleButtonClick = () => {
      // connect and save peer id returned from websocketServerConnect
      setMyPeerId(websocketServerConnect())
  }

  const resetState = () => {
      // This will call onServerClose()
      ws_conn.close();
  }

  const handleIncomingError = (error) => {
      setError("ERROR: " + error);
      resetState();
  }

  const getVideoElement = () => {
      return document.getElementById("stream");
  }

  const resetVideo = () => {
      // Reset the video element and stop showing the last received frame
      var videoElement = getVideoElement();
      videoElement.pause();
      videoElement.src = "";
      videoElement.load();
  }

  // SDP offer received from peer, set remote description and create an answer
  const onIncomingSDP = (sdp) => {
      peer_connection.setRemoteDescription(sdp).then(() => {
          setStatus("Remote SDP set");
          if (sdp.type !== "offer")
              return;
          setStatus("Got SDP offer");
          peer_connection.createAnswer()
          .then(onLocalDescription).catch(setError);
      }).catch(setError);
  }

  // Local description was set, send it to peer
  const onLocalDescription = (desc) => {
      console.log("Got local description: " + JSON.stringify(desc));
     
      peer_connection.setLocalDescription(desc).then(function() {
          setStatus("Sending SDP " + desc.type);
          let sdp = {'sdp': peer_connection.localDescription}
          ws_conn.send(JSON.stringify(sdp));
      });
  }

  const generateOffer = () => {
      peer_connection.createOffer().then(onLocalDescription).catch(setError);
  }

  // ICE candidate received from peer, add it to the peer connection
  const onIncomingICE = (ice) => {
      var candidate = new RTCIceCandidate(ice);
      peer_connection.addIceCandidate(candidate).catch(setError);
  }

  const onServerMessage = (event) => {
      console.log("Received " + event.data);

      let msg;

      switch (event.data) {
          case "HELLO":
              setStatus("Registered with server, waiting for call");
              return;
          default:
              if (event.data.startsWith("ERROR")) {
                  handleIncomingError(event.data);
                  return;
              }
              if (event.data.startsWith("OFFER_REQUEST")) {
                // The peer wants us to set up and then send an offer
                if (!peer_connection)
                    createCall(null).then (generateOffer);
              }
              else {
                  // Handle incoming JSON SDP and ICE messages
                  try {
                      msg = JSON.parse(event.data);
                  } catch (e) {
                      if (e instanceof SyntaxError) {
                          handleIncomingError("Error parsing incoming JSON: " + event.data);
                      } else {
                          handleIncomingError("Unknown error parsing response: " + event.data);
                      }
                      return;
                  }

                  // Incoming JSON signals the beginning of a call
                  if (!peer_connection)
                      createCall(msg);

                  if (msg.sdp != null) {
                      onIncomingSDP(msg.sdp);
                  } else if (msg.ice != null) {
                      onIncomingICE(msg.ice);
                  } else {
                      handleIncomingError("Unknown incoming JSON: " + msg);
                  }
              }
      }
  }

  function onServerClose(event) {
      setStatus('Disconnected from server');
      resetVideo();

      if (peer_connection) {
          peer_connection.close();
          peer_connection = null;
      }

      // Reset after a second
      window.setTimeout(websocketServerConnect, 1000);
  }

  function onServerError(event) {
      setError("Unable to connect to server, did you add an exception for the certificate?")
      console.log("onServerError", event)
      // Retry after 3 seconds
      window.setTimeout(websocketServerConnect, 3000);
  }

  function websocketServerConnect() {
      connect_attempts++;
      if (connect_attempts > 3) {
          setError("Too many connection attempts, aborting. Refresh page to try again");
          return;
      }

      // Fetch the peer id to use
      let peer_id = default_peer_id;

      ws_port = ws_port || '8443';

      var ws_url = 'ws://' + ws_server + ':' + ws_port

      setStatus("Connecting to server " + ws_url);
      ws_conn = new WebSocket(ws_url);

      /* When connected, immediately register with the server */
      ws_conn.addEventListener('open', (event) => {
          // document.getElementById("peer-id").textContent = peer_id;
          ws_conn.send('HELLO ' + peer_id);
          setStatus("Registering with server");
      });

      ws_conn.addEventListener('error', onServerError);
      ws_conn.addEventListener('message', onServerMessage);
      ws_conn.addEventListener('close', onServerClose);

      return peer_id
  }

  const onRemoteTrack = (event) => {
      if (getVideoElement().srcObject !== event.streams[0]) {
          console.log('Incoming stream');
          getVideoElement().srcObject = event.streams[0];
      }
  }

  const handleDataChannelOpen = (event) =>{
      console.log("dataChannel.OnOpen", event);
  };

  const handleDataChannelMessageReceived = (event) =>{
      console.log("dataChannel.OnMessage:", event, event.data.type);

      setStatus("Received data channel message");
      if (typeof event.data === 'string' || event.data instanceof String) {
          console.log('Incoming string message: ' + event.data);
          let textarea = document.getElementById("text")
          textarea.value = textarea.value + '\n' + event.data
      } else {
          console.log('Incoming data message');
      }
      send_channel.send("Hi! (from browser)");
  };

   const handleDataChannelError = (error) =>{
      console.log("dataChannel.OnError:", error);
  };

   const handleDataChannelClose = (event) =>{
      console.log("dataChannel.OnClose", event);
  };

   function onDataChannel(event) {
      setStatus("Data channel created");
      let receiveChannel = event.channel;
      receiveChannel.onopen = handleDataChannelOpen;
      receiveChannel.onmessage = handleDataChannelMessageReceived;
      receiveChannel.onerror = handleDataChannelError;
      receiveChannel.onclose = handleDataChannelClose;
  }

   function createCall(msg) {
     console.log("createCall: msg", msg)
      // Reset connection attempts because we connected successfully
      connect_attempts = 0;

      console.log('Creating RTCPeerConnection');

      peer_connection = new RTCPeerConnection(rtc_configuration);
      send_channel = peer_connection.createDataChannel('label', null);
      send_channel.onopen = handleDataChannelOpen;
      send_channel.onmessage = handleDataChannelMessageReceived;
      send_channel.onerror = handleDataChannelError;
      send_channel.onclose = handleDataChannelClose;
      peer_connection.ondatachannel = onDataChannel;
      peer_connection.ontrack = onRemoteTrack;

      if (msg != null && !msg.sdp) {
          console.log("WARNING: First message wasn't an SDP message!?");
      }

      peer_connection.onicecandidate = (event) => {
          // We have a candidate, send it to the remote party with the
          // same uuid
          if (event.candidate == null) {
              console.log("ICE Candidate was null, done");
              return;
          }
          ws_conn.send(JSON.stringify({'ice': event.candidate}));
      };

      if (msg != null)
          setStatus("Created peer connection for call, waiting for SDP");

  }


  return (
    <div className="App" style={{display: 'flew', flexDirection: 'column', alignItems: 'center'}}>
        <div>
            <video
                id="stream"
                autoPlay
                playsInline
            >
                Your browser doesn't support video
            </video>
        </div>

        <div>
          <div id="status">Status: {status}</div>
          <div id="error">Error: {error}</div>
        </div>

        <div>My id is <b id="peer-id">{myPeerId}</b></div>

        <button
            style={{
                width: "5rem",
                height: "2rem"
            }}
            onClick={handleButtonClick}
        >
            Click Me
        </button>
    </div>
  );
}

export default StreamContainer;