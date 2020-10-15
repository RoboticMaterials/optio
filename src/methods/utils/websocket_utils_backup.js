import React, { useState, useEffect } from 'react';

export function reconnectingSocket(URL, max_attempts) {
	let client;
	let isConnected = false;
	let reconnectOnClose = true;
	let messageListeners = [];
	let stateChangeListeners = [];

	let connect_attempts = 0;

	const CONNECTION_MAX_ATTEMPTS = max_attempts || 10;

	function on(fn) {
		messageListeners.push(fn);
	}

	function off(fn) {
		messageListeners = messageListeners.filter(l => l !== fn);
	}

	function onStateChange(fn) {
		stateChangeListeners.push(fn);
		return () => {
			stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
		};
	}

	function start() {
		console.log("start")

		client = new WebSocket(URL);

		client.onopen = () => {
			console.log("reconnectingSocket: onOpen")
			isConnected = true;
			stateChangeListeners.forEach(fn => fn(true));

		}

		const close = client.close;

		// Close without reconnecting;
		client.close = () => {
			console.log("client.close")
			reconnectOnClose = false;
			close.call(client);
		}

		client.onmessage = (event) => {
			messageListeners.forEach(fn => fn(event));
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

			setTimeout(start, 3000);
		}
	}

	const registerHandlers = () => {

	}

	start();

	return {
		on,
		off,
		onStateChange,
		close: () => client.close(),
		start: () => start(),
		send: (args) => client.send(args),
		getClient: () => client,
		isConnected: () => isConnected,
	};
}

export function reconnectingWebRTCSocket(URL, our_id, peer_id) {
	let client;
	let isConnected = false;
	let reconnectOnClose = true;
	let messageListeners = [];
	let stateChangeListeners = [];

	function on(fn) {
		messageListeners.push(fn);
	}

	function off(fn) {
		messageListeners = messageListeners.filter(l => l !== fn);
	}

	function onStateChange(fn) {
		stateChangeListeners.push(fn);
		return () => {
			stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
		};
	}

	function start() {
		console.log("start")

		client = new WebSocket(URL);

		client.onopen = () => {
			console.log("reconnectingSocket: onOpen")
			isConnected = true;
			stateChangeListeners.forEach(fn => fn(true));

		}

		const close = client.close;

		// Close without reconnecting;
		client.close = () => {
			console.log("client.close")
			reconnectOnClose = false;
			close.call(client);
		}

		client.onmessage = (event) => {
			messageListeners.forEach(fn => fn(event));
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

			setTimeout(start, 3000);
		}
	}

	const registerHandlers = () => {

	}

	start();



	const ws_conn = reconnectingSocket(URL);
	var peer_connection;
	var send_channel;
	var streams;
	var remoteTrackListeners = [];
	var errorListeners = [];
	var error = null;

	var reconnectInterval;
	var helloInterval;

	const setStatus = () => {}

	const setStreams = () => {}
	const setStreamConnected = () => {}

	function addErrorListener(fn) {
		errorListeners.push(fn);
		return () => {
			errorListeners = errorListeners.filter(l => l !== fn);
		};
	}

	const onError = (message) => {
		error = message;
		errorListeners.forEach(fn => fn(message));
	}



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

	const oldStart = ws_conn.start
	ws_conn.start = () => {
		oldStart()
		console.log("STARTING")
	}

	const oldOnOpen = ws_conn.getClient().onopen
	ws_conn.getClient().onopen = () => {
		console.log("ws_conn.getClient().onopen")
		oldOnOpen()
		setHelloInterval()
	}

	const oldOnclose = ws_conn.getClient().onclose
	ws_conn.getClient().onclose = () => {
		oldOnclose()
		setStatus('Disconnected from server');
		resetVideo();

		if (peer_connection) {
			peer_connection.close();
			peer_connection = null;
		}

		clearReconnectInterval()
	}

	function createCall(msg) {
		console.log("createCall: msg", msg)
		// Reset connection attempts because we connected successfully
		// connect_attempts = 0;

		console.log('Creating RTCPeerConnection');

		peer_connection = new RTCPeerConnection(rtc_configuration);
		send_channel = peer_connection.createDataChannel('label', null);
		send_channel.onopen = handleDataChannelOpen;
		send_channel.onmessage = handleDataChannelMessageReceived;
		send_channel.onerror = handleDataChannelError;
		send_channel.onclose = handleDataChannelClose;
		peer_connection.ondatachannel = onDataChannel;
		peer_connection.ontrack = onRemoteTrack;

		peer_connection.onsignalingstatechange = (args)=>{
			console.log("CHECKCHCEK onsignalingstatechange", args)
			console.log("CHECKCHCEK peer_connection", peer_connection)
		};

		peer_connection.onicegatheringstatechange = (args)=>{
			console.log("CHECKCHCEK onicegatheringstatechange", args)
			console.log("CHECKCHCEK peer_connection", peer_connection)
		};

		peer_connection.oniceconnectionstatechange = (args)=>{
			console.log("CHECKCHCEK oniceconnectionstatechange", args)
			console.log("CHECKCHCEK peer_connection", peer_connection)
		};

		peer_connection.onconnectionstatechange = (args)=>{
			console.log("CHECKCHCEK onconnectionstatechange", args)

			switch(peer_connection.connectionState) {
				case "connected":
					// The connection has become fully connected
					console.log("PC CONNECTED")
					break;
				case "disconnected":
					console.log("PC disconnected")
					reconnectToPeer()

					break;
				case "failed":
					// One or more transports has terminated unexpectedly or in an error
					console.log("PC FAILED")
					break;
				case "closed":
					// The connection has been closed
					console.log("PC CLOSED")
					break;
				default:
					console.log("PC DEFAULT")
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
			ws_conn.send(JSON.stringify({'ice': event.candidate}));
		};

		if (msg != null)
			setStatus("Created peer connection for call, waiting for SDP");

	}

	// SDP offer received from peer, set remote description and create an answer
	const onIncomingSDP = (sdp) => {
		peer_connection.setRemoteDescription(sdp).then(() => {
			setStatus("Remote SDP set");
			if (sdp.type !== "offer")
				return;
			setStatus("Got SDP offer");
			peer_connection.createAnswer()
				.then(onLocalDescription).catch(onError);
		}).catch(onError);
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
		peer_connection.createOffer().then(onLocalDescription).catch(onError);
	}

	// ICE candidate received from peer, add it to the peer connection
	const onIncomingICE = (ice) => {
		var candidate = new RTCIceCandidate(ice);
		peer_connection.addIceCandidate(candidate).catch(onError);
	}

	function onServerError(event) {
		onError("Unable to connect to server, did you add an exception for the certificate?")
		console.log("onServerError", event)
		// Retry after 3 seconds
		window.setTimeout(websocketServerConnect, 3000);
	}

	const websocketServerConnect = () => {
		return true
	}

	function addRemoteTrackCB(fn) {
		remoteTrackListeners.push(fn);
		return () => {
			remoteTrackListeners = remoteTrackListeners.filter(l => l !== fn);
		};
	}

	const onRemoteTrack = (event) => {
		console.log("onRemoteTrack event", event)
		onError(null)
		setStreamConnected(true)
		resetVideo();

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

	const resetState = () => {
		// This will call onServerClose()
		console.log("resettimg state")
		// setTimeout(() => {
		// 	ws_conn.close();
		// 	ws_conn.start()
		// }, 3000);
	}

	const reconnectToPeer = () => {
		console.log("reconnectToPeer")

		// close current connection
		resetVideo();

		if (peer_connection) {
			peer_connection.close();
			peer_connection = null;
		}

		setReconnectInerval()
	}

	const handleIncomingError = (error) => {
		console.log("handleIncomingError")
		onError(error);
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

	const clearReconnectInterval = () => {
		clearInterval(reconnectInterval)
		reconnectInterval = null
	}

	const setReconnectInerval = () => {
		ws_conn.getClient().send('SESSION ' + peer_id)
		if(!reconnectInterval) {
			reconnectInterval = setInterval(() => {

				ws_conn.getClient().send('SESSION ' + peer_id)
			}, 3000);
		}
	}

	const clearHelloInterval = () => {
		clearInterval(helloInterval)
		helloInterval = null
	}

	const setHelloInterval = () => {
		ws_conn.getClient().send('HELLO ' + our_id);
		if(!helloInterval) {
			helloInterval = setInterval(() => {
				console.log("Sending hello")
				ws_conn.getClient().send('HELLO ' + our_id);
				// setReconnectInerval()
			}, 3000);
		}
	}

	// add RTC functionality to onMessage
	const oldOnMessage = ws_conn.getClient().onmessage
	ws_conn.getClient().onmessage = (event) => {
		oldOnMessage(event)

		console.log("Received " + event.data);

		let msg;

		switch (event.data) {
			case "HELLO":
				setStatus("Registered with server, waiting for call");
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
					handleIncomingError(event.data);
					return;
				}
				else if (event.data.startsWith("SESSION_PEER_LEFT")) {
					// resetState()
					reconnectToPeer()
				}
				if (event.data.startsWith("OFFER_REQUEST")) {
					// The peer wants us to set up and then send an offer
					if (!peer_connection)
						console.log("OFFER_REQUEST")
						createCall(null).then (generateOffer);
				}
				else {
					// Handle incoming JSON SDP and ICE messages
					try {
						msg = JSON.parse(event.data);
					} catch (e) {
						if (e instanceof SyntaxError) {
							// handleIncomingError("Error parsing incoming JSON: " + event.data);
						} else {
							// handleIncomingError("Unknown error parsing response: " + event.data);
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

	return {
		on,
		off,
		onStateChange,
		close: () => client.close(),
		start: () => start(),
		send: (args) => client.send(args),
		getClient: () => client,
		isConnected: () => isConnected,
		addRemoteTrackCB,
		addErrorListener,
		getError: () => error
	};

}




export const useMessages = (client) => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		function handleMessage(message) {
			setMessages([...messages, message]);
		}
		client.on(handleMessage);
		return () => client.off(handleMessage);
	}, [messages, setMessages]);

	return messages;
}

