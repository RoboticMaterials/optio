import React from 'react'

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./pre_body_content.style"

const PreBodyContent = (props) => {

	const {
		processName
	} = props

	return (
		<styled.ProcessHeader>
			<styled.SubTitle>Process: {processName}</styled.SubTitle>
		</styled.ProcessHeader>
	)
}

PreBodyContent.propTypes = {
	processName: PropTypes.string
}

PreBodyContent.propTypes = {
	processName: "",
}

export default PreBodyContent
