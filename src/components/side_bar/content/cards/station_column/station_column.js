import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {deleteCard, putCard} from "../../../../../redux/actions/card_actions";
import * as styled from "./station_column.style";
import {Container} from "react-smooth-dnd";
import Card from "../card/card";
import React, {useState} from "react";
import {setCardDragging, setColumnHovering} from "../../../../../redux/actions/card_page_actions";


const StationsColumn = SortableContainer((props) => {
	const {
		id,
		station_id,
		stationName = "Unnamed",
		route_id,
		handleCardClick,
		cards = [],
		size,
		processId
	} = props

	const width = size?.width
	const height = size?.height


	const dispatch = useDispatch()
	const station = useSelector(state => { return state.locationsReducer.stations[station_id] })
	const route = useSelector(state => { return state.tasksReducer.tasks[route_id] })
	const objects = useSelector(state => { return state.objectsReducer.objects })
	const reduxCards = useSelector(state => { return state.cardsReducer.cards })
	const lots = useSelector(state => { return state.lotsReducer.lots })

	const [isCollapsed, setCollapsed] = useState(false)
	const [dragEnter, setDragEnter] = useState(false)
	const [dragLeave, setDragLeave] = useState(false)

	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const dispatchDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
	const onSetCardDragging = async (isDragging) => await dispatch(setCardDragging(isDragging))
	const onSetColumnHovering = async (isHoveringOverColumn) => await dispatch(setColumnHovering(isHoveringOverColumn))


	const handleDrop = (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult;

		if (payload === null) { //  No new button, only reorder
			//     const shiftedButtonsCopy = arrayMove(buttonsCopy, removedIndex, addedIndex)
			//     formikProps.setFieldValue("buttons", shiftedButtonsCopy)

		} else {
			if(addedIndex !== null) {

				var destinationCardId = null
				Object.values(reduxCards).forEach((currCard, cardIndex) => {

					// card is in same lot
					if(currCard.lot_id === payload.lot_id) {

						// card exists at the station / route combo. update instead of create
						if((currCard.route_id === route_id) && (currCard.station_id === station_id)) {
							destinationCardId = currCard._id
						}
					}
				})

				if(destinationCardId) {
					const destinationCard = reduxCards[destinationCardId]
					dispatchDeleteCard(destinationCardId, processId)

					onPutCard({
						...payload,
						count: parseInt(destinationCard.count) + parseInt(payload.count),
						station_id: station_id,
						route_id: route_id,
						process_id: processId
					}, payload._id)
				}

				else {
					onPutCard({
						...payload,
						station_id: station_id,
						route_id: route_id,
						process_id: processId
					}, payload._id)

				}





			}
		}
	}

	const renderCards = () => {
		return(
			<styled.BodyContainer
				dragEnter={dragEnter}
				onMouseEnter={()=>onSetColumnHovering(true)}
				onTouchStart={()=>onSetCardDragging(true)}
				// onScroll={()=>console.log("scroll")}
				onMouseLeave={()=>onSetColumnHovering(false)}
				onTouchEnd={()=>onSetCardDragging(false)}
			>
				<div onTouchEndCapture={null}></div>
				<Container
					onDrop={(DropResult)=> {
						handleDrop(DropResult)
						setDragEnter(false)
					}}
					getGhostParent={()=>document.body}
					onDragStart={()=>onSetCardDragging(true)}
					onDragEnd={()=>onSetCardDragging(false)}
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
								lot_id
							} = card

							const lotName = lots[lot_id] ? lots[lot_id].name : null
							const objectName = objects[object_id] ? objects[object_id].name : null

							return(
								<Card
									lotId={lot_id}
									lotName={lotName}
									name={name}
									objectName={objectName}
									count={count}
									id={index}
									index={index}
									onClick={()=>handleCardClick(_id, processId)}
								/>
							)
						})}

				</Container>
			</styled.BodyContainer>

		)
	}

	if(isCollapsed) {
		return(
			<styled.StationContainer isCollapsed={isCollapsed}>
				<styled.StationHeader>
					<i className="fa fa-chevron-right" aria-hidden="true"
					   onClick={() => setCollapsed(false)}
					/>
				</styled.StationHeader>

				<styled.BodyContainer>
					<styled.RotatedRouteName>{stationName}</styled.RotatedRouteName>
				</styled.BodyContainer>
			</styled.StationContainer>
		)
	}

	else {
		return(
			<styled.StationContainer height={height} isCollapsed={isCollapsed}>
				<styled.StationHeader>
						<i className="fa fa-chevron-down" aria-hidden="true"
						   onClick={() => setCollapsed(true)}
						/>



						<styled.LabelContainer>
							<styled.StationLabel>Station</styled.StationLabel>
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<i className="fas fa-ellipsis-h"></i>
				</styled.StationHeader>

				{renderCards()}


			</styled.StationContainer>
		)
	}

})

export default StationsColumn