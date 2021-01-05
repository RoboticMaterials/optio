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
import {getProcessStations} from "../../../../../methods/utils/processes_utils";
import {isEmpty} from "../../../../../methods/utils/object_utils";

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

const FORM_BUTTON_TYPES = {
	SAVE: "SAVE",
	ADD: "ADD",
	ADD_AND_NEXT: "ADD_AND_NEXT",
	ADD_AND_EDIT: "ADD_AND_EDIT"
}

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
		bins,
		binId,
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
		showProcessSelector

	} = props

	console.log("processOptions",processOptions)

	const {
		selectedBin
	} = values

	// actions
	const dispatch = useDispatch()
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))

	// redux state
	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] })
	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.locationsReducer.stations })
	const processes = useSelector(state => { return state.processesReducer.processes }) || {}

	// component state
	const [content, setContent] = useState(null)
	const [showLotInfo, setShowLotInfo] = useState(true)

	// derived state
	const selectedBinName = stations[selectedBin] ? stations[selectedBin].name : "Queue"
	const processStationIds = getProcessStations(currentProcess, routes) // get object with all station's belonging to the current process as keys
	const availableBins = !isEmpty(bins) ? Object.keys(bins) : ["QUEUE"]

	const startDateText = (values?.dates?.start?.month && values?.dates?.start?.day && values?.dates?.start?.year) ?  values.dates.start.month + "/" + values.dates.start.day + "/" + values.dates.start.year : "Planned start"
	const endDateText = (values?.dates?.end?.month && values?.dates?.end?.day && values?.dates?.end?.year) ?  values.dates?.end.month + "/" + values.dates?.end.day + "/" + values.dates?.end.year : "Planned end"

	const errorCount = Object.keys(errors).length > 0 // get number of field errors
	const touchedCount = Object.values(touched).length // number of touched fields
	const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting) && (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

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
			if (event.code === "Enter" || event.code === "NumpadEnter") {
				// prevent default actions
				event.preventDefault()
				event.stopPropagation()


				if(formMode === FORM_MODES.UPDATE) {
					// if the form mode is set to UPDATE, the default action of enter should be to save the lot
					// this is done by setting buttonType to SAVE and submitting the form
					setFieldValue("buttonType", FORM_BUTTON_TYPES.SAVE)
					submitForm()
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

	useEffect( () => {
		// setSelectedBin(binId)
		setFieldValue("selectedBin", binId)
	}, [binId])



	/*
	* Renders content for moving some or all of a lot from one bin to another
	* */
	const renderMoveContent = () => {
		const binCount = values.bins[selectedBin].count // count of current bin

		// get quantity options
		// options range from 1 to the number of items in the bin (binCount)
		// options are stored as list for dropdown
		var quantityOptions = [];
		for (var i = 1; i <= binCount; i++) {
			quantityOptions.push({
				value: i
			});
		}

		// get destination options for move
		// the destination options include
		const destinationOptions = [...Object.values(stations).filter((currStation) => {
			if((currStation._id !== selectedBin) && processStationIds[currStation._id]) return true
		})]
		if(selectedBin !== "QUEUE") destinationOptions.unshift({name: "Queue", _id: "QUEUE"})
		if(selectedBin !== "FINISH") destinationOptions.push({name: "Finished", _id: "FINISH"})

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
							options={quantityOptions}
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
							options={destinationOptions}
							valueField={"_id"}
						/>
					</div>
				</div>



				<div style={{display: "flex", flexDirection: "column", width: "100%"}}>
					<Button
						style={buttonStyle}
						onClick={()=> {
							submitForm()
							close()
						}}
						schema={"ok"}
						secondary
					>
						Ok
					</Button>
					<Button
						style={buttonStyle}
						onClick={()=>setContent(null)}
						schema={"error"}
						// secondary
					>
						Cancel
					</Button>
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
						name={"dates"}
					/>
				</styled.CalendarContainer>

				<Button
					style={buttonStyle}
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
					// secondary
				>
					Cancel
				</Button>
			</styled.BodyContainer>
		)
	}

	const renderMainContent = () => {
		return(
			<styled.BodyContainer>
				<styled.FieldTitle>Station</styled.FieldTitle>

				<ButtonGroup
					buttonViewCss={styled.buttonViewCss}
					buttons={buttonGroupNames}
					selectedIndex={buttonGroupIds.findIndex((ele) => ele === selectedBin)}
					onPress={(selectedIndex)=>{
						setFieldValue("selectedBin", buttonGroupIds[selectedIndex])
						// setSelectedBin(availableBins[selectedIndex])
					}}
					containerCss={styled.buttonGroupContainerCss}
					buttonViewSelectedCss={styled.buttonViewSelectedCss}
					buttonCss={styled.buttonCss}
				/>

				<styled.RowContainer>
					<styled.ObjectInfoContainer>
						<styled.ObjectTitleContainer>
							<styled.ObjectLabel>Quantity</styled.ObjectLabel>

							<TextField
								name={`bins.${selectedBin}.count`}
								type="number"
								InputComponent={styled.CountInput}
								IconContainerComponent={styled.QuantityErrorContainerComponent}
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
							type={"button"}
							disabled={submitDisabled}
							style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
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
							style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
							secondary
							onClick={async () => {
								setFieldValue("buttonType", FORM_BUTTON_TYPES.ADD_AND_NEXT)
								submitForm()
							}}
						>
							Add & Next
						</Button>

						<Button
							schema={'lots'}
							type={"button"}
							disabled={submitDisabled}
							style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
							secondary
							onClick={async () => {
								setFieldValue("buttonType", FORM_BUTTON_TYPES.ADD_AND_EDIT)
								submitForm()
							}}
						>
							Add & Edit
						</Button>
					</styled.ButtonContainer>
					:
					<styled.ButtonContainer>
						<Button
							schema={'lots'}
							type={"button"}
							disabled={submitDisabled}
							style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
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
							style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
							secondary
							type={"button"}
							onClick={()=>onDeleteClick(selectedBin)}
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
				<Button
					style={{marginTop: "1rem"}}
					onClick={()=>setContent(null)}
					schema={"error"}
					// secondary
				>
					Go Back
				</Button>
			</styled.BodyContainer>
		)
	}

	const renderProcessSelector = () => {
		var test = processOptions.concat(processOptions)
		test = test.concat(test)
		test = test.concat(test)
		test = test.concat(test)

		return(
			<div style={{marginBottom: "1rem"}}>
				<styled.ContentHeader>
					<styled.ContentTitle>Select Process</styled.ContentTitle>
				</styled.ContentHeader>

				<styled.ProcessOptionsContainer>


					{Object.keys(processes).map((currProcessId, currIndex) => {
						const currProcess = processes[currProcessId] || {}
						const {
							name: currProcessName = ""
						} = currProcess

						console.log("currProcess",currProcess)
						console.log("processes",processes)

						return (
							<styled.ProcessOption
								onClick={() => {
									setFieldValue("processId", currProcessId)
								}}
								isSelected={currProcessId === values.processId}
							>
								{currProcessName}
							</styled.ProcessOption>
						)
					})}
				</styled.ProcessOptionsContainer>

			</div>

		)
	}

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
					style={buttonStyle}
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

				{showProcessSelector && renderProcessSelector()}

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
						// secondary
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



		</styled.StyledForm>
	)
}

// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = {}


const CardEditor = (props) => {
	const {
		isOpen,
		close,
		processId,
		processOptions,
		showProcessSelector
	} = props

	// redux state
	const cards = useSelector(state => { return state.cardsReducer.cards })

	// actions
	const dispatch = useDispatch()
	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))

	// component state
	const [cardDataInterval, setCardDataInterval] = useState(null)
	const [formMode, setFormMode] = useState(FORM_MODES.CREATE)
	const [cardId, setCardId] = useState(props.cardId) //cardId and binId are stored as internal state but initialized from props (if provided)
	const [binId, setBinId] = useState(props.binId)

	// get card object from redux by cardId
	const card = cards[cardId]

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
			if(result) {
				setFormMode(FORM_MODES.UPDATE)
			}
			else {

			}
		}
		setCardDataInterval(setInterval(()=>onGetCard(cardId),5000))
	}

	/*
	*
	* */
	useEffect( () => {
		clearInterval(cardDataInterval)
		handleGetCard(cardId)

	}, [cardId])

	/*
	*
	* */
	const handleSubmit = async (values, formMode) => {

		const {
			name,
			bins,
			description,
			moveCount,
			moveLocation,
			buttonType,
			selectedBin
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

			const postResult = await onPostCard(submitItem)

			if(!(postResult instanceof Error)) {

				// if editor should stay on the same lot that was just created, set cardId and binId
				if(buttonType === FORM_BUTTON_TYPES.ADD_AND_EDIT) {
					const {
						_id
					} = postResult

					// set cardId to the id of the newly created lot
					setCardId(_id)

					// new lots are created in the queue, so set binId to QUEUE
					setBinId("QUEUE")
				}
			}
		}
	}

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
					selectedBin: binId,
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
							processId={processId}
							// selectedBin={selectedBin}
							// setSelectedBin={setSelectedBin}
							close={close}
							formMode={formMode}
							formikProps={formikProps}
							card={card}
							bins={bins}
							binId={binId}
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
						/>
					)
				}}
			</Formik>
		</styled.Container>
	)
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