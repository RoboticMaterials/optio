import React, {useState, useEffect} from "react";

// external functions
import PropTypes from "prop-types";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import FadeLoader from "react-spinners/FadeLoader"

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
import {CARD_SCHEMA_MODES, cardSchema, getCardSchema} from "../../../../../methods/utils/form_schemas";
import {getProcessStations} from "../../../../../methods/utils/processes_utils";
import {isEmpty, isObject} from "../../../../../methods/utils/object_utils";

// import styles
import * as styled from "./card_editor.style"
import * as FormStyle from "./lot_form_creator/lot_form_creator.style"

// logger
import log from '../../../../../logger'
import ErrorTooltip from "../../../../basic/form/error_tooltip/error_tooltip";
import ScrollingButtonField from "../../../../basic/form/scrolling_buttons_field/scrolling_buttons_field";
import NumberField from "../../../../basic/form/number_field/number_field";
import ContainerWrapper from "../../../../basic/container_wrapper/container_wrapper";
import DropContainer from "./drop_container/drop_container";
import FieldComponentMapper from "./field_component_mapper/field_component_mapper";
import {isArray} from "../../../../../methods/utils/array_utils";
import {getLotTemplates, setSelectedLotTemplate} from "../../../../../redux/actions/lot_template_actions";
import {arraysEqual} from "../../../../../methods/utils/utils";
import TemplateSelectorSidebar from "./lot_sidebars/template_selector_sidebar/template_selector_sidebar";
import {
	BASIC_LOT_TEMPLATE,
	BASIC_LOT_TEMPLATE_ID,
	CONTENT, FIELD_COMPONENT_NAMES,
	FORM_BUTTON_TYPES
} from "../../../../../constants/lot_contants";
import {BASIC_FIELD_DEFAULTS} from "../../../../../constants/form_constants";

const logger = log.getLogger("CardEditor")
logger.setLevel("debug")





const SubmitErrorHandler = ({ submitCount, isValid, onSubmitError }) => {
	const [lastHandled, setLastHandled] = useState(0);
	useEffect(() => {
		if (submitCount > lastHandled && !isValid) {
			onSubmitError();
			setLastHandled(submitCount);
		}
	}, [submitCount, isValid, onSubmitError, lastHandled]);

	return null;
};

const FormComponent = (props) => {

	const {
		formMode,
		getInitialValues,
		lotTemplate,
		lotTemplateId,
		setShowCardFormEditor,
		bins,
		binId,
		setBinId,
		cardId,
		close,
		isOpen,
		onDeleteClick,
		processId,
		errors,
		values,
		touched,
		isSubmitting,
		submitCount,
		setFieldValue,
		submitForm,
		formikProps,
		processOptions,
		showProcessSelector,
		content,
		setContent,
		setValues,
		loaded

	} = props


	// actions
	const dispatch = useDispatch()
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))

	// redux state
	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] })
	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.stationsReducer.stations })
	const processes = useSelector(state => { return state.processesReducer.processes }) || {}
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

	// component state
	const [showLotInfo, setShowLotInfo] = useState(true)
	const [calendarFieldName, setCalendarFieldName] = useState(null)
	const [showTemplateSelector, setShowTemplateSelector] = useState(formMode === FORM_MODES.CREATE)
	const [fieldNameArr, setFieldNameArr] = useState([]) // if cardId was passed, update existing. Otherwise create new

	// derived state
	const selectedBinName = stations[binId] ?
		stations[binId].name :
		binId === "QUEUE" ? "Queue" : "Finished"

	const processStationIds = getProcessStations(currentProcess, routes) // get object with all station's belonging to the current process as keys
	const availableBins = !isEmpty(bins) ? Object.keys(bins) : ["QUEUE"]

	const startDateText = ((values?.dates?.start?.month + 1) && values?.dates?.start?.day && values?.dates?.start?.year) ?  (values.dates.start.month + 1) + "/" + values.dates.start.day + "/" + values.dates.start.year : "Planned start"
	const endDateText = ((values?.dates?.end?.month + 1) && values?.dates?.end?.day && values?.dates?.end?.year) ?  (values.dates?.end.month + 1) + "/" + values.dates?.end.day + "/" + values.dates?.end.year : "Planned end"

	const errorCount = Object.keys(errors).length > 0 // get number of field errors
	const touchedCount = Object.values(touched).length // number of touched fields
	const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting) && (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

	useEffect( () => {
		// formikProps.resetForm()
		const {
			[lotTemplateId]: templateValues
		} = values || {}

		if(!templateValues) setFieldValue(lotTemplateId, getInitialValues(lotTemplate))

	}, [lotTemplateId])

	useEffect( () => {
		const {
			[lotTemplateId]: templateValues
		} = values || {}

		if(!templateValues) setFieldValue(lotTemplateId, getInitialValues(lotTemplate))

	}, [fieldNameArr])

	useEffect(() => {
		const {
			fields
		} = lotTemplate || {}

		if(isArray(fields)) {

			let newFieldNameArr = []
			fields.forEach((currRow) => {
				currRow.forEach((currItem) => {
					const {
						fieldName,
						component
					} = currItem || {}

					newFieldNameArr.push(fieldName)
				})
			})

			if(!arraysEqual(fieldNameArr, newFieldNameArr)) {
				setFieldNameArr(newFieldNameArr)
			}
		}
	}, [lotTemplate])

	/*
	*
	* */
	const getButtonGroupOptions = () => {
		var buttonGroupNames = []
		var buttonGroupIds = []
		availableBins.forEach((currBinId) =>{
			if(stations[currBinId]) {
				buttonGroupNames.push(stations[currBinId].name)
				buttonGroupIds.push(currBinId)
			}
		})
		if(bins["QUEUE"]) {
			buttonGroupNames.unshift("Queue")
			buttonGroupIds.unshift("QUEUE")
		}
		if(bins["FINISH"]) {
			buttonGroupNames.push("Finished")
			buttonGroupIds.push("FINISH")
		}

		return [buttonGroupNames, buttonGroupIds]
	}

	const [buttonGroupNames, buttonGroupIds] = getButtonGroupOptions()

	/*
	* handles when enter key is pressed
	*
	* This effect attaches an event listener to the keydown event
	* The listener effect listens for 'Enter' and 'NumpadEnter' events
	* If either of these events occur, the form will be submitted
	* */
	useEffect(() => {
		// keydown event listener
		const listener = event => {

			// check if event code corresponds to enter
			if (event.code === "Enter" || event.code === "NumpadEnter" || event.code === 13 || event.key === "Enter") {
				// prevent default actions
				event.preventDefault()
				event.stopPropagation()


				if(formMode === FORM_MODES.UPDATE) {
					// if the form mode is set to UPDATE, the default action of enter should be to save the lot
					// this is done by setting buttonType to SAVE and submitting the form

					switch(content){
						case CONTENT.MOVE:
							setFieldValue("buttonType", FORM_BUTTON_TYPES.MOVE_OK)
							submitForm()
							break
						default:
							setFieldValue("buttonType", FORM_BUTTON_TYPES.SAVE)
							submitForm()
							break
					}
				}
				else {
					// if the form mode is set to CREATE (the only option other than UPDATE), the default action of the enter key should be to add the lot
					// this is done by setting buttonType to ADD and submitting the form
					setFieldValue("buttonType", FORM_BUTTON_TYPES.ADD)
					submitForm()
				}

			}
		};

		// add event listener to 'keydown'
		document.addEventListener("keydown", listener);

		// on dismount remove the event listener
		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [])

	useEffect(() => {

		if(!isOpen && content) setContent(null)

		return () => {
		}
	}, [isOpen])

	/*
	* Renders content for moving some or all of a lot from one bin to another
	* */
	const renderMoveContent = () => {

		// get destination options for move
		// the destination options include
		const destinationOptions = [...Object.values(stations).filter((currStation) => {
			if((currStation._id !== binId) && processStationIds[currStation._id]) return true
		})]
		if(binId !== "QUEUE") destinationOptions.unshift({name: "Queue", _id: "QUEUE"})
		if(binId !== "FINISH") destinationOptions.push({name: "Finished", _id: "FINISH"})

		const maxValue = bins[binId]?.count || 0

		return(
			<styled.BodyContainer
				minHeight={"20rem"}
			>
				<div>
					<styled.ContentHeader style={{flexDirection: "column"}}>
						<styled.ContentTitle>Move lot</styled.ContentTitle>
						<div>
							<styled.InfoText style={{marginRight: "1rem"}}>Current Station</styled.InfoText>
							<styled.InfoText schema={"lots"} highlight={true}>{selectedBinName}</styled.InfoText>
						</div>
					</styled.ContentHeader>
					<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem"}}>
						<styled.InfoText>Select Quantity to Move</styled.InfoText>
						<styled.InfoText style={{marginBottom: "1rem"}}>{maxValue} Items Available</styled.InfoText>

						<NumberField
							maxValue={maxValue}
							minValue={0}
							name={"moveCount"}
						/>
					</div>

					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem"}}>
						<styled.InfoText style={{marginBottom: "1rem"}}>Select Lot Destination</styled.InfoText>

						<DropDownSearchField
							containerSyle={{minWidth: "35%"}}
							pattern={null}
							name="moveLocation"
							labelField={'name'}
							options={destinationOptions}
							valueField={"_id"}
						/>
					</div>
				</div>
			</styled.BodyContainer>
		)
	}

	const renderCalendarContent = () => {
		return(
			<styled.BodyContainer>
				<styled.ContentHeader style={{}}>
					<styled.ContentTitle>Select Start and End Date</styled.ContentTitle>
					<div></div>
				</styled.ContentHeader>

				<styled.CalendarContainer>
					<CalendarField
						name={calendarFieldName}
					/>
				</styled.CalendarContainer>
			</styled.BodyContainer>
		)
	}

	const renderMainContent = () => {
		return(
			<>
				<styled.SectionContainer>
			<styled.TheBody>
				{mapContainers(isArray(lotTemplate?.fields) ? lotTemplate.fields : [], true)}
			</styled.TheBody>
				</styled.SectionContainer>
			<styled.BodyContainer>
				{formMode === FORM_MODES.UPDATE &&
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginBottom: "2rem",
					}}
				>
					<styled.FieldTitle>Station</styled.FieldTitle>

					<ButtonGroup
						buttonViewCss={styled.buttonViewCss}
						buttons={buttonGroupNames}
						selectedIndex={buttonGroupIds.findIndex((ele) => ele === binId)}
						onPress={(selectedIndex)=>{
							setBinId(buttonGroupIds[selectedIndex])
							// setFieldValue("selectedBin", buttonGroupIds[selectedIndex])
							// setSelectedBin(availableBins[selectedIndex])
						}}
						containerCss={styled.buttonGroupContainerCss}
						buttonViewSelectedCss={styled.buttonViewSelectedCss}
						buttonCss={styled.buttonCss}
					/>
				</div>
				}

				<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
					<styled.ObjectInfoContainer>
							<styled.ObjectLabel>Quantity</styled.ObjectLabel>
							<NumberField
								minValue={0}
								name={`bins.${binId}.count`}
							/>
					</styled.ObjectInfoContainer>
				</div>

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
			</styled.BodyContainer>
			</>
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

						var {
							bins,
							...modifiedData
						} = data

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

						let messages = parseMessageFromEvent(name, username, modifiedData)

						// handle bins change
						// if(Object.keys(modifiedData).includes("bins")) {
						// 	const {
						// 		bins: {
						// 			new: newBins,
						// 			old: oldBins
						// 		},
						// 		...rest
						// 	} = modifiedData
						//
						// 	var oldVals = {}
						// 	var newVals = {}
						// 	Object.entries(newBins).forEach((currEntry) => {
						// 		const currKey = currEntry[0]
						// 		const currValue = currEntry[1]
						//
						// 		if(oldBins[currKey]) {
						// 			if(oldBins[currKey].count !== newBins[currKey].count) {
						// 				messages.push(`Changed count in ${currKey} from ${oldBins[currKey].count} to ${newBins[currKey].count}`)
						// 			}
						//
						// 			// oldVals[stations[currKey].name] = oldBins[currKey].count
						// 			// newVals[stations[currKey].name] = newBins[currKey].count
						//
						// 		}
						// 		else {
						// 			messages.push(`Set count to ${newBins[currKey].count} in ${currKey} `)
						// 			// entries[modifiedData]
						// 			// modifiedData = {
						// 			// 	...rest, "bins": {
						// 			// 		new: stations[newStationId] ? stations[newStationId].name : "",
						// 			// 		old: stations[oldStationId] ? stations[oldStationId].name : "",
						// 			// 	}
						// 			// }
						// 		}
						// 	})
						//
						// }

						if(messages.length === 0) return null

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

	const mapContainers = (items, mode) => {

		return (
			<FormStyle.ColumnContainer>

				{items.map((currRow, currRowIndex) => {

					const isLastRow = currRowIndex === items.length - 1
					return <div
						style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
						key={currRowIndex}
					>

						<FormStyle.RowContainer>

							{currRow.map((currItem, currItemIndex) => {
								const {
									_id: dropContainerId,
									component,
									fieldName
								} = currItem || {}



								const isLastItem = currItemIndex === currRow.length - 1
								const indexPattern = [currRowIndex, currItemIndex]
								const isOnlyItem = currRow.length === 1

								const templateFieldName = `${lotTemplateId}.${fieldName}`

								const {
									[lotTemplateId]: templateValues
								} = values || {}

								const {
									[fieldName]: fieldValue
								} = templateValues || {}

								return <div style={{
									margin: "1rem",
									flex: 1,
									alignSelf: "center",
									justifyContent: "center",
									display: "flex"
								}}
								>
									<FieldComponentMapper
										value={fieldValue}
										onCalendarClick={() => {
											setContent(CONTENT.CALENDAR_START)
											setCalendarFieldName(templateFieldName)
										}}
										containerStyle={{



											// alignItems: "center"
										}}
										displayName={fieldName}
										preview={false}
										component={component}
										fieldName={templateFieldName}
									/>
								</div>
							})}

						</FormStyle.RowContainer>
					</div>
				})}
			</FormStyle.ColumnContainer>
		)
	}

	const renderProcessSelector = () => {

		return(
			<styled.ProcessFieldContainer>
				<styled.ContentHeader>
					<styled.ContentTitle>Select Process</styled.ContentTitle>
				</styled.ContentHeader>

				<ScrollingButtonField
					name={"processId"}
					valueKey={"value"}
					labelKey={"label"}
					options={
						processOptions.map((currProcessId, currIndex) => {
							const currProcess = processes[currProcessId] || {}
							const {
								name: currProcessName = ""
							} = currProcess

							return (
								{
									label: currProcessName,
									value: currProcessId
								}
							)
						})
					}
				/>
			</styled.ProcessFieldContainer>
		)
	}

	if(loaded) {
		return(
			<styled.StyledForm>
				<SubmitErrorHandler
					submitCount={submitCount}
					isValid={formikProps.isValid}
					onSubmitError={() => {}}
					formik={formikProps}
				/>
				<styled.Header>
					{((content === CONTENT.CALENDAR_START) || (content === CONTENT.CALENDAR_END) || (content === CONTENT.HISTORY) || (content === CONTENT.MOVE))  &&
					<Button
						onClick={()=>setContent(null)}
						schema={'error'}
						// secondary
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
						secondary
						onClick={close}
						schema={'error'}
					>
						<i className="fa fa-times" aria-hidden="true"/>
					</Button>
				</styled.Header>

				<styled.RowContainer style={{flex: 1, alignItems: "stretch", overflow: "hidden"}}>
					{(showTemplateSelector) &&
					<TemplateSelectorSidebar
						showFields={false}
						onTemplateEditClick={() => {
							setShowCardFormEditor(true)
						}}
						selectedLotTemplatesId={lotTemplateId}

					/>
					}

				<styled.SuperContainer>

					{/*<styled.SectionContainer>*/}


						{showProcessSelector && renderProcessSelector()}

						<styled.FieldsHeader>
							<styled.NameContainer>

								<styled.LotName>Lot Name</styled.LotName>
								<TextField
									name="name"
									type="text"
									placeholder="Enter name..."
									InputComponent={Textbox}
								/>
							</styled.NameContainer>
						</styled.FieldsHeader>


					{/*</styled.SectionContainer>*/}

					{(content === null) &&
					renderMainContent()
					}
					{(((content === CONTENT.CALENDAR_END) || (content === CONTENT.CALENDAR_START))) &&
					renderCalendarContent()
					}
					{(content === CONTENT.HISTORY) &&
					renderHistory()
					}
					{(content === CONTENT.MOVE) &&
					renderMoveContent()
					}

				</styled.SuperContainer>
				</styled.RowContainer>

				{/* render buttons for appropriate content */}
				{
					{
						"CALENDAR_START":
							<styled.ButtonContainer style={{width: "100%"}}>
								<Button
									style={{...buttonStyle, width: "8rem"}}
									onClick={()=>setContent(null)}
									schema={"ok"}
									secondary
								>
									Ok
								</Button>
								<Button
									style={buttonStyle}
									onClick={()=>setContent(null)}
									schema={"error"}
								>
									Cancel
								</Button>
							</styled.ButtonContainer>,
						"HISTORY":
							<styled.ButtonContainer>
								<Button
									style={{...buttonStyle}}
									onClick={()=>setContent(null)}
									schema={"error"}
									// secondary
								>
									Go Back
								</Button>
							</styled.ButtonContainer>,
						"MOVE":
							<styled.ButtonContainer>
								<Button
									disabled={submitDisabled}
									style={{...buttonStyle, width: "8rem"}}
									type={"button"}
									onClick={()=> {
										setFieldValue("buttonType", FORM_BUTTON_TYPES.MOVE_OK)
										submitForm()
									}}
									schema={"ok"}
									secondary
								>
									Ok
								</Button>
								<Button
									type={"button"}
									style={buttonStyle}
									onClick={()=>setContent(null)}
									schema={"error"}
									// secondary
								>
									Cancel
								</Button>
							</styled.ButtonContainer>
					}[content] ||
					<styled.ButtonContainer>

						{/*<Button*/}
						{/*	schema={'lots'}*/}
						{/*	type={"button"}*/}
						{/*	style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}*/}
						{/*	secondary*/}
						{/*	onClick={async () => {*/}
						{/*		setShowCardFormEditor(true)*/}
						{/*		dispatchSetSelectedLotTemplate(lotTemplateId)*/}
						
						{/*		// close()*/}
						{/*	}}*/}
						{/*>*/}
						{/*	Edit Template*/}
						{/*</Button>*/}
						<Button
							schema={'lots'}
							type={"button"}
							style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
							secondary
							onClick={async () => {
								setShowTemplateSelector(!showTemplateSelector)
								dispatchSetSelectedLotTemplate(lotTemplateId)

								// close()
							}}
						>
							{showTemplateSelector ? "Hide Templates" : "Show Templates"}
						</Button>
						{formMode === FORM_MODES.CREATE ?
							<>
								<Button
									schema={'lots'}
									type={"button"}
									disabled={submitDisabled}
									style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
									secondary
									onClick={async () => {
										setFieldValue("buttonType", FORM_BUTTON_TYPES.ADD)
										submitForm()

									}}
								>
									Add
								</Button>

								<Button
									schema={'lots'}
									type={"button"}
									disabled={submitDisabled}
									style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
									secondary
									onClick={async () => {
										setFieldValue("buttonType", FORM_BUTTON_TYPES.ADD_AND_NEXT)
										submitForm()
									}}
								>
									Add & Next
								</Button>
							</>
							:
							<>
								<Button
									schema={'lots'}
									type={"button"}
									disabled={submitDisabled}
									style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
									secondary
									onClick={async () => {
										setFieldValue("buttonType", FORM_BUTTON_TYPES.SAVE)
										submitForm()
									}}
								>
									Save
								</Button>

								<Button
									schema={'lots'}
									style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
									secondary
									type={"button"}
									onClick={() => onDeleteClick(binId)}
								>
									<i style={{marginRight: ".5rem"}} className="fa fa-trash" aria-hidden="true"/>

									Delete
								</Button>
								<Button
									schema={'lots'}
									type={"button"}
									style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
									secondary
									onClick={async () => {
										setContent(CONTENT.MOVE)
									}}
								>
									Move
								</Button>
							</>
						}
					</styled.ButtonContainer>
				}
			</styled.StyledForm>
		)
	}
	else {
		return(
			<FadeLoader
				css={styled.FadeLoaderCSS}
				height={5}
				width={3}
				loading={true}
			/>
		)
	}

			}



// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = {marginBottom: '0rem', marginTop: 0}


const CardEditor = (props) => {
	const {
		isOpen,
		close,
		processId,
		processOptions,
		showProcessSelector,
		setShowCardFormEditor,
	} = props

	// redux state
	const cards = useSelector(state => { return state.cardsReducer.cards })
	const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})
	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}


	// actions
	const dispatch = useDispatch()
	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
	const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))




	// component state
	const [cardDataInterval, setCardDataInterval] = useState(null)

	const [cardId, setCardId] = useState(props.cardId) //cardId and binId are stored as internal state but initialized from props (if provided)
	const [binId, setBinId] = useState(props.binId)
	const [content, setContent] = useState(null)
	const [loaded, setLoaded] = useState(false)
	const [formMode, setFormMode] = useState(props.cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new


	// get card object from redux by cardId
	const card = cards[cardId] || null
	let lotTemplateId = selectedLotTemplatesId
	if(!lotTemplateId && isObject(card) && card?.lotTemplateId) {
		lotTemplateId = card?.lotTemplateId
	}
	if(!lotTemplateId) lotTemplateId = BASIC_LOT_TEMPLATE_ID
	let lotTemplate = lotTemplates[lotTemplateId]  || BASIC_LOT_TEMPLATE
	if(!lotTemplates[lotTemplateId]) {
		lotTemplateId = BASIC_LOT_TEMPLATE_ID
		lotTemplate = BASIC_LOT_TEMPLATE
	}

	// extract card attributes
	const {
		bins = {}
	} = card || {}

	/*
	*
	* */
	const handleDeleteClick = async (selectedBin) => {
		const {
			[selectedBin]: currentBin,
			...remainingBins
		} = bins

		var submitItem = {
			...card,
			bins: {...remainingBins},
		}

		// if there are no remaining bins, delete the card
		if(isEmpty(remainingBins)) {
			onDeleteCard(cardId, processId)
		}

		// otherwise update the card to contain only the remaining bins
		else {
			const result = await onPutCard(submitItem, cardId)
		}

		close()
	}

	/*
	*
	* */
	const handleGetCard = async (cardId) => {
		if(cardId) {
			const result = await onGetCard(cardId)
		}
		// if(!loaded) {
		// 	setLoaded(true)
		// }
	}

	/*
	*
	* */
	useEffect( () => {
		handleGetCard(cardId)
		var timer = setInterval(()=> {
			handleGetCard(cardId)
			dispatchGetLotTemplates()
		},5000)

		return () => {
			clearInterval(timer)
		}

	}, [cardId])

	/*
	* if card exists, set form mode to update
	* */
	useEffect( () => {

		// editing existing card
		if(cardId) {
			if(card) {

				// if card has template, template and card must be loaded
				if(card?.lotTemplateId) {
					if(lotTemplate && !loaded) {
						setLoaded(true)
					}
				}

				// No template, only need card to set loaded
				else if(!loaded) {
					setLoaded(true) // if card already exists, set loaded to true
				}
			}

		}

		// creating new, set loaded to true
		else {
			if(!loaded) setLoaded(true)
		}

	}, [card, lotTemplate, lotTemplateId])

	useEffect( () => {
		dispatchGetLotTemplates()
		dispatchSetSelectedLotTemplate(null)

		return () => {
			close()
		}

	}, [])

	/*
	*
	* */
	const handleSubmit = async (values, formMode) => {

		const {
			name,
			changed,
			new: isNew,
			bins,
			moveCount,
			moveLocation,
			processId: selectedProcessId,
			[lotTemplateId]: templateValues,
		} = values || {}

		const start = values?.dates?.start || null
		const end = values?.dates?.end || null

		if(content === CONTENT.MOVE) {
			// moving card need to update count for correct bins
			if(moveCount && moveLocation) {

				var submitItem = {
					name,
					bins,
					process_id: card.process_id,
					start_date: start,
					end_date: end,
					lotTemplateId,
					...templateValues
				}

				/*
				* if lot items are being moved to a different bin, the submitItem's bins key needs to be updated
				* namely, the count field for the destination and origin bins needs to updated
				*
				* The destination bin's count should be incremented by the number of items being moved
				* The current bin's count should be decremented by the number of items being moved
				*
				* */

				// get count and location info for move from form values
				const {
					name: moveName,
					_id: destinationBinId,
				} = moveLocation[0]

				// extract destination, current, and remaining bins
				const {
					[destinationBinId]: destinationBin,
					[binId]: currentBin,
					...unalteredBins
				} = bins

				// update counts of current and destination bins
				const currentBinCount = parseInt(currentBin ? currentBin.count : 0) - moveCount
				const destinationBinCount = parseInt(destinationBin ? destinationBin.count : 0) + moveCount

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
						[binId]: {			// update current bin's count, keep remaining attributes
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
		}

		else {
			// update (PUT)
			if(formMode === FORM_MODES.UPDATE) {

				var submitItem = {
					name,
					bins,
					process_id: card.process_id,
					start_date: start,
					end_date: end,
					lotTemplateId,
					...templateValues
				}

				onPutCard(submitItem, cardId)
			}

			// create (POST)
			else {

				const submitItem = {
					name,
					bins,
					process_id: processId ? processId : selectedProcessId,
					start_date: start,
					end_date: end,
					lotTemplateId,
					...templateValues
				}

				const postResult = await onPostCard(submitItem)

				if(!(postResult instanceof Error)) {

				}
				else {
					console.error("postResult",postResult)
				}

			}
		}


	}

	/*
	* extracts initial values from the current lot and maps them to the template parameter
	* */
	const getInitialValues = (lotTemplate) => {

		let initialValues = {} // initialize to empty object

		// make sure lotTemplate is object to avoid errors
		// make sure lotTemplate.fields is array
		if(isObject(lotTemplate) && isArray(lotTemplate.fields)) {


			// loop through rows in column
			lotTemplate.fields.forEach((currRow, currRowIndex) => {

				// loop through items in row
				currRow.forEach((currItem, currItemIndex) => {

					// extract properties of currItem
					const {
						fieldName,
						_id: fieldId,
						component,
						key
					} = currItem || {}

					// set initialValue for current item
					// name of value is given by fieldName
					// if card already has a value, use it. Otherwise, use appropriate default value for field type
					switch(component) {
						case FIELD_COMPONENT_NAMES.TEXT_BOX: {
							initialValues[fieldName] = isObject(card) ? (card[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD) : BASIC_FIELD_DEFAULTS.TEXT_FIELD
							break;
						}

						case FIELD_COMPONENT_NAMES.TEXT_BOX_BIG: {
							initialValues[fieldName] = isObject(card) ? (card[fieldName] || BASIC_FIELD_DEFAULTS.TEXT_FIELD) : BASIC_FIELD_DEFAULTS.TEXT_FIELD
							break;
						}

						case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
							initialValues[fieldName] = isObject(card) ? (card[fieldName] || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD) : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD
							break;
						}

						case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
							let updatedValues = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD

							if(isObject(card) && isArray(card[fieldName])) {
								const val = card[fieldName]
								if(val.length > 0) {
									updatedValues = [new Date(val[0])]
								}
								if(val.length > 1) {
									updatedValues.push(new Date(val[1]))
								}
							}
							initialValues[fieldName] = updatedValues
							break;
						}

						case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
							initialValues[fieldName] = isObject(card) ? (card[fieldName] || BASIC_FIELD_DEFAULTS.NUMBER_FIELD) : BASIC_FIELD_DEFAULTS.NUMBER_FIELD
							break;
						}
					}
				})
			})
		}
		else {

		}

		return initialValues
	}

	// only return form if required data has loaded
	if(loaded) {
		return(
			<styled.Container
				isOpen={isOpen}
				onRequestClose={()=> {
					close()

				}}
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
						processId: processId,
						moveCount: 0,
						moveLocation: [],
						name: card ? card.name : "",
						bins: card && card.bins ?
							card.bins
							:
							{
								"QUEUE": {
									count: 0
								},
							},
						[lotTemplateId]: {
							...getInitialValues(lotTemplate)
						}

					}}

					// validation control
					validationSchema={getCardSchema((content === CONTENT.MOVE) ? CARD_SCHEMA_MODES.MOVE_LOT : CARD_SCHEMA_MODES.EDIT_LOT, bins[binId]?.count ? bins[binId].count : 0)}
					validateOnChange={true}
					validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
					validateOnBlur={true}

					// enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
					onSubmit={async (values, { setSubmitting, setTouched, resetForm }) => {
						// set submitting to true, handle submit, then set submitting to false
						// the submitting property is useful for eg. displaying a loading indicator
						const {
							buttonType
						} = values

						setSubmitting(true)
						await handleSubmit(values, formMode)
						setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
						setSubmitting(false)

						switch(buttonType) {
							case FORM_BUTTON_TYPES.ADD:
								resetForm()
								close()
								break
							case FORM_BUTTON_TYPES.MOVE_OK:
								resetForm()
								close()
								break
							case FORM_BUTTON_TYPES.ADD_AND_NEXT:
								resetForm()
								break
							case FORM_BUTTON_TYPES.SAVE:
								close()
								break
							default:
								break
						}

					}}
				>
					{formikProps => {

						// extract formik props
						const {
							errors,
							values,
							touched,
							isSubmitting,
							submitCount,
							setFieldValue,
							submitForm
						} = formikProps

						return (
							<FormComponent
								getInitialValues={getInitialValues}
								lotTemplate={lotTemplate}
								lotTemplateId={lotTemplateId}
								setShowCardFormEditor={setShowCardFormEditor}
								loaded={loaded}
								processId={processId}
								close={close}
								formMode={formMode}
								formikProps={formikProps}
								card={card}
								bins={bins}
								binId={binId}
								setBinId={setBinId}
								cardId={cardId}
								isOpen={isOpen}
								onDeleteClick={handleDeleteClick}
								errors={errors}
								values={values}
								touched={touched}
								isSubmitting={isSubmitting}
								submitCount={submitCount}
								setFieldValue={setFieldValue}
								submitForm={submitForm}
								formikProps={formikProps}
								processOptions={processOptions}
								showProcessSelector={showProcessSelector}
								content={content}
								setContent={setContent}
							/>
						)
					}}
				</Formik>
			</styled.Container>
		)
	}

	// if not done loading data, show loader icon
	else {
		return (
			<FadeLoader
				css={styled.FadeLoaderCSS}
				height={5}
				width={3}
				loading={true}
			/>
		)
	}


}

// Specifies propTypes
CardEditor.propTypes = {
	binId: PropTypes.string,
		showProcessSelector: PropTypes.bool,
};

// Specifies the default values for props:
CardEditor.defaultProps = {
	binId: "QUEUE",
		showProcessSelector: false
};

export default CardEditor