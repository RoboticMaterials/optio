import * as styled from "./card_zone.style";
import StationsColumn from "../station_column/station_column";
import React, {useEffect, useState} from "react";
import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {setDataPage} from "../../../../../redux/actions/api_actions";

const CardZone = SortableContainer((props) => {

	const {
		// stations,
		handleCardClick,
		processId,
		size
	} = props

	const width = size?.width
	const height = size?.height

	console.log("CardZone height",height)

	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const cards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || []

	let cardsSorted = {}
	currentProcess.routes && currentProcess.routes.forEach((currRouteId) => {
		const currRoute =  routes[currRouteId]

		const loadStationId = currRoute?.load?.station
		const unloadStationId = currRoute?.unload?.station
		console.log("currRoute",currRoute)

		cardsSorted[currRouteId + "+" + loadStationId] = {
			station_id: loadStationId,
			route_id: currRouteId,
			cards: []
		}
		cardsSorted[currRouteId + "+" + unloadStationId] = {
			station_id: unloadStationId,
			route_id: currRouteId,
			cards: []
		}
	})

	Object.values(cards).forEach((card) => {
		console.log("cards mapping cards", card)
		if(cardsSorted[card.route_id + "+" + card.station_id]) {
			cardsSorted[card.route_id + "+" + card.station_id].cards.push(card)
		}
	})



	const onSetDataPage = (page) => setDataPage(page)

	useEffect(() => {

		onSetDataPage("CardZone")
		return () => {
			// remove page
			onSetDataPage(null) // might not be necessary, can just overwrite in next page
		}
	}, [])


	console.log("CardZone cards",cards)


		return(
			<styled.Container width={width} height={height}>
				{
					Object.values(cardsSorted).map((obj, index) => {

						const {
							station_id,
							route_id,
							cards: cardsArr
						} = obj

						return (
							<StationsColumn
								size={size}
								// onDrop={handleDrop}
								key={station_id + index}
								id={route_id+"+"+station_id}
								station_id={station_id}
								processId={processId}
								route_id={route_id}
								cards={cardsArr}
								handleCardClick={handleCardClick}
							/>
						)
					})
				}
			</styled.Container>
		)





})

export default CardZone

