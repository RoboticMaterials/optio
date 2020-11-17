import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {putCard} from "../../../../../redux/actions/card_actions";
import * as styled from "./station_column.style";
import {Container} from "react-smooth-dnd";
import Card from "../card/card";
import React, {useState} from "react";


const StationsColumn = SortableContainer((props) => {
	const {
		id,
		station_id,
		route_id,
		handleCardClick,
		cards
	} = props

	const dispatch = useDispatch()
	const station = useSelector(state => { return state.locationsReducer.stations[station_id] })
	const route = useSelector(state => { return state.tasksReducer.tasks[route_id] })
	const [isCollapsed, setCollapsed] = useState(false)
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

	const {
		name
	} = station

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
				onPutCard({...payload, station_id: station_id, route_id: route_id}, payload._id)
			}
		}
	}

	const renderCards = () => {
		return(
				<Container
					onDrop={(DropResult)=> {
						handleDrop(DropResult)
					}}
					groupName="process-cards"
					getChildPayload={index =>
						cards[index]
					}
					style={{background: "purple", flex: 1}}
				>
					{cards.map((card, index) => {
						console.log("card",card)
						const {
							_id
						} = card

						return(
							<Card
								name={card.name}
								id={index}
								index={index}
								onClick={()=>handleCardClick(_id)}
							/>
						)
					})}
				</Container>

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

				<styled.RotatedRouteName>{name}</styled.RotatedRouteName>

			</styled.StationContainer>
		)
	}

	else {
		return(
			<styled.StationContainer isCollapsed={isCollapsed}>
				<styled.StationHeader>
					<i className="fa fa-chevron-down" aria-hidden="true"
					   onClick={() => setCollapsed(true)}
					/>

					<styled.TitleContainer>
						<styled.LabelContainer>
							<styled.LabelTitle>Route</styled.LabelTitle>
							<styled.LabelValue>{route.name}</styled.LabelValue>
						</styled.LabelContainer>

						<styled.LabelContainer>
							<styled.LabelTitle>Station</styled.LabelTitle>
							<styled.LabelValue>{name}</styled.LabelValue>
						</styled.LabelContainer>
					</styled.TitleContainer>

					<styled.StationButton>
						<i className="fas fa-ellipsis-h"></i>
					</styled.StationButton>
				</styled.StationHeader>

				{renderCards()}


			</styled.StationContainer>
		)
	}

})

export default StationsColumn