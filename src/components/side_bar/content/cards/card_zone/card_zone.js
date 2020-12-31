import React, {useEffect, useState} from "react";



// components
import StationsColumn from "../columns/station_column/station_column";
import LotQueue from "../columns/lot_queue/lot_queue";
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
import FinishColumn from "../columns/finish_column/finish_column";

const CardZone = SortableContainer((props) => {

	const {
		// stations,
		handleCardClick,
		processId,
		setShowCardEditor,
		showCardEditor,
		maxHeight
	} = props

	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const cards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || []
	const stations = useSelector(state => { return state.locationsReducer.stations })

	let cardsSorted = {}
	var prevLoadStationId
	var prevUnloadStationId

	var step = 0
	currentProcess.routes && currentProcess.routes.forEach((currRouteId, index) => {
		const currRoute =  routes[currRouteId]


		const loadStationId = currRoute?.load?.station
		const unloadStationId = currRoute?.unload?.station

		if(prevUnloadStationId !== loadStationId) {
			cardsSorted[loadStationId] = {
				station_id: loadStationId,
				step: step,
				cards: []
			}
		}

		// if(prevLoadStationId !== unloadStationId ) {
			cardsSorted[unloadStationId] = {
				station_id: unloadStationId,
				step: step,
				cards: []
		}

		step = step + 1

		prevLoadStationId = loadStationId
		prevUnloadStationId = unloadStationId
	})


	var queue = []
	var finished = []
	Object.values(cards).forEach((card) => {

		const {
			bins,
			_id,
			...rest
		} = card

		if(card.bins) {
			Object.entries(card.bins).forEach((binEntry) => {
				const binId = binEntry[0]
				const binValue = binEntry[1]

				const {
					count
				} = binValue

				if(cardsSorted[binId]) {
					cardsSorted[binId].cards.push({
						...rest,
						binId,
						count,
						cardId: _id
					})
				}
				else if(binId === "QUEUE") {
					queue.push({
						...rest,
						count,
						binId,
						cardId: _id
					})
				}
				else if(binId === "FINISH") {
					finished.push({
						...rest,
						count,
						binId,
						cardId: _id
					})
				}

			})
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
			<styled.Container>
				<LotQueue
					key={"QUEUE"}
					maxHeight={maxHeight}
					station_id={"QUEUE"}
					setShowCardEditor={setShowCardEditor}
					showCardEditor={showCardEditor}
					stationName={"Queue"}
					processId={processId}
					cards={queue}
					handleCardClick={handleCardClick}
				/>

				{
					Object.values(cardsSorted).map((obj, index) => {

						const {
							station_id,
							route_id,
							step,
							cards: cardsArr
						} = obj

						const currStation = stations[station_id]
						const {
							name: stationName
						} = currStation || {}

						return (
							<StationsColumn
								step={step}
								maxHeight={maxHeight}
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

				<FinishColumn
					key={"FINISH"}
					maxHeight={maxHeight}
					station_id={"FINISH"}
					setShowCardEditor={setShowCardEditor}
					showCardEditor={showCardEditor}
					stationName={"Finished"}
					processId={processId}
					cards={finished}
					handleCardClick={handleCardClick}
				/>

			</styled.Container>
		)
})

export default CardZone

