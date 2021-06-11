import React, {useContext, useState, createContext, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import LotCreatorForm from "../lot_template_editor/template_form";
import * as styled from "./sku_editor.style";
import {isMobile} from "react-device-detect";
import ScaleWrapper from "../../../../../basic/scale_wrapper/scale_wrapper";
import LotEditor from "../card_editor/lot_editor";
import {immutableReplace, isArray, isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
import {useDispatch, useSelector} from "react-redux";
import {convertValue, getFormCustomFields} from "../../../../../../methods/utils/card_utils";
import LotFields from "../card_editor/lot_fields/lot_fields";
import {
    BASIC_LOT_TEMPLATE, DEFAULT_COUNT_DISPLAY_NAME, DEFAULT_DISPLAY_NAMES,
    DEFAULT_NAME_DISPLAY_NAME, FIELD_COMPONENT_DATA_TYPES, FIELD_COMPONENT_NAMES, FIELD_DATA_TYPES,
    getDefaultFields
} from "../../../../../../constants/lot_contants";
import Button from "../../../../../basic/button/button";
import LotEditorMainContent from "../card_editor/lot_editor_main_content/lot_editor_main_content";
import BackButton from "../../../../../basic/back_button/back_button";
import TextField from "../../../../../basic/form/text_field/text_field";
import Textbox from "../../../../../basic/textbox/textbox";
import {isObject} from "../../../../../../methods/utils/object_utils";
import {LotFormSchema} from "../../../../../../methods/utils/form_schemas";
import set from "lodash/set";
import {Formik} from "formik";
import {FORM_MODES} from "../../../../../../constants/scheduler_constants";
import {
    postLotTemplate,
    putLotTemplate,
    setSelectedLotTemplate
} from "../../../../../../redux/actions/lot_template_actions";
import {ThemeContext} from "styled-components";
import WorkInstructions from "./work_instructions/work_instructions";
import {getProcessStations} from "../../../../../../methods/utils/processes_utils";
import withModal from "../../../../../../higher_order_components/with_modal/with_modal";
import InstructionEditor from "./work_instructions/instruction_editor/instruction_editor";
import useChange from "../../../../../basic/form/useChange";
import {
    getDefaultWorkInstructions,
    iterateWorkInstructionFields, iterateWorkInstructions, iterateWorkInstructionsSync
} from "../../../../../../methods/utils/workinstruction_utils";
import {postImage} from "../../../../../../api/image_api";
import {getPdf, getPdfs, postPdf} from "../../../../../../api/pdf_api";
import PdfViewer from "../../../../../basic/pdf_viewer/pdf_viewer";
import PdfViewerModal from "../../../../../basic/pdf_viewer/pdf_viewer_modal";
import {postWorkInstruction} from "../../../../../../redux/actions/work_instructions_actions";
import {putWorkInstruction} from "../../../../../../api/work_instructions_api";
import {isString} from "../../../../../../methods/utils/string_utils";

const InstructionEditorModal = withModal(InstructionEditor, 'auto', '90%', 'auto', '90%')

export const SkuContext = createContext()
const buttonStyle = {marginBottom: '0rem', marginTop: 0}



const SkuEditor = (props) => {

    const {
        selectedLotTemplatesId,
        lotTemplateId,
        close
    } = props

    const themeContext = useContext(ThemeContext)

    const formRef = useRef(null)
    const {
        values = {},
        resetForm = () => {}
    } = formRef?.current || {}

    const dispatch = useDispatch()
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))
    const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))
    const dispatchPostWorkInstruction = async (workInstruction) => await dispatch(postWorkInstruction(workInstruction))
    const dispatchPutWorkInstruction = async (workInstruction, id) => await dispatch(putWorkInstruction(workInstruction, id))
    const dispatchPostLotTemplate= async (lotTemplate) => await dispatch(postLotTemplate(lotTemplate))

    const lotTemplate = useSelector(state => { return state.lotTemplatesReducer.lotTemplates[selectedLotTemplatesId] })
    const reduxWorkInstructions = useSelector(state => { return state.workInstructionsReducer.workInstructions }) || {}
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const tasks = useSelector(state => { return state.tasksReducer.tasks }) || {}
    const stations = useSelector(state => { return state.stationsReducer.stations }) || {}

    const [formMode, setFormMode] = useState(selectedLotTemplatesId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new
    const [showInstructionEditor, setShowInstructionEditor] = useState(false)
    const [editingFields, setEditingFields] = useState(false)
    const [confirmDeleteTemplateModal, setConfirmDeleteTemplateModal] = useState(false);
    const [pdfs, setPdfs] = useState({});

    const fields = getFormCustomFields(lotTemplate?.fields || [])

    /*
	* resert form if template id changes
	* */
    useEffect(() => {
        resetForm()
    }, [selectedLotTemplatesId])

    /*
    * this useeffect loads all the pdfs in the templates work instructions.
    * Since the files may be large, they're only retrieved in the context of this component instead of being stored in redux
    * */
    useEffect(() => {

        // loop through all work instructions
        iterateWorkInstructionsSync(lotTemplate?.workInstructions,  async (workInstructionId, processId, stationId) => {

            // get work instruction from redux
            const workInstruction = reduxWorkInstructions[workInstructionId]

            const {
                fields = []
            } = workInstruction || {}

            // loop through fields
            for(const field of fields) {
                const {
                    value,
                    component,
                    label
                } = field || {}

                // get data type
                const dataType = FIELD_COMPONENT_DATA_TYPES[component]

                /*
                * handle dataTypes as necessary
                * */
                switch (dataType) {

                    case FIELD_DATA_TYPES.PDF: {
                        // get the pdf using the value in the work instruction (which is just the id of the pdf)
                        if(isString(value)) {
                            const pdf = await getPdf(value)
                            setPdfs((prevState => {
                                return {...prevState, [value]: pdf}
                            }))
                            break
                        }
                    }
                    default: {
                    }
                }
            }
        })

        return () => {};
    }, [lotTemplate?.workInstructions]);


    const handleSubmit = async (values, formMode) => {

        const {
            fields,
            name,
            displayNames,
            workInstructions = {}
        } = values

        let response

        // first handle work instructions
        let mappedWorkInstructions = {} // stores workInstructions with values converted for storage (if necessary)

        await iterateWorkInstructionFields(workInstructions, async (field, processId, stationId, index) => {
            const {
                value,
                component,
                label
            } = field

            // create objects for process and station
            if(!mappedWorkInstructions[processId]) mappedWorkInstructions[processId] = {}
            if(!mappedWorkInstructions[processId][stationId]) mappedWorkInstructions[processId][stationId] = {fields: []}

            // get data type
            const dataType = FIELD_COMPONENT_DATA_TYPES[component]

            // handle if data has to be handled differently
            switch (dataType) {

                case FIELD_DATA_TYPES.PDF: {
                    // pdf files shouldn't be stored directly in db, instead need to post separately and just store the id of the document

                    if(value) {
                        const formData = new FormData();
                        formData.set('pdf', value, 'pdf');

                        const postedPdf = await postPdf(formData) // post it

                        const pdfId = postedPdf?._id

                        // replace value with id of pdf
                        mappedWorkInstructions[processId][stationId].fields[index] = {...field, value: pdfId}
                    }
                    else {
                        // if no value, make sure its set to null
                        mappedWorkInstructions[processId][stationId].fields[index] = {...field, value: null}
                    }
                    break
                }
                default: {
                    // otherwise just spread the field
                    mappedWorkInstructions[processId][stationId].fields[index] = {...field}
                }
            }
        })

        // now must post/put each individual work instruction
        let templateWorkInstructions = {}
        await iterateWorkInstructions(mappedWorkInstructions, async (instructionObjects, processId, stationId) => {
            if(!templateWorkInstructions[processId]) templateWorkInstructions[processId] = {}
            if(!templateWorkInstructions[processId][stationId]) templateWorkInstructions[processId][stationId] = null

            // get id
            let workInstructionId = instructionObjects?._id

            // if has id, put, otherwise post
            if(workInstructionId) {
                // update
                const result = await dispatchPutWorkInstruction(instructionObjects, workInstructionId)
            }
            else {
                // create
                const result = await dispatchPostWorkInstruction(instructionObjects)
                workInstructionId = result._id
            }

            // just store the id of the work instruction in the actual lot template
            templateWorkInstructions[processId][stationId] = workInstructionId
        })

        // NOW, save the lot template itself

        // update (PUT)
        if(formMode === FORM_MODES.UPDATE) {
            response = await dispatchPutLotTemplate({fields, name, displayNames, workInstructions: templateWorkInstructions}, lotTemplateId)
        }

        // // create (POST)
        else {
            response = await dispatchPostLotTemplate({fields, name, displayNames, workInstructions: templateWorkInstructions})

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

        return response;
    }

    /*
    * this function gets initial values for workInstructions
    * */
    const getInitialWorkInstructions = () => {

        // if the template has work instructions, parse em out
        if(lotTemplate?.workInstructions) {

            const mappedWorkInstructions = {}

            // iterate through work instructions
            iterateWorkInstructionsSync(lotTemplate.workInstructions,  (workInstructionId, processId, stationId) => {
                if(!mappedWorkInstructions[processId]) mappedWorkInstructions[processId] = {}
                if(!mappedWorkInstructions[processId][stationId]) mappedWorkInstructions[processId][stationId] = {}

                // get work instructoin from redux using id
                const workInstructionObj = reduxWorkInstructions[workInstructionId]
                const {
                    fields = [],
                    _id
                } = workInstructionObj || {}

                // create mutable form of work instruction so it doesn't change values in redux
                let mappedWorkInstructionObj = {fields: fields.map(field => {
                        return {...field}
                    }), _id}

                // loop through fields for any necessary conversions
                let index = 0
                for(const field of fields) {
                    const {
                        value,
                        component
                    } = field

                    const dataType = FIELD_COMPONENT_DATA_TYPES[component]

                    const mappedField = {...field} // spread field so you can change it without unwanted side-effects

                    if(value) {
                        switch (dataType) {

                            case FIELD_DATA_TYPES.PDF: {
                                // only pdf ID is save in WI, so replace value with the actual pdf
                                if(value) {
                                    mappedField.value = pdfs[value]
                                    break
                                }
                            }
                            default: {
                                // nothing special, so just run value through converter
                                const convertedValue = convertValue(value, dataType)
                                mappedField.value = convertedValue
                            }
                        }
                    }

                    // update the field in the WI object
                    mappedWorkInstructionObj.fields[index] = {...mappedField}

                    index = index + 1
                }

                // update workInstructions object
                mappedWorkInstructions[processId][stationId] = mappedWorkInstructionObj
            })

            return mappedWorkInstructions
        }

        // lot template doesn't have WI's, so use defaults
        return getDefaultWorkInstructions(processes, tasks)
    }

    return (
        <Formik
            innerRef={formRef}
            initialValues={{
                fields: lotTemplate ?
                    lotTemplate.fields
                    :
                    getDefaultFields(),
                workInstructions: getInitialWorkInstructions(),
                name: lotTemplate ? lotTemplate.name : "",
                changed: false,
                displayNames: lotTemplate ?
                    isObject(lotTemplate.displayNames) ?
                        {
                            name: lotTemplate?.displayNames?.name || DEFAULT_NAME_DISPLAY_NAME ,
                            count: lotTemplate?.displayNames?.count || DEFAULT_COUNT_DISPLAY_NAME
                        }
                        :
                        DEFAULT_DISPLAY_NAMES
                    :
                    DEFAULT_DISPLAY_NAMES
            }}
            validate={(values, props) => {
                try {
                    LotFormSchema.validateSync(values, {
                        abortEarly: false,
                        context: values
                    });
                } catch (error) {
                    if (error.name !== "ValidationError") {
                        throw error;
                    }

                    return error.inner.reduce((errors, currentError) => {
                        errors = set(errors, currentError.path, currentError.message)
                        return errors;
                    }, {});
                }
            }}
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

                const submitPromise = await handleSubmit(values, formMode)
                setSubmitting(false)

                if(!(submitPromise instanceof Error) && submitPromise !== undefined) {
                    close()
                }

                return submitPromise;
            }}
        >
            {formikProps => {

                const {
                    values = {},
                    submitForm = () => null,
                    isSubmitting = false,
                    submitCount = 0,
                    errors = {},
                    touched = {},
                    setFieldValue = {}
                } = formikProps

                const errorCount = Object.keys(errors).length > 0 // get number of field errors
                const touchedCount = Object.values(touched).length // number of touched fields
                const submitDisabled = ((((errorCount > 0)) || (touchedCount === 0) || isSubmitting) && ((submitCount > 0)) ) || !values.changed // disable if there are errors or no touched field, and form has been submitted at least once

                return(

                    <>
                        {showInstructionEditor &&
                        <InstructionEditorModal
                            isOpen={true}
                            width={'fit-content'}
                            height={'fit-content'}
                            stationId={showInstructionEditor?.stationId}
                            processId={showInstructionEditor?.processId}
                            selectedIndex={showInstructionEditor?.index}
                            fields={values?.workInstructions[showInstructionEditor?.processId][showInstructionEditor?.stationId]?.fields}
                            close={() => setShowInstructionEditor(false)}
                        />
                        }
                        <styled.Container2>

                            <SkuContext.Provider
                                value={{
                                    setShowInstructionEditor: setShowInstructionEditor,
                                    showInstructionEditor: showInstructionEditor
                                }}
                            >
                                <styled.Header>
                                    {editingFields ?
                                        <BackButton
                                            containerStyle={{position: 'absolute'}}
                                            secondary
                                            onClick={()=>setEditingFields(false)}
                                            schema={'error'}
                                        />
                                        :
                                        <styled.CloseButton
                                            color={themeContext.schema.error.solid}
                                            className={'fas fa-times'}
                                            onClick={close}
                                        />
                                    }

                                    <styled.TemplateNameContainer>
                                        <styled.TemplateLabel>SKU</styled.TemplateLabel>
                                        <TextField
                                            name={"name"}
                                            onChange={() => setFieldValue('changed', true)}
                                            placeholder={"Enter template name..."}
                                            InputComponent={Textbox}
                                            style={{minWidth: "25rem", fontSize: themeContext.fontSize.sz2}}
                                            inputStyle={{background: themeContext.bg.tertiary}}
                                        />
                                    </styled.TemplateNameContainer>

                                </styled.Header>

                                {editingFields ?
                                    <LotCreatorForm
                                        onBackClick={()=>setEditingFields(false)}
                                        formikProps={formikProps}
                                        isOpen={true}
                                        onAfterOpen={null}
                                        lotTemplateId={lotTemplateId}
                                        formMode={formMode}
                                        setFormMode={setFormMode}
                                        confirmDeleteTemplateModal={confirmDeleteTemplateModal}
                                        setConfirmDeleteTemplateModal={setConfirmDeleteTemplateModal}
                                    />
                                    :
                                    <styled.ContentContainer>
                                        <div
                                            style={{
                                                width: '50%',
                                                position: 'relative',
                                                marginTop: '3rem',
                                                marginBottom: '3rem',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'rgba(0,0,0,0.15)',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    zIndex: 1000
                                                }}
                                            >
                                                <Button
                                                    label={'Edit Fields'}
                                                    schema={'lots'}
                                                    style={{
                                                        zIndex: 1000,
                                                        flex: 1,
                                                        maxWidth: '30rem'
                                                    }}
                                                    onClick={()=>setEditingFields(true)}
                                                />
                                            </div>
                                            <ScaleWrapper
                                                scaleFactor={.7}
                                            >
                                                <styled.TheBody>
                                                    <LotEditorMainContent
                                                        fields={fields}
                                                        usable={false}
                                                        preview={true}
                                                    />
                                                </styled.TheBody>
                                            </ScaleWrapper>
                                        </div>

                                        <styled.WorkInstructionsContainer>
                                            <styled.Label>Work Instructions</styled.Label>
                                            <WorkInstructions
                                                workInstructions={values.workInstructions}
                                            />
                                        </styled.WorkInstructionsContainer>
                                    </styled.ContentContainer>
                                }
                            </SkuContext.Provider>
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
                        </styled.Container2>
                    </>
                )
            }}

        </Formik>
    );
};

SkuEditor.propTypes = {

};

SkuEditor.defaultProps = {
    close: () => null
};

export default (SkuEditor)
