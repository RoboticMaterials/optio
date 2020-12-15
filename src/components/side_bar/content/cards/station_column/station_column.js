import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {putCard} from "../../../../../redux/actions/card_actions";
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

	const [isCollapsed, setCollapsed] = useState(false)
	const [dragEnter, setDragEnter] = useState(false)
	const [dragLeave, setDragLeave] = useState(false)

	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onSetCardDragging = async (isDragging) => await dispatch(setCardDragging(isDragging))
	const onSetColumnHovering = async (isHoveringOverColumn) => await dispatch(setColumnHovering(isHoveringOverColumn))


	const handleDrop = (dropResult) => {
		console.log("handleDrop dropResult", dropResult)
		console.log("handleDrop id", id)
		const { removedIndex, addedIndex, payload, element } = dropResult;

		if (payload === null) { //  No new button, only reorder
			//     const shiftedButtonsCopy = arrayMove(buttonsCopy, removedIndex, addedIndex)
			//     formikProps.setFieldValue("buttons", shiftedButtonsCopy)

		} else {
			if(addedIndex !== null) {
				console.log("posting payload", payload)
				onPutCard({...payload, station_id: station_id, route_id: route_id, process_id: processId}, payload._id)
			}
		}
	}

	const renderCards = () => {
		return(
			<styled.BodyContainer
				dragEnter={dragEnter}
				onMouseEnter={()=>onSetColumnHovering(true)}
				onTouchStart={()=>onSetCardDragging(true)}
				onScroll={()=>console.log("scroll")}
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
							console.log("card",card)
							const {
								_id,
								count = 0,
								name,
								object_id
							} = card

							const objectName = objects[object_id] ? objects[object_id].name : null

							return(
								<Card
									name={name}
									objectName={objectName}
									count={count}
									id={index}
									index={index}
									onClick={()=>handleCardClick(_id)}
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