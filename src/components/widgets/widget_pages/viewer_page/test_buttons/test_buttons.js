import React, { useState, useEffect } from 'react';
import * as styled from "./test_buttons.style"
import reconnectingWebRTCSocket from "../../../../../methods/utils/websocket_utils";

const TestButtons = (props) => {

	const {
		onStartClick,
		onCloseClick
	} = props

	return(
		<styled.Container>
			<button
				onClick={()=>{
					onCloseClick()
				}}
			>
				TEST CLOSE SOCKET
			</button>
			<button
				onClick={()=>{
					onStartClick()
				}}
			>
				TEST OPEN SOCKET
			</button>
		</styled.Container>

	)
}

export default TestButtons