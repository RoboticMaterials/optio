import React, {useEffect, useState} from "react";



// components
import StationsColumn from "../station_column/station_column";
import LotQueue from "../lot_queue/lot_queue";
import Button from "../../../../basic/button/button";

// external components
import {SortableContainer} from "react-sortable-hoc";
import {Container} from "react-smooth-dnd";

// external functions
import {useDispatch, useSelector} from "react-redux";

// actions
import {setDataPage} from "../../../../../redux/actions/api_actions";

// styles
import * as styled from "./card_zone.style";

const CardZone = SortableContainer((props) => {

	const {
		// stations,
		handleCardClick,
		processId,
		size,
		setShowCardEditor,
		showCardEditor,
		maxHeight
	} = props

	const width = size?.width
	const height = size?.height


	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const cards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || []
	const stations = useSelector(state => { return state.locationsReducer.stations })

	let cardsSorted = {}
	var prevLoadStationId
	var prevUnloadStationId
	currentProcess.routes && currentProcess.routes.forEach((currRouteId) => {
		const currRoute =  routes[currRouteId]


		const loadStationId = currRoute?.load?.station
		const unloadStationId = currRoute?.unload?.station

		if(prevUnloadStationId !== loadStationId) {
			cardsSorted[currRouteId + "+" + loadStationId] = {
				station_id: loadStationId,
				route_id: currRouteId,
				cards: []
			}
		}

		if(prevLoadStationId !== unloadStationId ) {
			cardsSorted[currRouteId + "+" + unloadStationId] = {
				station_id: unloadStationId,
				route_id: currRouteId,
				cards: []
			}
		}

		prevLoadStationId = loadStationId
		prevUnloadStationId = unloadStationId
	})

	var queue = []
	Object.values(cards).forEach((card) => {

		if(cardsSorted[card.route_id + "+" + card.station_id]) {
			cardsSorted[card.route_id + "+" + card.station_id].cards.push(card)
		}
		else {
			queue.push(card)
			// cardsSorted[card.route_id + "+" + card.station_id] = {
			// 	station_id: card.station_id,
			// 	route_id: card.route_id,
			// 	cards: []
			// }
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




		return(
			<styled.Container width={width} height={height}>
				<LotQueue
					// size={size}
					// onDrop={handleDrop}
					key={null}
					setShowCardEditor={setShowCardEditor}
					showCardEditor={showCardEditor}

					stationName={"Queue"}
					// id={route_id+"+"+station_id}
					// station_id={station_id}
					processId={processId}
					// route_id={route_id}
					cards={queue}
					handleCardClick={handleCardClick}
				/>

				{
					Object.values(cardsSorted).map((obj, index) => {

						const {
							station_id,
							route_id,
							cards: cardsArr
						} = obj

						const currStation = stations[station_id]
						const {
							name: stationName
						} = currStation || {}

						return (
							<StationsColumn
								size={size}
								// onDrop={handleDrop}
								key={station_id + index}
								id={route_id+"+"+station_id}
								station_id={station_id}
								stationName={stationName}
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

