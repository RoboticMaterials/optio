import React, {useState, useEffect} from "react";
import Popup from 'reactjs-popup'
import * as styled from "./calendar_placeholder.style"

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		text,
		selectRange,
		calendarContent,
		showCalendarPopup,
		setShowCalendarPopup, 
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

			<Popup open={showCalendarPopup} closeOnDocumentClick={true} onClose={() => setShowCalendarPopup(false)}>
				{!!calendarContent && calendarContent()}
			</Popup>
		</styled.DatesContainer>
	)

	// look, im just gonna be honest here. Im not sure exactly how this works for a date range but it just does...
	// I could look into it and figure it out, but frankly Austin wants to remove date ranges anyway so its really
	// not worth it. I THINK whats happening is the calendarContent call is still being called by the date range 
	// components, and thats just rendering the popup. But since the content is generated in lot_editor.js the
	// rendered calendar works as expected. A little weird but ill take it lol

	return (
		<styled.DateItem style={containerStyle} onClick={() => {onClick(); setShowCalendarPopup(true)}}>
			<styled.DateText>{text}</styled.DateText>
			<Popup open={showCalendarPopup} closeOnDocumentClick={true} onClose={() => setShowCalendarPopup(false)}>
				{!!calendarContent && calendarContent()}
			</Popup>
		</styled.DateItem>
	)
}

export default CalendarPlaceholder