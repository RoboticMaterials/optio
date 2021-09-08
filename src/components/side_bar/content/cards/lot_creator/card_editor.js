import React, {useState, useEffect} from "react";

import * as styled from "./card_editor.style"
import {cardSchema} from "../../../../../methods/utils/form_schemas";
import TextField from "../../../../basic/form/text_field/text_field";
import Textbox from "../../../../basic/textbox/textbox";
import DropDownSearchField from "../../../../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../../../../basic/button/button";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid'


// logger
import log from '../../../../../logger'
import {deleteCard, getCard, postCard, putCard} from "../../../../../redux/actions/card_actions";
import {FORM_MODES} from "../../../../../constants/scheduler_constants";
import { TextField as Cal } from '@material-ui/core';
import {getCardHistory} from "../../../../../redux/actions/card_history_actions";
import {parseMessageFromEvent} from "../../../../../methods/utils/card_utils";
import TimePicker from "../../../../basic/timer_picker/timer_picker";
import Calendar from 'react-calendar'
import CalendarField from "../../../../basic/form/calendar_field/calendar_field";
import TimePickerField from "../../../../basic/form/time_picker_field/time_picker_field";
import CustomTimePickerField from "../../../../basic/form/custom_time_picker_field/custom_time_picker_field";
import {getLot, postLot, putLot} from "../../../../../redux/actions/lot_actions";

const logger = log.getLogger("CardEditor")

logger.setLevel("debug")

const CONTENT = {
	HISTORY: "HISTORY",
	CALENDAR_START: "CALENDAR_START",
	CALENDAR_END: "CALENDAR_END",
	CALENDAR_RANGE: "CALENDAR_RANGE",
	MOVE: "MOVE"

}

const CardEditor = (props) => {
	const {
		isOpen,
		onAfterOpen,
		close,
		cardId,
		processId
		// objectId

	} = props

	const object = {
		_id: 123,
		name: "hopper"
	}
	const {
		name: objectName
	} = object

	const processes = useSelector(state => { return state.processesReducer.processes })
	const processIds = Object.keys(processes)
	const cards = useSelector(state => { return state.cardsReducer.cards })
	const lots = useSelector(state => { return state.lotsReducer.lots })

	const card = cards[cardId]
	const {
		station_id: stationId,
		// process_id: processId = processIds[0],
		route_id: routeId,
		lot_id: lotId
	} = card || {}

	const lot = lots[lotId]



	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.locationsReducer.stations })

	const objects = useSelector(state => { return state.objectsReducer.objects })

	const routeIds = processes[processId] ? processes[processId].routes : []

	const dispatch = useDispatch()

	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

	const DispatchPostLot = async (lot) => await dispatch(postLot(lot))
	const DispatchPutLot = async (lot, lotId) => await dispatch(putLot(lot, lotId))
	const onGetLot = async (lotId) => await dispatch(getLot(lotId))

	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))

	const [cardDataInterval, setCardDataInterval] = useState(null)
	const [calendarValue, setCalendarValue] = useState(null)
	const [showTimePicker, setShowTimePicker] = useState(false)

	useEffect( () => {
		clearInterval(cardDataInterval)
		if(cardId) {
			onGetCard(cardId)
			setCardDataInterval(setInterval(()=>onGetCard(cardId),5000))
		}
	}, [cardId])

	const [content, setContent] = useState(null)

	const formMode = card ? FORM_MODES.UPDATE : FORM_MODES.CREATE

	useEffect(() => {

		if(!isOpen && content) setContent(null)
		if(showTimePicker) setShowTimePicker(false)

	    return () => {
	    }
	}, [isOpen])

	const handleSubmit = async (values, formMode) => {

		const {
			name,
			bin,
			description,
			count,
			object,
			moveCount,
			moveLocation
		} = values

		const start = values?.dates?.start || null
		const end = values?.dates?.end || null

		const objectId = (object && Array.isArray(object) && object.length > 0) ? object[0]._id : null


		// update (PUT)
		if(formMode === FORM_MODES.UPDATE) {

			// if(lotId) {
			// 	DispatchPutLot({
			// 		...lots[lotId],
			// 		name
			// 	}, lotId)
			// }



			var submitItem = {
				name,
				station_id: bin[0]?.station_id,
				route_id: bin[0]?.route_id,
				description,
				object_id: objectId,
				process_id: card.process_id,
				lot_id: card.lot_id,
				start_date: start,
				end_date: end,
				count,
			}



			if(moveCount && moveLocation) {

				const moveCountVal = moveCount[0].value
				const {
					name: moveName,
					route_id: moveRouteId,
					station_id: moveStationId,
					_id: moveId,
				} = moveLocation[0]


				var destinationCardId = null
				Object.values(cards).forEach((currCard, cardIndex) => {

					// lot is in same lot
					if(currCard.lot_id === card.lot_id) {

						// lot exists at the station / route combo. update instead of create
						if((currCard.route_id === moveRouteId) && (currCard.station_id === moveStationId)) {
							destinationCardId = currCard._id
						}
					}
				})

				submitItem.count = submitItem.count - moveCountVal

				// PUT destination lot
				if(destinationCardId) {
					const destinationItem = {
						...cards[destinationCardId],
						count: cards[destinationCardId].count + moveCountVal
					}

					onPutCard(destinationItem, destinationCardId)

				}

			 	// post destination lot
				else {
					onPostCard({
						name,
						count: moveCountVal,
						station_id: moveStationId,
						route_id: moveRouteId,
						description,
						object_id: objectId,
						process_id: processId,
						start_date: start,
						end_date: end,
						lot_id: lotId
					})
				}
			}



			// update
			// const submitItem = {
			// 	name,
			// 	station_id: bin[0]?.station_id,
			// 	route_id: bin[0]?.route_id,
			// 	description,
			// 	object_id: objectId,
			// 	process_id: lot.process_id,
			// 	lot_id: lot.lot_id,
			// 	start_date: start,
			// 	end_date: end,
			// 	count,
			// }

			onPutCard(submitItem, card._id)
		}

		// create (POST)
		else {
			const createdLot = await DispatchPostLot({
				process_id: processId,
				name
			})

			const {
				_id: lotId
			} = createdLot

			const submitItem = {
				name,
				count,
				station_id: "QUEUE",
				route_id: "QUEUE",
				description,
				object_id: objectId,
				process_id: processId,
				start_date: start,
				end_date: end,
				lot_id: lotId
			}

			onPostCard(submitItem)
		}


	}


	return(
		<styled.Container
			isOpen={isOpen}
			onRequestClose={close}
			contentLabel="Confirm Delete Modal"
			style={{
				overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)' 
                },
				content: {

				}
			}}
		>
			<Formik
				initialValues={{
					name: card ? card.name : "",
					bin: card ? dropdownOptions.filter((currOption) => (currOption.station_id === card.station_id) && (currOption.route_id === card.route_id)) : [dropdownOptions[0]],
					stationId: card ? dropdownOptions.filter((currOption) => (currOption.station_id === card.station_id) && (currOption.route_id === card.route_id)) : [dropdownOptions[0]],
					description: card ? card.description : "",
					dates: card ? {
						start: card.start_date,
						end: card.end_date,
					} : null,
					count: card ? card.count : 0,
					object: (card && card.object_id) ?  [objects[card.object_id]] : []
				}}

				// validation control
				validationSchema={cardSchema}
				validateOnChange={true}
				validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
				validateOnBlur={true}

				enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
				onSubmit={async (values, { setSubmitting, setTouched, resetForm }) => {
					// set submitting to true, handle submit, then set submitting to false
					// the submitting property is useful for eg. displaying a loading indicator
					setSubmitting(true)
					await handleSubmit(values, formMode)
					setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
					setSubmitting(false)
					resetForm()
				}}
			>
				{formikProps => {

					// extract common properties from formik
					const {errors, values, touched, isSubmitting, initialValues} = formikProps


					const startDateText = (values?.dates?.start?.month && values?.dates?.start?.day && values?.dates?.start?.year) ?  values.dates.start.month + "/" + values.dates.start.day + "/" + values.dates.start.year : "Planned start"
					// const startDateTime = (values?.startTime?.hours && values?.startTime?.minutes && values?.startTime?.seconds) ?  values.startTime.hours + ":" + values.startTime.minutes + ":" + values.startTime.seconds : "Start Time"

					const endDateText = (values?.dates?.end?.month && values?.dates?.end?.day && values?.dates?.end?.year) ?  values.dates?.end.month + "/" + values.dates?.end.day + "/" + values.dates?.end.year : "Planned end"
					// const endDateTime = (values?.endTime?.hours && values?.endTime?.minutes && values?.endTime?.seconds) ?  values.endTime.hours + ":" + values.endTime.minutes + ":" + values.endTime.seconds : "Start Time"

					// get number of field errors
					const errorCount = Object.keys(errors).length > 0

					// get number of touched fields
					const touchedReducer = (accumulator, currentValue) => (currentValue === true) ? accumulator + 1 : accumulator
					const touchedCount = Object.values(touched).reduce(touchedReducer, 0)

					const submitDisabled = (errorCount > 0) || (touchedCount === 0) || isSubmitting
					
					const renderCalendar = () => {
						return(
							<styled.BodyContainer>
								<styled.ContentHeader style={{}}>
									<styled.ContentTitle>Select Start and End Date</styled.ContentTitle>
									<div></div>
								</styled.ContentHeader>

								<styled.CalendarContainer>
									<CalendarField
										name={"dates"}
									/>
								</styled.CalendarContainer>

								<Button
									onClick={()=>setContent(null)}
									schema={"processes"}
								>
									Ok
								</Button>
							</styled.BodyContainer>
						)
					}

					const renderContent = () => {
						return(
							<styled.BodyContainer>
								{/*<div style={{display: "flex", marginBottom: "1rem"}}>*/}
									<TextField
										name="description"
										type="text"
										placeholder="Description..."
										InputComponent={Textbox}
										lines={5}
										style={{marginBottom: "1rem"}}
										// ContentContainer={styled.InputContainer}
									/>

									<styled.ObjectInfoContainer>
										{/*<styled.ObjectTitleContainer style={{marginBottom: "1rem"}}>*/}
											{/*<styled.ObjectLabel>Object</styled.ObjectLabel>*/}
											{/*<styled.ObjectName>{objectName}</styled.ObjectName>*/}
											<styled.ObjectLabel>Object</styled.ObjectLabel>
											<DropDownSearchField
												// Container={styled.StationContainer}
												containerSyle={{flex: 1}}
												// containerSyle={{flex: 1}}
												pattern={null}
												name="object"
												labelField={'name'}
												options={Object.values(objects)}
												valueField={"_id"}
												// label={'Choose Draggable'}
												onDropdownOpen={() => {
												}}
											/>
											<div style={{margin: "0 1rem"}}/>
										{/*</styled.ObjectTitleContainer>*/}

										<styled.ObjectTitleContainer>
											<styled.ObjectLabel>Count</styled.ObjectLabel>
											<TextField
												name="count"
												type="number"
												InputComponent={styled.CountInput}
											/>
										</styled.ObjectTitleContainer>
									</styled.ObjectInfoContainer>
								{/*</div>*/}

								<span>
									<styled.DatesContainer>
										<styled.DateItem onClick={()=>setContent(CONTENT.CALENDAR_START)}>
											<styled.DateText>{startDateText}</styled.DateText>
											{/*<styled.TimeText>{startDateTime}</styled.TimeText>*/}
										</styled.DateItem>

										<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

										<styled.DateItem onClick={()=>setContent(CONTENT.CALENDAR_END)}>
											<styled.DateText>{endDateText}</styled.DateText>
											{/*<styled.TimeText>{endDateTime}</styled.TimeText>*/}
										</styled.DateItem>
									</styled.DatesContainer>
								</span>


								{/*<DropDownSearchField*/}
								{/*	Container={styled.StationContainer}*/}
								{/*	pattern={null}*/}
								{/*	name="bin"*/}
								{/*	labelField={'name'}*/}
								{/*	options={dropdownOptions}*/}
								{/*	valueField={"_id"}*/}
								{/*	label={'Choose Draggable'}*/}
								{/*	onDropdownOpen={() => {*/}
								{/*	}}*/}
								{/*/>*/}



								<styled.WidgetContainer>
									<styled.Icon
										className="fas fa-history"
										color={"red"}
										onClick={()=> {
											if(content !== CONTENT.HISTORY) {
												onGetCardHistory(cardId)
												setContent(CONTENT.HISTORY)
											}
											else {
												setContent(null)
											}
										}}
									/>

									<styled.Icon color={"grey"} className="fas fa-thermometer-half"/>

									<styled.Icon color={"grey"} className="fas fa-heart"/>
								</styled.WidgetContainer>


								{formMode === FORM_MODES.CREATE ?
									<styled.ButtonContainer>
										<Button
											schema={'processes'}
											disabled={submitDisabled}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
												close()
											}}
										>
											Add
										</Button>

										<Button
											schema={'processes'}
											disabled={submitDisabled}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
												formikProps.resetForm()
											}}
										>
											Add & Next
										</Button>

										<Button
											schema={'processes'}
											disabled={submitDisabled}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
											}}
										>
											Add & Edit
										</Button>
									</styled.ButtonContainer>
									:
									<styled.ButtonContainer>
										<Button
											schema={'processes'}
											disabled={submitDisabled}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
											}}
										>
											Save
										</Button>

										<Button
											schema={'processes'}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											type={"button"}
											onClick={async () => {
												onDeleteCard(card._id, processId)
												close()
											}}
										>
											<i className="fa fa-trash" aria-hidden="true"/>

											Delete
										</Button>
										<Button
											schema={'processes'}
											style={{ marginBottom: '0rem', marginTop: 0 }}
											secondary
											type={"button"}
											onClick={async () => {
												setContent(CONTENT.MOVE)
											}}
										>
											Move
										</Button>
									</styled.ButtonContainer>
								}
							</styled.BodyContainer>
						)
					}

					const renderHistory = () => {
						const {
							events = []
						} = cardHistory || {}

						return(
							<styled.BodyContainer>
								<styled.ContentHeader style={{}}>
										<styled.ContentTitle>History</styled.ContentTitle>
								</styled.ContentHeader>


								<styled.HistoryBodyContainer>
									{events.map((currEvent) => {
										const {
											name,
											description,
											username,
											data,
											date: {$date: date}
										} = currEvent

										var jsDate = new Date(date);
										var currentDate = new Date();
										const diffTime = Math.abs(currentDate - jsDate);
										const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

										var modifiedData = data

										// maps id value changes to names (eg if station_id changed, replaces the station_ids with the corresponding station names)
										if(Object.keys(modifiedData).includes("station_id") || Object.keys(modifiedData).includes("route_id")) {

											// handle station_id change
											if(Object.keys(modifiedData).includes("station_id")) {
												const {
													station_id: {
														new: newStationId,
														old: oldStationId
													},
													...rest
												} = modifiedData

												modifiedData = {
													...rest, "station": {
														new: stations[newStationId] ? stations[newStationId].name : "",
														old: stations[oldStationId] ? stations[oldStationId].name : "",
													}
												}
											}

											// handle route_id change
											if(Object.keys(modifiedData).includes("route_id")) {
												const {
													route_id: {
														new: newRouteId,
														old: oldRouteId
													},
													...rest
												} = modifiedData

												modifiedData = {
													...rest, "route": {
														new: routes[newRouteId] ? routes[newRouteId].name : "",
														old: routes[oldRouteId] ? routes[oldRouteId].name : "",
													}
												}

											}
										}

										let messages = parseMessageFromEvent(name, username, modifiedData)

										return(
											<styled.HistoryItemContainer>
												<styled.HistoryUserContainer>
													<styled.HistoryUserText>{username}</styled.HistoryUserText>
												</styled.HistoryUserContainer>
												<styled.HistoryInfoContainer>
													{messages.map((currMessage) => {
														return(
															<styled.HistoryInfoText>
																{currMessage}
															</styled.HistoryInfoText>
														)
													})}
												</styled.HistoryInfoContainer>
												<styled.HistoryDateContainer>
													<styled.HistoryDateText>{jsDate.toLocaleString()}</styled.HistoryDateText>
												</styled.HistoryDateContainer>
											</styled.HistoryItemContainer>
										)
									})}
								</styled.HistoryBodyContainer>
							</styled.BodyContainer>
						)
					}

					return (
						<styled.StyledForm>
							<styled.Header>
								{((content === CONTENT.CALENDAR_START) || (content === CONTENT.CALENDAR_END) || (content === CONTENT.HISTORY))  &&
									<Button
										onClick={()=>setContent(null)}
										schema={'processes'}
									>
										<styled.Icon className="fas fa-arrow-left"></styled.Icon>
									</Button>
								}

								<styled.Title>
									Card Editor
									{(lot && lot.name) &&
										<span>{lot.name}</span>
									}
								</styled.Title>

								<Button
									onClick={close}
									schema={'processes'}
								>
									<i className="fa fa-times" aria-hidden="true"/>
								</Button>
							</styled.Header>

							<styled.NameContainer>
								<TextField
									name="name"
									type="text"
									placeholder="Enter name..."
									InputComponent={Textbox}
									// ContentContainer={styled.InputContainer}
								/>
							</styled.NameContainer>


							{(content === null) &&
								renderContent()
							}
							{(((content === CONTENT.CALENDAR_END) || (content === CONTENT.CALENDAR_START))) &&
								renderCalendar()
							}
							{(content === CONTENT.HISTORY) &&
								renderHistory()
							}
							{/* {(content === CONTENT.MOVE) &&
							renderMove()
							} */}



						</styled.StyledForm>
					)
				}}
			</Formik>

		</styled.Container>
	)
}

export default CardEditor