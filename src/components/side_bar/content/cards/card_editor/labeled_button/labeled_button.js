import React from 'react'

// functions external
import PropTypes from 'prop-types'

// components internal
import WobbleButton from "../../../../../basic/wobble_button/wobble_button"

// styles
import * as styled from "./labeled_button.style"

const LabeledButton = (props) => {

	const {
		label,
		children,
		containerStyle
	} = props

	return (
		<styled.Container
			style={containerStyle}
		>
			{children}
			<styled.Caption>{label}</styled.Caption>
		</styled.Container>
	)
}

LabeledButton.propTypes = {
	label: PropTypes.string,
}

LabeledButton.defaultProps = {
	label: "",
}

export default LabeledButton
