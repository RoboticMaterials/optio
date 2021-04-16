import React, {useState} from "react";

// functions external
import PropTypes from 'prop-types';

// components internal
import Column from "../column/column";
import Button from "../../../../../basic/button/button";

import * as styled from "./lot_queue.style";

const LotQueue = ((props) => {
	const {
		stationId = "QUEUE",
		stationName = "Unnamed",
		onCardClick,
		cards,
		onAddLotClick,
		processId,
		setShowCardEditor,
		showCardEditor,
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
			sortMode={sortMode}
			maxHeight={maxHeight}
			maxWidth={"20rem"}
			HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0) => {
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
				else{
					return(
						<styled.StationHeader>
							<styled.HeaderRow
								style={{
									marginBottom: "1rem"
								}}
							>
								<i className="fa fa-chevron-down" aria-hidden="true"
								   onClick={() => setCollapsed(true)}
									 style = {{cursor: "pointer"}}

								/>


								<styled.LabelContainer>
									<styled.StationTitle>{stationName}</styled.StationTitle>
								</styled.LabelContainer>

								<Button
									onClick={onAddLotClick}
									schema={'lots'}
								>
									+ Lot
								</Button>
							</styled.HeaderRow>
							<styled.HeaderRow
								style={{justifyContent: "space-between"}}
							>
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

// Specifies propTypes
LotQueue.propTypes = {
	stationName: PropTypes.string,
	onCardClick: PropTypes.func,
	onAddLotClick: PropTypes.func,
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
};

// Specifies the default values for props:
LotQueue.defaultProps = {
	stationName: "Unnamed",
	onCardClick: ()=>{},
	onAddLotClick: ()=>{},
	cards: [],
	setShowCardEditor: ()=>{},
	showCardEditor: false
};

export default LotQueue
