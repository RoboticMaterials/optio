import React, { useEffect, useRef, useState} from "react";
import VisibilitySensor from 'react-visibility-sensor'

// actions
import { putCard } from "../../../../../../redux/actions/card_actions";
import {
	setDroppingLotId,
	setLotHovering,
	setDraggingLotId
} from "../../../../../../redux/actions/card_page_actions";

// components external
import { Draggable, Container } from 'react-smooth-dnd';

// components internal
import Lot from "../../lot/lot";

// functions external
import { useDispatch, useSelector } from "react-redux";

// styles
import * as styled from "./column.style";

/// utils
import { sortBy } from "../../../../../../methods/utils/card_utils";
import { immutableDelete, immutableReplace, isArray, isNonEmptyArray } from "../../../../../../methods/utils/array_utils";
import { getCustomFields, handleMoveLotToMergeStation } from "../../../../../../methods/utils/lot_utils";
import {findProcessStartNodes, findProcessEndNode} from '../../../../../../methods/utils/processes_utils'
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
		setSelectedCards
	} = props

	// redux state
	const objects = useSelector(state => { return state.objectsReducer.objects })
	const reduxCards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || {}
	const hoveringLotId = useSelector(state => { return state.cardPageReducer.hoveringLotId }) || null
	const draggingLotId = useSelector(state => { return state.cardPageReducer.draggingLotId }) || null

	const routes = useSelector(state => state.tasksReducer.tasks)
	const stations = useSelector(state => state.stationsReducer.stations)
	const processes = useSelector(state => state.processesReducer.processes)
	const kickoffDashboards = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards})

	// console.log(shiftDetails)

	// actions
	const dispatch = useDispatch()
	const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchSetDroppingLotId = async (lotId, binId) => await dispatch(setDroppingLotId(lotId, binId))
	const dispatchSetLotHovering = async (lotId) => await dispatch(setLotHovering(lotId))
	const dispatchSetDraggingLotId = async (lotId) => await dispatch(setDraggingLotId(lotId))

	// component state
	const [dragEnter, setDragEnter] = useState(false)
	const [lotQuantitySummation, setLotQuantitySummation] = useState(0)
	const [numberOfLots, setNumberOfLots] = useState(0)
	const [cards, setCards] = useState([])


	// const [breaks, setBreaks] = useState([])
	// const [bottlneckCycleTime, setBottleneckCycleTime] = useState(0);
	// const [precedingQuantity, setPrecedingQuantity] = useState(0);

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

		setNumberOfLots(tempNumberOfLots)
		setLotQuantitySummation(tempLotQuantitySummation)
	}, [cards])

	const [isSelectedCardsNotEmpty, setIsSelectedCardsNotEmpty] = useState(false)

	useEffect(() => {
		setIsSelectedCardsNotEmpty(isNonEmptyArray(selectedCards))
	}, [selectedCards])

	useEffect(() => {
		if (sortMode) {
			let tempCards = [...props.cards] // *** MAKE MODIFIABLE COPY OF CARDS TO ALLOW SORTING ***
			sortBy(tempCards, sortMode, sortDirection)
			setCards(tempCards)
		}
		else {
			setCards(props.cards)
		}
	}, [props.cards, sortMode, sortDirection])


	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		const {
			binId,
			cardId,
			process_id: oldProcessId,
			...remainingPayload
		} = payload

		const processRoutes = processes[oldProcessId].routes.map(routeId => routes[routeId])
		let startNodes = findProcessStartNodes(processRoutes)
		let endNode = findProcessEndNode(processRoutes)

		if (oldProcessId !== processId) return false
	 	if(binId === station_id) return false
		for(const ind in processes[oldProcessId].routes){
			let route = routes[processes[oldProcessId]?.routes[ind]]
			if(route.unload === station_id && route.load ===binId && route.divergeType!=='split'){//Move lot forward in its route. Cannot be split route
				return true
			}
			else if(route.unload === binId && route.load === station_id && route.divergeType!=='split'){//Move lot backwards provided the previous station isnt a split/merge route and routes arent merging into current station
				const mergingRoutes = processes[oldProcessId].routes
															.map(routeId => routes[routeId])
															.filter(route => route.unload === binId)

				const previousMergingRoutes = processes[oldProcessId].routes
															.map(routeId => routes[routeId])
															.filter(route => route.unload === station_id)

				if(mergingRoutes.length === 1 && previousMergingRoutes === 1) return true
			}
			//Make this more restrictive, allows to drag from q and to Finish
			else if(binId==="QUEUE") {
				for(const ind in startNodes){
					if(station_id===startNodes[ind]) return true
				}
			}

			else if(station_id==="FINISH") {
				for(const ind in startNodes){
					if(binId===endNode) return true
				}
			}
		}

		return false

	}


	const onMouseEnter = (event, lotId) => {
		dispatchSetLotHovering(lotId)
	}


	const onMouseLeave = (event) => {
		dispatchSetLotHovering(null)
	}

	const getSelectedIndex = (lotId, binId) => {
		return selectedCards.findIndex((currLot) => {
			const {
				cardId: currLotId,
				binId: currBinId
			} = currLot

			return (lotId === currLotId) && (binId === currBinId)
		})
	}

	const getIsSelected = (lotId, binId) => {
		const existingIndex = getSelectedIndex(lotId, binId)
		return (existingIndex !== -1)
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

	const getIsLastSelected = (lotId) => {
		const lastSelected = getLastSelected() || {}
		const {
			cardId: currLotId,
		} = lastSelected

		return lotId === currLotId
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

	const handleDrop = async (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult || {}

		if (payload === null) { //  No new button, only reorder
			return
		} else {
			if (addedIndex !== null) {
				const {
					binId,
					cardId,
					count,
					// process_id: oldProcessId,
					...remainingPayload
				} = payload

				await dispatchSetDroppingLotId(cardId, binId)

				if (!(binId === station_id)) {
					const droppedCard = reduxCards[cardId] ? reduxCards[cardId] : {}

					const oldBins = droppedCard.bins ? droppedCard.bins : {}
					const {
						[binId]: movedBin,
						...remainingOldBins
					} = oldBins || {}

					if (movedBin) {
						// already contains items in bin
						if (oldBins[station_id] && movedBin) {

							const movedCount = parseInt(movedBin?.count || 0)
							const mergingRoutes = processes[droppedCard.process_id].routes
			                              .map(routeId => routes[routeId])
			                              .filter(route => route.unload === station_id)


							if(mergingRoutes.length > 1){
								const updatedLot = handleMoveLotToMergeStation(droppedCard,binId,station_id, movedCount)
								dispatchPutCard(updatedLot, updatedLot._id)
							}
							else{
								// handle updating lot
								{
									const oldCount = parseInt(oldBins[station_id]?.count || 0)
									const movedCount = parseInt(movedBin?.count || 0)


									await dispatchPutCard({
										...remainingPayload,
										bins: {
											...remainingOldBins,
											[station_id]: {
												...oldBins[station_id],
												count: oldCount + movedCount
											}
										}
									}, cardId)
								}

								// handle updating selectedLots
								{
									// current action is to remove lot from selectedLots if it is merged
									const existingIndex = getSelectedIndex(cardId, binId)
									if (existingIndex !== -1) {
										setSelectedCards(immutableDelete(selectedCards, existingIndex))
									}
								}
							}
						}

						// no items in bin
						else {
							const movedCount = parseInt(movedBin?.count || 0)
							const mergingRoutes = processes[droppedCard.process_id].routes
			                              .map(routeId => routes[routeId])
			                              .filter(route => route.unload === station_id)


							if(mergingRoutes.length > 1){
								const updatedLot = handleMoveLotToMergeStation(droppedCard,binId,station_id, movedCount)
								dispatchPutCard(updatedLot, updatedLot._id)
							}
							// update lot
							else{
								{
									const a = await dispatchPutCard({
										...remainingPayload,
										bins: {
											...remainingOldBins,
											[station_id]: {
												...movedBin,
											}
										}
									}, cardId)
								}

								// update selectedLots
								{
									// current action is to remove lot from selectedLots if it is merged
									const existingIndex = getSelectedIndex(cardId, binId)
									if (existingIndex !== -1) {
										setSelectedCards(immutableReplace(selectedCards, {
											...selectedCards[existingIndex],
											binId: station_id
										}, existingIndex))
									}
								}
							}
						}
					}
				}

				await dispatchSetDroppingLotId(null, null)
			}
		}
	}

	const renderCards = () => {
		return (
				<styled.BodyContainer
					dragEnter={dragEnter}
				>
					<Container
						onDrop={async (DropResult) => {
							await handleDrop(DropResult)
							setDragEnter(false)
						}}
						shouldAcceptDrop={shouldAcceptDrop}
						getGhostParent={() => document.body}
						onDragStart={(dragStartParams, b, c) => {
							const {
								isSource,
								payload,
								willAcceptDrop
							} = dragStartParams

							if (isSource) {
								const {
									binId,
									cardId
								} = payload

								dispatchSetDraggingLotId(cardId)
							}
						}}
						onDragEnd={(dragEndParams) => {
							const {
								isSource,
							} = dragEndParams

							if (isSource) {
								dispatchSetDraggingLotId(null)
							}
						}}
						onDragEnter={() => {
							setDragEnter(true)
						}}
						onDragLeave={() => {
							setDragEnter(false)
						}}
						onDropReady={(dropResult) => { }}
						groupName="process-cards"
						getChildPayload={index =>
							cards[index]
						}
						style={{ overflow: "auto", height: "100%", padding: "1rem 1rem 2rem 1rem"}}
					>
						{cards.map((card, index) => {
							const {
								_id,
								count = 0,
								leadTime,
								name,
								object_id,
								cardId,
								flags,
								lotNumber,
								totalQuantity,
								processName,
								lotTemplateId,
								...rest
							} = card

							// console.log(lotNumber, leadTime)

							// const templateValues = getCustomFields(lotTemplateId, card)

							// const lotName = lots[lot_id] ? lots[lot_id].name : null
							// const objectName = objects[object_id] ? objects[object_id].name : null

							const isSelected = getIsSelected(cardId, station_id)
							const isDragging = draggingLotId === cardId
							const isHovering = hoveringLotId === cardId

							const isLastSelected = getIsLastSelected(cardId)

							// const isSelected = (draggingLotId !== null) ? () : ()
							const selectable = (hoveringLotId !== null) || (draggingLotId !== null) || isSelectedCardsNotEmpty


							return (
								<VisibilitySensor partialVisibility = {true}>
									{({isVisible}) =>
										<>
											{!!isVisible ?
													<Draggable
														key={cardId}
														onMouseEnter={(event) => onMouseEnter(event, cardId)}
														onMouseLeave={onMouseLeave}
														style={{
														}}
													>
														<div
															style={{
															}}
														>
															<LotContainer
																glow={isLastSelected}
																isFocused={isDragging || isHovering}
																enableFlagSelector={true}
																selectable={selectable}
																isSelected={isSelected}
																key={cardId}
																// processName={processName}
																totalQuantity={totalQuantity}
																lotNumber={lotNumber}
																name={name}
																count={count}
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
																	marginBottom: "0.5rem",
																}}
															/>
														</div>
													</Draggable>
													:
													<div style = {{height: '20rem', width: '80%'}}>
													...Loading
													</div>
											}
										</>
									}
								</VisibilitySensor>
							)
						})}

					</Container>
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
				isCollapsed={isCollapsed}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
			>
				{HeaderContent(numberOfLots, lotQuantitySummation)}

				{renderCards()}
			</styled.StationContainer>
		)
	}

})

export default Column
