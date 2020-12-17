import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {putCard} from "../../../../../redux/actions/card_actions";
import * as styled from "./lot_queue.style";
import {Container} from "react-smooth-dnd";
import Card from "../card/card";
import React, {useState} from "react";
import {setCardDragging, setColumnHovering} from "../../../../../redux/actions/card_page_actions";
import Button from "../../../../basic/button/button";
import CalendarField from "../../../../basic/form/calendar_field/calendar_field";
import PropTypes from 'prop-types';

const LotQueue = SortableContainer((props) => {
	const {
		id,
		station_id = "QUEUE",
		stationName = "Unnamed",
		route_id = "QUEUE",
		handleCardClick,
		cards,
		size,
		processId,
		setShowCardEditor,
		showCardEditor
	} = props

	const width = size?.width
	const height = size?.height


	const dispatch = useDispatch()
	const station = useSelector(state => { return state.locationsReducer.stations[station_id] })
	const route = useSelector(state => { return state.tasksReducer.tasks[route_id] })
	const objects = useSelector(state => { return state.objectsReducer.objects })
	const lots = useSelector(state => { return state.lotsReducer.lots })

	const [isCollapsed, setCollapsed] = useState(false)
	const [dragEnter, setDragEnter] = useState(false)
	const [dragLeave, setDragLeave] = useState(false)

	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onSetCardDragging = async (isDragging) => await dispatch(setCardDragging(isDragging))
	const onSetColumnHovering = async (isHoveringOverColumn) => await dispatch(setColumnHovering(isHoveringOverColumn))


	const handleDrop = (dropResult) => {
		const { removedIndex, addedIndex, payload, element } = dropResult;

		if (payload === null) { //  No new button, only reorder
			//     const shiftedButtonsCopy = arrayMove(buttonsCopy, removedIndex, addedIndex)
			//     formikProps.setFieldValue("buttons", shiftedButtonsCopy)

		} else {
			if(addedIndex !== null) {
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

							const objectName = objects[object_id] ? objects[object_id].name : null
							const lotName = lots[lot_id] ? lots[lot_id].name : null

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
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<Button
							onClick={()=> {
								handleCardClick(null, processId)
								setShowCardEditor(!showCardEditor)

							}}
							schema={'processes'}
						>
							+ Card
						</Button>
				</styled.StationHeader>

				{renderCards()}


			</styled.StationContainer>
		)
	}

})

// Specifies propTypes
LotQueue.propTypes = {
	stationName: PropTypes.string,
	handleCardClick: PropTypes.func,
	// cards: [],
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
};

// Specifies the default values for props:
LotQueue.defaultProps = {
	stationName: "Unnamed",
	handleCardClick: ()=>{},
	cards: [],
	setShowCardEditor: ()=>{},
	showCardEditor: false
};

export default LotQueue