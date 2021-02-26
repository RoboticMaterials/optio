import React, {useState} from "react";

// actions
import {deleteCard, putCard} from "../../../../../../redux/actions/card_actions";
import {
	setDroppingLotId,
	setColumnHovering,
	setLotHovering,
	setDraggingLotId
} from "../../../../../../redux/actions/card_page_actions";

// components external
import { Draggable } from 'react-smooth-dnd';
import {Container} from "react-smooth-dnd";

// components internal
import Lot from "../../lot/lot";

// functions external
import {useDispatch, useSelector} from "react-redux";

// styles
import * as styled from "./column.style";
import {getLotTemplateData} from "../../../../../../methods/utils/lot_utils";


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

	// if(sortMode) {
	// 	sortBy(cards, sortMode)
	// }

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

	const onMouseEnter = (event, lotId) => {
		dispatchSetLotHovering(lotId)
	}

	const onMouseLeave = (event) => {
		dispatchSetLotHovering(null)
	}


	const handleDrop = async (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult;

		if (payload === null) { //  No new button, only reorder
			return
		} else {
			if(addedIndex !== null) {
				const {
					binId,
					cardId,
					count,
					// process_id: oldProcessId,
					...remainingPayload
				} = payload

				await dispatchSetDroppingLotId(cardId, binId)

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

							await dispatchPutCard({
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
				{/*<div onTouchEndCapture={null}></div>*/}
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
								_id,
								count = 0,
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
							console.log("card",card)

							const templateValues = getLotTemplateData(lotTemplateId, card)

							// const lotName = lots[lot_id] ? lots[lot_id].name : null
							const objectName = objects[object_id] ? objects[object_id].name : null

							const isSelected = (draggingLotId !== null) ? (draggingLotId === cardId) : (hoveringLotId === cardId)
							const selectable = (hoveringLotId !== null) || (draggingLotId !== null)

							return(
								<Draggable
									key={cardId}
									onMouseEnter={(event) => onMouseEnter(event, cardId)}
									onMouseLeave={onMouseLeave}
								>
								<Lot
									enableFlagSelector={true}
									templateValues={templateValues}
									selectable={selectable}
									isSelected={isSelected}
									key={cardId}
									processName={processName}
									totalQuantity={totalQuantity}
									lotNumber={lotNumber}
									name={name}
									objectName={objectName}
									count={count}
									id={cardId}
									flags={flags || []}
									index={index}
									onClick={()=>handleCardClick(cardId, processId, station_id)}
									containerStyle={{marginBottom: "0.5rem"}}
								/>
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
				{HeaderContent}

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
				{HeaderContent}

				{renderCards()}
			</styled.StationContainer>
		)
	}

})

export default Column