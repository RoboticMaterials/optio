import log from "loglevel";

const logger = log.getLogger("reconnectingWebRTCSocket");

logger.setLevel("silent");
// RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection
const googleSTUN = "stun:stun.l.google.com:19302";
const mozillaSTUN = "stun:stun.services.mozilla.com";

// RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;

RTCSessionDescription =
  window.RTCSessionDescription || window.RTCSessionDescription;
RTCIceCandidate = window.RTCIceCandidate || window.RTCIceCandidate;

var default_rtc_configuration = {
  iceServers: [
    {
      urls: mozillaSTUN,
    },
    {
      urls: googleSTUN,
    },
  ],
  iceCandidatePoolSize: 10,
  asdasdsa: 2322,
};

export default function reconnectingWebRTCSocket(
  URL,
  our_id,
  peer_id,
  rtc_config
) {
  let client;
  let isConnected = false;
  let reconnectOnClose = true;
  let messageListeners = [];
  let stateChangeListeners = [];
  var peer_connection;
  var send_channel;
  var remoteTrackListeners = [];
  var errorListeners = [];
  var statusListeners = [];
  var status = null;
  var error = null;
  var roomReconnectInterval;
  var peerReconnectInterval;
  var helloInterval;
  var rtc_configuration = rtc_config || default_rtc_configuration;
  var streams = [];

  function addMessageListener(fn) {
    messageListeners.push(fn);
  }

  function removeMessageListener(fn) {
    messageListeners = messageListeners.filter((l) => l !== fn);
  }

  function addErrorListener(fn) {
    errorListeners.push(fn);
    return () => {
      errorListeners = errorListeners.filter((l) => l !== fn);
    };
  }

  const setError = (message) => {
    logger.error("setError: measssadasdsasagee", message);
    error = message;
    errorListeners.forEach((fn) => fn(message));
  };

  function addStatusListener(fn) {
    statusListeners.push(fn);
    return () => {
      statusListeners = statusListeners.filter((l) => l !== fn);
    };
  }

  const setStatus = (message) => {
    status = message;
    statusListeners.forEach((fn) => fn(message));
  };

  function onStateChange(fn) {
    stateChangeListeners.push(fn);
    return () => {
      stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
    };
  }

  function start() {
    client = new WebSocket(URL);

    client.onopen = () => {
      isConnected = true;
      stateChangeListeners.forEach((fn) => fn(true));

      setHelloInterval();
    };

    const close = client.close;

    // Close without reconnecting;
    client.close = () => {
      reconnectOnClose = false;
      close.call(client);
    };

    client.onmessage = (event) => {
      logger.log("onmessage event.dataa", event.data);

      messageListeners.forEach((fn) => fn(event));
      let msg;

      switch (event.data) {
        case "HELLO":
          setStatus("Registered with server.");
          clearHelloInterval();
          setRoomReconnectInterval();
          return;

        case "SESSION_OK":
          // successfully connected, clear interval
          clearRoomReconnectInterval();

          setStatus("Successfuly started session with " + peer_id);
          return;

        default:
          if (event.data.startsWith("ERROR")) {
            setError(event.data);
            return;
          } else if (event.data.startsWith("SESSION_PEER_LEFT")) {
            // reconnectToPeer()
          } else if (event.data.startsWith("ROOM_OK")) {
            clearRoomReconnectInterval();
            setStatus("Successfuly joined room " + peer_id);
            setPeerReconnectInterval(5000);
            return;
          } else if (event.data.startsWith("ROOM_PEER_LEFT")) {
            logger.log("ROOM_PEEsaR_LEFT");
            return;
          } else if (event.data.startsWith("ROOM_PEER_MSG")) {
            logger.log("ROOM_PEEsR_MSG ROOM_PEER_MSG ROOM_PEER_MSG");
            var splitted = event.data.split(" ");
            logger.log("splitted", splitted);

            return;
          } else if (event.data.startsWith("ping")) {
            return;
          }
          if (event.data.startsWith("OFFER_REQUEST")) {
            // The peer wants us to set up and then send an offer
            if (!peer_connection) createCall(null).then(generateOffer);
          } else {
            // Handle incoming JSON SDP and ICE messages
            try {
              msg = JSON.parse(event.data);
            } catch (e) {
              if (e instanceof SyntaxError) {
                setError("Error parsing incoming JSON: " + event.data);
              } else {
                setError("Unknown error parsing response: " + event.data);
              }
              return;
            }

            // Incoming JSON signals the beginning of a call
            msg = msg.content;
            if (!peer_connection) {
              createCall(msg);
            }

            if (msg.sdp != null) {
              onIncomingSDP(msg.sdp);
            } else if (msg.ice != null) {
              onIncomingICE(msg.ice);
            } else if (msg === "PIPELINE_STOPPED") {
              reconnectToPeer(100);
              // closePeerConnection()
              logger.log("PIPELINE_STOPPED");
            } else {
              setError("Unknown incoming JSON: " + msg);
            }
          }
      }
    };

    client.onerror = (e) => logger.error(e);

    client.onclose = () => {
      logger.log("client.onclose");

      isConnected = false;
      stateChangeListeners.forEach((fn) => fn(false));

      closePeerConnection();

      clearPeerReconnectInterval();
      clearRoomReconnectInterval();
      clearHelloInterval();

      if (!reconnectOnClose) {
        logger.log("ws closed by app");
        return;
      }

      logger.log("ws closed by server");

      // attempt reconnect
      setTimeout(start, 3000);

      setStatus("Disconnected from server");
    };
  }

  function createCall(msg) {
    logger.warn("*** createCall ***");
    logger.log("createCall: msg", msg);
    // Reset connection attempts because we connected successfully
    // connect_attempts = 0;

    logger.log("Creating RTCPeerConnection");

    peer_connection = new RTCPeerConnection(rtc_configuration);
    // peer_connection = new RTCPeerConnection();

    // send_channel = peer_connection.createDataChannel('label', null);
    // send_channel.onopen = handleDataChannelOpen;
    // send_channel.onmessage = handleDataChannelMessageReceived;
    // send_channel.onerror = handleDataChannelError;
    // send_channel.onclose = handleDataChannelClose;
    peer_connection.ondatachannel = onDataChannel;
    peer_connection.ontrack = onRemoteTrack;

    peer_connection.onicecandidateerror = (event) => {
      logger.log("onicecandidateerror event", event);
      if (event.errorCode >= 300 && event.errorCode <= 699) {
        // STUN errors are in the range 300-699. See RFC 5389, section 15.6
        // for a list of codes. TURN adds a few more error codes; see
        // RFC 5766, section 15 for details.
      } else if (event.errorCode >= 700 && event.errorCode <= 799) {
        // Server could not be reached; a specific error number is
        // provided but these are not yet specified.
      }
    };

    peer_connection.onremovestream = (event) => {
      logger.log("onremovestream event", event);
    };

    peer_connection.onsignalingstatechange = (event) => {
      logger.log("onsignalingstatechange event", event);
      logger.log(
        "onsignalingstatechange peer_connection.signalingState",
        peer_connection.signalingState
      );
    };

    peer_connection.onicegatheringstatechange = (event) => {
      logger.log("onicegatheringstatechange event", event);
      logger.log(
        "peer_connection.iceGatheringState",
        peer_connection.iceGatheringState
      );
    };

    peer_connection.oniceconnectionstatechange = (event) => {
      logger.log("oniceconnectionstatechange event", event);
      logger.log(
        "oniceconnectionstatechange pc.iceConnectionState",
        peer_connection.iceConnectionState
      );
    };

    peer_connection.onconnectionstatechange = (event) => {
      logger.log("peer_connection onconnectionstatechange event", event);
      logger.log(
        "peer_connection onconnectionstatechange peer_connection",
        peer_connection
      );
      logger.log(
        "peer_connection onconnectionstatechange peer_connection.connectionState",
        peer_connection.connectionState
      );

      switch (peer_connection.connectionState) {
        case "connected":
          // The connection has become fully connected
          break;
        case "disconnected":
          reconnectToPeer();

          break;
        case "failed":
          // One or more transports has terminated unexpectedly or in an error
          break;
        case "closed":
          // The connection has been closed
          break;
        default:
          break;
      }
    };

    if (msg != null && !msg.sdp) {
      logger.log("WARNING: First message wasn't an SDP message!?");
    }

    peer_connection.onicecandidate = (event) => {
      logger.warn("*** onicecandidate *** - sending candidate", event);
      // We have a candidate, send it to the remote party with the
      // same uuid
      if (event.candidate == null) {
        logger.log("ICE Candidate was null, done");
        return;
      }

      client.send(
        JSON.stringify({
          type: "ROOM_PEER_MSG",
          to: peer_id.toString(),
          content: { ice: event.candidate },
        })
      );
    };

    if (msg != null)
      setStatus("Created peer connection for call, waiting for SDP");
  }

  // SDP offer received from peer, set remote description and create an answer
  const onIncomingSDP = (sdp) => {
    logger.warn("*** onIncomingSDP ***", sdp);
    peer_connection
      .setRemoteDescription(sdp)
      .then(() => {
        setStatus("Remote SDP set");
        if (sdp.type !== "offer") return;
        setStatus("Got SDP offer");
        peer_connection.createAnswer().then(onLocalDescription).catch(setError);
      })
      .catch(setError);
  };

  // Local description was set, send it to peer
  const onLocalDescription = (desc) => {
    logger.warn("*** onLocalDescription ***");
    logger.log("Got local description: ", JSON.stringify(desc));
    logger.log("Got local description: ", desc);

    peer_connection.setLocalDescription(desc).then(function () {
      setStatus("Sending SDP " + desc.type);
      let sdp = {
        content: { sdp: peer_connection.localDescription },
        type: "ROOM_PEER_MSG",
        to: peer_id.toString(),
      };
      client.send(JSON.stringify(sdp));
    });
  };

  const generateOffer = () => {
    logger.warn("*** generateOffer ***");
    peer_connection.createOffer().then(onLocalDescription).catch(setError);
  };

  // ICE candidate received from peer, add it to the peer connection
  const onIncomingICE = (ice) => {
    var candidate = new RTCIceCandidate(ice);
    logger.warn("*** onIncomingICE ***", candidate);
    peer_connection.addIceCandidate(candidate).catch(setError);
  };

  function addRemoteTrackListener(fn) {
    logger.warn("*** addRemoteTrackListener ***");
    remoteTrackListeners.push(fn);
    return () => {
      remoteTrackListeners = remoteTrackListeners.filter((l) => l !== fn);
    };
  }

  const closePeerConnection = () => {
    logger.warn("*** closePeerConnection ***");

    if (peer_connection) {
      // peer_connection.restartIce()
      peer_connection.close();
    }
    peer_connection = null;
  };

  const onRemoteTrack = (event) => {
    logger.warn("*** onRemoteTrack *** event", event);
    var identity = peer_connection.peerIdentity;
    logger.log("identity", identity);
    setError(null);
    setStatus("Received track.");

    // streams = streams.concat(event.streams)
    logger.log("onRemoteTrack streams", streams);

    remoteTrackListeners.forEach((fn) => fn(event.streams));
  };

  const handleDataChannelOpen = (event) => {
    logger.warn("*** handleDataChannelOpen ***", event);
  };

  const handleDataChannelMessageReceived = (event) => {
    logger.warn("*** handleDataChannelMessageReceived ***");
    logger.log("dataChannel.OnMessage:", event, event.data.type);

    setStatus("Received data channel message");
    if (typeof event.data === "string" || event.data instanceof String) {
      logger.log("Incoming string message: " + event.data);
      let textarea = document.getElementById("text");
      textarea.value = textarea.value + "\n" + event.data;
    } else {
      logger.log("Incoming data message");
    }
    send_channel.send("Hi! (from browser)");
  };

  const handleDataChannelError = (error) => {
    logger.warn("*** handleDataChannelError ***");
    logger.log("dataCh" + "annel.OnError:", error);
  };

  const handleDataChannelClose = (event) => {
    logger.warn("*** handleDataChannelClose ***");
    logger.log("dataChannel.OnClose", event);
  };

  function onDataChannel(event) {
    logger.warn("*** onDataChannel ***");
    setStatus("Data channel created");
    let receiveChannel = event.channel;
    receiveChannel.onopen = handleDataChannelOpen;
    receiveChannel.onmessage = handleDataChannelMessageReceived;
    receiveChannel.onerror = handleDataChannelError;
    receiveChannel.onclose = handleDataChannelClose;
  }

  const reconnectToPeer = (interval) => {
    logger.warn("*** reconnectToPeer ***: interval", interval);
    if (peer_connection) peer_connection.restartIce();

    if (isConnected) {
      logger.log("reconnectToPeer peer_connection", peer_connection);
      // close current connection
      closePeerConnection();
      peer_connection = null;
      setPeerReconnectInterval(3000);
    }
  };

  const clearPeerReconnectInterval = () => {
    clearInterval(peerReconnectInterval);
    peerReconnectInterval = null;
  };

  const setPeerReconnectInterval = (interval) => {
    logger.warn("*** setPeerReconnectInterval a***");

    if (isConnected) {
      setStatus(`Attempting to connect to peer ${peer_id}.`);

      let msg = "CONNECT " + peer_id;

      client.send(msg);
      if (!peerReconnectInterval) {
        peerReconnectInterval = setInterval(() => {
          if (peer_connection) {
            clearPeerReconnectInterval();
          }

          logger.log(`sending msg: ${msg}`);
          client.send(msg);
        }, interval);
      }
    }
  };

  const clearRoomReconnectInterval = () => {
    logger.warn("*** clearRoomReconnectInterval ***");
    clearInterval(roomReconnectInterval);
    roomReconnectInterval = null;
  };

  const setRoomReconnectInterval = (interval) => {
    logger.warn("*** setRoomReconnectInterval ***");

    if (isConnected) {
      setStatus(`Attempting to connect to peer ${peer_id}.`);

      let msg = "ROOM " + peer_id;

      client.send(msg);
      if (!roomReconnectInterval) {
        roomReconnectInterval = setInterval(() => {
          logger.log(`sending msg: ${msg}`);
          client.send(msg);
        }, interval);
      }
    }
  };

  const clearHelloInterval = () => {
    logger.warn("*** clearHelloInterval ***");
    clearInterval(helloInterval);
    helloInterval = null;
  };

  const setHelloInterval = () => {
    logger.warn("*** setHelloInterval ***");
    if (isConnected) {
      client.send("HELLO " + our_id);
      if (!helloInterval) {
        helloInterval = setInterval(() => {
          client.send("HELLO " + our_id);
        }, 3000);
      }
    }
  };

  start();

  return {
    addMessageListener,
    removeMessageListener,
    onStateChange,
    close: () => client.close(),
    start: () => start(),
    send: (args) => client.send(args),
    getClient: () => client,
    isConnected: () => isConnected,
    addRemoteTrackListener,
    addErrorListener,
    addStatusListener,
    getError: () => error,
    getStatus: () => status,
  };
}
