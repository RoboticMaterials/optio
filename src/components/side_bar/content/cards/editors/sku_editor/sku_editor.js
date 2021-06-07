import React, {useContext, useState, createContext} from 'react';
import PropTypes from 'prop-types';
import LotCreatorForm from "../lot_template_editor/template_form";
import * as styled from "./sku_editor.style";
import {isMobile} from "react-device-detect";
import ScaleWrapper from "../../../../../basic/scale_wrapper/scale_wrapper";
import LotEditor from "../card_editor/lot_editor";
import {immutableReplace, isArray, isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
import {useDispatch, useSelector} from "react-redux";
import {getFormCustomFields} from "../../../../../../methods/utils/card_utils";
import LotFields from "../card_editor/lot_fields/lot_fields";
import {
    BASIC_LOT_TEMPLATE, DEFAULT_COUNT_DISPLAY_NAME, DEFAULT_DISPLAY_NAMES,
    DEFAULT_NAME_DISPLAY_NAME, FIELD_COMPONENT_NAMES,
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

const InstructionEditorModal = withModal(InstructionEditor)

export const SkuContext = createContext()

const SkuEditor = (props) => {

    const {
        selectedLotTemplatesId,
        setShowLotTemplateEditor,
        lotTemplateId,
        close
    } = props

    const themeContext = useContext(ThemeContext)


    const dispatch = useDispatch()
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))
    const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))
    const dispatchPostLotTemplate= async (lotTemplate) => await dispatch(postLotTemplate(lotTemplate))

    const lotTemplate = useSelector(state => { return state.lotTemplatesReducer.lotTemplates[selectedLotTemplatesId] }) || BASIC_LOT_TEMPLATE
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const tasks = useSelector(state => { return state.tasksReducer.tasks }) || {}
    const stations = useSelector(state => { return state.stationsReducer.stations }) || {}

    const [formMode, setFormMode] = useState(props.lotTemplateId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new
    const [showInstructionEditor, setShowInstructionEditor] = useState(false)
    const [editingFields, setEditingFields] = useState(false)

    const fields = getFormCustomFields(lotTemplate?.fields || [])

    const handleSubmit = async (values, formMode) => {

        const {
            fields,
            name,
            displayNames
        } = values

        let response

        // update (PUT)
        if(formMode === FORM_MODES.UPDATE) {
            response = await dispatchPutLotTemplate({fields, name, displayNames}, lotTemplateId)
        }

        // // create (POST)
        else {
            response = await dispatchPostLotTemplate({fields, name, displayNames})
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

        return response;
    }

    const getInitialWorkInstructions = () => {
        if(lotTemplate?.workInstructions) {
            return lotTemplate.workInstructions
        }

        let workInstructions = {}

        Object.values(processes).forEach(process => {
            const {
                _id: processId
            } = process

            workInstructions[processId] = {}

            const stationIds = getProcessStations(process, tasks)
            Object.keys(stationIds).forEach(stationId => {
                // workInstructions[processId]
                workInstructions[processId][stationId] = {
                    stationId,
                    fields: [
                        {
                            label: 'Cycle Time',
                            value: null,
                            component: FIELD_COMPONENT_NAMES.TIME_SELECTOR,
                        },
                        {
                            label: 'Work Instructions',
                            value: null,
                            component: FIELD_COMPONENT_NAMES.IMAGE_SELECTOR,
                        }
                    ]
                }
            })
        })

        return workInstructions
    }

    return (
        <Formik
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

            // validation control
            // validationSchema={LotFormSchema}
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

            enableReinitialize={false} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
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

                return (
                    <>
                        {showInstructionEditor &&
                        <InstructionEditorModal
                            width={'fit-content'}
                            height={'fit-content'}
                            stationId={showInstructionEditor?.stationId}
                            fields={showInstructionEditor?.fields}
                            // values={showInstructionEditor}
                            // width={'10%'}
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
                                    {/*<styled.Title>*/}
                                    <BackButton
                                        containerStyle={{position: 'absolute'}}
                                        secondary
                                        onClick={()=>setEditingFields(false)}
                                        schema={'error'}
                                    >
                                    </BackButton>

                                    {/*<div style={{marginRight: "auto"}}/>*/}

                                    <styled.TemplateNameContainer>
                                        <styled.TemplateLabel>SKU</styled.TemplateLabel>
                                        <TextField
                                            name={"name"}
                                            placeholder={"Enter template name..."}
                                            InputComponent={Textbox}
                                            style={{minWidth: "25rem", fontSize: themeContext.fontSize.sz2}}
                                            inputStyle={{background: themeContext.bg.tertiary}}
                                        />
                                    </styled.TemplateNameContainer>
                                    {/*</styled.Title>*/}


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
                                                workInstructions={formikProps.values.workInstructions}
                                            />
                                        </styled.WorkInstructionsContainer>
                                    </styled.ContentContainer>
                                }
                            </SkuContext.Provider>
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
