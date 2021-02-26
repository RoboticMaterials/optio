import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {deleteCard, putCard} from "../../../../../../redux/actions/card_actions";
import * as styled from "./column.style";
import {Container} from "react-smooth-dnd";
import Card from "../../lot/lot";
import React, {useState} from "react";
import {setCardDragging, setColumnHovering} from "../../../../../../redux/actions/card_page_actions";
import {generateBinId, sortBy} from "../../../../../../methods/utils/card_utils";


// const animationDuration = 500
const Column = ((props) => {

	const {
		station_id,
		stationName = "Unnamed",
		handleCardClick,
		cards,
		processId,
		HeaderContent,
		isCollapsed,
		maxWidth,
		maxHeight,
		sortMode
	} = props

	if(sortMode) {
		sortBy(cards, sortMode)
	}

	const objects = useSelector(state => { return state.objectsReducer.objects })
	const reduxCards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || {}

	const [dragEnter, setDragEnter] = useState(false)

	const dispatch = useDispatch()
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchSetCardDragging = async (lotId, binId) => await dispatch(setCardDragging(lotId, binId))

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

	const handleDrop = async (dropResult) => {
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

				await dispatchSetCardDragging(cardId, binId)

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

							await onPutCard({
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
							const a = await onPutCard({
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

				await dispatchSetCardDragging(null, null)
			}
		}

	}

	const renderCards = () => {
		return(
			<styled.BodyContainer
				dragEnter={dragEnter}
			>
				<div onTouchEndCapture={null}></div>
				<Container
					onDrop={async (DropResult)=> {
						await handleDrop(DropResult)
						setDragEnter(false)
					}}
					shouldAcceptDrop={shouldAcceptDrop}
					getGhostParent={()=>document.body}
					onDragStart={(dragStartParams, b, c)=>{}}
					onDragEnd={(dragEndParams)=>{}}
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
								_id,
								count = 0,
								name,
								object_id,
								cardId,
								start_date,
								end_date,
								flags
							} = card

							// const lotName = lots[lot_id] ? lots[lot_id].name : null
							const objectName = objects[object_id] ? objects[object_id].name : null

							return(
								<Card
									key={cardId}
									name={name}
									start_date={start_date}
									end_date={end_date}
									objectName={objectName}
									count={count}
									id={cardId}
									flags={flags || []}
									index={index}
									onClick={()=>handleCardClick(cardId, processId, station_id)}
									containerStyle={{marginBottom: "0.5rem"}}
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