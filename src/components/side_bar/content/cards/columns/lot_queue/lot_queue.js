import React, {useState} from "react";

// functions external
import PropTypes from 'prop-types';

// components internal
import Column from "../column/column";
import Button from "../../../../../basic/button/button";

import * as styled from "./lot_queue.style";

const LotQueue = ((props) => {
	const {
		station_id = "QUEUE",
		stationName = "Unnamed",
		onCardClick,
		cards,
		onAddLotClick,
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
			sortMode={sortMode}
			maxHeight={maxHeight}
			maxWidth={"24rem"}
			HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0) => (
				<styled.StationHeader>
					<styled.HeaderRow
						style={{
							marginBottom: "1rem",
							marginTop: "0.5rem",
							justifyContent: 'center',
							position: 'relative'
						}}
					>

						<styled.LabelContainer>
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<Button
							onClick={onAddLotClick}
							schema={'lots'}
							style={{position: 'absolute', right: 0, marginRight: 0}}
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
			)}
			station_id={station_id}
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
