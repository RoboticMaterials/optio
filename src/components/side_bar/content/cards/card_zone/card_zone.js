import React, {useEffect, useState, memo} from "react"

// components internal
import StationsColumn from "../columns/station_column/station_column"
import LotQueue from "../columns/lot_queue/lot_queue"
import FinishColumn from "../columns/finish_column/finish_column"

// functions external
import {useDispatch, useSelector} from "react-redux"
import PropTypes from "prop-types"

// utils
import {getLotTotalQuantity, getMatchesFilter} from "../../../../../methods/utils/lot_utils";
import {getLoadStationId, getUnloadStationId} from "../../../../../methods/utils/route_utils";

// styles
import * as styled from "./card_zone.style"
import {isObject} from "../../../../../methods/utils/object_utils";
import {isArray} from "../../../../../methods/utils/array_utils";


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
		sortMode,
		sortDirection,
		selectedCards,
		setSelectedCards,
		handleAddLotClick,
	} = props

	// redux state
	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const processCards = useSelector(state => { return state.cardsReducer.processCards }) || {}
	const stations = useSelector(state => { return state.stationsReducer.stations })
	const draggedLotInfo = useSelector(state => { return state.cardPageReducer.droppedLotInfo })
	const {
		lotId: draggingLotId = "",
		binId: draggingBinId = ""
	} = draggedLotInfo || {}

	// component state
	const [cardsSorted, setCardsSorted] = useState({})
	const [bins, setBins] = useState({})
	const [queue, setQueue] = useState([])
	const [finished, setFinished] = useState([])
	const [cards, setCards] = useState({})
	const {
		name: processName = ""
	} = currentProcess || {}

	// const [cardsSorted, setCardsSorted] = useState({})
	// const [queue, setQueue] = useState([])
	// const [finished, setFinished] = useState([])

	useEffect(() => {
		setCards(processCards[processId] || {})
	}, [processCards])

	// need to loop through the process's routes first and get all station ids involved in the process
	// this must be done first in order to avoid showing lots that are in stations that are no longer a part of the process
	useEffect(() => {
		let prevLoadStationId		// tracks previous load station id when looping through routes
		let prevUnloadStationId		// tracks previous unload station id when looping through routes
		let tempBins = {}	// temp var for storing sorted cards

		// loop through routes, get load / unload station id and create entry in tempCardsSorted for each station
		currentProcess.routes && currentProcess.routes.forEach((currRouteId, index) => {

			// get current route and load / unload station ids
			const currRoute = routes[currRouteId]
			const loadStationId = getLoadStationId(currRoute)
			const unloadStationId = getUnloadStationId(currRoute)

			// only add loadStation entry if the previous unload wasn't identical (in order to avoid duplicates)
			if (prevUnloadStationId !== loadStationId) {

				// add entry in tempCardsSorted
				tempBins[loadStationId] = {
					station_id: loadStationId,
					cards: []
				}
			}

			// add entry in tempCardsSorted
			tempBins[unloadStationId] = {
				station_id: unloadStationId,
				cards: []
			}

			// update prevLoadStationId and prevUnloadStationId
			prevLoadStationId = loadStationId
			prevUnloadStationId = unloadStationId
		})

		setBins(tempBins)

	}, [currentProcess, routes])


	// now that the object keys have been made, loop through the process's cards and add them to the correct bins
	useEffect(() => {
		let tempQueue = []		// temp var for storing queue lots
		let tempFinished = []	// temp var for storing finished lots
		let tempCardsSorted = {...bins}

		Object.values(cards).forEach((card) => {

			// extract lot attributes
			const {
				bins: cardBins,
				_id,
				...rest
			} = card

			const totalQuantity = getLotTotalQuantity(card)

			const matchesFilter = getMatchesFilter(card, lotFilterValue, selectedFilterOption)

			if(cardBins && matchesFilter) {

				// loop through this lot's bins
				Object.entries(cardBins).forEach((binEntry) => {

					// get bin attributes
					const binId = binEntry[0]
					const binValue = binEntry[1]
					const {
						count
					} = binValue

					// don't render lot being dragged - prevents flicker bug after drop
					if((binId === draggingBinId) && (_id === draggingLotId)) return

					const lotItem = {
						...rest,
						totalQuantity,
						binId,
						count,
						cardId: _id,
						processName
					}

					// if there is an entry in tempCardsSorted with key matching {binId}, add the lot to this bin
					if(bins[binId]) {
						// tempCardsSorted[binId].cards.push(lotItem)
						const currentObj = isObject(tempCardsSorted[binId]) ? tempCardsSorted[binId] : {}
						const existingCards = (isArray(currentObj.cards)) ? currentObj.cards : []

						tempCardsSorted = {
							...tempCardsSorted,
							[binId]: {
								...currentObj,
								cards: [...existingCards, lotItem]
							}
						}
					}

					// if {binId} is queue, add the lot to the queue
					else if(binId === "QUEUE") {
						tempQueue.push(lotItem)
					}

					// if the {binId} is finish, add the lot to the finished column
					else if(binId === "FINISH") {
						tempFinished.push(lotItem)
					}

				})
			}
		})

		setCardsSorted(tempCardsSorted)
		setQueue(tempQueue)
		setFinished(tempFinished)
	}, [bins, cards, lotFilterValue, selectedFilterOption, draggingBinId, draggingLotId])

	/*
	* Renders a {StationColumn} for each entry in {cardsSorted}
	*
	* */
	const renderStationColumns = () => {

		// loop through each entry in {cardsSorted} and return a {StationsColumn}
		return Object.values(cardsSorted).map((obj, index) => {

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
					setSelectedCards={setSelectedCards}
					selectedCards={selectedCards}
					sortMode={sortMode}
					sortDirection={sortDirection}
					maxHeight={maxHeight}
					key={station_id + index}
					id={route_id+"+"+station_id}
					station_id={station_id}
					stationName={stationName}
					processId={processId}
					route_id={route_id}
					cards={cardsArr}
					onCardClick={handleCardClick}
				/>
			)
		})
	}

	return(
		<styled.Container>
			<LotQueue
				setSelectedCards={setSelectedCards}
				selectedCards={selectedCards}
				key={"QUEUE"}
				sortMode={sortMode}
				sortDirection={sortDirection}
				maxHeight={maxHeight}
				station_id={"QUEUE"}
				setShowCardEditor={setShowCardEditor}
				showCardEditor={showCardEditor}
				stationName={"Queue"}
				processId={processId}
				cards={queue}
				onCardClick={handleCardClick}
				onAddLotClick={() => handleAddLotClick(processId)}
			/>

			{renderStationColumns()}

			<FinishColumn
				setSelectedCards={setSelectedCards}
				selectedCards={selectedCards}
				key={"FINISH"}
				sortMode={sortMode}
				sortDirection={sortDirection}
				maxHeight={maxHeight}
				station_id={"FINISH"}
				setShowCardEditor={setShowCardEditor}
				showCardEditor={showCardEditor}
				stationName={"Finished"}
				processId={processId}
				cards={finished}
				onCardClick={handleCardClick}
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
	maxHeight: PropTypes.string
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

export default memo(CardZone)

