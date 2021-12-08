import React, { useEffect, useRef, useMemo, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
import VisibilitySensor from 'react-visibility-sensor'

// actions
import { putCard } from "../../../../../../redux/actions/card_actions";
import {
	setDroppingLotId,
	setLotHovering,
	setDraggingLotId,
	setDraggingStationId,
	setDragFromBin,
	setLotDivHeight,
	setHideCard,
} from "../../../../../../redux/actions/card_page_actions";

// components external
import { Draggable, Container } from 'react-smooth-dnd';

// components internal
import Lot from "../../lot/lot";

// functions external
import { useDispatch, useSelector } from "react-redux";
import {deepCopy} from "../../../../../../methods/utils/utils";

// styles
import * as styled from "./column.style";

/// utils
import { sortBy } from "../../../../../../methods/utils/card_utils";
import { immutableDelete, immutableReplace, isArray, isNonEmptyArray } from "../../../../../../methods/utils/array_utils";
import { getCustomFields, handleNextStationBins, handleCurrentStationBins, handleMergeParts } from "../../../../../../methods/utils/lot_utils";
import {findProcessStartNodes, findProcessEndNodes, isStationOnBranch } from '../../../../../../methods/utils/processes_utils'
import LotContainer from "../../lot/lot_container";

const Column = ((props) => {

	const {
		station_id,
		stationName = "Unnamed",
		onCardClick,
		selectedCards,
		processId,
		HeaderContent,
		isCollapsed,
		maxWidth,
		maxHeight,
		sortMode,
		sortDirection,
		setSelectedCards,
		containerStyle
	} = props

	// redux state
	const allProcessCards = useSelector(state => { return state.cardsReducer.processCards }) || {}
	const reduxProcessCards = useMemo(() => allProcessCards[processId], [allProcessCards])
	const hoveringLotId = useSelector(state => { return state.cardPageReducer.hoveringLotId }) || null
	const draggingLotId = useSelector(state => { return state.cardPageReducer.draggingLotId }) || null
	const draggingStationId = useSelector(state => state.cardPageReducer.draggingStationId) || null
	const lotDivHeight = useSelector(state => state.cardPageReducer.lotDivHeight) || null
	const dragFromBin = useSelector(state => state.cardPageReducer.dragFromBin) || null
	const routes = useSelector(state => state.tasksReducer.tasks)
	const stations = useSelector(state => state.stationsReducer.stations)
	const processes = useSelector(state => state.processesReducer.processes)
	const kickoffDashboards = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards})
	const showCardEditor = useSelector(state => { return state.cardsReducer.showEditor })
	const hideCard = useSelector(state => state.cardPageReducer.hideCard)
	const history = useHistory();
  const pageName = history.location.pathname;
  const isDashboard = !!pageName.includes("/locations");
	// actions
	const lotRef = useRef(null)
	const dragContainerRef = useRef(null)
	const dispatch = useDispatch()
	const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchSetLotDivHeight = (height) => dispatch(setLotDivHeight(height))
	const dispatchSetDroppingLotId = async (lotId, binId) => await dispatch(setDroppingLotId(lotId, binId))
	const dispatchSetLotHovering = async (lotId) => await dispatch(setLotHovering(lotId))
	const dispatchSetDraggingLotId = async (lotId) => await dispatch(setDraggingLotId(lotId))
	const dispatchSetDraggingStationId = async (stationId) => await dispatch(setDraggingStationId(stationId))
	const dispatchSetDragFromBin = async (stationId) => await dispatch(setDragFromBin(stationId))
	const dispatchSetHideCard = async (card) => await dispatch(setHideCard(card))

	// component state
	const [dragEnter, setDragEnter] = useState(false)
	const [lotQuantitySummation, setLotQuantitySummation] = useState(0)
	const [numberOfLots, setNumberOfLots] = useState(0)
	const [cards, setCards] = useState([])
	const [enableFlags, setEnableFlags] = useState(true)
	const [isSourcee, setIsSource] = useState(false)
	const [highlightStation, setHighlightStation] = useState(false)
	const [acceptDrop, setAcceptDrop] = useState(false)//checks if the station should accept the drop when hovering over it
	const [inDropZone, setInDropZone] = useState(false)

	useEffect(() => {
		let tempLotQuantitySummation = 0
		let tempNumberOfLots = 0
		cards.forEach((currLot) => {
			const {
				count = 0
			} = currLot || {}

			tempNumberOfLots = parseInt(tempNumberOfLots) + 1
			tempLotQuantitySummation = parseInt(tempLotQuantitySummation) + parseInt(count)
		})
		if(!hideCard){
			setNumberOfLots(tempNumberOfLots)
			setLotQuantitySummation(tempLotQuantitySummation)
		}
	}, [reduxProcessCards])

	const [isSelectedCardsNotEmpty, setIsSelectedCardsNotEmpty] = useState(false)

	useEffect(() => {
		if(!hideCard){
			if (sortMode) {
				let tempCards = [...props.cards] // *** MAKE MODIFIABLE COPY OF CARDS TO ALLOW SORTING ***
				sortBy(tempCards, sortMode, sortDirection)
				setCards(tempCards)
			}
			else {
				setCards(props.cards)
			}
		}
	}, [reduxProcessCards, sortMode, sortDirection])


	useEffect(() => {
		if(!!draggingLotId && !!dragFromBin && !!reduxProcessCards[draggingLotId]){
			let accDrop = shouldAcceptDrop(draggingLotId, dragFromBin, station_id)
			setAcceptDrop(accDrop)
		}
		if(!draggingLotId) setHighlightStation(null)

	}, [draggingLotId])

	useEffect(() => {
		if(draggingLotId === null && !!hideCard && station_id === dragFromBin && processId === hideCard.process_id){
			let tempCards = deepCopy(cards)
			let ind = tempCards.findIndex(card => card.cardId === hideCard.cardId)
			tempCards.splice(ind,1)
			setCards(tempCards)
		}
	}, [draggingLotId])

	useEffect(() => {
		if(draggingLotId === null && !!hideCard && station_id === draggingStationId && processId === hideCard.process_id){
			let tempCards = deepCopy(cards)
			tempCards.push(hideCard)
			setCards(tempCards)
		}
	}, [draggingLotId])


	//This function is now more limiting with split/merge
	// -dont allow moving lot to next stations(s) if current station disperses a lot
	//-dont allow movinga lot backwards if the previous node has routes merging into it or if it disperses a lot
	//-dont allow moving lot back if current node has routes merging into it
	//-These limitations ensure dragging lots around in cardZone dont mess merge/split functionality
	//-We should make it more flexible in the future with functions that handle the above cases...
	//-There is some functionality that i added where you can drag lots forward into their merging station and it will properly merge them
	const shouldAcceptDrop = (cardId, binId, station_id) => {
		let lastStationTraversed = false
		let oldProcessId = reduxProcessCards[cardId].process_id

		const process = processes[reduxProcessCards[cardId].process_id]
		const processRoutes = process.routes.map(routeId => routes[routeId])

		if (reduxProcessCards[cardId].process_id !== processId) return false
		if (!!showCardEditor) return false

			let startNodes = findProcessStartNodes(processRoutes, stations)
			let endNode = findProcessEndNodes(processRoutes)

			if (oldProcessId !== processId) return [false, lastStationTraversed]
			if(!!showCardEditor) return [false, lastStationTraversed]
			//if (process[oldProcessId] === undefined) return false

		 	if(binId === station_id) {
				//setHighlightStation(true)
				return [true, lastStationTraversed]
			}

			const forwardsTraverseCheck = (currentStationID) => {
				if(endNode.includes(currentStationID) && station_id =='FINISH'){//If you can traverse to the end node, also allow finish column
					setHighlightStation(true)
					return true
				}
				else if(currentStationID === 'QUEUE' && (process.startDivergeType!=='split' || startNodes.length ===1)){
					//if lot is in queue and station is one of the the start nodes and start disperse isnt split then allow move
					if(startNodes.includes(station_id)){
						setHighlightStation(true)
						return true
					}
					else{//If the station is not one of the start nodes still traverse forwards from all the start nodes to see if you can get to station
						for(const ind in startNodes){
							const canMove = forwardsTraverseCheck(startNodes[ind])
							if(!!canMove) return true
						}
					}
				}
				const nextRoutes = processRoutes.filter(route => route.load === currentStationID)
				if(!!nextRoutes[0] && (!nextRoutes[0].divergeType || nextRoutes[0].divergeType!=='split')){//can't drag forward if station disperses lots
					for(const ind in nextRoutes){
						if(nextRoutes[ind].unload === station_id){
							//If you are skipping over nodes and drag to a merge station we need to keep track of the station right before
							//the merge station as merge functions need this to find routeTravelled
							lastStationTraversed = nextRoutes[ind].load
							setHighlightStation(true)
							return true
						}
						else{
							const mergingRoutes = processRoutes.filter((route) => route.unload === nextRoutes[ind].unload);
							if(mergingRoutes.length === 1){
								const canMove = forwardsTraverseCheck(nextRoutes[ind].unload)
								if(!!canMove) return true
							}
						}
					}
				}
			}

			const backwardsTraverseCheck = (currentStationID) => {//dragging into Queue, make sure kickoff isnt dispersed
				if(startNodes.includes(currentStationID) && station_id === 'QUEUE' && (process.startDivergeType!=='split' || startNodes.length ===1)) {//can traverse back to queue
					setHighlightStation(true)
					return true

				}

				else if(currentStationID === 'FINISH'){//dragging from Finish. Can drag into traversed stations provided theyre not a merge station
					if(endNode.includes(station_id)){
							setHighlightStation(true)
							return true
						}
					else{
						const canMove = backwardsTraverseCheck(endNode)
						if(!!canMove) return true
					}

				}

				const mergingRoutes = processRoutes.filter((route) => route.unload === currentStationID);
				if(mergingRoutes.length===1){//Can't drag backwards from merge station
					for(const ind in mergingRoutes){
						const dispersingRoutes = processRoutes.filter((route) => route.load === mergingRoutes[ind].load);
						if(mergingRoutes[ind].load === station_id) {
							if(dispersingRoutes.length === 1 || dispersingRoutes[0].divergeType!=='split' || !dispersingRoutes[0].divergeType ){
								setHighlightStation(true)
								return true
							}
						}
						else{
								if(dispersingRoutes.length === 1 || !dispersingRoutes[0].divergeType || dispersingRoutes[0].divergeType!=='split'){
									const canMove = backwardsTraverseCheck(mergingRoutes[ind].load)
									if(!!canMove) return true
								}
							}
						}
					}
				}

			let atMergeStation = false
			const forwardsFound = forwardsTraverseCheck(binId)
			if(!!forwardsFound) return [true, lastStationTraversed]

			const backwardsFound = backwardsTraverseCheck(binId)
			if(!!backwardsFound) return [true, lastStationTraversed]

			return [false, lastStationTraversed]

	}


	const onMouseEnter = (event, lotId) => {
		dispatchSetLotHovering(lotId)
	}


	const onMouseLeave = (event) => {
		dispatchSetLotHovering(null)
	}

	const handleDeleteDisabledLot = (card, binId, partId) => {
			let currLot = reduxProcessCards[card.cardId]
			let currBin = currLot.bins[binId]

			delete currBin[partId]

			let submitLot = {
				...currLot,
				bins: {
					...currLot.bins,
					[binId]: currBin
				}
			}
			if(Object.values(currBin).length===1 && currBin['count'] === 0) delete submitLot.bins[binId]
			dispatchPutCard(submitLot, submitLot._id)
	}

	const handleRightClickDeleteLot = (card, binId) => {
			let currLot = reduxProcessCards[card.cardId]
			let currBin = currLot.bins[binId]

			currBin['count'] = 0

			let submitLot = {
				...currLot,
				bins: {
					...currLot.bins,
					[binId]: currBin
				}
			}

			if(Object.values(currBin).length===1) delete submitLot.bins[binId]
			dispatchPutCard(submitLot, submitLot._id)
	}

	const getLastSelectedIndex = () => {
		let addedIndex = -1

		for (var i = selectedCards.length - 1; i >= 0; i--) {
			const currLot = selectedCards[i]
			const {
				binId: currBinId
			} = currLot || {}

			if ((currBinId === station_id) && (i > addedIndex)) {
				addedIndex = i
			}
		}

		return addedIndex
	}

	const getLastSelected = () => {
		const lastSelectedIndex = getLastSelectedIndex()
		return selectedCards[lastSelectedIndex]
	}

	const getBetweenSelected = (lotId) => {
		const lastSelected = getLastSelected() || {}
		const {
			cardId: lastSelectedLotId,
		} = lastSelected

		const selectedIndex = cards.findIndex((currLot) => {
			const {
				cardId: currLotId,
				binId: currBinId
			} = currLot

			return (lastSelectedLotId === currLotId) && (station_id === currBinId)
		})

		const existingIndex = cards.findIndex((currLot) => {
			const {
				cardId: currLotId,
				binId: currBinId
			} = currLot

			return (lotId === currLotId) && (station_id === currBinId)
		})

		if (selectedIndex === -1) {
			return [cards[existingIndex]]
		}
		else if (selectedIndex < existingIndex) {
			return cards.slice(selectedIndex, existingIndex + 1)
		}
		else {
			return cards.slice(existingIndex, selectedIndex + 1).reverse()
		}
	}

	const handleDrop = async () => {
			let [inDropZne, lastStn] = shouldAcceptDrop(draggingLotId, dragFromBin, draggingStationId)
			let tempDragId = draggingLotId
			if(!!inDropZne){
					const binId = dragFromBin
					const droppedCard = reduxProcessCards[draggingLotId] ? reduxProcessCards[draggingLotId] : {}
					const oldBins = droppedCard.bins ? droppedCard.bins : {}
					const {
						[binId]: movedBin,
						...remainingOldBins
					} = oldBins || {}

					dispatchSetDraggingLotId(null)

					if (movedBin) {
						let updatedLot = droppedCard
						let stationBeforeMerge = !!lastStn ? lastStn : binId
						updatedLot.bins = handleNextStationBins(updatedLot.bins, updatedLot.bins[binId]?.count, stationBeforeMerge, draggingStationId, processes[updatedLot.process_id], routes, stations)
						updatedLot.bins = handleCurrentStationBins(updatedLot.bins, updatedLot.bins[binId]?.count, binId, processes[updatedLot.process_id], routes)
						if(!!updatedLot.bins[binId] && !updatedLot.bins[binId]['count']){
							updatedLot.bins[binId] = {
								...updatedLot.bins[binId],
								count: 0
							}
						}

						//Bin exists but nothing in it. Delete the bin as this messes various things up.
						if(!!updatedLot.bins[binId] && updatedLot.bins[binId]['count'] === 0 && Object.values(updatedLot.bins[binId]).length === 1){
							delete updatedLot.bins[binId]
						}
						let result = dispatchPutCard(updatedLot, updatedLot._id)

						result.then((res) => {
							dispatchSetHideCard(null)
							dispatchSetDragFromBin(null)
							dispatchSetDraggingStationId(null)
					})
				}
			}
			else{
				dispatchSetDraggingLotId(null)
				dispatchSetDragFromBin(null)
				dispatchSetDraggingStationId(null)
				dispatchSetHideCard(null)
			}
	}

	const renderCards = () => {
		return (
				<styled.BodyContainer
					class = 'container'
					style={{ overflow: "auto", height: "100%", padding: "1rem",
					 pointerEvents: !!draggingLotId && 'none',
				 }}

					>
						{(!!highlightStation && !!draggingLotId && station_id!==dragFromBin) &&
							<styled.DragToDiv
								ref = {dragContainerRef}
								dragDivHeight = {(!!lotDivHeight ? (lotDivHeight-1) + 'rem' : '10rem')}
								class = 'dragToDiv'
							/>
						}
						{cards.map((card, index) => {
							const {
								_id,
								count = 0,
								leadTime,
								name,
								object_id,
								cardId,
								flags,
								lotNum,
								totalQuantity,
								processName,
								lotTemplateId,
								...rest
							} = card

							// const isSelected = (draggingLotId !== null) ? () : ()
							const selectable = (hoveringLotId !== null) || (draggingLotId !== null) || isSelectedCardsNotEmpty
							if(!!reduxProcessCards[card.cardId]?.bins[card.binId]){
								let partBins = reduxProcessCards[card.cardId].bins[card.binId]

								return (
									Object.keys(partBins).map((part) => {

										const isPartial = part !== 'count' ? true : false
										return (
											<VisibilitySensor partialVisibility = {true} offset = {{bottom: 50, top: 50}}>
												{({isVisible}) =>
													<>
														{!!isVisible ?
														<>
																{(partBins[part]>0 || (part === 'count' && partBins['count']>0)) &&

																	<styled.LotDiv
																		id = {'item'}
																		ref = {lotRef}
																		class = 'item'
																		onMouseEnter={(event) => onMouseEnter(event, cardId)}
																		onMouseLeave={onMouseLeave}
																		onDragStart = {(e)=>{
																			dispatchSetHideCard(card)

																			if(!!lotRef && !!lotRef.current && !!lotRef.current.offsetHeight){
																				dispatchSetLotDivHeight(lotRef.current.offsetHeight/16)
																			}
																			e.target.style.opacity = '.001'
																			dispatchSetDraggingLotId(cardId)
																			dispatchSetDragFromBin(station_id)

																		}}
																		onDragEnd = {(e)=>{
																			if(!!dragFromBin && !!draggingStationId && dragFromBin!==draggingStationId) handleDrop()
																			else{
																				dispatchSetDraggingLotId(null)
																				dispatchSetDragFromBin(null)
																				dispatchSetDraggingStationId(null)
																				dispatchSetHideCard(null)
																			}
																			e.target.style.opacity = '1'
																		}}

																		style={{
																			background: 'transparent',
																			borderRadius: '1rem',
																			pointerEvents: 'none'
																		}}
																	>
																	<LotContainer
																		isPartial = {isPartial}
																		onDeleteDisabledLot = {() => {
																			handleDeleteDisabledLot(card, card.binId, part)
																		}}
																		onRightClickDeleteLot = {()=>{
																			handleRightClickDeleteLot(card, card.binId)
																		}}
																		enableFlagSelector={enableFlags}
																		selectable={selectable}
																		key={cardId}
																		// processName={processName}
																		totalQuantity={totalQuantity}
																		lotNumber={lotNum}
																		name={isPartial ? name + ` (${routes[part]?.part})` : name}
																		count={isPartial ? partBins[part] : partBins['count']}
																		leadTime={leadTime}
																		id={cardId}
																		flags={flags || []}
																		index={index}
																		lotId={cardId}
																		binId={station_id}
																		onClick={(e) => {
																			const payload = getBetweenSelected(cardId)

																			onCardClick(
																				e,
																				{
																					lotId: cardId,
																					processId: processId,
																					binId: station_id
																				},
																				payload
																			)
																		}}
																		containerStyle={{
																			borderBottom: draggingLotId === cardId && station_id === dragFromBin && '.25rem solid #b8b9bf',
																			borderRight: draggingLotId === cardId && station_id === dragFromBin && '.2rem solid #b8b9bf',
																			borderLeft: draggingLotId === cardId && station_id === dragFromBin && '.1rem solid #b8b9bf',
																			borderTop: draggingLotId === cardId && station_id === dragFromBin && '.05rem solid #b8b9bf',
																			boxShadow: draggingLotId === cardId && station_id === dragFromBin && '2px 3px 2px 1px rgba(0,0,0,0.2)',
																			borderRadius: '0.2rem',
																			padding: '0.2rem',
																			margin: '.4rem',
																			width: '96%',
																			pointerEvents: !!draggingLotId && draggingLotId !== cardId && 'none',
																		}}
																	/>
																	</styled.LotDiv>

															}
													</>
													:
													<div style = {{minHeight:'15rem', width: '80%'}}>
													...Loading
													</div>
											}
										</>
									}
								</VisibilitySensor>
										)
									})
								)
							}
						})}
				</styled.BodyContainer>
		)
	}

	if (isCollapsed) {
		return (
			<styled.StationContainer
				maxHeight={maxHeight}
				isCollapsed={isCollapsed}
				maxWidth={maxWidth}
			>
				{HeaderContent(numberOfLots, lotQuantitySummation)}

				<styled.BodyContainer style={{
					padding: "1rem 0",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",

				}}>
					<styled.RotationWrapperOuter>
						<styled.RotationWrapperInner>
							<styled.RotatedRouteName>{stationName}</styled.RotatedRouteName>
						</styled.RotationWrapperInner>
					</styled.RotationWrapperOuter>
				</styled.BodyContainer>
			</styled.StationContainer>
		)
	}

	else {
		return (

			<styled.StationContainer
				onDragOver = {(e) => {
				 if(!!dragContainerRef && !!dragContainerRef.current) dragContainerRef.current.style.minHeight = (lotDivHeight + 4) + 'rem'
				 dispatchSetDraggingStationId(station_id)
				 if(!!acceptDrop){
					 setInDropZone(true)
				 }
				 e.preventDefault()
			 }}
			 onDragLeave={(e) => {
					 setInDropZone(false)
					 dispatchSetDraggingStationId(null)
					 if(!!dragContainerRef && !!dragContainerRef.current) dragContainerRef.current.style.minHeight = (lotDivHeight -1) + 'rem'
			 }}
				isCollapsed={isCollapsed}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				style={{
					...containerStyle
				}}
			>
				<div style = {{pointerEvents: !!draggingLotId && 'none'}}>
					{HeaderContent(numberOfLots, lotQuantitySummation)}
				</div>
				{!showCardEditor &&
					renderCards()
				}
			</styled.StationContainer>
		)
	}

})

export default Column
