import React, {useState, useEffect} from "react";

// external functions
import PropTypes from "prop-types";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";

// internal components
import CalendarField from "../../../../basic/form/calendar_field/calendar_field";
import TextField from "../../../../basic/form/text_field/text_field";
import Textbox from "../../../../basic/textbox/textbox";
import DropDownSearchField from "../../../../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../../../../basic/button/button";
import ButtonGroup from "../../../../basic/button_group/button_group";

// actions
import {deleteCard, getCard, postCard, putCard} from "../../../../../redux/actions/card_actions";
import {getCardHistory} from "../../../../../redux/actions/card_history_actions";

// constants
import {FORM_MODES} from "../../../../../constants/scheduler_constants";

// utils
import {parseMessageFromEvent} from "../../../../../methods/utils/card_utils";
import {cardSchema} from "../../../../../methods/utils/form_schemas";

// import styles
import * as styled from "./card_editor.style"

// logger
import log from '../../../../../logger'

const logger = log.getLogger("CardEditor")
logger.setLevel("debug")

const CONTENT = {
	HISTORY: "HISTORY",
	CALENDAR_START: "CALENDAR_START",
	CALENDAR_END: "CALENDAR_END",
	CALENDAR_RANGE: "CALENDAR_RANGE",
	MOVE: "MOVE"
}

// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = {}


const CardEditor = (props) => {
	const {
		isOpen,
		close,
		cardId,
		processId,
		binId
	} = props

	// extract redux state
	const cards = useSelector(state => { return state.cardsReducer.cards })

	const card = cards[cardId]
	const {
		bins
	} = card || {}

	const availableBins = bins ? Object.keys(bins) : ["QUEUE"]

	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.locationsReducer.stations })

	// define actions
	const dispatch = useDispatch()
	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))

	// define component state
	const [cardDataInterval, setCardDataInterval] = useState(null)
	const [calendarValue, setCalendarValue] = useState(null)
	const [showTimePicker, setShowTimePicker] = useState(false)




	const handleGetCard = async (cardId) => {
		if(cardId) {
			const result = await onGetCard(cardId)
			if(result) {
				setFormMode(FORM_MODES.UPDATE)
				setShowLotInfo(false)
			}
			else {

			}
		}
		setCardDataInterval(setInterval(()=>onGetCard(cardId),5000))
	}
	useEffect( () => {
		clearInterval(cardDataInterval)
		handleGetCard(cardId)

	}, [cardId])

	useEffect( () => {
		setSelectedBin(binId)
	}, [binId])

	// const formMode = card ? FORM_MODES.UPDATE : FORM_MODES.CREATE

	const [content, setContent] = useState(null)
	const [selectedBin, setSelectedBin] = useState(binId)
	const [formMode, setFormMode] = useState(FORM_MODES.CREATE)
	const [showLotInfo, setShowLotInfo] = useState(formMode === FORM_MODES.CREATE)

	const selectedBinName = stations[selectedBin] ? stations[selectedBin].name : "Queue"



	useEffect(() => {

		if(!isOpen && content) setContent(null)
		if(showTimePicker) setShowTimePicker(false)

		return () => {
		}
	}, [isOpen])

	const handleSubmit = async (values, formMode) => {

		const {
			name,
			bins,
			description,
			moveCount,
			moveLocation
		} = values


		const start = values?.dates?.start || null
		const end = values?.dates?.end || null

		// update (PUT)
		if(formMode === FORM_MODES.UPDATE) {


			var submitItem = {
				name,
				bins,
				description,
				process_id: card.process_id,
				start_date: start,
				end_date: end,
			}


			// moving card need to update count for correct bins
			if(moveCount && moveLocation) {

				/*
				* if lot items are being moved to a different bin, the submitItem's bins key needs to be updated
				* namely, the count field for the destination and origin bins needs to updated
				*
				* The destination bin's count should be incremented by the number of items being moved
				* The current bin's count should be decremented by the number of items being moved
				*
				* */

				// get count and location info for move from form values
				const moveCountVal = moveCount[0].value
				const {
					name: moveName,
					_id: destinationBinId,
				} = moveLocation[0]

				// extract destination, current, and remaining bins
				const {
					[destinationBinId]: destinationBin,
					[selectedBin]: currentBin,
					...unalteredBins
				} = bins

				// update counts of current and destination bins
				const currentBinCount = parseInt(currentBin ? currentBin.count : 0) - moveCountVal
				const destinationBinCount = parseInt(destinationBin ? destinationBin.count : 0) + moveCountVal

				// update bins
				var updatedBins

				if(currentBinCount) {
					// both the current bin and the destination bin have items, so update both lots and spread the remaining

					updatedBins = {
						...unalteredBins, 			// spread remaining bins
						[destinationBinId]: {		// update destination bin's count, keep remaining attributes
							...destinationBin,
							count: destinationBinCount
						},
						[selectedBin]: {			// update current bin's count, keep remaining attributes
							...currentBin,
							count: currentBinCount
						}
					}
				}

				else {
					// if currentBinCount is 0, the bin no longer has any items associated with the lot, so remove it
					updatedBins = {
						...unalteredBins,
						[destinationBinId]: {
							...destinationBin,
							count: destinationBinCount
						}
					}
				}

				// update submit items bins
				submitItem = {
					...submitItem,
					bins: updatedBins
				}

				// update card
				onPutCard(submitItem, cardId)
			}

			// no lot item move, so just normal update
			else {
				onPutCard(submitItem, cardId)
			}
		}

		// create (POST)
		else {

			const submitItem = {
				name,
				bins,
				description,
				process_id: processId,
				start_date: start,
				end_date: end,
			}

			onPostCard(submitItem)
		}


	}

	return(
		<styled.Container
			isOpen={isOpen}
			onRequestClose={close}
			contentLabel="Lot Editor Form"
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
					description: card ? card.description : "",
					bins: card && card.bins ?
						card.bins
						:
						{
							"QUEUE": {
								count: 0
							},
						},
					dates: card ? {
						start: card.start_date,
						end: card.end_date,
					} : null,
					count: card ? card.count : 0,
					// object: (card && card.object_id) ?  [objects[card.object_id]] : []
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
					// close()
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
					// const touchedReducer = (accumulator, currentValue) => (currentValue === true) ? accumulator + 1 : accumulator
					// const touchedCount = Object.values(touched).reduce(touchedReducer, 0)
					const touchedCount = Object.values(touched).length
					const submitDisabled = (errorCount > 0) || (touchedCount === 0) || isSubmitting

					const onDeleteClick = async () => {

						const {
							[selectedBin]: currentBin,
							...remainingBins
						} = bins

						var submitItem = {
							...card,
							bins: {...remainingBins},
						}

						onPutCard(submitItem, cardId)
						close()
					}

					const renderMove = () => {
						const binCount = values.bins[selectedBin].count

						var list = [];
						for (var i = 0; i <= binCount; i++) {
							list.push({
								value: i
							});
						}

						const moveLocationOptions = [{name: "Queue", _id: "QUEUE"},...Object.values(stations).filter((currStation) => currStation._id !== selectedBin)]

						return(
							<styled.BodyContainer
								minHeight={"20rem"}
							>
								<div>
									<styled.ContentHeader style={{}}>
										<styled.ContentTitle>Move lot</styled.ContentTitle>
									</styled.ContentHeader>
									<div style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}>
										<styled.InfoText>Move</styled.InfoText>
										<DropDownSearchField
											containerSyle={{marginRight: "1rem"}}
											pattern={null}
											name="moveCount"
											labelField={'value'}
											options={list}
											valueField={"value"}
										/>
										<styled.InfoText>items</styled.InfoText>
									</div>

									<div style={{ display: "flex", alignItems: "center"}}>
										<styled.InfoText>from</styled.InfoText>
										<styled.InfoText schema={"lots"} highlight={true}>{selectedBinName}</styled.InfoText>
										<styled.InfoText>To</styled.InfoText>
										<DropDownSearchField
											containerSyle={{minWidth: "10rem"}}
											pattern={null}
											name="moveLocation"
											labelField={'name'}
											options={moveLocationOptions}
											valueField={"_id"}
										/>
									</div>
								</div>




								<Button
									style={buttonStyle}
									onClick={()=> {
										formikProps.submitForm()
										close()
									}}
									schema={"lots"}
								>
									Ok
								</Button>
							</styled.BodyContainer>
						)
					}

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
									style={buttonStyle}
									onClick={()=>setContent(null)}
									schema={"lots"}
								>
									Ok
								</Button>
							</styled.BodyContainer>
						)
					}

					const renderContent = () => {
						return(
							<styled.BodyContainer>
								<styled.FieldTitle>Station</styled.FieldTitle>

								<ButtonGroup
									buttonViewCss={styled.buttonViewCss}
									buttons={
										availableBins.map((currBinId) => {
											if(currBinId === "QUEUE") return "Queue"
											if(stations[currBinId]) return stations[currBinId].name
											return ""
										})
									}
									selectedIndex={availableBins.findIndex((ele) => ele === selectedBin)}
									onPress={(selectedIndex)=>{
										setSelectedBin(availableBins[selectedIndex])
									}}
									containerCss={styled.buttonGroupContainerCss}
									buttonViewSelectedCss={styled.buttonViewSelectedCss}
									buttonCss={styled.buttonCss}
								/>

								<styled.RowContainer>
									<styled.ObjectInfoContainer>
										<styled.ObjectTitleContainer>
											<styled.ObjectLabel>Count</styled.ObjectLabel>

											<TextField
												name={`bins.${selectedBin}.count`}
												type="number"
												InputComponent={styled.CountInput}
											/>
										</styled.ObjectTitleContainer>
									</styled.ObjectInfoContainer>
								</styled.RowContainer>

								{formMode === FORM_MODES.UPDATE &&
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
								</styled.WidgetContainer>
								}



								{formMode === FORM_MODES.CREATE ?
									<styled.ButtonContainer>
										<Button
											schema={'lots'}
											disabled={submitDisabled}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
												close()
											}}
										>
											Add
										</Button>

										<Button
											schema={'lots'}
											disabled={submitDisabled}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm()
												formikProps.resetForm()
											}}
										>
											Add & Next
										</Button>

										<Button
											schema={'lots'}
											disabled={submitDisabled}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
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
											schema={'lots'}
											disabled={submitDisabled}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
											secondary
											onClick={async () => {
												await formikProps.submitForm({close: false})
											}}
										>
											Save
										</Button>

										<Button
											schema={'lots'}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
											secondary
											type={"button"}
											onClick={onDeleteClick}
										>
											<i className="fa fa-trash" aria-hidden="true"/>

											Delete
										</Button>
										<Button
											schema={'lots'}
											style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
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
									schema={'lots'}
									style={buttonStyle}
								>
									<styled.Icon className="fas fa-arrow-left"></styled.Icon>
								</Button>
								}

								<styled.Title>
									{formMode === FORM_MODES.CREATE ?
										"Create Lot"
										:
										"Edit Lot"
									}
								</styled.Title>

								<Button
									onClick={close}
									schema={'lots'}
									style={buttonStyle}
								>
									<i className="fa fa-times" aria-hidden="true"/>
								</Button>
							</styled.Header>

							<styled.SectionContainer>
								{formMode === FORM_MODES.UPDATE &&
								<styled.ContentHeader>
									<styled.ContentTitle>Lot Info</styled.ContentTitle>
								</styled.ContentHeader>
								}

								<styled.NameContainer>
									<TextField
										name="name"
										type="text"
										placeholder="Enter name..."
										InputComponent={Textbox}
									/>
								</styled.NameContainer>

								{((content === null)) &&
								<>
									{showLotInfo &&
									<>
										<styled.NameContainer>
											<TextField
												name="description"
												type="text"
												placeholder="Description..."
												InputComponent={Textbox}
												lines={5}
											/>
										</styled.NameContainer>

										<styled.DatesContainer>
											<styled.DateItem onClick={()=>setContent(CONTENT.CALENDAR_START)}>
												<styled.DateText>{startDateText}</styled.DateText>
											</styled.DateItem>

											<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

											<styled.DateItem onClick={()=>setContent(CONTENT.CALENDAR_END)}>
												<styled.DateText>{endDateText}</styled.DateText>
											</styled.DateItem>
										</styled.DatesContainer>
									</>
									}


									{formMode === FORM_MODES.UPDATE &&
									<Button
										secondary
										style={{...buttonStyle, margin: "0 0 1rem 0", width: "fit-content"}}
										type={"button"}
										onClick={()=>setShowLotInfo(!showLotInfo)}
										schema={"lots"}
									>
										{showLotInfo ? "Hide Lot Details" : "Show Lot Details"}
									</Button>
									}

								</>

								}


							</styled.SectionContainer>

							{(content === null) &&
							renderContent()
							}
							{(((content === CONTENT.CALENDAR_END) || (content === CONTENT.CALENDAR_START))) &&
							renderCalendar()
							}
							{(content === CONTENT.HISTORY) &&
							renderHistory()
							}
							{(content === CONTENT.MOVE) &&
							renderMove()
							}



						</styled.StyledForm>
					)
				}}
			</Formik>

		</styled.Container>
	)
}

// Specifies propTypes
CardEditor.propTypes = {
	binId: PropTypes.string,
};

// Specifies the default values for props:
CardEditor.defaultProps = {
	binId: "QUEUE"
};

export default CardEditor