import React, {useEffect, useState} from "react";

// actions
import {putCard} from "../../../../../../redux/actions/card_actions";
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
import {useDispatch, useSelector} from "react-redux";

// styles
import * as styled from "./column.style";

/// utils
import {getCustomFields} from "../../../../../../methods/utils/lot_utils";
import {sortBy} from "../../../../../../methods/utils/card_utils";
import {immutableDelete, immutableReplace, isArray, isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
import LotContainer from "../../lot/lot_container";

const Column = ((props) => {

	const {
		stationId,
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
		if(sortMode) {
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
			processId: oldProcessId,
			...remainingPayload
		} = payload

		if(oldProcessId !== processId) return false
		return true
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

			if((currBinId === stationId) && (i > addedIndex)) {
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

			return (lastSelectedLotId === currLotId) && (stationId === currBinId)
		})

		const existingIndex = cards.findIndex((currLot) => {
			const {
				cardId: currLotId,
				binId: currBinId
			} = currLot

			return (lotId === currLotId) && (stationId === currBinId)
		})

		if(selectedIndex === -1) {
			return [cards[existingIndex]]
		}
		else if(selectedIndex < existingIndex) {
			return cards.slice(selectedIndex, existingIndex+1)
		}
		else {
			return cards.slice(existingIndex, selectedIndex+1).reverse()
		}
	}

	const handleDrop = async (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult || {}

		if (payload === null) { //  No new button, only reorder
			return
		} else {
			if(addedIndex !== null) {
				const {
					binId,
					cardId,
					count,
					...remainingPayload
				} = payload

				await dispatchSetDroppingLotId(cardId, binId)

				if(!(binId === stationId)) {
					const droppedCard = reduxCards[cardId] ? reduxCards[cardId] : {}

					const oldBins = droppedCard.bins ? droppedCard.bins : {}
					const {
						[binId]: movedBin,
						...remainingOldBins
					} = oldBins || {}

					if(movedBin) {
						// already contains items in bin
						if(oldBins[stationId] && movedBin) {

							// handle updating lot
							{
								const oldCount = parseInt(oldBins[stationId]?.count || 0)
								const movedCount = parseInt(movedBin?.count || 0)

								await dispatchPutCard({
									...remainingPayload,
									bins: {
										...remainingOldBins,
										[stationId]: {
											...oldBins[stationId],
											count:  oldCount + movedCount
										}
									}
								}, cardId)
							}

							// handle updating selectedLots
							{
								// current action is to remove lot from selectedLots if it is merged
								const existingIndex = getSelectedIndex(cardId, binId)
								if(existingIndex !== -1) {
									setSelectedCards(immutableDelete(selectedCards,existingIndex))
								}
							}

						}

						// no items in bin
						else {
							// update lot
							{
								const a = await dispatchPutCard({
									...remainingPayload,
									bins: {
										...remainingOldBins,
										[stationId]: {
											...movedBin,
										}
									}
								}, cardId)
							}

							// update selectedLots
							{
								// current action is to remove lot from selectedLots if it is merged
								const existingIndex = getSelectedIndex(cardId, binId)
								if(existingIndex !== -1) {
									setSelectedCards(immutableReplace(selectedCards, {
										...selectedCards[existingIndex],
										binId: stationId
									}, existingIndex))
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
		return(
			<styled.BodyContainer
				dragEnter={dragEnter}
			>
				<Container
					onDrop={async (DropResult)=> {
						await handleDrop(DropResult)
						setDragEnter(false)
					}}
					shouldAcceptDrop={shouldAcceptDrop}
					getGhostParent={()=>document.body}
					onDragStart={(dragStartParams, b, c)=>{
						const {
							isSource,
							payload,
							willAcceptDrop
						} = dragStartParams

						if(isSource) {
							const {
								binId,
								cardId
							} = payload

							dispatchSetDraggingLotId(cardId)
						}
					}}
					onDragEnd={(dragEndParams)=>{
						const {
							isSource,
						} = dragEndParams

						if(isSource) {
							dispatchSetDraggingLotId(null)
						}
					}}
					onDragEnter={()=> {
						setDragEnter(true)
					}}
					onDragLeave={()=> {
						setDragEnter(false)
					}}
					onDropReady={(dropResult)=>{}}
					groupName="process-cards"
					getChildPayload={index =>
						cards[index]
					}
					style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				>
					{cards.map((card, index) => {
						const {
							id,
							count = 0,
							name,
							objectId,
							cardId,
							flags,
							lotNumber,
							totalQuantity,
							processName,
							lotTemplateId,
							...rest
						} = card

						const isSelected = getIsSelected(cardId, stationId)
						const isDragging = draggingLotId === cardId
						const isHovering = hoveringLotId === cardId

						const isLastSelected = getIsLastSelected(cardId)

						// const isSelected = (draggingLotId !== null) ? () : ()
						const selectable = (hoveringLotId !== null) || (draggingLotId !== null) || isSelectedCardsNotEmpty

						return(
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
										lotId={cardId}
										binId={stationId}
										onClick={(e)=> {
											const payload = getBetweenSelected(cardId)
											onCardClick(
												e,
												{
													lotId: cardId,
													processId: processId,
													binId: stationId
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
						)
					})}

				</Container>
			</styled.BodyContainer>

		)
	}

	if(isCollapsed) {
		return(
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
		return(
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