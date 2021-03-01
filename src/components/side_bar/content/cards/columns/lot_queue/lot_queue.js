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
		handleCardClick,
		cards,
		processId,
		setShowCardEditor,
		showCardEditor,
		maxHeight,
		sortMode
	} = props

	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			sortMode={sortMode}
			maxHeight={maxHeight}
			maxWidth={"20rem"}
			HeaderContent={
				!isCollapsed ?
					<styled.StationHeader>
						<i className="fa fa-chevron-down" aria-hidden="true"
						   onClick={() => setCollapsed(true)}
						/>

						<styled.LabelContainer>
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<Button
							onClick={()=> {
								handleCardClick(null, processId)
								setShowCardEditor(!showCardEditor)

							}}
							schema={'lots'}
						>
							+ Lot
						</Button>
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
			handleCardClick={handleCardClick}
			cards = {cards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)


})

// Specifies propTypes
LotQueue.propTypes = {
	stationName: PropTypes.string,
	handleCardClick: PropTypes.func,
	// cards: [],
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
};

// Specifies the default values for props:
LotQueue.defaultProps = {
	stationName: "Unnamed",
	handleCardClick: ()=>{},
	cards: [],
	setShowCardEditor: ()=>{},
	showCardEditor: false
};

export default LotQueue