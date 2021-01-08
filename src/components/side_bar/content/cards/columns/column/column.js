import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {deleteCard, putCard} from "../../../../../../redux/actions/card_actions";
import * as styled from "./column.style";
import {Container} from "react-smooth-dnd";
import Card from "../../card/card";
import React, {useState} from "react";
import {setCardDragging, setColumnHovering} from "../../../../../../redux/actions/card_page_actions";
import {generateBinId} from "../../../../../../methods/utils/card_utils";


const Column = SortableContainer((props) => {
	const {
		station_id,
		stationName = "Unnamed",
		handleCardClick,
		cards = [],
		processId,
		HeaderContent,
		isCollapsed,
		maxWidth,
		maxHeight

	} = props



	const dispatch = useDispatch()

	const objects = useSelector(state => { return state.objectsReducer.objects })
	const reduxCards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || {}


	const [dragEnter, setDragEnter] = useState(false)
	const [dragLeave, setDragLeave] = useState(false)

	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
	// const onSetCardDragging = async (isDragging) => await dispatch(setCardDragging(isDragging))
	// const onSetColumnHovering = async (isHoveringOverColumn) => await dispatch(setColumnHovering(isHoveringOverColumn))

	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		const {
			binId,
			cardId,
			process_id: oldProcessId,
			...remainingPayload
		} = payload

		if(oldProcessId !== processId) return false
		// if(binId === station_id) return false
		return true
	}

	const handleDrop = (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult;

		if (payload === null) { //  No new button, only reorder

		} else {
			if(addedIndex !== null) {
				const {
					binId,
					cardId,
					count,
					// process_id: oldProcessId,
					...remainingPayload
				} = payload

				if(!(binId === station_id)) {


					const droppedCard = reduxCards[cardId] ? reduxCards[cardId] : {}

					const oldBins = droppedCard.bins ? droppedCard.bins : {}
					const {
						[binId]: movedBin,
						...remainingOldBins
					} = oldBins || {}


					if(movedBin) {
						// already contains items in bin
						if(oldBins[station_id] && movedBin) {

							const oldCount = parseInt(oldBins[station_id]?.count || 0)
							const movedCount = parseInt(movedBin?.count || 0)

							onPutCard({
								...remainingPayload,
								bins: {
									...remainingOldBins,
									[station_id]: {
										...oldBins[station_id],
										count:  oldCount + movedCount
									}
								}
							}, cardId)
						}

						// no items in bin
						else {
							onPutCard({
								...remainingPayload,
								bins: {
									...remainingOldBins,
									[station_id]: {
										...movedBin,
									}
								}
							}, cardId)
						}
					}
				}
			}
		}
	}

	const renderCards = () => {
		return(
			<styled.BodyContainer
				dragEnter={dragEnter}
				// onMouseEnter={()=>onSetColumnHovering(true)}
				// onTouchStart={()=>onSetCardDragging(true)}
				// onScroll={()=>console.log("scroll")}
				// onMouseLeave={()=>onSetColumnHovering(false)}
				// onTouchEnd={()=>onSetCardDragging(false)}
			>
				<div onTouchEndCapture={null}></div>
				<Container
					onDrop={(DropResult)=> {
						handleDrop(DropResult)
						setDragEnter(false)
					}}
					shouldAcceptDrop={shouldAcceptDrop}
					getGhostParent={()=>document.body}
					// onDragStart={()=>onSetCardDragging(true)}
					// onDragEnd={()=>onSetCardDragging(false)}
					onDragEnter={()=>setDragEnter(true)}
					onDragLeave={()=>setDragEnter(false)}
					onDropReady={()=>{}}
					groupName="process-cards"
					getChildPayload={index =>
						cards[index]
					}
					style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				>
						{cards.map((card, index) => {
							const {
								_id,
								count = 0,
								name,
								object_id,
								cardId
							} = card

							// const lotName = lots[lot_id] ? lots[lot_id].name : null
							const objectName = objects[object_id] ? objects[object_id].name : null

							return(
								<Card
									name={name}
									objectName={objectName}
									count={count}
									id={index}
									index={index}
									onClick={()=>handleCardClick(cardId, processId, station_id)}
								/>
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
				{HeaderContent}

				<styled.BodyContainer>
					<styled.RotatedRouteName>{stationName}</styled.RotatedRouteName>
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
				{HeaderContent}

				{renderCards()}
			</styled.StationContainer>
		)
	}

})

export default Column