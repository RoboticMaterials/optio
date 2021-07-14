import React, {useEffect, useState} from "react";
import { useTheme } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux';

// functions external
import PropTypes from 'prop-types';

// components internal
import Column from "../column/column";
import Button from "../../../../../basic/button/button";

import * as styled from "./integration_queue.style";

import { getIntegrationCards } from '../../../../../../redux/actions/integrations_actions'

const IntegrationQueue = ((props) => {
	const {
		station_id,
		stationName,
		endpoint,
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

	const dispatch = useDispatch()
	const dispatchGetIntegrationCards = () => dispatch(getIntegrationCards(endpoint))

	const theme = useTheme()

	useEffect(() => {
		dispatchGetIntegrationCards()
	}, [])

	return(
		<Column
			setSelectedCards={setSelectedCards}
			selectedCards={selectedCards}
			sortDirection={sortDirection}
			sortMode={sortMode}
			maxHeight={maxHeight}
			maxWidth={"24rem"}
			style={{background: theme.bg.tertiary}}
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
IntegrationQueue.propTypes = {
	stationName: PropTypes.string,
	onCardClick: PropTypes.func,
	onAddLotClick: PropTypes.func,
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
};

// Specifies the default values for props:
IntegrationQueue.defaultProps = {
	stationName: "Unnamed",
	onCardClick: ()=>{},
	onAddLotClick: ()=>{},
	cards: [],
	setShowCardEditor: ()=>{},
	showCardEditor: false
};

export default IntegrationQueue
