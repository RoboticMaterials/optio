import * as styled from "./timeline_zone.style";
import StationsColumn from "../station_column/station_column";
import React, {useState} from "react";
import {SortableContainer} from "react-sortable-hoc";
import TimelineCard from "./timeline_card/timeline_card";
import {useSelector} from "react-redux";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import ZoneHeader from "../zone_header/zone_header";

const TimelineZone = SortableContainer((props) => {

	const {
		handleCardClick,
		initialProcesses
	} = props

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })
	const stations = useSelector(state => { return state.locationsReducer.stations })
	const cards = useSelector(state => { return Object.values(state.cardsReducer.cards) })

	const [selectedProcesses, setSelectedProcesses] = useState(processes)

	console.log("TimelineZone cards",cards)



	const renderProcessCards = () => {
		return(
			<div>

			{selectedProcesses.map((currProcess) => {
					const processCards = cards.filter((currCard) => {
						return currCard.process_id === currProcess._id
					})

					const {
						_id: processId,
						name: processName
					} = currProcess

					return(
						<styled.ProcessContainer>
							<styled.ProcessHeader>
								<styled.ProcessTitle>{processName}</styled.ProcessTitle>
							</styled.ProcessHeader>
							<styled.ProcessBody>
							{
								processCards.map((card, index) => {


									const {
										name: cardName,
										_id: cardId,
										station_id: stationId,
										start_date,
										end_date
									} = card

									const cardStation = stations[stationId]

									const {
										name: stationName
									} = cardStation

									return (
										<TimelineCard
											// onDrop={handleDrop}
											processName={processName}
											stationName={stationName}
											onClick={()=>handleCardClick(cardId)}
											key={cardId}
											id={cardId}
											name={cardName}
											start_date={start_date}
											end_date={end_date}
										/>
									)
								})
							}
							</styled.ProcessBody>
						</styled.ProcessContainer>
					)
				})

			}
			</div>
		)

	}


	return(
		<styled.Container>
			<ZoneHeader
				lotFilterValue={lotFilterValue}
				selectedProcesses={selectedProcesses}
				setSelectedProcesses={setSelectedProcesses}
			/>
			<styled.Body>
				{renderProcessCards()}
			</styled.Body>
		</styled.Container>
	)





})

export default TimelineZone

