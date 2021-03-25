import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./station_column.style";

import React, {useState} from "react";

import Column from "../column/column"

const StationsColumn = ((props) => {
	const {
		station_id,
		stationName = "Unnamed",
		onCardClick,
		cards = [],
		processId,
		maxHeight,
		sortMode,
		sortDirection,
		selectedCards,
		setSelectedCards
	} = props

	const [isCollapsed, setCollapsed] = useState(false)
	
	return(
		<Column
			setSelectedCards={setSelectedCards}
			selectedCards={selectedCards}
			sortDirection={sortDirection}
			maxWidth={"20rem"}
			sortMode={sortMode}
			maxHeight={maxHeight}
			HeaderContent={
				!isCollapsed ?
				<styled.StationHeader>
					<styled.HeaderContent>
						<i className="fa fa-chevron-down" aria-hidden="true"
						   onClick={() => setCollapsed(true)}
						   style={{marginRight: "1rem"}}
						/>

						<styled.LabelContainer>
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<i className="fas fa-ellipsis-h" style={{opacity: 0}}></i>
					</styled.HeaderContent>
				</styled.StationHeader>
					:
					<styled.StationHeader>
						<i className="fa fa-chevron-right" aria-hidden="true"
							onClick={() => setCollapsed(false)}
						/>
					</styled.StationHeader>
			}
			station_id={station_id}
			stationName = {stationName}
			onCardClick={onCardClick}
			cards = {cards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)
})

export default StationsColumn