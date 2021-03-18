import React from 'react'
import PropTypes from 'prop-types'
import * as sharedStyles from "../../modals.style"

const PreBodyContent = (props) => {

	const {
		processName
	} = props

	return (
		<sharedStyles.ProcessHeader>
			<sharedStyles.SubTitle>Process: {processName}</sharedStyles.SubTitle>
		</sharedStyles.ProcessHeader>
	)
}

PreBodyContent.propTypes = {
	processName: PropTypes.string
}

PreBodyContent.propTypes = {
	processName: "",
}

export default PreBodyContent
