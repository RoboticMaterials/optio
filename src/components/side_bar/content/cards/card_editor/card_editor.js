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

import Calendar from 'react-calendar';

// logger
import log from '../../../../../logger'
import {deleteCard, getCard, postCard, putCard} from "../../../../../redux/actions/card_actions";
import {FORM_MODES} from "../../../../../constants/scheduler_constants";
import { TextField as Cal } from '@material-ui/core';
import {getCardHistory} from "../../../../../redux/actions/card_history_actions";
import {parseMessageFromEvent} from "../../../../../methods/utils/card_utils";

import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';

const logger = log.getLogger("CardEditor")

logger.setLevel("debug")

const CardEditor = (props) => {
	const {
		isOpen,
		onAfterOpen,
		close,
		cardId,

	} = props

	const processes = useSelector(state => { return state.processesReducer.processes })
	const processIds = Object.keys(processes)
	const card = useSelector(state => { return state.cardsReducer.cards[cardId] })
	const {
		station_id: stationId,
		process_id: processId = processIds[0],
		route_id: routeId
	} = card || {}
	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.locationsReducer.stations })

	console.log("processId",processId)

	const routeIds = processes[processId].routes

	const dispatch = useDispatch()
	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))

	const [cardDataInterval, setCardDataInterval] = useState(null)
	const [calendarValue, setCalendarValue] = useState(null)
	const [showCalendar, setShowCalendar] = useState(true)

	console.log("calendarValue",calendarValue)

	useEffect( () => {
		clearInterval(cardDataInterval)
		if(cardId) {
			onGetCard(cardId)
			setCardDataInterval(setInterval(()=>onGetCard(cardId),5000))
		}
	}, [cardId])

	let dropdownOptions = []
	routeIds.forEach((currRouteId) => {
		const matchingRoute = routes[currRouteId]
		let loadStationId = matchingRoute?.load?.station
		let unloadStationId = matchingRoute?.unload?.station

		loadStationId && dropdownOptions.push({
			name: "Route: " + matchingRoute.name + " - Station: " + stations[loadStationId]?.name,
			route_id: matchingRoute._id,
			station_id: loadStationId,
			_id: currRouteId + "+" + loadStationId
		})

		unloadStationId && dropdownOptions.push({
			name: "Route: " + matchingRoute.name + " - Station: " + stations[unloadStationId]?.name,
			route_id: matchingRoute._id,
			station_id: unloadStationId,
			_id: currRouteId + "+" + unloadStationId
		})

	})



	const [showHistory, setShowHistory] = useState(false)

	const formMode = card ? FORM_MODES.UPDATE : FORM_MODES.CREATE


	// let uniqueChars = [...new Set(stationIds)]
	// const stationsObj = useSelector(state => { return state.locationsReducer.locations })
	// let stations = uniqueChars.map((stationId) => {
	// 	return stationsObj[stationId]
	// })

	useEffect(() => {

		if(!isOpen && showHistory) setShowHistory(false)

	    return () => {
	    }
	}, [isOpen])




	// stations = Object.values().filter((location) => stationIds.includes(location._id) )

	const handleSubmit = (values, formMode) => {
		logger.log("cardEditor values", values)

		const {
			name,
			bin,
			description
		} = values

		// update (PUT)
		if(formMode === FORM_MODES.UPDATE) {
			const submitItem = {
				name,
				station_id: bin[0]?.station_id,
				route_id: bin[0]?.route_id,
				description,
				process_id: card.process_id
			}

			onPutCard(submitItem, card._id)
		}

		// create (POST)
		else {
			const submitItem = {
				name,
				station_id: bin[0]?.station_id,
				route_id: bin[0]?.route_id,
				description,
				process_id: processId
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
					zIndex: 500
				},
				content: {

				}
			}}
		>
			<Formik
				initialValues={{
					name: card ? card.name : "",
					bin: card ? dropdownOptions.filter((currOption) => (currOption.station_id === card.station_id) && (currOption.route_id === card.route_id)) : [dropdownOptions[0]],
					description: card ? card.description : "",
				}}

				// validation control
				validationSchema={cardSchema}
				validateOnChange={true}
				validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
				validateOnBlur={true}

				enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
				onSubmit={async (values, { setSubmitting, setTouched }) => {
					// set submitting to true, handle submit, then set submitting to false
					// the submitting property is useful for eg. displaying a loading indicator
					setSubmitting(true)
					await handleSubmit(values, formMode)
					setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
					setSubmitting(false)
				}}
			>
				{formikProps => {

					// extract common properties from formik
					const {errors, values, touched, isSubmitting} = formikProps

					logger.log("values",values)
					logger.log("touched",touched)
					logger.log("errors",errors)

					// get number of field errors
					const errorCount = Object.keys(errors).length > 0

					// get number of touched fields
					const touchedReducer = (accumulator, currentValue) => (currentValue === true) ? accumulator + 1 : accumulator
					const touchedCount = Object.values(touched).reduce(touchedReducer, 0)

					const submitDisabled = (errorCount > 0) || (touchedCount === 0) || isSubmitting

					const renderCalendar = () => {
						return(
							<styled.CalendarContainer>
								<styled.HistoryHeader>
									<span>Calendar</span>
								</styled.HistoryHeader>

								{/*<Calendar*/}
								{/*	onChange={setCalendarValue}*/}
								{/*	value={calendarValue}*/}
								{/*/>*/}

								<styled.WidgetContainer style={{marginTop: "1rem"}}>
									<styled.Icon
										className="fas fa-calendar-alt"
										color={"red"}
										onClick={()=>setShowCalendar(false)}
									/>
								</styled.WidgetContainer>
							</styled.CalendarContainer>
						)
					}

					const renderContent = () => {
						return(
							<>
								<TextField
									name="description"
									type="text"
									placeholder="Description..."
									InputComponent={Textbox}
									lines={5}
									ContentContainer={styled.InputContainer}
								/>

								<DropDownSearchField
									Container={styled.StationContainer}
									pattern={null}
									name="bin"
									labelField={'name'}
									options={dropdownOptions}
									valueField={"_id"}
									label={'Choose Station'}
									onDropdownOpen={() => {
									}}
								/>



								<styled.WidgetContainer>
									<styled.Icon
										className="fas fa-history"
										color={"red"}
										onClick={()=> {
											onGetCardHistory(cardId)
											setShowHistory(true)
										}}
									/>
									<styled.Icon color={"grey"} className="fas fa-thermometer-half"/>
									<styled.Icon color={"grey"} className="fas fa-heart"/>
									<styled.Icon
										className="fas fa-calendar-alt"
										color={"red"}
										onClick={()=>setShowCalendar(true)}
									/>

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
									</styled.ButtonContainer>
								}
							</>
						)
					}

					const renderHistory = () => {
						const {
							events = []
						} = cardHistory || {}

						console.log("cardHistory",cardHistory)

						return(
							<styled.HistoryContainer>
								<styled.HistoryHeader>
									<span>history</span>
									<styled.Icon
										className="fas fa-history"
										color={"red"}
										onClick={()=>setShowHistory(false)}
									/>
								</styled.HistoryHeader>

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
														new: stations[newStationId].name,
														old: stations[oldStationId].name,
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
														new: routes[newRouteId].name,
														old: routes[oldRouteId].name,
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
							</styled.HistoryContainer>
						)
					}

					return (
						<styled.StyledForm>
							<styled.Header>
								<styled.Title>Card Editor</styled.Title>
								<styled.CloseButton
									onClick={close}
								>
									<i className="fa fa-times" aria-hidden="true"/>
								</styled.CloseButton>
							</styled.Header>

							<styled.BodyContainer>
								<TextField
									name="name"
									type="text"
									placeholder="Enter name..."
									InputComponent={Textbox}
									ContentContainer={styled.InputContainer}
								/>
								{!showHistory ?
									!showCalendar ?
										renderContent()
										:
										renderCalendar()
									:
									renderHistory()
								}
							</styled.BodyContainer>


						</styled.StyledForm>
					)
				}}
			</Formik>

		</styled.Container>
	)
}

export default CardEditor