import React, {useEffect, useState} from "react"

// components
import StationsColumn from "../columns/station_column/station_column"
import LotQueue from "../columns/lot_queue/lot_queue"
import FinishColumn from "../columns/finish_column/finish_column"

// external functions
import {useDispatch, useSelector} from "react-redux"
import PropTypes from "prop-types"
import {SortableContainer} from "react-sortable-hoc"

// actions
import {setDataPage} from "../../../../../redux/actions/api_actions"

// styles
import * as styled from "./card_zone.style"
import {getMatchesFilter} from "../../../../../methods/utils/lot_utils";

const CardZone = ((props) => {

	// extract props
	const {
		handleCardClick,
		processId,
		setShowCardEditor,
		showCardEditor,
		maxHeight,
		lotFilterValue,
		selectedFilterOption,
		sortMode
	} = props

	// redux state
	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const cards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || []
	const stations = useSelector(state => { return state.stationsReducer.stations })
	const draggedLotInfo = useSelector(state => { return state.cardPageReducer.draggedLotInfo })
	const {
		lotId: draggingLotId = "",
		binId: draggingBinId = ""
	} = draggedLotInfo || {}



	// console.log("draggedLotInfo",draggedLotInfo)

	const [cardsSorted, setCardsSorted] = useState({})
	const [queue, setQueue] = useState([])
	const [finished, setFinished] = useState([])

	// const onSetDataPage = (page) => setDataPage(page)
	//
	// useEffect(() => {
	//
	// 	onSetDataPage("CardZone")
	//
	// 	return () => {
	// 		// remove page
	// 		onSetDataPage(null)
	// 	}
	// }, [])

	// need to loop through the process's routes first and get all station ids involved in the process
	// this must be done first in order to avoid showing lots that are in stations that are no longer a part of the process

	var prevLoadStationId		// tracks previous load station id when looping through routes
	var prevUnloadStationId		// tracks previous unload station id when looping through routes
	var tempCardsSorted = {}	// temp var for storing sorted cards

	// loop through routes, get load / unload station id and create entry in tempCardsSorted for each station
	currentProcess.routes && currentProcess.routes.forEach((currRouteId, index) => {

		// get current route and load / unload station ids
		const currRoute = routes[currRouteId]
		const loadStationId = currRoute?.load?.station
		const unloadStationId = currRoute?.unload?.station

		// only add loadStation entry if the previous unload wasn't identical (in order to avoid duplicates)
		if (prevUnloadStationId !== loadStationId) {

			// add entry in tempCardsSorted
			tempCardsSorted[loadStationId] = {
				station_id: loadStationId,
				cards: []
			}
		}

		// add entry in tempCardsSorted
		tempCardsSorted[unloadStationId] = {
			station_id: unloadStationId,
			cards: []
		}

		// update prevLoadStationId and prevUnloadStationId
		prevLoadStationId = loadStationId
		prevUnloadStationId = unloadStationId
	})

	// now that the object keys have been made, loop through the process's cards and add them to the correct bins

	var tempQueue = []		// temp var for storing queue lots
	var tempFinished = []	// temp var for storing finished lots

	Object.values(cards).forEach((card) => {

		// extract lot attributes
		const {
			bins,
			_id,
			...rest
		} = card


		const matchesFilter = getMatchesFilter(card, lotFilterValue, selectedFilterOption)

		if(card.bins && matchesFilter) {

			// loop through this lot's bins
			Object.entries(card.bins).forEach((binEntry) => {

				// get bin attributes
				const binId = binEntry[0]
				const binValue = binEntry[1]
				const {
					count
				} = binValue

				// don't render lot being dragged - prevents flicker bug after drop
				if((binId === draggingBinId) && (_id === draggingLotId)) return

				// if there is an entry in tempCardsSorted with key matching {binId}, add the lot to this bin
				if(tempCardsSorted[binId]) {
					tempCardsSorted[binId].cards.push({
						...rest,
						binId,
						count,
						cardId: _id
					})
				}

				// if {binId} is queue, add the lot to the queue
				else if(binId === "QUEUE") {
					tempQueue.push({
						...rest,
						count,
						binId,
						cardId: _id
					})
				}

				// if the {binId} is finish, add the lot to the finished column
				else if(binId === "FINISH") {
					tempFinished.push({
						...rest,
						count,
						binId,
						cardId: _id
					})
				}

			})
		}
	})

	/*
	* Renders a {StationColumn} for each entry in {cardsSorted}
	*
	* */
	const renderStationColumns = () => {

		// loop through each entry in {cardsSorted} and return a {StationsColumn}
		return Object.values(tempCardsSorted).map((obj, index) => {

			// extract attributes of current bin
			const {
				station_id,
				route_id,
				cards: cardsArr
			} = obj

			// get current station attributes from {station_id} and redux state
			const currStation = stations[station_id]
			const {
				name: stationName
			} = currStation || {}

			return (
				<StationsColumn
					sortMode={sortMode}
					maxHeight={maxHeight}
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

	return(
		<styled.Container>
			<LotQueue
				key={"QUEUE"}
				sortMode={sortMode}
				maxHeight={maxHeight}
				station_id={"QUEUE"}
				setShowCardEditor={setShowCardEditor}
				showCardEditor={showCardEditor}
				stationName={"Queue"}
				processId={processId}
				cards={tempQueue}
				handleCardClick={handleCardClick}
			/>

			{renderStationColumns()}

			<FinishColumn
				key={"FINISH"}
				sortMode={sortMode}
				maxHeight={maxHeight}
				station_id={"FINISH"}
				setShowCardEditor={setShowCardEditor}
				showCardEditor={showCardEditor}
				stationName={"Finished"}
				processId={processId}
				cards={tempFinished}
				handleCardClick={handleCardClick}
			/>
		</styled.Container>
	)
})

// Specifies propTypes
CardZone.propTypes = {
	handleCardClick: PropTypes.func,
	setShowCardEditor: PropTypes.func,
	processId: PropTypes.string,
	lotFilterValue: PropTypes.string,
	showCardEditor: PropTypes.bool,
	maxHeight: PropTypes.number
}

// Specifies the default values for props:
CardZone.defaultProps = {
	handleCardClick: () => {},
	processId: null,
	setShowCardEditor: () => {},
	showCardEditor: false,
	maxHeight: "30rem",
	lotFilterValue: ""
}

export default CardZone

