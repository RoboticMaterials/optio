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
		processId
	} = props

	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const cards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || []

	let cardsSorted = {}
	currentProcess.routes.forEach((currRouteId) => {
		const currRoute =  routes[currRouteId]
		console.log("currRoute",currRoute)
		const {
			load: {station: loadStationId},
			unload: {station: unloadStationId},
		} = currRoute

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



	const dispatch = useDispatch()
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
			<styled.Container>
				{
					Object.values(cardsSorted).map((obj, index) => {

						const {
							station_id,
							route_id,
							cards: cardsArr
						} = obj

						return (
							<StationsColumn
								// onDrop={handleDrop}
								key={station_id + index}
								id={route_id+"+"+station_id}
								station_id={station_id}
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

