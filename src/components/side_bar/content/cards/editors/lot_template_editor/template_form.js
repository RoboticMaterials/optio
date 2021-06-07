import React, {useState, useEffect, useContext} from "react";

// external functions
import PropTypes from "prop-types";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import FadeLoader from "react-spinners/FadeLoader"

// internal components
import TextField from "../../../../../basic/form/text_field/text_field";
import Textbox from "../../../../../basic/textbox/textbox";
import Button from "../../../../../basic/button/button";
import BackButton from '../../../../../basic/back_button/back_button';
import ConfirmDeleteModal from '../../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

// actions
import { pageDataChanged } from "../../../../../../redux/actions/sidebar_actions"

// constants
import {FORM_MODES} from "../../../../../../constants/scheduler_constants";

// utils
import {LotFormSchema} from "../../../../../../methods/utils/form_schemas";
import {isObject} from "../../../../../../methods/utils/object_utils";
import set from "lodash/set";

// import styles
import * as styled from "../card_editor/lot_editor.style"

// logger
import log from '../../../../../../logger'
import LotTemplateEditorSidebar from "./lot_template_editor_sidebar/lot_template_editor_sidebar";
import LotFormCreator from "./lot_form_creator/lot_form_creator";
import SubmitErrorHandler from "../../../../../basic/form/submit_error_handler/submit_error_handler";
import {
	deleteLotTemplate,
	getLotTemplate, getLotTemplates,
	postLotTemplate,
	putLotTemplate, setSelectedLotTemplate
} from "../../../../../../redux/actions/lot_template_actions";
import NumberInput from "../../../../../basic/number_input/number_input";
import useChange from "../../../../../basic/form/useChange";
import {
	DEFAULT_COUNT_DISPLAY_NAME,
	DEFAULT_DISPLAY_NAMES,
	DEFAULT_NAME_DISPLAY_NAME,
	EMPTY_DEFAULT_FIELDS, getDefaultFields
} from "../../../../../../constants/lot_contants";
import {ThemeContext} from "styled-components";


const disabledStyle = {
	// filter: "contrast(50%)"
}
const logger = log.getLogger("CardEditor")
logger.setLevel("debug")

const buttonStyle = {marginBottom: '0rem', marginTop: 0}

const FormComponent = (props) => {

	const {
		formMode,
		lotTemplateId,
		close,
		onDeleteClick,
		errors,
		values,
		touched,
		isSubmitting,
		submitCount,
		submitForm,
		formikProps,
		onBackClick,
		loaded
	} = props

	const themeContext = useContext(ThemeContext)

	useChange()
	// component state
	const [preview, ] = useState(false)
	const [confirmDeleteTemplateModal, setConfirmDeleteTemplateModal] = useState(false);


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
				submitForm()

			}
		}

		// add event listener to 'keydown'
		document.addEventListener("keydown", listener);

		// on dismount remove the event listener
		return () => {
			document.removeEventListener("keydown", listener);
		};
	}, [])

	/*
	* resert form if template id changes
	* */
	useEffect(() => {
		formikProps.resetForm()
	}, [lotTemplateId])

	return(
		<styled.StyledForm>
			<ConfirmDeleteModal
					isOpen={!!confirmDeleteTemplateModal}
					title={"Are you sure you want to delete this Lot Template?"}
					button_1_text={"Yes"}
					button_2_text={"No"}
					handleClose={()=>setConfirmDeleteTemplateModal(null)}
					handleOnClick1={() => {
							setConfirmDeleteTemplateModal(null)
							onDeleteClick()
							close()
					}}
					handleOnClick2={() => {
							setConfirmDeleteTemplateModal(null)
					}}
			/>
			<SubmitErrorHandler
				submitCount={submitCount}
				isValid={formikProps.isValid}
				onSubmitError={() => {}}
				formik={formikProps}
			/>


			<styled.RowContainer style={{flex: 1, alignItems: "stretch", overflow: "hidden"}}>
				<LotTemplateEditorSidebar/>

				<styled.ScrollContainer>
					<styled.SectionContainer>
						<styled.FieldsHeader
							style={disabledStyle}
						>
							<styled.NameContainer>
								{/*<styled.LotName>Lot Name</styled.LotName>*/}
								<TextField

									style={{
										fontSize: themeContext.fontSize.sz3,
										fontWeight: themeContext.fontWeight.bold,
										whiteSpace: "nowrap" ,
										marginRight: "2rem",
										marginBottom: ".5rem",
										width: "20rem"
									}}
										schema='lots'
									inputStyle={{fontSize: '1rem'}}
									name={"displayNames.name"}
									InputComponent={Textbox}
								/>
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
										style={{flex: 1}}
										usable={false}
										schema='lots'
										textboxContainerStyle={{flex: 1}}
										inputStyle={{flex: 1, pointerEvents: 'none'}}
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
								<TextField
									name={"displayNames.count"}
									InputComponent={Textbox}
									style={{
										display: "inline-flex",
										marginRight: "1rem",
										fontWeight: "bold",
										alignItems: "center",
										textAlign: "center",
									}}
								/>
								<NumberInput
									inputDisabled={true}
									themeContext={themeContext}
									minusDisabled={true}
									plusDisabled={true}
								/>
							</styled.ObjectInfoContainer>
						</div>
					</styled.BodyContainer>
				</styled.ScrollContainer>
			</styled.RowContainer>



		<styled.ButtonContainer style={{width: "100%"}}>
			<Button
				style={{...buttonStyle}}
				onClick={async () => {
					submitForm()
				}}
				schema={"ok"}
				disabled={submitDisabled}
			>
				{formMode === FORM_MODES.UPDATE ? "Save Template" : "Create Template"}
			</Button>
			{/* <Button
				style={buttonStyle}
				onClick={()=>close()}
				// schema={"error"}
			>
				Close
			</Button> */}

			{/* <Button
				style={buttonStyle}
				onClick={()=>setPreview(!preview)}
				schema={"error"}
			>
				{preview ? "Show Editor" : "Show Preview"}
			</Button> */}
			{formMode === FORM_MODES.UPDATE &&
			<Button
				style={buttonStyle}
				onClick={()=>setConfirmDeleteTemplateModal(true)}
				schema={"error"}
			>
				Delete Template
			</Button>
			}

		</styled.ButtonContainer>


		</styled.StyledForm>
	)

}




const LotCreatorForm = (props) => {
	const {
		isOpen,
		close,
		processOptions,
		showProcessSelector,
		lotTemplateId,
		onBackClick,
		formMode,
		setFormMode,
		formikProps
	} = props

	// actions

	const dispatch = useDispatch()
	const dispatchPostLotTemplate= async (lotTemplate) => await dispatch(postLotTemplate(lotTemplate))
	const dispatchGetLotTemplate = async (id) => await dispatch(getLotTemplate(id))
	const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())

	const dispatchDeleteLotTemplate = async (id) => await dispatch(deleteLotTemplate(id))
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})

	const [loaded, setLoaded] = useState(false)

	// get lot object from redux by cardId
	const lotTemplate = lotTemplates[lotTemplateId] || null

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
	* if lot exists, set form mode to update
	* */
	useEffect( () => {
		if(lotTemplate && !loaded) {
			setLoaded(true) // if lot already exists, set loaded to true
		}

	}, [lotTemplate])

	useEffect( () => {
		dispatchGetLotTemplates()
	}, [])



	/*
	*
	* */


	return(
		<styled.Container>




						<FormComponent
							loaded={loaded}
							close={close}
							formMode={formMode}
							isOpen={isOpen}
							onDeleteClick={handleDeleteClick}
							formikProps={formikProps}
							{...formikProps}
							processOptions={processOptions}
							showProcessSelector={showProcessSelector}
							lotTemplateId={lotTemplateId}
							onBackClick={onBackClick}
						/>



		</styled.Container>
	)
}

// Specifies propTypes
LotCreatorForm.propTypes = {
	binId: PropTypes.string,
	showProcessSelector: PropTypes.bool,
	onBackClick: PropTypes.func,
};

// Specifies the default values for props:
LotCreatorForm.defaultProps = {
	binId: "QUEUE",
	showProcessSelector: false,
	onBackClick: () => null
};

export default LotCreatorForm
