import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './viewer_page.style'

// Import components
import ButtonGroup from '../../../basic/button_group/button_group'
import BounceButton from '../../../basic/bounce_button/bounce_button'

import StreamContainer from './stream_container/stream_container'

// some hard coded values for now
// Set this to use a specific peer id instead of a random one
var our_default_id;
var our_id;
var peer_id = 5555
var ws_server = "localhost";
var ws_port;
const CONNECTION_MAX_ATTEMPTS = 1000

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


const getOurId = () => {
    return Math.floor(Math.random() * (9000 - 10) + 10).toString();
}

const ViewerPage = () => {

    const locaitons = useSelector(state => state.locationsReducer.locations)
    const devices = useSelector(state => state.devicesReducer.devices)

    const [streamConnected, setStreamConnected] = useState(false)
    const [myPeerId, setMyPeerId] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [disconnect, setDisconnect] = useState(false); // determined whether or not to attempt to reconnect websocket on close
    const [streams, setStreams] = useState(null)


    const params = useParams()

    // Set the station and device if there is a associated device
    const station = locaitons[params.stationID]
    let device = {}
    if(!!station.device_id) device = devices[station.device_id]


    useEffect(() => {
        // code to run on component
        setMyPeerId(websocketServerConnect())

        return () => {
            // Disconnect Stream on unmount
            setDisconnect(true)
            ws_conn.close()
        }
    }, [])

    useEffect(() => {
      if(disconnect) ws_conn.close();
    }, [disconnect])


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
          if(videoElement) {
            videoElement.pause();
            videoElement.src = "";
            videoElement.load();
          }

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
            case "SESSION_OK":
                setStatus("Successfuly started P2P session with " + peer_id);
                return
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
          console.log("onServerClose disconnect",disconnect)

          if (peer_connection) {
              peer_connection.close();
              peer_connection = null;
          }

          // Reset after a second
          if(!disconnect) {
            //setTimeout(websocketServerConnect, 1000)
          }
      }

      function onServerError(event) {
          setError("Unable to connect to server, did you add an exception for the certificate?")
          console.log("onServerError", event)
          // Retry after 3 seconds
          window.setTimeout(websocketServerConnect, 3000);
      }

      const websocketServerConnect = () => {
          connect_attempts++;
          if (connect_attempts > CONNECTION_MAX_ATTEMPTS) {
              setError("Too many connection attempts, aborting. Refresh page to try again");
              return;
          }

          // Fetch the peer id to use
          our_id = our_default_id || getOurId()

          ws_port = ws_port || '8443';

          var ws_url = 'ws://' + ws_server + ':' + ws_port

          setStatus("Connecting to server " + ws_url);
          ws_conn = new WebSocket(ws_url);

          /* When connected, immediately register with the server */
          ws_conn.addEventListener('open', (event) => {
              // document.getElementById("peer-id").textContent = peer_id;
              onServerOpen()
          });

          ws_conn.addEventListener('error', onServerError);
          ws_conn.addEventListener('message', onServerMessage);
          ws_conn.addEventListener('close', onServerClose);

          return our_id
      }

      const onServerOpen = () => {
          ws_conn.send('HELLO ' + our_id);
          ws_conn.send('SESSION ' + peer_id)
          setStatus("Registering with server");
      }

      const onRemoteTrack = (event) => {
          console.log("onRemoteTrack event", event)
          console.log("onRemoteTrack getVideoElement().srcObject", getVideoElement().srcObject)
          setStreams(event.streams)

          if (getVideoElement().srcObject !== event.streams[0]) {
              console.log('Incoming stream');
              getVideoElement().srcObject = event.streams[0];

              setError(null)
              setStreamConnected(true)
              // getVideoElement().src = event.streams[0];

          }
          resetVideo();
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
        <styled.PageContainer>
          <styled.TitleContainer>
            <styled.DeviceName>{!!device ? `${device.device_name}` : 'Connect to Stream'}</styled.DeviceName>
            <styled.LiveText>Live Stream</styled.LiveText>
          </styled.TitleContainer>


                <StreamContainer
                  status={status}
                  error={error}
                  myPeerId={myPeerId}
                  resetVideo={resetVideo}
                  loading={!streamConnected}
                  streams={streams}

                />


            <styled.ConnectContainer>
            </styled.ConnectContainer>
        </styled.PageContainer>
    )
}

export default ViewerPage
