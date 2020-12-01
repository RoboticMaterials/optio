import * as styled from "./timeline_card.style";
import React, {useState} from "react";

const TimelineCard = (props) => {

	const {
		name,
		id,
		index,
		onClick,
		processName,
		stationName,
		start_date,
		end_date
	} = props

	console.log("TimelineCard start_date",start_date)
	console.log("TimelineCard end_date",end_date)

	const startDateText = (start_date?.month && start_date?.day && start_date?.year) ?  start_date.month + "/" + start_date.day + "/" + start_date.year : "Planned start"
	const endDateText = (end_date?.month && end_date?.day && end_date?.year) ?  end_date.month + "/" + end_date.day + "/" + end_date.year : "Planned end"

	return(
		<styled.Container onClick={onClick}>
				<styled.Header>
					<styled.ProcessInfo>
						<styled.ProcessName>Process: {processName}</styled.ProcessName>
						<styled.ProcessName>Station: {stationName}</styled.ProcessName>
					</styled.ProcessInfo>
				</styled.Header>



			<styled.RowContainer>
				<styled.BasicInfoContainer>




					<styled.CardName>{name}</styled.CardName>
				</styled.BasicInfoContainer>

				<styled.DatesContainer>
					<styled.DateItem>
						<styled.DateText>{startDateText}</styled.DateText>
					</styled.DateItem>

					<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

					<styled.DateItem >
						<styled.DateText>{endDateText}</styled.DateText>
					</styled.DateItem>
				</styled.DatesContainer>
			</styled.RowContainer>

		</styled.Container>
	)





}

export default TimelineCard

