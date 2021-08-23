import React, { useState, useEffect, useRef, useContext, useCallback } from "react";

// api
import { getCardsCount } from "../../../../../api/cards_api";

// external functions
import PropTypes from "prop-types";
import { Formik, setNestedObjectValues } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
    isMobile
} from "react-device-detect";


// external components
import FadeLoader from "react-spinners/FadeLoader"
import Popup from 'reactjs-popup';
import ReactTooltip from "react-tooltip";

// internal components
import CalendarField, { CALENDAR_FIELD_MODES } from "../../../../basic/form/calendar_field/calendar_field";
import TextField from "../../../../basic/form/text_field/text_field";
import Textbox from "../../../../basic/textbox/textbox";
import DropDownSearchField from "../../../../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../../../../basic/button/button";
import BackButton from '../../../../basic/back_button/back_button'
import ButtonGroup from "../../../../basic/button_group/button_group";
import ScrollingButtonField from "../../../../basic/form/scrolling_buttons_field/scrolling_buttons_field";
import NumberField from "../../../../basic/form/number_field/number_field";
import FieldComponentMapper from "../lot_template_editor/field_component_mapper/field_component_mapper";
import TemplateSelectorSidebar from "./lot_sidebars/template_selector_sidebar/template_selector_sidebar";
import SubmitErrorHandler from "../../../../basic/form/submit_error_handler/submit_error_handler";
import LotCreatorForm from "../lot_template_editor/template_form";
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import BarcodeModal from '../../../../basic/modals/barcode_modal/barcode_modal'

// actions
import { deleteCard, getCard, postCard, putCard, showBarcodeModal } from "../../../../../redux/actions/card_actions";
import { getCardHistory } from "../../../../../redux/actions/card_history_actions";
import { getLotTemplates, setSelectedLotTemplate } from "../../../../../redux/actions/lot_template_actions";
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions";


// constants
import { FORM_MODES } from "../../../../../constants/scheduler_constants";
import {
    CONTENT,
    DEFAULT_COUNT_DISPLAY_NAME,
    DEFAULT_NAME_DISPLAY_NAME, defaultBins,
    FORM_BUTTON_TYPES, getDefaultBins, IGNORE_LOT_SYNC_WARNING, QUEUE_BIN_ID,
    SIDE_BAR_MODES
} from "../../../../../constants/lot_contants";

// utils
import {
    getFormCustomFields,
    parseMessageFromEvent
} from "../../../../../methods/utils/card_utils";
import {
    CARD_SCHEMA_MODES,
    uniqueNameSchema,
    getCardSchema,
} from "../../../../../methods/utils/form_schemas";
import { getProcessStations, getNextStationInProcess } from "../../../../../methods/utils/processes_utils";
import { isEmpty, isObject } from "../../../../../methods/utils/object_utils";
import { isArray } from "../../../../../methods/utils/array_utils";
import { formatLotNumber, getDisplayName } from "../../../../../methods/utils/lot_utils";
import { deepCopy } from '../../../../../methods/utils/utils'
import uuid from 'uuid'

// import styles
import * as styled from "./lot_editor.style"
import * as FormStyle from "../lot_template_editor/lot_form_creator/lot_form_creator.style"

// hooks
import useWarn from "../../../../basic/form/useWarn";

// logger
import log from '../../../../../logger'
import { ThemeContext } from "styled-components";
import { getIsEquivalent } from "../../../../../methods/utils/utils";
import SimpleModal from "../../../../basic/modals/simple_modal/simple_modal";
import usePrevious from "../../../../../hooks/usePrevious";
import WobbleButton from "../../../../basic/wobble_button/wobble_button";
import { postLocalSettings } from "../../../../../redux/actions/local_actions";
import LabeledButton from "./labeled_button/labeled_button";


const logger = log.getLogger("CardEditor")
logger.setLevel("debug")

const FormComponent = (props) => {

    const {
        showCreationStatusButton,
        onShowCreateStatusClick,
        showPasteIcon,
        onPasteIconClick,
        disabledAddButton,
        lotNumber,
        card,
        setShowLotTemplateEditor,
        lotTemplate,
        lotTemplateId,
        bins,
        binId,
        setBinId,
        onImportXML,
        close,
        isOpen,
        processId,
        errors,
        values,
        status,
        touched,
        footerContent,
        isSubmitting,
        submitCount,
        setFieldValue,
        onSubmit,
        formikProps,
        processOptions,
        content,
        setContent,
        onAddClick,
        onSelectLotTemplate,
        loaded,
        cardNames,
        useCardFields,
        setUseCardFields,
        merge
    } = props

    const {
        _id: cardId,
        syncWithTemplate
    } = values || {}

    const {
        fields: cardFields = []
    } = card || {}

    const {
        fields: templateFields = []
    } = lotTemplate || {}

    const formMode = cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE

    const themeContext = useContext(ThemeContext);
    const toolTipId = useRef(`tooltip-${uuid.v4()}`).current

    // actions
    const dispatch = useDispatch()
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchShowBarcodeModal = (bool) => dispatch(showBarcodeModal(bool))
    // redux state
    const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] })
    const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
    const routes = useSelector(state => { return state.tasksReducer.tasks })
    const stations = useSelector(state => { return state.stationsReducer.stations })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const localReducer = useSelector(state => state.localReducer) || {}
    const barcodeModal = useSelector(state => state.cardsReducer.showBarcodeModal)
    const processesArray = Object.values(processes)

    const [showTemplateSelector, setShowTemplateSelector] = useState(true)
    const [finalProcessOptions, setFinalProcessOptions] = useState([])
    const [showProcessSelector, setShowProcessSelector] = useState(props.showProcessSelector)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [templateFieldsChanged, setTemplateFieldsChanged] = useState(false);
    const [loadingTemplateValues, setLoadingTemplateValues] = useState(false);

    const [showFieldModal, setShowFieldModal] = useState(false)
    const [checkedCardAndTemplateFields, setCheckedCardAndTemplateFields] = useState(false)


    const [warningValues, setWarningValues] = useState()

    useEffect(() => {
        setWarningValues({
            name: values.name,
            cardNames,
            _id: cardId
        })
    }, [values.name, cardNames])

    useWarn(uniqueNameSchema, {
        setStatus: formikProps.setStatus,
        status,
        values: warningValues
    })

    // derived state
    const selectedBinName = stations[binId] ?
        stations[binId].name :
        binId === "QUEUE" ? "Queue" : "Finished"

    const processStationIds = getProcessStations(currentProcess, routes) // get object with all station's belonging to the current process as keys
    const availableBins = !isEmpty(bins) ? Object.keys(bins) : ["QUEUE"]

    const errorCount = Object.keys(errors).length > 0 // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting) && (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    useEffect(() => {
        formikProps.validateForm()
    }, [])

    useEffect(() => {
        if (!checkedCardAndTemplateFields && (formMode !== FORM_MODES.CREATE) && !values.syncWithTemplate) {
            const cardFieldsWithoutValue = values.fields.map((currRow) => {

                return currRow.map((currField) => {
                    const {
                        value,
                        ...rest
                    } = currField || {}

                    return {
                        ...rest
                    }
                })
            })

            const isEquivalent = getIsEquivalent(templateFields, cardFieldsWithoutValue)

            const ignoreSyncWarning = localReducer?.localSettings?.[IGNORE_LOT_SYNC_WARNING]?.[cardId]

            if (!ignoreSyncWarning) {
                setShowFieldModal(!isEquivalent)
            }

            setTemplateFieldsChanged(!isEquivalent)
            setCheckedCardAndTemplateFields(true)
        }
    }, [templateFields, cardFields, lotTemplateId, lotTemplate])

    /*
    * handles when enter key is pressed
    *
    * This effect attaches an event listener to the keydown event
    * The listener effect listens for 'Enter' and 'NumpadEnter' events
    * If either of these events occur, the form will be submitted
    * */
    useEffect(() => {
        // keydown event listener

        // add event listener to 'keydown'
        document.addEventListener("keydown", enterListener);

        // on dismount remove the event listener
        return () => {
            document.removeEventListener("keydown", enterListener);
        };
    }, [values])

    const enterListener = useCallback((event) => {

        // check if event code corresponds to enter
        if (event.code === "Enter" || event.code === "NumpadEnter" || event.code === 13 || event.key === "Enter") {
            // prevent default actions
            event.preventDefault()
            event.stopPropagation()


            if (formMode === FORM_MODES.UPDATE) {
                // if the form mode is set to UPDATE, the default action of enter should be to save the lot
                // this is done by setting buttonType to SAVE and submitting the form

                switch (content) {
                    case CONTENT.MOVE:
                        onSubmit(values, FORM_BUTTON_TYPES.MOVE_OK)
                        break
                    default:
                        onSubmit(values, FORM_BUTTON_TYPES.SAVE)
                        break
                }
            }
            else {
                // if the form mode is set to CREATE (the only option other than UPDATE), the default action of the enter key should be to add the lot
                onSubmit(values, FORM_BUTTON_TYPES.ADD)
            }

        }
    }, [values])

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
            bins: { ...remainingBins },
        }

        let requestSuccessStatus = false

        // if there are no remaining bins, delete the card
        if (isEmpty(remainingBins)) {
            dispatchDeleteCard(cardId, processId)
        }

        // otherwise update the card to contain only the remaining bins
        else {
            const result = await dispatchPutCard(submitItem, cardId)

            // check if request was successful
            if (!(result instanceof Error)) {
                requestSuccessStatus = true
            }
        }

        close()
    }



    const previousTemplateId = usePrevious(lotTemplateId)


    /*
    * This effect sets default values when the lotTemplate changes.
    *
    * This must be dont in the formComponent so it has access to setFieldValue, which is a prop from formik
    *
    * It checks values to see if it already contains a key for the current lotTemplateId
    * If the key already exists, nothing is done. Otherwise it creates the key and sets the intialvalues using getInitialValues
    * */
    useEffect(() => {
        // extract sub object for current lotTemplateId
        const {
            [lotTemplateId]: templateValues = [],
            fields = [],
            syncWithTemplate
        } = values || {}

        // switch templates
        if (previousTemplateId !== lotTemplateId && (previousTemplateId !== null) && (previousTemplateId !== undefined)) {
            setFieldValue(previousTemplateId, fields)

            setUseCardFields(false)

            // if doesn't contain values for current object, set initialValues
            setFieldValue("fields", getFormCustomFields(templateFields,
                [...cardFields, ...templateValues]))
        }

        // update in current template
        else {
            setFieldValue("fields", getFormCustomFields((useCardFields && !syncWithTemplate) ? cardFields : templateFields,
                [...cardFields, ...fields]))
        }

    }, [lotTemplateId, lotTemplate, useCardFields, syncWithTemplate])



    useEffect(() => {
        if (isArray(processOptions)) {
            setFinalProcessOptions(processOptions)
        }
        else if (isArray(processesArray)) {
            setFinalProcessOptions(processesArray.map((currProcess) => currProcess._id))
        }
        else {
            setFinalProcessOptions([])
        }

    }, [processOptions, processes])

    /*
    * This function gets a list of names and ids for the stations button group
    * */
    const getButtonGroupOptions = () => {
        var buttonGroupNames = []
        var buttonGroupIds = []

        // loop through availableBins. add name of each bin to buttonGroupNames, add id to buttonGroupIds
        availableBins.forEach((currBinId) => {
            if (stations[currBinId]) {
                buttonGroupNames.push(stations[currBinId].name)
                buttonGroupIds.push(currBinId)
            }
        })

        // add queue to beginning of arrays
        if (bins["QUEUE"]) {
            buttonGroupNames.unshift("Queue")
            buttonGroupIds.unshift("QUEUE")
        }

        // add finished to end of arrays
        if (bins["FINISH"]) {
            buttonGroupNames.push("Finished")
            buttonGroupIds.push("FINISH")
        }

        return [buttonGroupNames, buttonGroupIds]
    }

    const [buttonGroupNames, buttonGroupIds] = getButtonGroupOptions()

    useEffect(() => {

        if (!isOpen && content) setContent(null)

        return () => {
        }
    }, [isOpen])

    useEffect(() => {

        return () => {
            dispatchPageDataChanged(false)
        }

    }, [])

    /*
    * Renders content for moving some or all of a lot from one bin to another
    * */
    const renderMoveContent = () => {

        // get destination options for move
        // the destination options include
        const destinationOptions = [...Object.values(stations).filter((currStation) => {
            if ((currStation._id !== binId) && processStationIds[currStation._id]) return true
        })]
        if (binId !== "QUEUE") destinationOptions.unshift({ name: "Queue", _id: "QUEUE" }) // add queue
        if (binId !== "FINISH") destinationOptions.push({ name: "Finished", _id: "FINISH" }) // add finished

        const maxValue = bins[binId]?.count || 0

        return (
            <styled.BodyContainer
                minHeight={"20rem"}
            >
                <div>
                    <styled.ContentHeader style={{ flexDirection: "column" }}>
                        <styled.ContentTitle>Move lot</styled.ContentTitle>
                        <div>
                            <styled.InfoText style={{ marginRight: "1rem" }}>Current Station</styled.InfoText>
                            <styled.InfoText schema={"lots"} highlight={true}>{selectedBinName}</styled.InfoText>
                        </div>
                    </styled.ContentHeader>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                        <styled.InfoText>Select Quantity to Move</styled.InfoText>
                        <styled.InfoText style={{ marginBottom: "1rem" }}>{maxValue} Items Available</styled.InfoText>
                        <NumberField
                            maxValue={maxValue}
                            minValue={1}
                            name={"moveCount"}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
                        <styled.InfoText style={{ marginBottom: "1rem" }}>Select Lot Destination</styled.InfoText>

                        <DropDownSearchField
                            containerSyle={{ minWidth: "35%" }}
                            pattern={null}
                            name="moveLocation"
                            labelField={'name'}
                            options={destinationOptions}
                            valueField={"_id"}
                            fixedHeight={false}
                        />
                    </div>
                </div>
            </styled.BodyContainer>
        )
    }

    // renders main content
    const renderMainContent = () => {
        return (
            <>
                <styled.SectionContainer>
                    <styled.TheBody>
                        {renderFields()}
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
                                onPress={(selectedIndex) => {
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

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <styled.ObjectInfoContainer>
                            <styled.ObjectLabel>{getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)}</styled.ObjectLabel>
                            <NumberField
                                minValue={1}
                                name={`bins.${binId}.count`}
                            />
                        </styled.ObjectInfoContainer>
                    </div>
                </styled.BodyContainer>
            </>
        )
    }

    // renders history content
    const renderHistory = () => {
        const {
            events = []
        } = cardHistory || {}

        return (
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
                            date: { $date: date }
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
                        if (Object.keys(modifiedData).includes("route_id")) {
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

                        if (messages.length === 0) return null

                        return (
                            <styled.HistoryItemContainer>
                                <styled.HistoryUserContainer>
                                    <styled.HistoryUserText>{username}</styled.HistoryUserText>
                                </styled.HistoryUserContainer>
                                <styled.HistoryInfoContainer>
                                    {messages.map((currMessage) => {
                                        return (
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

    /*
    * Renders fields
    * */
    const renderFields = () => {

        const fields = (useCardFields && !values.syncWithTemplate) ? isArray(cardFields) ? cardFields : isArray(lotTemplate?.fields) ? lotTemplate.fields : []
            : isArray(lotTemplate?.fields) ? lotTemplate.fields : []

        return (
            <FormStyle.ColumnContainer>

                {fields.map((currRow, currRowIndex) => {


                    const isLastRow = currRowIndex === fields.length - 1
                    return <div
                        style={{ flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column" }}
                        key={currRowIndex}
                    >
                        <FormStyle.RowContainer>

                            {currRow.map((currItem, currItemIndex) => {
                                const {
                                    _id: dropContainerId,
                                    component,
                                    fieldName,
                                    dataType,
                                    key,
                                    required,
                                    showInPreview,
                                } = currItem || {}

                                // get full field name
                                const fullFieldName = `fields[${currRowIndex}][${currItemIndex}].value`

                                // get template error
                                const {
                                    [lotTemplateId]: templateErrors
                                } = errors || {}
                                // get field error
                                const {
                                    [fieldName]: fieldError
                                } = templateErrors || {}

                                return <styled.FieldContainer
                                    key={dropContainerId}
                                >
                                    <FieldComponentMapper
                                        required={required}
                                        fieldId={dropContainerId}
                                        displayName={fieldName}
                                        preview={false}
                                        component={component}
                                        fieldName={fullFieldName}
                                    />
                                </styled.FieldContainer>
                            })}

                        </FormStyle.RowContainer>
                    </div>
                })}
            </FormStyle.ColumnContainer>
        )
    }

    const renderProcessSelector = () => {

        return (
            <styled.ProcessFieldContainer>
                <styled.ContentHeader style={{ marginBottom: ".5rem" }}>
                    <styled.ContentTitle>Select Process</styled.ContentTitle>
                </styled.ContentHeader>

                <ScrollingButtonField
                    name={"processId"}
                    valueKey={"value"}
                    labelKey={"label"}
                    options={
                        finalProcessOptions.map((currProcessId, currIndex) => {
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

    const renderSelectedProcess = () => {
        return (
            <styled.ProcessFieldContainer>
                <styled.ContentHeader style={{ marginBottom: ".5rem" }}>
                    <styled.ContentTitle>Selected Process: {processes[values.processId].name}</styled.ContentTitle>
                </styled.ContentHeader>
            </styled.ProcessFieldContainer>

        )
    }

    const renderForm = () => {
        return (
            <styled.StyledForm
                loading={loadingTemplateValues}
            >

                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={"Are you sure you want to delete this Lot Card?"}
                    button_1_text={"Yes"}
                    button_2_text={"No"}
                    handleClose={() => setConfirmDeleteModal(null)}
                    handleOnClick1={() => {
                        handleDeleteClick(binId)
                        setConfirmDeleteModal(null)
                    }}
                    handleOnClick2={() => {
                        setConfirmDeleteModal(null)
                    }}
                />

                <BarcodeModal
                    isOpen={!!barcodeModal}
                    title={"RM-" + lotNumber + " Barcode"}
                    handleClose={() => {
                        dispatchShowBarcodeModal(false)
                    }}
                    barcodeId={"RM-" + lotNumber}
                />
                <styled.Header>
                    {((content === CONTENT.CALENDAR) || (content === CONTENT.HISTORY) || (content === CONTENT.MOVE)) &&
                        <div
                            style={{ position: "absolute" }}
                        >
                            <BackButton
                                onClick={() => setContent(null)}
                                schema={'error'}
                                secondary
                            >
                            </BackButton>
                        </div>
                    }

                    {content === CONTENT.HISTORY &&
                        <styled.Title>
                            Lot History
                        </styled.Title>
                    }
                    {content === CONTENT.MOVE &&
                        <styled.Title>
                            Move Lot
                        </styled.Title>
                    }
                    {content !== CONTENT.HISTORY && content !== CONTENT.MOVE &&
                        <styled.Title>
                            {formMode === FORM_MODES.CREATE ?
                                "Create Lot"
                                :
                                "Edit Lot"
                            }
                        </styled.Title>
                    }


                    <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={close} />
                </styled.Header>

                <styled.RowContainer style={{ flex: 1, alignItems: "stretch", overflow: "hidden"}}>
                    {(showTemplateSelector) &&
                        <TemplateSelectorSidebar
                            showFields={false}
                            onTemplateSelectClick={onSelectLotTemplate}
                            onTemplateEditClick={() => {
                                setShowLotTemplateEditor(true)
                            }}
                            onCloseClick={() => {
                                setShowTemplateSelector(!showTemplateSelector)
                            }}
                            selectedLotTemplatesId={lotTemplateId}
                        />
                    }

                    <styled.ScrollContainer>

                        <styled.FieldsHeader>

                            <styled.SubHeader>
                                <styled.IconRow>
                                    {(isMobile && !showTemplateSelector) &&
                                        <LabeledButton
                                            label={"Template"}
                                        >
                                            <styled.TemplateButton
                                                type={"button"}
                                                className={showTemplateSelector ? "fas fa-times" : SIDE_BAR_MODES.TEMPLATES.iconName}
                                                color={themeContext.schema.lots.solid}
                                                onClick={() => {
                                                    setShowTemplateSelector(true)
                                                    //onSelectLotTemplate(lotTemplateId)
                                                }}
                                            />
                                        </LabeledButton>
                                    }

                                    <LabeledButton>
                                        <div // Neccessary because tooltips cannot be dynamically generated. Need a parent component for render
                                            data-tip
                                            data-for={toolTipId}
                                        >
                                            <>
                                                {templateFieldsChanged ?
                                                    <WobbleButton
                                                        repeat={false}
                                                    >
                                                        <styled.SyncProblem
                                                            style={{ fontSize: 40, color: "#fc9003" }}
                                                            onClick={() => setShowFieldModal(true)}
                                                        />
                                                    </WobbleButton>
                                                    :
                                                    <styled.Sync
                                                        sync={values.syncWithTemplate}
                                                        style={{ fontSize: 40 }}
                                                        onClick={() => setFieldValue("syncWithTemplate", !values.syncWithTemplate)}
                                                    />
                                                }
                                                <ReactTooltip id={toolTipId} place='top' effect='solid'>
                                                    <div style={{maxWidth: '20rem'}}>
                                                        When sync is enabled, this lot's fields will automatically update when its template is changed.
                                                    </div>
                                                </ReactTooltip>
                                            </>
                                        </div>
                                    </LabeledButton>

                                    <div>
                                        <styled.ContentTitle>Selected Template: </styled.ContentTitle>
                                        <styled.ContentValue>{lotTemplate.name}</styled.ContentValue>
                                    </div>



                                </styled.IconRow>


                                {showPasteIcon &&
                                    <LabeledButton
                                        label={"Pasted Data"}
                                    >
                                        <styled.PasteIcon
                                            type={"button"}
                                            className="fas fa-paste"
                                            color={"#ffc20a"}
                                            onClick={onPasteIconClick}
                                        />
                                    </LabeledButton>
                                }

                                <Button
                                    schema={'lots'}
                                    type={"button"}
                                    disabled={submitDisabled}
                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0, position: 'absolute', right: '8rem' }}
                                    onClick={onImportXML}
                                >
                                    Import xml file
                                </Button>

                                <Button
                                    schema={'lots'}
                                    type={"button"}
                                    disabled={submitDisabled}
                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0}}
                                    onClick={() => {
                                        dispatchShowBarcodeModal(true)
                                    }}
                                >
                                    Barcode
                                </Button>

                            </styled.SubHeader>

                            {(showProcessSelector || !values.processId) && renderProcessSelector()}
                            {!!values.processId && renderSelectedProcess()}

                            <styled.RowContainer >
                                <styled.NameContainer style={{ flex: 0 }}>
                                    <styled.FieldLabel>Lot Number</styled.FieldLabel>
                                    <styled.LotNumber>{formatLotNumber(lotNumber)}</styled.LotNumber>
                                </styled.NameContainer>

                                <styled.NameContainer>
                                    <styled.FieldLabel>{getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)}</styled.FieldLabel>
                                    <TextField
                                        disabled={content !== null}
                                        inputStyle={content !== null ? {
                                            background: "transparent",
                                            border: "none",
                                            boxShadow: "none",

                                        } : {}}
                                        style={content !== null ? {
                                            background: "transparent",
                                            border: "none",
                                            boxShadow: "none",
                                        } : {}}
                                        name={"name"}
                                        type={"text"}
                                        placeholder={"Enter name..."}
                                        InputComponent={Textbox}
                                        schema={"lots"}
                                    />
                                </styled.NameContainer>
                            </styled.RowContainer>
                        </styled.FieldsHeader>

                        {(content === null) &&
                            renderMainContent()
                        }
                        {(content === CONTENT.HISTORY) &&
                            renderHistory()
                        }
                        {(content === CONTENT.MOVE) &&
                            renderMoveContent()
                        }

                    </styled.ScrollContainer>
                </styled.RowContainer>

                <styled.Footer>
                    {/* render buttons for appropriate content */}
                    {(isMobile && showTemplateSelector) ?
                        <styled.ButtonContainer>
                            <Button
                                type={"button"}
                                style={{ ...buttonStyle, }}
                                onClick={() => setShowTemplateSelector(false)}
                                schema={"lots"}
                            // secondary
                            >
                                Back to Editor
                            </Button>
                        </styled.ButtonContainer>
                        :
                        <styled.ButtonContainer>
                            {
                                {
                                    [CONTENT.HISTORY]:
                                        <>
                                            <Button
                                                style={{ ...buttonStyle }}
                                                onClick={() => setContent(null)}
                                                schema={"error"}
                                                secondary
                                            >
                                                Go Back
                                            </Button>
                                        </>,
                                    [CONTENT.MOVE]:
                                        <>
                                            <Button
                                                disabled={submitDisabled}
                                                style={{ ...buttonStyle, width: "8rem" }}
                                                type={"button"}
                                                onClick={() => {
                                                    onSubmit(values, FORM_BUTTON_TYPES.MOVE_OK)
                                                }}
                                                schema={"ok"}
                                                secondary
                                            >
                                                Ok
                                            </Button>
                                            <Button
                                                type={"button"}
                                                style={buttonStyle}
                                                onClick={() => setContent(null)}
                                                schema={"error"}
                                            // secondary
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                }[content] ||
                                <>
                                    {showCreationStatusButton &&
                                        <Button
                                            type={"button"}
                                            label={"Back to Creation Status"}
                                            onClick={onShowCreateStatusClick}
                                        />
                                    }

                                    {formMode === FORM_MODES.CREATE ?
                                        <>
                                            {disabledAddButton &&
                                                <Button
                                                    schema={'lots'}
                                                    type={"button"}
                                                    disabled={submitDisabled}
                                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                    onClick={onAddClick}
                                                >
                                                    Add
                                                </Button>
                                            }
                                            {!disabledAddButton &&
                                                <Button
                                                    schema={'lots'}
                                                    type={"button"}
                                                    disabled={submitDisabled}
                                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                    onClick={async () => {
                                                        onSubmit(values, FORM_BUTTON_TYPES.ADD)
                                                    }}
                                                >
                                                    {!!merge ? 'Merge' : 'Add'}
                                                </Button>
                                            }

                                            {!disabledAddButton && !merge &&
                                                <Button
                                                    schema={'lots'}
                                                    type={"button"}
                                                    secondary
                                                    disabled={submitDisabled}
                                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                    onClick={async () => {
                                                        onSubmit(values, FORM_BUTTON_TYPES.ADD_AND_NEXT)
                                                    }}
                                                >
                                                    Add & Next
                                                </Button>
                                            }
                                            {!!merge &&
                                                <Button
                                                    schema={'lots'}
                                                    type={"button"}
                                                    secondary
                                                    disabled={submitDisabled}
                                                    style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                    onClick={async () => {
                                                        // For Merge and Move, you need to take the bins value and move the location to the next one of that current bin location
                                                        let copyValues = deepCopy(values)
                                                        const nextStation = getNextStationInProcess(processes[values.processId], Object.keys(values.bins)[0])
                                                        copyValues.bins = { [nextStation._id]: Object.values(values.bins)[0] }
                                                        onSubmit(copyValues, FORM_BUTTON_TYPES.ADD_AND_MOVE)
                                                    }}
                                                >
                                                    Merge & Move Lot to Next Station
                                                </Button>
                                            }
                                        </>
                                        :
                                        <>

                                            <Button
                                                schema={'lots'}
                                                type={"button"}
                                                disabled={submitDisabled}
                                                style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                onClick={async () => {
                                                    onSubmit(values, FORM_BUTTON_TYPES.SAVE)

                                                }}
                                            >
                                                Save Lot
                                            </Button>

                                            <Button
                                                schema={'lots'}
                                                type={"button"}
                                                style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                onClick={async () => {
                                                    setContent(CONTENT.MOVE)
                                                }}
                                                secondary
                                            >
                                                Move Lot
                                            </Button>
                                            <Button
                                                schema={'delete'}
                                                style={{ ...buttonStyle, marginBottom: '0rem', marginTop: 0 }}
                                                type={"button"}
                                                onClick={() => setConfirmDeleteModal(true)}
                                                tertiary
                                            >
                                                <i style={{ marginRight: ".5rem" }} className="fa fa-trash" aria-hidden="true" />
                                                Delete Lot
                                            </Button>
                                        </>
                                    }
                                </>
                            }

                        </styled.ButtonContainer>
                    }


                    {footerContent()}
                </styled.Footer>
            </styled.StyledForm>
        )
    }


    return (
        <>
            {showFieldModal &&
                <SimpleModal
                    content={"The template used by this lot has changed. Would you like to sync the lot to match the template?"}
                    isOpen={showFieldModal}
                    title={"Lot Template has Changed"}
                    onRequestClose={() => setShowFieldModal(false)}
                    onCloseButtonClick={() => setShowFieldModal(false)}
                    handleOnClick1={() => {
                        // setUseCardFields(false)
                        setFieldValue("syncWithTemplate", true)
                        setShowFieldModal(false)
                        setTemplateFieldsChanged(false)
                        setCheckedCardAndTemplateFields(false)

                        const {
                            localSettings
                        } = localReducer || {}

                        const {
                            [IGNORE_LOT_SYNC_WARNING]: ignoreSyncWarning,
                        } = localSettings || {}

                        const {
                            [cardId]: ignoreThisLot,
                            ...rest
                        } = ignoreSyncWarning || {}


                        dispatchPostLocalSettings({
                            ...localSettings,
                            [IGNORE_LOT_SYNC_WARNING]: {
                                ...rest,
                            }
                        })
                    }}
                    handleOnClick2={() => {
                        setShowFieldModal(false)

                        const {
                            localSettings
                        } = localReducer || {}

                        dispatchPostLocalSettings({
                            ...localSettings,
                            [IGNORE_LOT_SYNC_WARNING]: {
                                [cardId]: true
                            }
                        })
                    }}
                    button_1_text={"Yes"}
                    button_2_text={"no"}
                    contentLabel={"Update Lot"}
                />
            }

            {renderForm()}
            <SubmitErrorHandler
                submitCount={submitCount}
                isValid={formikProps.isValid}
                onSubmitError={() => { }}
                formik={formikProps}
            />
        </>
    )

}



// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = { marginBottom: '0rem', marginTop: 0 }


const LotEditor = (props) => {

    const {
        isOpen,
        initialBin,
        onAddClick,
        footerContent,
        lotTemplateId,
        lotTemplate,
        hidden,
        onShowCreateStatusClick,
        showCreationStatusButton,
        showPasteIcon,
        onSubmit,
        close,
        processId,
        processOptions,
        showProcessSelector,
        onSelectLotTemplate,
        disabledAddButton,
        collectionCount,
        initialValues,
        formRef,
        onValidate,
        onPasteIconClick,
        onImportXML,
        cardNames,
        merge,
    } = props

    // redux state
    const cards = useSelector(state => { return state.cardsReducer.cards })
    const selectedLotTemplatesId = useSelector(state => { return state.lotTemplatesReducer.selectedLotTemplatesId })
    // actions
    const dispatch = useDispatch()
    const onPostCard = async (card) => await dispatch(postCard(card))
    const onGetCard = async (cardId) => await dispatch(getCard(cardId))
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

    // component state
    const [cardId, setCardId] = useState(props.cardId) //cardId and binId are stored as internal state but initialized from props (if provided)
    const [binId, setBinId] = useState(props.binId || "QUEUE")
    const [content, setContent] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [formMode,] = useState(props.cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new
    const [showLotTemplateEditor, setShowLotTemplateEditor] = useState(false)
    const [useCardFields, setUseCardFields] = useState(props.cardId ? true : false)


    // get card object from redux by cardId
    const card = cards[cardId] || null
    const [lotNumber, setLotNumber] = useState((card && card.lotNumber !== null) ? card.lotNumber : collectionCount)

    // extract card attributes
    const {
        bins = {}
    } = card || {}

    /*
    *
    * */
    const handleGetCard = async (cardId) => {
        if (cardId) {
            const result = await onGetCard(cardId)
        }
        // if(!loaded) {
        // 	setLoaded(true)
        // }
    }

    useEffect(() => {
        setCardId(props.cardId)
    }, [props.cardId])


    useEffect(() => {
        setLotNumber((card && card.lotNumber !== null) ? card.lotNumber : collectionCount)
    }, [card, collectionCount])


    /*
    *
    * */
    useEffect(() => {
        handleGetCard(cardId)
        var timer = setInterval(() => {
            handleGetCard(cardId)
            dispatchGetLotTemplates()
        }, 5000)

        return () => {
            clearInterval(timer)
        }

    }, [cardId])

    /*
    * if card exists, set form mode to update
    * */
    useEffect(() => {

        if (collectionCount !== null) {
            // editing existing card
            if (cardId) {
                if (card) {

                    // if card has template, template and card must be loaded
                    if (card?.lotTemplateId) {
                        if (lotTemplate && !loaded) {
                            setLoaded(true)
                        }
                    }

                    // No template, only need card to set loaded
                    else if (!loaded) {
                        setLoaded(true) // if card already exists, set loaded to true
                    }
                }

            }

            // creating new, set loaded to true
            else {
                if (!loaded) setLoaded(true)
            }
        }

    }, [card, lotTemplate, lotTemplateId, collectionCount])

    useEffect(() => {
        dispatchSetSelectedLotTemplate(null)
        dispatchGetLotTemplates()

        // return () => {
        // 	close()
        // }

    }, [])

    if (loaded) {
        return (
            <>
                {showLotTemplateEditor &&
                    <LotCreatorForm
                        isOpen={true}
                        onAfterOpen={null}
                        lotTemplateId={selectedLotTemplatesId}
                        close={() => {
                            setShowLotTemplateEditor(false)
                        }}
                    />
                }
                <styled.Container>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            _id: card ? card._id : null,
                            processId: processId,
                            syncWithTemplate: card ? (card.syncWithTemplate || false) : false,
                            moveCount: card?.bins[binId]?.count || 0,
                            moveLocation: [],
                            name: card ? card.name : ``,
                            bins: card && card.bins ?
                                card.bins
                                :
                                getDefaultBins(initialBin),
                            fields: getFormCustomFields((useCardFields && !card?.syncWithTemplate) ? (card?.fields || []) : lotTemplate.fields, card?.fields ? card?.fields : null)

                        }}
                        validationSchema={getCardSchema((content === CONTENT.MOVE) ? CARD_SCHEMA_MODES.MOVE_LOT : CARD_SCHEMA_MODES.EDIT_LOT, bins[binId]?.count ? bins[binId].count : 0)}
                        validate={onValidate}
                        validateOnChange={true}
                        // validateOnMount={true} // leave false, if set to true it will generate a form error when new data is fetched
                        validateOnBlur={true}
                        onSubmit={() => { }} // this is necessary

                    // enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
                    >
                        {formikProps => {
                            const {
                                setSubmitting,
                                setTouched,
                                resetForm,
                                setFieldValue,
                                validateForm,
                                setErrors,
                                submitForm

                            } = formikProps

                            const handleSubmit = async (values, buttonType) => {
                                setSubmitting(true)
                                await submitForm()

                                const submissionErrors = await validateForm()

                                // abort if there are errors
                                if (!isEmpty(submissionErrors)) {
                                    setSubmitting(false)
                                    return false
                                }

                                onSubmit && onSubmit(values, buttonType)

                                let requestResult

                                const {
                                    _id,
                                    name,
                                    changed,
                                    new: isNew,
                                    bins,
                                    moveCount,
                                    moveLocation,
                                    processId: selectedProcessId,
                                    [lotTemplateId]: templateValues,
                                    fields,
                                    syncWithTemplate
                                } = values || {}


                                if (content === CONTENT.MOVE) {
                                    // moving card need to update count for correct bins
                                    if (moveCount && moveLocation) {

                                        var submitItem = {
                                            name,
                                            bins,
                                            lotNumber,
                                            flags: isObject(card) ? (card.flags || []) : [],
                                            process_id: card.process_id,
                                            lotTemplateId,
                                            fields,
                                            syncWithTemplate
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

                                        if (currentBinCount) {
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
                                            bins: updatedBins,
                                            fields,
                                            syncWithTemplate
                                            // fields
                                        }

                                        // update card
                                        requestResult = onPutCard(submitItem, values._id)

                                    }
                                }

                                else {
                                    // update (PUT)
                                    if (values._id) {

                                        var submitItem = {
                                            name,
                                            bins,
                                            flags: isObject(card) ? (card.flags || []) : [],
                                            process_id: isObject(card) ? (card.process_id || processId) : (processId),
                                            lotTemplateId,
                                            lotNumber,
                                            fields,
                                            syncWithTemplate
                                        }

                                        requestResult = onPutCard(submitItem, values._id)
                                    }

                                    // create (POST)
                                    else {
                                        const submitItem = {
                                            name,
                                            bins,
                                            flags: [],
                                            process_id: processId ? processId : selectedProcessId,
                                            lotTemplateId,
                                            lotNumber,
                                            fields,
                                            syncWithTemplate
                                        }

                                        requestResult = await onPostCard(submitItem)

                                        if (!(requestResult instanceof Error)) {
                                            const {
                                                _id = null
                                            } = requestResult || {}

                                            setFieldValue("_id", _id)
                                        }
                                        else {
                                            console.error("requestResult error", requestResult)
                                        }
                                    }
                                }

                                setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
                                setSubmitting(false)

                                switch (buttonType) {
                                    case FORM_BUTTON_TYPES.ADD:
                                        resetForm()
                                        close()
                                        break
                                    case FORM_BUTTON_TYPES.ADD_AND_MOVE:
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

                                return requestResult
                                // return true
                            }

                            if (hidden || showLotTemplateEditor) return null
                            return (
                                <FormComponent
                                    useCardFields={useCardFields}
                                    setUseCardFields={setUseCardFields}
                                    cardNames={cardNames}
                                    onAddClick={onAddClick}
                                    footerContent={footerContent}
                                    showCreationStatusButton={showCreationStatusButton}
                                    lotNumber={lotNumber}
                                    collectionCount={collectionCount}
                                    onSubmit={handleSubmit}
                                    setShowLotTemplateEditor={setShowLotTemplateEditor}
                                    showLotTemplateEditor={showLotTemplateEditor}
                                    lotTemplate={lotTemplate}
                                    lotTemplateId={lotTemplateId}
                                    disabledAddButton={disabledAddButton}
                                    loaded={loaded}
                                    onShowCreateStatusClick={onShowCreateStatusClick}
                                    processId={processId}
                                    close={close}
                                    formMode={formMode}
                                    onImportXML={onImportXML}
                                    showPasteIcon={showPasteIcon}
                                    {...formikProps}
                                    bins={bins}
                                    binId={binId}
                                    setBinId={setBinId}
                                    cardId={cardId}
                                    isOpen={isOpen}
                                    formikProps={formikProps}
                                    processOptions={processOptions}
                                    showProcessSelector={showProcessSelector}
                                    onSelectLotTemplate={onSelectLotTemplate}
                                    content={content}
                                    setContent={setContent}
                                    card={card}
                                    onPasteIconClick={onPasteIconClick}
                                    merge={merge}
                                />
                            )
                        }}
                    </Formik>
                </styled.Container>
            </>
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
LotEditor.propTypes = {
    binId: PropTypes.string,
    showProcessSelector: PropTypes.bool,
};

// Specifies the default values for props:
LotEditor.defaultProps = {
    binId: "QUEUE",
    initialBin: QUEUE_BIN_ID,
    showProcessSelector: false,
    providedValues: []
};

export default LotEditor
