import React, { useState, useEffect } from 'react';
import * as styled from "./stream_info.style"

const StreamInfo = (props) => {

	const {
		loading,
		status,
		error,
		outID,
		peerID,
		streams
	} = props

	return(
		<styled.Container>
			<styled.Item>loading: {loading}</styled.Item>
			<styled.Item>status: {status}</styled.Item>
			<styled.Item>error: {error}</styled.Item>
			<styled.Item>my ID: {outID}</styled.Item>
			<styled.Item>peer ID: {peerID}</styled.Item>
		</styled.Container>

	)
}

export default StreamInfo