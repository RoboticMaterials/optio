import React, { useEffect, useRef, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
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
import { getCustomFields, handleMoveLotToMergeStation, handleMoveLotFromMergeStation, handleNextStationBins, handleCurrentStationBins } from "../../../../../../methods/utils/lot_utils";
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
	const history = useHistory();
  const pageName = history.location.pathname;
  const isDashboard = !!pageName.includes("/locations");
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
	const [enableFlags, setEnableFlags] = useState(true)
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

	//This function is now more limiting with split/merge
	// -dont allow moving lot to next stations(s) if current station disperses a lot
	//-dont allow movinga lot backwards if the previous node has routes merging into it or if it disperses a lot
	//-dont allow moving lot back if current node has routes merging into it
	//-These limitations ensure dragging lots around in cardZone dont mess merge/split functionality
	//-We should make it more flexible in the future with functions that handle the above cases...
	//-There is some functionality that i added where you can drag lots forward into their merging station and it will properly merge them
	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		if(!!payload){
			const {
				binId,
				cardId,
				process_id: oldProcessId,
				...remainingPayload
			} = payload

			const processRoutes = processes[oldProcessId]?.routes.map(routeId => routes[routeId])
			let startNodes = findProcessStartNodes(processRoutes, stations)
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
		else return false
	}


	const onMouseEnter = (event, lotId) => {
		dispatchSetLotHovering(lotId)
	}


	const onMouseLeave = (event) => {
		dispatchSetLotHovering(null)
	}

	const handleDeleteDisabledLot = (card, binId, partId) => {
			let currLot = reduxCards[card.cardId]
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
		console.log('here')
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
						let updatedLot = droppedCard
						updatedLot.bins = handleNextStationBins(updatedLot.bins, updatedLot.bins[binId]?.count, binId, station_id, processes[updatedLot.process_id], routes, stations)
						updatedLot.bins = handleCurrentStationBins(updatedLot.bins, updatedLot.bins[binId]?.count, binId, processes[updatedLot.process_id], routes)

						if(!!updatedLot.bins[binId] && !updatedLot.bins[binId]['count']){
							updatedLot.bins[binId] = {
								...updatedLot.bins[binId],
								count: 0
							}
						}
						dispatchPutCard(updatedLot, updatedLot._id)
						await dispatchSetDroppingLotId(null, null)
				}
			}
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

							if (isSource && payload) {
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
							if(!!reduxCards[card.cardId]?.bins[card.binId]){
								let partBins = reduxCards[card.cardId].bins[card.binId]

								return (
									Object.keys(partBins).map((part) => {
										const isPartial = part !== 'count' ? true : false
										return (
											<>
												{(partBins[part]>partBins['count'] || (part === 'count' && partBins['count']>0)) &&
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
																	isPartial = {isPartial}
																	onDeleteDisabledLot = {() => {
																		handleDeleteDisabledLot(card, card.binId, part)
																	}}
																	glow={isLastSelected}
																	isFocused={isDragging || isHovering}
																	enableFlagSelector={enableFlags}
																	selectable={selectable}
																	isSelected={isSelected}
																	key={cardId}
																	// processName={processName}
																	totalQuantity={totalQuantity}
																	lotNumber={lotNumber}
																	name={isPartial ? name + ` (${routes[part]?.part})` : name}
																	count={isPartial ? partBins[part] - partBins['count'] : partBins['count']}
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
												}
											</>
										)
									})
								)
							}
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
