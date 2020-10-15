import React, { useState, useEffect } from 'react';


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
		<div>
			<div>loading: {loading}</div>
			<div>status: {status}</div>
			<div>error: {error}</div>
			<div>my ID: {outID}</div>
			<div>peer ID: {peerID}</div>
		</div>

	)
}

export default StreamInfo