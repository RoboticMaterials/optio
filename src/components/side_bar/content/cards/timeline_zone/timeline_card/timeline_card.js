import * as styled from "./timeline_card.style";
import React, {useState} from "react";

const TimelineCard = (props) => {

	const {
		name,
		id,
		index,
		onClick,
		processName,
		stationName
	} = props


	return(
		<styled.Container onClick={onClick}>
			<styled.BasicInfoContainer>
				<styled.ProcessName>Process: {processName}</styled.ProcessName>
				<styled.ProcessName>stationName: {stationName}</styled.ProcessName>
				<styled.CardName>{name}</styled.CardName>
			</styled.BasicInfoContainer>

		</styled.Container>
	)





}

export default TimelineCard

