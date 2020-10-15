var default_rtc_configuration = {
	iceServers: [
		{
			urls: "stun:stun.l.google.com:19302"
		}
	]
};


export function reconnectingWebRTCSocket(URL, our_id, peer_id, rtc_config) {
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
	var reconnectInterval;
	var helloInterval;
	var rtc_configuration = rtc_config || default_rtc_configuration

	function addMessageListener(fn) {
		messageListeners.push(fn);
	}

	function removeMessageListener(fn) {
		messageListeners = messageListeners.filter(l => l !== fn);
	}

	function addErrorListener(fn) {
		errorListeners.push(fn);
		return () => {
			errorListeners = errorListeners.filter(l => l !== fn);
		};
	}

	const setError = (message) => {
		error = message;
		errorListeners.forEach(fn => fn(message));
	}

	function addStatusListener(fn) {
		statusListeners.push(fn);
		return () => {
			statusListeners = statusListeners.filter(l => l !== fn);
		};
	}

	const setStatus = (message) => {
		status = message;
		statusListeners.forEach(fn => fn(message));
	}

	function onStateChange(fn) {
		stateChangeListeners.push(fn);
		return () => {
			stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
		};
	}

	function start() {
		client = new WebSocket(URL);

		client.onopen = () => {
			isConnected = true;
			stateChangeListeners.forEach(fn => fn(true));

			setHelloInterval()
		}

		const close = client.close;

		// Close without reconnecting;
		client.close = () => {
			reconnectOnClose = false;
			close.call(client);
		}

		client.onmessage = (event) => {
			messageListeners.forEach(fn => fn(event));
			let msg;

			switch (event.data) {
				case "HELLO":
					setStatus("Registered with server.");
					clearHelloInterval()
					setReconnectInerval()
					return;

				case "SESSION_OK":
					// successfully connected, clear interval
					clearReconnectInterval()

					setStatus("Successfuly started P2P session with " + peer_id);
					return

				default:
					if (event.data.startsWith("ERROR")) {
						setError(event.data);
						return;
					}
					else if (event.data.startsWith("SESSION_PEER_LEFT")) {
						reconnectToPeer()
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
								setError("Error parsing incoming JSON: " + event.data)
							} else {
								setError("Unknown error parsing response: " + event.data)
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
							setError("Unknown incoming JSON: " + msg);
						}
					}
			}
		}

		client.onerror = (e) => console.error(e);

		client.onclose = () => {
			console.log("client.onclose")

			isConnected = false;
			stateChangeListeners.forEach(fn => fn(false));

			if (!reconnectOnClose) {
				console.log('ws closed by app');
				return;
			}

			console.log('ws closed by server');

			// attempt reconnect
			setTimeout(start, 3000);


			setStatus('Disconnected from server');

			if (peer_connection) {
				peer_connection.close();
				peer_connection = null;
			}

			clearReconnectInterval()
			clearHelloInterval()
		}
	}




	function createCall(msg) {
		console.log("createCall: msg", msg)
		// Reset connection attempts because we connected successfully
		// connect_attempts = 0;

		console.log('Creating RTCPeerConnection');

		peer_connection = new RTCPeerConnection(rtc_configuration);
		// send_channel = peer_connection.createDataChannel('label', null);
		// send_channel.onopen = handleDataChannelOpen;
		// send_channel.onmessage = handleDataChannelMessageReceived;
		// send_channel.onerror = handleDataChannelError;
		// send_channel.onclose = handleDataChannelClose;
		peer_connection.ondatachannel = onDataChannel;
		peer_connection.ontrack = onRemoteTrack;

		peer_connection.onsignalingstatechange = (args)=>{
		};

		peer_connection.onicegatheringstatechange = (args)=>{
		};

		peer_connection.oniceconnectionstatechange = (args)=>{
		};

		peer_connection.onconnectionstatechange = (args)=>{

			switch(peer_connection.connectionState) {
				case "connected":
					// The connection has become fully connected
					break;
				case "disconnected":
					reconnectToPeer()

					break;
				case "failed":
					// One or more transports has terminated unexpectedly or in an error
					break;
				case "closed":
					// The connection has been closed
					break;
				default:
					break
			}
		};

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
			client.send(JSON.stringify({'ice': event.candidate}));
		};

		if (msg != null)
			setStatus("Created peer connection for call, waiting for SDP");

	}

	// SDP offer received from peer, set remote description and create an answer
	const onIncomingSDP = (sdp) => {
		console.log("onIncomingSDP", sdp)
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
		console.log("Got local description: ", JSON.stringify(desc));
		console.log("Got local description: ", desc);

		peer_connection.setLocalDescription(desc).then(function() {
			setStatus("Sending SDP " + desc.type);
			let sdp = {'sdp': peer_connection.localDescription}
			client.send(JSON.stringify(sdp));
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

	function addRemoteTrackListener(fn) {
		remoteTrackListeners.push(fn);
		return () => {
			remoteTrackListeners = remoteTrackListeners.filter(l => l !== fn);
		};
	}

	const onRemoteTrack = (event) => {
		console.log("onRemoteTrack event", event)
		var identity = peer_connection.peerIdentity
		console.log("identity",identity)
		setError(null)
		setStatus("Received track.")

		remoteTrackListeners.forEach(fn => fn(event.streams));
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

	const reconnectToPeer = () => {
		if(isConnected) {
			console.log("reconnectToPeer peer_connection", peer_connection)
			// close current connection
			if (peer_connection) {
				peer_connection.close();
				peer_connection = null;
			}
			peer_connection = null;

			setReconnectInerval()
		}
	}

	const clearReconnectInterval = () => {
		clearInterval(reconnectInterval)
		reconnectInterval = null
	}

	const setReconnectInerval = () => {
		if(isConnected) {
			setStatus(`Attempting to connect to peer ${peer_id}.`);
			client.send('SESSION ' + peer_id)
			if(!reconnectInterval) {
				reconnectInterval = setInterval(() => {
					let msg = 'SESSION ' + peer_id
					console.log(`sending msg: ${msg}`)
					client.send(msg)
				}, 3000);
			}
		}
	}

	const clearHelloInterval = () => {
		clearInterval(helloInterval)
		helloInterval = null
	}

	const setHelloInterval = () => {
		if(isConnected) {
			client.send('HELLO ' + our_id);
			if(!helloInterval) {
				helloInterval = setInterval(() => {
					client.send('HELLO ' + our_id);
				}, 3000);
			}
		}
	}

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
		getStatus: () => status
	};

}



