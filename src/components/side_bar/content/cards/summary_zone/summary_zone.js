import * as styled from "./summary_zone.style";
import StationsColumn from "../station_column/station_column";
import React, {useState} from "react";
import {SortableContainer} from "react-sortable-hoc";

const SummaryZone = SortableContainer((props) => {

	const {
		stations,
		cards,
		handleCardClick
	} = props


	return(
		<styled.Container>
			{
				stations.map((stationId, index) => {

					return (
						<StationsColumn
							// onDrop={handleDrop}
							key={stationId + index}
							id={stationId}
							cards={cards[stationId]}
							handleCardClick={handleCardClick}
						/>
					)
				})
			}
		</styled.Container>
	)





})

export default SummaryZone

