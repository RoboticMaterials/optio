import * as styled from "./timeline_zone.style";
import StationsColumn from "../station_column/station_column";
import React, {useState} from "react";
import {SortableContainer} from "react-sortable-hoc";
import TimelineCard from "./timeline_card/timeline_card";
import {useSelector} from "react-redux";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";

const TimelineZone = SortableContainer((props) => {

	const {
		handleCardClick,
		initialProcesses
	} = props

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })
	const stations = useSelector(state => { return state.locationsReducer.stations })
	const cards = useSelector(state => { return Object.values(state.cardsReducer.cards) })

	const [selectedProcesses, setSelectedProcesses] = useState(initialProcesses)

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
						<div>
							<span>{processName}</span>
							{
								processCards.map((card, index) => {


									const {
										name: cardName,
										_id: cardId,
										station_id: stationId
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
										/>
									)
								})
							}
						</div>
					)
				})

			}
			</div>
		)

	}


	return(
		<styled.Container>
			<styled.Header>
				<DropDownSearch
					style={{width: "30rem"}}
					onClearAll={()=>{
						setSelectedProcesses([])
					}}
					clearable
					multi
					values={selectedProcesses}
					options={processes}
					onChange={values => {
						console.log("onChange values",values)
						setSelectedProcesses(values)
					}}
					pattern={null}
					labelField={'name'}
					valueField={"_id"}
					onDropdownOpen={() => {
					}}
					onRemoveItem={(values)=> {
						console.log("onRemoveItem values",values)
						setSelectedProcesses(values)

					}}
				/>

			</styled.Header>
			<styled.Body>
				{renderProcessCards()}
			</styled.Body>
		</styled.Container>
	)





})

export default TimelineZone

