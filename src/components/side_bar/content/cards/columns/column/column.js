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
	setDragFromBin
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
	const reduxCards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || {}
	const hoveringLotId = useSelector(state => { return state.cardPageReducer.hoveringLotId }) || null
	const draggingLotId = useSelector(state => { return state.cardPageReducer.draggingLotId }) || null
	const draggingStationId = useSelector(state => state.cardPageReducer.draggingStationId) || null
	const dragFromBin = useSelector(state => state.cardPageReducer.dragFromBin) || null
	const routes = useSelector(state => state.tasksReducer.tasks)
	const stations = useSelector(state => state.stationsReducer.stations)
	const processes = useSelector(state => state.processesReducer.processes)
	const kickoffDashboards = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards})
	const showCardEditor = useSelector(state => { return state.cardsReducer.showEditor })
	const history = useHistory();
  const pageName = history.location.pathname;
  const isDashboard = !!pageName.includes("/locations");

	// actions
	const dispatch = useDispatch()
	const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchSetDroppingLotId = async (lotId, binId) => await dispatch(setDroppingLotId(lotId, binId))
	const dispatchSetLotHovering = async (lotId) => await dispatch(setLotHovering(lotId))
	const dispatchSetDraggingLotId = async (lotId) => await dispatch(setDraggingLotId(lotId))
	const dispatchSetDraggingStationId = async (stationId) => await dispatch(setDraggingStationId(stationId))
	const dispatchSetDragFromBin = async (stationId) => await dispatch(setDragFromBin(stationId))


	// component state
	const [dragEnter, setDragEnter] = useState(false)
	const [lotQuantitySummation, setLotQuantitySummation] = useState(0)
	const [numberOfLots, setNumberOfLots] = useState(0)
	const [cards, setCards] = useState([])
	const [enableFlags, setEnableFlags] = useState(true)
	const [isSourcee, setIsSource] = useState(false)
	const [highlightStation, setHighlightStation] = useState(false)
	const [lastStationTraversed, setLastStationTraversed] = useState(null)
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

	useEffect(() => {
		if(!!draggingLotId && !!dragFromBin && !!reduxCards[draggingLotId]){
			let accDrop = shouldAcceptDrop(draggingLotId, dragFromBin, station_id)
			setAcceptDrop(accDrop)
		}
		if(!draggingLotId) setHighlightStation(null)

	}, [draggingLotId])

	//This function is now more limiting with split/merge
	// -dont allow moving lot to next stations(s) if current station disperses a lot
	// -dont allow movinga lot backwards if the previous node has routes merging into it or if it disperses a lot
	// -dont allow moving lot back if current node has routes merging into it
	// -These limitations ensure dragging lots around in cardZone dont mess merge/split functionality
	// -We should make it more flexible in the future with functions that handle the above cases...
	// -There is some functionality that i added where you can drag lots forward into their merging station and it will properly merge them
	const shouldAcceptDrop = (cardId, binId, stationId) => {

		const process = processes[reduxCards[cardId].process_id]
		const processRoutes = process.routes.map(routeId => routes[routeId])

		if (reduxCards[cardId].process_id !== processId) return false
		if (!!showCardEditor) return false

		return isStationOnBranch(binId, stationId, process, processRoutes, stations, setHighlightStation, setLastStationTraversed)
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

	const handleRightClickDeleteLot = (card, binId) => {
			let currLot = reduxCards[card.cardId]
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

	const handleDrop = async () => {
		let inDropZne = shouldAcceptDrop(draggingLotId, dragFromBin, draggingStationId)
		if(!!inDropZne && draggingStationId!==dragFromBin){
				const binId = dragFromBin
				const droppedCard = reduxCards[draggingLotId] ? reduxCards[draggingLotId] : {}
				const oldBins = droppedCard.bins ? droppedCard.bins : {}
				const {
					[binId]: movedBin,
					...remainingOldBins
				} = oldBins || {}

				if (movedBin) {
					let updatedLot = droppedCard
					let stationBeforeMerge = !!lastStationTraversed ? lastStationTraversed : binId
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
					//console.log(JSON.parse(JSON.stringify(updatedLot)))
					dispatchPutCard(updatedLot, updatedLot._id)
					await dispatchSetDroppingLotId(null, null)
			}
		}
	}

	const renderCards = () => {
		return (
				<styled.BodyContainer
					className = 'container'
					style={{ overflow: "auto", height: "100%", padding: "1rem",

				 }}

				 onDragOver = {(e)=>{
					 dispatchSetDraggingStationId(station_id)
					 if(!!acceptDrop){
						 setInDropZone(true)
					 }
					 e.preventDefault()
				 }}
				 onDragLeave={(e) => {
						 setInDropZone(false)
						 dispatchSetDraggingStationId(null)
				 }}
					>
					{!!highlightStation && !!draggingLotId &&
						<styled.DragToDiv

						className = 'dragToDiv'
						onDragOver={(e) => {
							if(e.target.className.includes('dragToDiv')){
								e.target.style.minHeight = '18rem'
							}
						}}
						onDragLeave={(e) => {
								if(!!inDropZone){
										e.target.style.minHeight = '10rem'
								}
						}}
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

							const isLastSelected = getIsLastSelected(cardId)

							// const isSelected = (draggingLotId !== null) ? () : ()
							const selectable = (hoveringLotId !== null) || (draggingLotId !== null) || isSelectedCardsNotEmpty
							if(!!reduxCards[card.cardId]?.bins[card.binId]){
								let partBins = reduxCards[card.cardId].bins[card.binId]

								return (
									Object.keys(partBins).map((part) => {

										const isPartial = part !== 'count' ? true : false
										return (
											<VisibilitySensor partialVisibility = {true}>
												{({isVisible}) =>
													<>
														{!!isVisible ?
														<>
																{(partBins[part]>0 || (part === 'count' && partBins['count']>0)) &&

																	<styled.LotDiv
																		id = 'item'
																		class = 'item'
																		draggable = {true}
																		onMouseEnter={(event) => onMouseEnter(event, cardId)}
																		onMouseLeave={onMouseLeave}
																		onDragStart = {(e)=>{
																			e.target.style.opacity = '.001'
																			dispatchSetDraggingLotId(cardId)
																			dispatchSetDragFromBin(station_id)
																		}}
																		onDragEnd = {(e)=>{
																			handleDrop()
																			e.target.style.opacity = '1'
																			dispatchSetDraggingLotId(null)
																			dispatchSetDragFromBin(null)
																		}}

																		style={{
																			background: 'transparent',
																			borderRadius: '1rem',
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
																		glow={isLastSelected}
																		enableFlagSelector={enableFlags}
																		selectable={selectable}
																		key={cardId}
																		// processName={processName}
																		totalQuantity={totalQuantity}
																		lotNumber={lotNum}
																		name={isPartial ? name + ` (${stations[routes[part]?.load]?.name})` : name}
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
																			border: draggingLotId === cardId && station_id === dragFromBin && '.2rem solid #7e7e7e',
																			margin: draggingLotId === cardId && station_id === dragFromBin ? '0rem' : '.4rem',
																			padding: '.1rem',
																			width: draggingLotId === cardId && station_id === dragFromBin ? '100%' : '95%',
																		}}
																	/>
																	</styled.LotDiv>

															}
													</>
													:
													<div style = {{height: '20rem', width: '80%'}}>
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
				isCollapsed={isCollapsed}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				style={containerStyle}
			>
				{HeaderContent(numberOfLots, lotQuantitySummation)}

				{!showCardEditor &&
					renderCards()
				}
			</styled.StationContainer>
		)
	}

})

export default Column
