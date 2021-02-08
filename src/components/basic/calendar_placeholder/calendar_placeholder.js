import React, {useState} from "react";

import * as styled from "./calendar_placeholder.style"

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		text,
		selectRange,
		endText,
		startText,
	} = props

	if(selectRange) return (
		<styled.DatesContainer>
			<styled.DateItem onClick={onClick}>
				<styled.DateText>{startText}</styled.DateText>
			</styled.DateItem>

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			<styled.DateItem onClick={onClick}>
				<styled.DateText>{endText}</styled.DateText>
			</styled.DateItem>
		</styled.DatesContainer>
	)

	return (
		<styled.DateItem onClick={onClick}>
			<styled.DateText>{text}</styled.DateText>
		</styled.DateItem>
	)
}

export default CalendarPlaceholder