import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./finish_column.style";

import React, {useState} from "react";

import Column from "../column/column"

const FinishColumn = ((props) => {
	const {
		station_id,
		stationName = "Unnamed",
		handleCardClick,
		cards = [],
		processId,
		maxHeight,
		sortMode,
		sortDirection
	} = props

	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			sortDirection={sortDirection}
			maxHeight={maxHeight}
			sortMode={sortMode}
			maxWidth={"20rem"}
			HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0)=>{
				if(isCollapsed) {
					return(
						<styled.StationHeader>
							<i className="fa fa-chevron-right" aria-hidden="true"
							   onClick={() => setCollapsed(false)}
							/>
						</styled.StationHeader>
					)
				}
				else {
					return(
						<styled.StationHeader>
							<styled.HeaderRow style={{
								marginBottom: "1rem"
							}}>
								<i className="fa fa-chevron-down" aria-hidden="true"
								   onClick={() => setCollapsed(true)}
								/>

								<styled.LabelContainer>

									<styled.StationTitle>{stationName}</styled.StationTitle>
								</styled.LabelContainer>

								<i className="fas fa-ellipsis-h" style={{opacity: 0}}></i>
							</styled.HeaderRow>

							<styled.HeaderRow>
								<div>
									<styled.QuantityText>Lots: </styled.QuantityText>
									<styled.QuantityText>{numberOfLots}</styled.QuantityText>
								</div>

								<div>
									<styled.QuantityText>Total Quantity: </styled.QuantityText>
									<styled.QuantityText>{lotQuantitySummation}</styled.QuantityText>
								</div>
							</styled.HeaderRow>
						</styled.StationHeader>
					)
				}
			}}
			station_id={station_id}
			stationName = {stationName}
			handleCardClick={handleCardClick}
			cards = {cards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)


})

export default FinishColumn