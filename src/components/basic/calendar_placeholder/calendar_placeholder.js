import React, {useState} from "react";

import * as styled from "./calendar_placeholder.style"
import PropTypes from "prop-types";
import NumberInput from "../number_input/number_input";

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		text,
		selectRange,
		endText,
		startText,
		containerStyle,
		usable
	} = props

	if(selectRange) return (
		<styled.DatesContainer style={containerStyle}>
			<styled.DateItem usable={usable} onClick={onStartClick}>
				<styled.DateText>{startText}</styled.DateText>
			</styled.DateItem>

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			<styled.DateItem usable={usable} onClick={onEndClick}>
				<styled.DateText>{endText}</styled.DateText>
			</styled.DateItem>
		</styled.DatesContainer>
	)

	return (
		<styled.DateItem usable={usable} style={containerStyle} onClick={onClick}>
			<styled.DateText>{text}</styled.DateText>
		</styled.DateItem>
	)
}

// Specifies propTypes
CalendarPlaceholder.propTypes = {
}

// Specifies the default values for props:
CalendarPlaceholder.defaultProps = {
}

export default CalendarPlaceholder