import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./finish_column.style";

import React, {useState} from "react";

import Column from "../column/column"

const FinishColumn = SortableContainer((props) => {
	const {
		station_id,
		stationName = "Unnamed",
		handleCardClick,
		cards = [],
		processId,
		maxHeight
	} = props

	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			maxHeight={maxHeight}
			maxWidth={"15rem"}
			HeaderContent={
				!isCollapsed ?
				<styled.StationHeader>
					<styled.HeaderContent>
						<i className="fa fa-chevron-down" aria-hidden="true"
						   onClick={() => setCollapsed(true)}
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
			handleCardClick={handleCardClick}
			cards = {cards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)


})

export default FinishColumn