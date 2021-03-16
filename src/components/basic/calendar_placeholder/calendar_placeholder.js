import React, {useState} from "react";

import * as styled from "./calendar_placeholder.style"

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		text,
		selectRange,
		endText,
		startText,
		containerStyle
	} = props

	if(selectRange) return (
		<styled.DatesContainer style={containerStyle}>
			<styled.DateItem onClick={onStartClick}>
				<styled.DateText>{startText}</styled.DateText>
			</styled.DateItem>

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			<styled.DateItem onClick={onEndClick}>
				<styled.DateText>{endText}</styled.DateText>
			</styled.DateItem>
		</styled.DatesContainer>
	)

	return (
		<styled.DateItem style={containerStyle} onClick={onClick}>
			<styled.DateText>{text}</styled.DateText>
		</styled.DateItem>
	)
}

export default CalendarPlaceholder