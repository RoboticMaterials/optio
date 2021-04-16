import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./finish_column.style";

import React, {useState} from "react";

import Column from "../column/column"

const FinishColumn = ((props) => {
	const {
		stationId,
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
			maxHeight={maxHeight}
			sortMode={sortMode}
			maxWidth={"20rem"}
			HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0)=>{
				if(isCollapsed) {
					return(
						<styled.StationHeader>
							<i className="fa fa-chevron-right" aria-hidden="true"
							   onClick={() => setCollapsed(false)}
								 style = {{cursor: "pointer"}}
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
									 style = {{cursor: "pointer"}}
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
			stationId={stationId}
			stationName = {stationName}
			onCardClick={onCardClick}
			cards = {cards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)


})

export default FinishColumn
