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
import {getCardHistory} from "../../../../../redux/actions/card_history_actions";

// constants
import {FORM_MODES} from "../../../../../constants/scheduler_constants";

// utils
import {parseMessageFromEvent} from "../../../../../methods/utils/card_utils";
import {CARD_SCHEMA_MODES, cardSchema, getCardSchema, LotFormSchema} from "../../../../../methods/utils/form_schemas";
import {getProcessStations} from "../../../../../methods/utils/processes_utils";
import {isEmpty} from "../../../../../methods/utils/object_utils";

// import styles
import * as styled from "./card_editor.style"

// logger
import log from '../../../../../logger'
import ErrorTooltip from "../../../../basic/form/error_tooltip/error_tooltip";
import ScrollingButtonField from "../../../../basic/form/scrolling_buttons_field/scrolling_buttons_field";
import NumberField from "../../../../basic/form/number_field/number_field";
import LotEditorSidebar, {EMPTY_DEFAULT_FIELDS, FIELD_COMPONENT_NAMES} from "./editor_sidebar/editor_sidebar";
import DraggableSurface from "./draggable_surface/draggable_surface";
import {Container} from "react-smooth-dnd";
import DropContainer from "./drop_container/drop_container";
import {isArray} from "../../../../../methods/utils/array_utils";
import {uuidv4} from "../../../../../methods/utils/utils";
import {cloneWithRef} from "react-dnd/lib/utils/cloneWithRef";
import LotFormCreator from "./lot_form_creator/lot_form_creator";
import SubmitErrorHandler from "../../../../basic/form/submit_error_handler/submit_error_handler";
import {
	deleteLotTemplate,
	getLotTemplate, getLotTemplates,
	postLotTemplate,
	putLotTemplate, setSelectedLotTemplate
} from "../../../../../redux/actions/lot_template_actions";
import lotTemplatesReducer from "../../../../../redux/reducers/lot_templates_reducer";
import NumberInput from "../../../../basic/number_input/number_input";
import useChange from "../../../../basic/form/useChange";


const disabledStyle = {
	filter: "contrast(50%)"
}
const logger = log.getLogger("CardEditor")
logger.setLevel("debug")

const CONTENT = {
	HISTORY: "HISTORY",
	CALENDAR_START: "CALENDAR_START",
	CALENDAR_END: "CALENDAR_END",
	CALENDAR_RANGE: "CALENDAR_RANGE",
	MOVE: "MOVE",
	EDIT_FORM: "EDIT_FORM",
}

const FORM_BUTTON_TYPES = {
	SAVE: "SAVE",
	ADD: "ADD",
	ADD_AND_NEXT: "ADD_AND_NEXT",
	MOVE_OK: "MOVE_OK"
}



const FormComponent = (props) => {

	const {
		formMode,
		lotTemplateId,
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
		setFieldTouched,
		isSubmitting,
		submitCount,
		setFieldValue,
		submitForm,
		setTouched,
		formikProps,
		processOptions,
		showProcessSelector,
		content,
		setContent,
		loaded

	} = props


	// actions
	const dispatch = useDispatch()
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))

	useChange()

	// redux state

	// component state
	const [preview, setPreview] = useState(false)

	console.log("Card editor values",values)

	const errorCount = Object.keys(errors).length > 0 // get number of field errors
	const touchedCount = Object.values(touched).length // number of touched fields
	const submitDisabled = ((((errorCount > 0)) || (touchedCount === 0) || isSubmitting) && ((submitCount > 0)) ) || !values.changed // disable if there are errors or no touched field, and form has been submitted at least once

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
		}

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

	useEffect(() => {

		//
		// setFieldValue("changed", false)
		formikProps.resetForm()

	}, [lotTemplateId])

	return(
		<styled.StyledForm>
			<SubmitErrorHandler
				submitCount={submitCount}
				isValid={formikProps.isValid}
				onSubmitError={() => {}}
				formik={formikProps}
			/>
			<styled.Header>
				{/*<styled.Title>*/}

				<styled.NameContainer>
					<styled.NameLabel>Template Name</styled.NameLabel>
					<TextField  name={"name"} InputComponent={Textbox}/>
				</styled.NameContainer>
				{/*</styled.Title>*/}

				<Button
					secondary
					onClick={close}
					schema={'error'}
				>
					<i className="fa fa-times" aria-hidden="true"/>
				</Button>
			</styled.Header>

			<styled.RowContainer style={{flex: 1, alignItems: "stretch", overflow: "hidden"}}>
				<LotEditorSidebar/>

				<styled.SuperContainer>
				<styled.SectionContainer>
					<styled.FieldsHeader
						style={disabledStyle}
					>
						<styled.NameContainer>
							<styled.LotName>Lot Name</styled.LotName>
							<div
								style={{
									flexDirection: "row",
									alignItems: "center",
									width: "100%",
									position: "relative",
									display: "flex",
								}}
							>
								<Textbox
									textboxContainerStyle={{flex: 1}}
									disabled={true}
									type="text"
									placeholder="Enter name..."
									InputComponent={Textbox}
								/>
							</div>
						</styled.NameContainer>
					</styled.FieldsHeader>
					<styled.TheBody>
						{loaded ?
							<LotFormCreator
								{...formikProps}
								preview={preview}
							/>

							:
							<FadeLoader
								css={styled.FadeLoaderCSS}
								height={5}
								width={3}
								loading={true}
							/>
						}


					</styled.TheBody>
				</styled.SectionContainer>

				<styled.BodyContainer style={disabledStyle}>
					<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
						<styled.ObjectInfoContainer>
							<styled.ObjectLabel>Quantity</styled.ObjectLabel>
							<NumberInput
								inputDisabled={true}
								minusDisabled={true}
								plusDisabled={true}
							/>
						</styled.ObjectInfoContainer>
					</div>
				</styled.BodyContainer>
				</styled.SuperContainer>
			</styled.RowContainer>


			{/* render buttons for appropriate content */}
			{
				{
					"EDIT_FORM":
						<styled.ButtonContainer style={{width: "100%"}}>
							<Button
								style={{...buttonStyle, width: "8rem"}}
								onClick={async () => {
									setFieldValue("buttonType", FORM_BUTTON_TYPES.SAVE)

									// set touched to true for all fields to show errors
									values.fields.forEach((currRow, currRowIndex) => {
										currRow.forEach((currField, currFieldIndex) => {
											setFieldTouched(`fields[${currRowIndex}][${currFieldIndex}].fieldName`, true)
										})
									})
									setFieldTouched("name", true)


									submitForm()
								}}
								schema={"ok"}
								disabled={submitDisabled}
								secondary
							>
								{formMode === FORM_MODES.UPDATE ? "Save" : "Create"}
							</Button>
							<Button
								style={buttonStyle}
								onClick={()=>close()}
								// schema={"error"}
							>
								Close
							</Button>

							<Button
								style={buttonStyle}
								onClick={()=>setPreview(!preview)}
								schema={"error"}
							>
								{preview ? "Show Editor" : "Show Preview"}
							</Button>
							{formMode === FORM_MODES.UPDATE &&
							<Button
								style={buttonStyle}
								onClick={()=>onDeleteClick()}
								schema={"error"}
							>
								Delete Template
							</Button>
							}

						</styled.ButtonContainer>,
				}[content] ||
				null
			}
		</styled.StyledForm>
	)

}

// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = {marginBottom: '0rem', marginTop: 0}


const LotCreatorForm = (props) => {
	const {
		isOpen,
		close,
		processId,
		processOptions,
		showProcessSelector,
		lotTemplateId
	} = props

	// actions
	const dispatch = useDispatch()
	const dispatchPostLotTemplate= async (lotTemplate) => await dispatch(postLotTemplate(lotTemplate))
	const dispatchGetLotTemplate = async (id) => await dispatch(getLotTemplate(id))
	const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
	const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))
	const dispatchDeleteLotTemplate = async (id) => await dispatch(deleteLotTemplate(id))
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})


	const [content, setContent] = useState(CONTENT.EDIT_FORM)
	const [loaded, setLoaded] = useState(false)
	const [formMode, setFormMode] = useState(props.lotTemplateId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new

	// get card object from redux by cardId
	const lotTemplate = lotTemplates[lotTemplateId] || null
	console.log("FormEditor lotTemplates",lotTemplates)
	console.log("FormEditor aa lotTemplate",lotTemplate)
	console.log("FormEditor aa formMode",formMode)

	/*
	*
	* */
	const handleDeleteClick = async () => {

		dispatchDeleteLotTemplate(lotTemplateId)
		dispatchSetSelectedLotTemplate(null)

		// close()
	}

	/*
	*
	* */
	const handleGetLotTemplate = async (id) => {
		if(id) {
			const result = await dispatchGetLotTemplate(id)
		}
		if(!loaded) {
			setLoaded(true)
		}
	}

	/*
	*
	* */
	useEffect( () => {
		handleGetLotTemplate(lotTemplateId)
		var timer = setInterval(()=>handleGetLotTemplate(lotTemplateId),5000)

		if(lotTemplateId && (formMode !== FORM_MODES.UPDATE)) {
			setFormMode(FORM_MODES.UPDATE)
		}
		else if(!lotTemplate && (formMode !== FORM_MODES.CREATE)) {
			setFormMode(FORM_MODES.CREATE)
		}

		return () => {
			clearInterval(timer)
		}

	}, [lotTemplateId])

	/*
	* if card exists, set form mode to update
	* */
	useEffect( () => {
		if(lotTemplate && !loaded) {
			setLoaded(true) // if card already exists, set loaded to true
		}

	}, [lotTemplate])

	useEffect( () => {
		dispatchGetLotTemplates()
	}, [])



	/*
	*
	* */
	const handleSubmit = async (values, formMode) => {

		const {
			fields,
			name
		} = values


		// update (PUT)
		if(formMode === FORM_MODES.UPDATE) {
			dispatchPutLotTemplate({fields, name}, lotTemplateId)
		}

		// // create (POST)
		else {
			const response = await dispatchPostLotTemplate({fields, name})
			//
			if(!(response instanceof Error)) {
				const {
					lotTemplate: createdLotTemplate
				} = response || {}

				const {
					_id: createdLotTemplateId,
				} = createdLotTemplate || {}

				dispatchSetSelectedLotTemplate(createdLotTemplateId)
			}
			else {
				console.error("postResult",response)
			}
		}
	}

	return(
		<styled.Container
			formEditor={true}
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

				},
			}}
		>
			<Formik
				initialValues={{
					fields: lotTemplate ?
						lotTemplate.fields
						:
						EMPTY_DEFAULT_FIELDS,

					name: lotTemplate ? lotTemplate.name : "",
					changed: false
				}}

				// validation control
				validationSchema={LotFormSchema}
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

					console.log("onSubmit")

					setSubmitting(true)
					await handleSubmit(values, formMode)
					setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
					setSubmitting(false)

					// switch(buttonType) {
					// 	case FORM_BUTTON_TYPES.ADD:
					// 		resetForm()
					// 		close()
					// 		break
					// 	case FORM_BUTTON_TYPES.MOVE_OK:
					// 		resetForm()
					// 		close()
					// 		break
					// 	case FORM_BUTTON_TYPES.ADD_AND_NEXT:
					// 		resetForm()
					// 		break
					// 	case FORM_BUTTON_TYPES.SAVE:
					// 		close()
					// 		break
					// 	default:
					// 		break
					// }

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
							loaded={loaded}
							close={close}
							formMode={formMode}
							formikProps={formikProps}
							isOpen={isOpen}
							onDeleteClick={handleDeleteClick}
							formikProps={formikProps}
							{...formikProps}
							processOptions={processOptions}
							showProcessSelector={showProcessSelector}
							content={content}
							setContent={setContent}
							lotTemplateId={lotTemplateId}
						/>
					)
				}}
			</Formik>
		</styled.Container>
	)
}

// Specifies propTypes
LotCreatorForm.propTypes = {
	binId: PropTypes.string,
	showProcessSelector: PropTypes.bool,
};

// Specifies the default values for props:
LotCreatorForm.defaultProps = {
	binId: "QUEUE",
	showProcessSelector: false
};

export default LotCreatorForm