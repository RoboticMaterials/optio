import React, { useState, useRef, useEffect, useCallback } from 'react'

// actions
import { postCard } from "../../../../../redux/actions/card_actions";

// api
import { getCardsCount } from "../../../../../api/cards_api";

// components internal
import LotEditor from "./lot_editor"
import StatusList from "../../../../basic/status_list/status_list"
import { PasteForm } from "../../../../basic/paste_mapper/paste_mapper"
import SimpleModal from "../../../../basic/modals/simple_modal/simple_modal";

// constants
import {
    BASIC_LOT_TEMPLATE,
    BASIC_LOT_TEMPLATE_ID,
    COUNT_FIELD, DEFAULT_COUNT_DISPLAY_NAME, DEFAULT_NAME_DISPLAY_NAME,
    FIELD_COMPONENT_NAMES,
    FORM_STATUS,
    NAME_FIELD
} from "../../../../../constants/lot_contants"

// functions external
import PropTypes from 'prop-types'
import { setNestedObjectValues } from "formik"
import { ValidationError } from "yup";
import { useDispatch, useSelector } from "react-redux";

// hooks
import usePrevious from "../../../../../hooks/usePrevious"

// utils
import {editLotSchema, uniqueNameSchema} from "../../../../../methods/utils/form_schemas";
import { immutableReplace, immutableSet, isArray, isNonEmptyArray } from "../../../../../methods/utils/array_utils";
import { convertPastePayloadToLot } from "../../../../../methods/utils/card_utils";
import { isObject, pathStringToObject } from "../../../../../methods/utils/object_utils";
import { getDisplayName } from "../../../../../methods/utils/lot_utils";

// styles
import * as styled from "./lot_editor_container.style";
import {postLocalSettings} from "../../../../../redux/actions/local_actions";

const LotEditorContainer = (props) => {

    // actions
    const dispatch = useDispatch()
    const dispatchPostCard = async (card) => await dispatch(postCard(card))
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    // redux state
    const selectedLotTemplatesId = useSelector(state => { return state.lotTemplatesReducer.selectedLotTemplatesId })
    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}
    const cards = useSelector(state => { return state.cardsReducer.cards })
    const localReducer = useSelector(state => state.localReducer) || {}
    const {
        loaded: localSettingsLoaded,
        localSettings
    } = localReducer
    const {
        lastLotTemplateId = null
    } = localSettings || {}

    // component state
    const [mappedStatus, setMappedStatus] = useState([])						// array of form status objects
    const [selectedIndex, setSelectedIndex] = useState(null)					// current selected index for mapped data arrays (values, errors, touched, etc)
    const [mappedValues, setMappedValues] = useState([])						// array of form values objects
    const [mappedErrors, setMappedErrors] = useState([])						// array of form errors objects
    // const [mappedWarnings, setMappedWarnings] = useState([])						// array of form errors objects
    const [mappedTouched, setMappedTouched] = useState([])					// array of form touched objects
    const [pasteTable, setPasteTable] = useState([])							// array structure for mapping pasted table
    const [disablePasteModal, setDisablePasteModal] = useState(false)			// bool - used to determine whether or not to show the paste modal
    const [resetPasteTable, setResetPasteTable] = useState(false)				// bool - used to reset values in pasteForm
    const [showPasteMapper, setShowPasteMapper] = useState(false)				// bool - used for whether or not to render pasteForm
    const [showSimpleModal, setShowSimpleModal] = useState(false)				// bool - controls rendering of simple modal for pasting
    const [pasteMapperHidden, setPasteMapperHidden] = useState(true)			// bool - controls whether or not paste form is hidden (this is distinct from rendering)
    const [showStatusList, setShowStatusList] = useState(false)				// bool - controls whether or not to show statusList
    const [createdLot, setCreatedLot] = useState(false)				// bool - controls whether or not to show statusList
    const [fieldNameArr, setFieldNameArr] = useState([])
    const [lotTemplate, setLotTemplate] = useState([])
    const {
        name: lotTemplateName = ""
    } = lotTemplate || {}
    const [lotTemplateId, setLotTemplateId] = useState(null)
    const [card, setCard] = useState(cards[props.cardId] || null)
    const [collectionCount, setCollectionCount] = useState(null)
    const [lazyCreate, setLazyCreate] = useState(false)

    const [cardNames, setCardNames] = useState([])
    const [showStatusListLazy, setShowStatusListLazy] = useState(null)

    const previousSelectedIndex = usePrevious(selectedIndex) // needed for useEffects

    const formRef = useRef(null)	// gets access to form state
    const {
        current
    } = formRef || {}

    const {
        values = {},
        touched = {},
        errors = {},
        // status = {},
        setValues = () => { },
        setErrors = () => { },
        resetForm = () => { },
        setTouched = () => { },
        setFieldValue = () => { },
        setStatus = () => { },
    } = current || {}

    /*
    * This effect is used to update the current predicted lotNumber on an interval
    * The lotNumber here is just used for display, the actual assigned lotNumber should be handled on the backend
    * */
    useEffect(() => {
        getCount()
        let lotNumberTimer = setInterval(() => {
            getCount()
        }, 5000)

        return () => {
            clearInterval(lotNumberTimer)
        }
    }, [])

    // when card id changes, update card
    useEffect(() => {
        setCard(cards[props.cardId] || null)
    }, [props.cardId])

    /*
    * This effect is used to determine which lotTemplateId / lotTemplate to use
    * */
    useEffect(() => {
        let tempLotTemplateId = selectedLotTemplatesId  // set template id to selected template from redux - set by sidebar when you pick a template

        // if a template isn't provided by redux, check if card has template id
        if (!tempLotTemplateId && isObject(card) && card?.lotTemplateId) {
            tempLotTemplateId = card?.lotTemplateId
        }

        // if card also doesn't have template id, use lastLotTemplateId from localstorage
        if (!tempLotTemplateId) tempLotTemplateId = lastLotTemplateId

        // get lottemplate using id
        let tempLotTemplate = lotTemplates[tempLotTemplateId]

        // if the template wasn't found, default everything to use BASIC_LOT_TEMPLATE
        if (!lotTemplates[tempLotTemplateId]) {
            tempLotTemplateId = BASIC_LOT_TEMPLATE_ID
            tempLotTemplate = BASIC_LOT_TEMPLATE
        }

        setLotTemplateId(tempLotTemplateId)
        setLotTemplate(tempLotTemplate)
    }, [selectedLotTemplatesId, card, lotTemplates, lastLotTemplateId])


    /*
    * This effect is used to update localSettings with the last used lotTemplateId
    * */
    useEffect(() => {
        // only post to local settings if localsettings have been loaded. Otherwise this could overwrite the stored localsettings with the initial (default) values
        if(localSettingsLoaded && (lotTemplateId !== null) && (lastLotTemplateId !== lotTemplateId)) {
            const {
                localSettings
            } = localReducer || {}

            dispatchPostLocalSettings({
                ...localSettings,
                lastLotTemplateId: lotTemplateId,
            })
        }
    }, [lotTemplateId, localSettingsLoaded, lastLotTemplateId])


    /*
    * This effect is used as a callback to call createLot after other useStates have run.
    * */
    useEffect(() => {
        if (lazyCreate) {
            setLazyCreate(false)
            createLot(selectedIndex, onAddCallback)
        }
    }, [lazyCreate])

    useEffect(() => {
        if(!showStatusListLazy) {
            setShowStatusListLazy(null)
            if(showStatusList) {
                setShowStatusList(false)
            }
        }
    }, [showStatusListLazy])

    /*
    * This hook is used for updating mappedValues, errors, touched state from form values when selectedIndex is changed
    * */
    useEffect(() => {
        if (isArray(mappedValues) && mappedValues.length > 0 && selectedIndex !== previousSelectedIndex && previousSelectedIndex !== null) {
            setMappedValues(immutableReplace(mappedValues, values, previousSelectedIndex))	// update mapped values
            setMappedTouched(immutableReplace(mappedTouched, touched, previousSelectedIndex))	// update mapped touched
            // setMappedStatus(immutableReplace(mappedStatus, status, previousSelectedIndex))	// update mapped status
        }

    }, [values, selectedIndex])

    /*
    * This hook is used for updating form values from stored mapped state when selectedIndex is changed
    * */
    useEffect(() => {
        if (isArray(mappedValues) && mappedValues.length > 0 && mappedValues[selectedIndex] && selectedIndex !== previousSelectedIndex) {
            // get mapped state for current selectedIndex value
            const currMappedValue = mappedValues[selectedIndex] || {}
            const currMappedError = mappedErrors[selectedIndex] || {}
            const currMappedTouched = mappedTouched[selectedIndex] || {}
            const currMappedStatus = mappedStatus[selectedIndex] || {}

            resetForm()	// reset when switching

            // update form state
            setValues(currMappedValue)
            setErrors(currMappedError)
            setTouched(currMappedTouched)
            setStatus(currMappedStatus)
        }
    }, [mappedValues, selectedIndex])


    /*
    * Updates collectionCount state var, used for displaying predicted lot number
    * */
    const getCount = async () => {
        const count = await getCardsCount()
        setCollectionCount(count)
    }

    /*
    * This function handles the logic for when the create button in the paste form is clicked
    * */
    const handlePasteFormCreateClick = (payload) => {

        let tempMappedValues = []

        setPasteMapperHidden(true)		// hide paste form
        setShowPasteMapper(false)			// don't render paste form
        setPasteTable([])					// clear pasteTable
        setShowStatusList(true)			// display statusList

        // run validation for each lot
        payload.forEach((currMappedLot, currMappedLotIndex) => {

            let newLot = convertPastePayloadToLot(currMappedLot, lotTemplate, props.processId)		// convert to lot format
            tempMappedValues.push(newLot)

            // update status
            setMappedStatus((previous) => {
                const previousStatus = previous[selectedIndex] || {}
                return immutableSet(previous, {
                    ...previousStatus,
                    validationStatus: {
                        message: `Validating lot.`,
                        code: FORM_STATUS.VALIDATION_START
                    },
                    resourceStatus: {
                        message: `-`,
                        code: FORM_STATUS.NOT_STARTED
                    },
                }, currMappedLotIndex)
            })

            // set touched
            const updatedTouched = setNestedObjectValues(newLot, true)
            setMappedTouched((previous) => {
                const previousTouched = previous[currMappedLotIndex] || {}
                return immutableSet(previous, {
                    ...previousTouched,
                    ...updatedTouched
                }, currMappedLotIndex)
            })

            validateLot(newLot, currMappedLotIndex)		// validate that bad boy
        })

        setMappedValues(tempMappedValues)				// set mapped values to payload provided from paste form
    }

    /*
    * This effect runs whenever lotTemplate changes
    * It sets fieldNameArr to an array of all the fieldNames in the current template.
    * If there is no change in fieldNameArr, no update is performed. Otherwise it updates the array whenever lotTemplate changes
    *
    * This is necessary in order to update initialValues when a lotTemplate is edited
    * */
    useEffect(() => {
        // get fields
        const {
            fields
        } = lotTemplate || {}

        // check if array to prevent errors
        if (isArray(fields)) {

            let newFieldNameArr = [] // initialze arr for storing fieldNames

            fields.forEach((currRow) => {	// loop through rows
                currRow.forEach((currItem) => {	// loop through items

                    // extract properties
                    const {
                        fieldName,
                        component,
                        dataType,
                        _id
                    } = currItem || {}

                    if (component === FIELD_COMPONENT_NAMES.CALENDAR_START_END) {
                        newFieldNameArr.push({ _id, fieldName: `${fieldName}`, index: 0, dataType: dataType, displayName: `${fieldName} (start)` })
                        newFieldNameArr.push({ _id, fieldName: `${fieldName}`, index: 1, dataType: dataType, displayName: `${fieldName} (end)` })
                    }
                    else {
                        newFieldNameArr.push({ _id, fieldName, dataType: component, displayName: fieldName })
                    }

                })
            })

            setFieldNameArr([
                // ...REQUIRED_FIELDS,
                {
                    ...NAME_FIELD,
                    displayName: getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)
                },
                {
                    ...COUNT_FIELD,
                    displayName: getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)
                },
                ...newFieldNameArr,
            ])
        }
    }, [lotTemplate])

    useEffect(() => {
        let tempCardNames = []

        Object.values(cards).forEach((currCard) => {
            const {
                name,
                _id: currLotId
            } = currCard || {}

            tempCardNames.push({name, id: currLotId})
        })

        setCardNames(tempCardNames)
    }, [cards])

    /*
    * listen for paste event to migrate excel data
    * */
    useEffect(() => {
        // add event listener to 'paste'
        document.addEventListener("paste", onPasteEvent);

        // on dismount remove the event pasteListener
        return () => {
            document.removeEventListener("paste", onPasteEvent);
        };
    }, [disablePasteModal])

    const handleValidate = (values) => {
        if (selectedIndex !== null) {
            validateLot(values, selectedIndex)
        }
    }

    const setPending = (index) => {
        const values = mappedValues[index]
        if (values._id) return

        // update status
        setMappedStatus((previous) => {
            const previousStatus = previous[index] || {}
            return immutableSet(previous, {
                ...previousStatus,
                resourceStatus: {
                    message: `Waiting.`,
                    code: FORM_STATUS.WAITING
                }
            }, index)
        })
    }

    /*
    * handles logic for creating a lot from mappedValues
    * */
    const createLot = async (index, cb) => {
        if(!createdLot) setCreatedLot(true)
        const values = mappedValues[index]
        if (values._id) return	// lot was already created, don't try creating it again

        // update status
        setMappedStatus((previous) => {
            const previousStatus = previous[index] || {}
            return immutableSet(previous, {
                ...previousStatus,
                resourceStatus: {
                    message: `Started.`,
                    code: FORM_STATUS.CREATE_START
                }
            }, index)
        })

        // re-run validation right before submitting to ensure there are no errors
        try {
            const validationResult = validateLot(values, index)

            const hasErrors = validationResult instanceof ValidationError

            if (hasErrors) {
                // update status - found errors so create is cancelled
                setMappedStatus((previous) => {
                    const previousStatus = previous[index] || {}
                    return immutableSet(previous, {
                        ...previousStatus,
                        resourceStatus: {
                            message: `Creation cancelled due to validation errors.`,
                            code: FORM_STATUS.VALIDATION_ERROR
                        }
                    }, index)
                })
            }
            else {
                // no errors, POST it
                const {
                    name: newName,
                    bins: newBins,
                    processId: newProcessId,
                    fields
                } = values || {}

                const submitItem = {
                    name: newName,
                    bins: newBins,
                    process_id: newProcessId,
                    lotTemplateId: lotTemplateId,
                    fields,
                    lotNumber: index //collectionCount + index
                }

                await dispatchPostCard(submitItem)
                    .then((result) => {
                        if (result) {
                            // successfully POSTed
                            const {
                                _id = null
                            } = result || {}

                            // update status, POST success
                            setMappedStatus((previous) => {
                                const previousStatus = previous[index] || {}
                                return immutableSet(previous, {
                                    ...previousStatus,
                                    resourceStatus: {
                                        message: `Successfully created lot!`,
                                        code: FORM_STATUS.CREATE_SUCCESS
                                    }
                                }, index)
                            })

                            // update values (only difference should be ID added and maybe lotNumber was different
                            setMappedValues((previous) => {
                                return immutableSet(previous, {
                                    ...result
                                }, index)
                            })

                            // call callback if provided
                            cb && cb(_id)
                        }

                        else {
                            // POST error, update status
                            setMappedStatus((previous) => {
                                const previousStatus = previous[index] || {}
                                return immutableSet(previous, {
                                    ...previousStatus,
                                    resourceStatus: {
                                        message: `Error creating lot.`,
                                        code: FORM_STATUS.CREATE_ERROR
                                    }
                                }, index)
                            })
                        }
                    })
                    .catch((err) => {

                        setMappedStatus((previous) => {
                            const previousStatus = previous[index] || {}
                            return immutableSet(previous, {
                                ...previousStatus,
                                resourceStatus: {
                                    message: `Error creating lot.`,
                                    code: FORM_STATUS.CREATE_ERROR
                                }
                            }, index)
                        })
                    })
            }
        }

        catch(err) {
            console.error("create err",err)
        }
    }

    /*
    * runs async validation for a lot and  updates its status
    * */
    const validateLot = (values, index) => {
        try {
            uniqueNameSchema.validateSync({
                name: values.name,
                cardNames: cardNames,
            }, {abortEarly: false})

            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {}
                return immutableSet(previous, {
                    ...previousStatus,
                    warnings: {}
                }, index)
            })
        }
        catch(err) {
            const {
                inner = [],
                // message
            } = err || {}

            let lotErrors = {}

            // collect errors
            inner.forEach((currErr) => {
                const {
                    // errors,
                    path,
                    message,
                    value
                } = currErr || {}

                const {
                    fieldName
                } = value || {}

                const errorObj = isObject(value) ? {[fieldName]: message} : pathStringToObject(path, ".", message)

                lotErrors = {
                    ...lotErrors,
                    ...errorObj
                }
            })

            // set touched
            const updatedTouched = setNestedObjectValues(values, true)
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {}
                return immutableSet(previous, {
                    ...previousTouched,
                    ...updatedTouched
                }, index)
            })

            // set errors
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {}
                return immutableSet(previous, {
                    ...previousStatus,
                    warnings: lotErrors
                }, index)
            })
        }

        try {
            editLotSchema.validateSync(values, { abortEarly: false })

            // clear errors and  touched
            setMappedErrors((previous) => {
                return immutableSet(previous, {}, index)
            })
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {}
                return immutableSet(previous, {
                    ...previousTouched
                }, index)
            })

            // update status with success
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {}
                return immutableSet(previous, {
                    ...previousStatus,
                    validationStatus: {
                        message: `Successfully validated lot!`,
                        code: FORM_STATUS.VALIDATION_SUCCESS
                    }
                }, index)
            })
        }

        catch(err) {
            // oh no there was an error
            const {
                inner = [],
                // message
            } = err || {}

            let lotErrors = {}

            // collect errors
            inner.forEach((currErr) => {
                const {
                    // errors,
                    path,
                    message,
                    value
                } = currErr || {}

                const {
                    fieldName
                } = value || {}

                const errorObj = isObject(value) ? {[fieldName]: message} : pathStringToObject(path, ".", message)

                lotErrors = {
                    ...lotErrors,
                    ...errorObj
                }
            })

            // update status with errors
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {}
                return immutableSet(previous, {
                    ...previousStatus,
                    validationStatus: {
                        message: `Error validating lot.`,
                        code: FORM_STATUS.VALIDATION_ERROR
                    }
                }, index)
            })

            // set errors
            setMappedErrors((previous) => {
                return immutableSet(previous, lotErrors, index)
            })

            // set touched
            const updatedTouched = setNestedObjectValues(lotErrors, true)
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {}
                return immutableSet(previous, {
                    ...previousTouched,
                    ...updatedTouched
                }, index)
            })

            return err
        }

        // return
    }

    /*
    * Event handler for paste events
    *
    * converts tabular data to an array of arrays structure (1 column X n rows)
    * */
    const onPasteEvent = useCallback((e) => {
        const plainText = e.clipboardData.getData('text/plain')	// get clipboard data

        var rows = plainText.split("\n");
        let table = []

        for (var y in rows) {

            var cells = rows[y].split("\t")

            for (const x in cells) {

                if (table[x]) {
                    table[x].push(cells[x])
                }
                else {
                    table.push([cells[x]])
                }
            }
        }

        setPasteTable(table)	// set paste table

        // need to call setShowSimpleModal with tiny delay in order to allow normal pasting
        if (!disablePasteModal) {
            setTimeout(() => {
                setShowSimpleModal(true)
            }, 0)
        }

        return true
    }, [disablePasteModal])

    /*
    * callback function used in createLot when submit is called from inside lot editor
    *
    * Updates form values with id of created lot
    * */
    const onAddCallback = (id) => {
        setFieldValue("_id", id)
    }

    return (
        <styled.Container
            isOpen={true}
            onRequestClose={() => {
                // close()
                props.close()

            }}
            contentLabel="Lot Editor Form"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                content: {

                }
            }}
        >
            {showStatusList &&
                <StatusList
                    displayNames={lotTemplate?.displayNames || {}}
                    onItemClick={(item) => {
                        setSelectedIndex(item.index)
                        setShowStatusListLazy(false)
                    }}
                    onCreateClick={createLot}
                    onCreateAllClick={async () => {
                        for (let i = 0; i < mappedValues.length; i++) {
                            setPending(i)
                        }
                        for (let i = 0; i < mappedValues.length; i++) {
                            await createLot(i)
                        }
                    }}
                    onCanceleClick={() => {
                        setShowStatusList(false)
                        setPasteTable([])
                        setSelectedIndex(null)
                        setMappedValues([])

                        if(createdLot) {
                            props.close()
                        }
                    }}

                    onShowMapperClick={() => {
                        setShowStatusList(false)
                        setShowPasteMapper(true)
                        setPasteMapperHidden(false)
                    }}
                    data={mappedValues.map((currValue, currIndex) => {
                        const {
                            name
                        } = currValue

                        const wholeVal = mappedValues[currIndex]

                        const {
                            _id
                        } = wholeVal

                        const currStatus = mappedStatus[currIndex] || {}
                        return {
                            errors: mappedErrors[currIndex] || {},
                            title: name,
                            created: !!_id,
                            ...currStatus,
                            index: currIndex
                        }
                    })}

                />
            }
            {showPasteMapper &&
                <PasteForm
                    hidden={pasteMapperHidden}
                    reset={resetPasteTable}
                    availableFieldNames={[
                        ...fieldNameArr,

                    ]}
                    onCancel={() => {
                        setShowPasteMapper(false)
                        setPasteMapperHidden(true)
                        setPasteTable([])	// clear table
                    }}

                    table={pasteTable}
                    // onPreviewClick={(payload) => {
                    // 	// setShowPasteMapper(false)
                    // 	// setShowProcessSelector(true)
                    // 	setMappedValues(payload)
                    // 	setSelectedIndex(0)
                    // 	setPasteMapperHidden(true)
                    // }}
                    onCreateClick={(payload) => {
                        handlePasteFormCreateClick(payload)
                    }}
                />
            }

            {showSimpleModal &&
                <SimpleModal
                    isOpen={true}
                    title={"Paste Event Detected"}
                    onRequestClose={() => setShowSimpleModal(false)}
                    onCloseButtonClick={() => setShowSimpleModal(false)}
                    handleOnClick2={() => {
                        setShowPasteMapper(true)
                        setPasteMapperHidden(false)
                        setShowSimpleModal(false)

                        setResetPasteTable(true)
                        setTimeout(() => {
                            setResetPasteTable(false)
                        }, 250)
                        setDisablePasteModal(false)

                    }}
                    handleOnClick1={() => {
                        setShowSimpleModal(false)
                        setDisablePasteModal(true)
                    }}
                    button_2_text={"Yes"}
                    button_1_text={"No"}

                >
                    <styled.SimpleModalText>A paste event was detected. Would you like to use pasted data to create lots?</styled.SimpleModalText>
                </SimpleModal>
            }

            <LotEditor
                cardNames={cardNames}
                lotTemplateName={lotTemplateName}
                onAddClick={() => {
                    /*
                    * Note: createLot function uses mappedValues and the index within mappedValues to retrieve data for which lot to create
                    * Therefore, before createLot is called, mappedValues must be updated.
                    *
                    * If you call setMappedValues and then directly call createLot, createLot will run before mappedValues is updated.
                    *
                    * Therefore, instead of directly calling createLot, lazyCreate is set to true. A useEffect hook listens for changes to lazyCreate, and then calls createLot when lazyCreate is true. This ensures mappedValues is updated before createLot is called
                    *
                    *
                    * */
                    // const newValue = convertLotToExcel(values, lotTemplateId)						// convert form values format to mapped excel format
                    setMappedValues(immutableReplace(mappedValues, values, selectedIndex))		// update mapped state
                    setMappedErrors(immutableReplace(mappedErrors, errors, selectedIndex))			// update mapped state
                    setMappedTouched(immutableReplace(mappedTouched, touched, selectedIndex))		// update mapped state
                    setLazyCreate(true)														// have to submit in round-about way in order to ensure other state variables are up-to-date first
                }}
                collectionCount={parseInt((collectionCount + 1))}
                lotTemplateId={lotTemplateId}
                lotTemplate={lotTemplate}
                showProcessSelector={props.showProcessSelector || (isArray(mappedValues) && mappedValues.length > 0)}
                hidden={showStatusList || showPasteMapper}
                onShowCreateStatusClick={() => {
                    setShowStatusList(true)
                    setSelectedIndex(null)
                }}

                disabledAddButton={(isArray(mappedValues) && mappedValues.length > 0)}
                formRef={formRef}
                showCreationStatusButton={(isArray(mappedValues) && mappedValues.length > 0)}
                showPasteIcon={isNonEmptyArray(pasteTable)}
                onPasteIconClick={() => {
                    setShowPasteMapper(true)
                    setPasteMapperHidden(false)
                    setResetPasteTable(true)
                    setTimeout(() => {
                        setResetPasteTable(false)
                    }, 250)
                    setDisablePasteModal(false)
                }}
                {...props}
                cardId={(props.cardId !== null) ? props.cardId : values._id ? values._id : null}
                onValidate={handleValidate}
                footerContent={() =>
                    (isArray(mappedValues) && mappedValues.length > 0) &&
                    <styled.PageSelector>
                        <styled.PageSelectorButton className="fas fa-chevron-left"
                            onClick={() => {
                                if (selectedIndex > 0) {
                                    setSelectedIndex(selectedIndex - 1)
                                }
                            }}
                        />
                        <styled.PageSelectorText>{selectedIndex + 1}/{mappedValues.length}</styled.PageSelectorText>
                        <styled.PageSelectorButton className="fas fa-chevron-right"
                            onClick={() => {
                                if (selectedIndex < mappedValues.length - 1) {
                                    setSelectedIndex(selectedIndex + 1)
                                }

                            }}
                        />
                    </styled.PageSelector>
                }
            />
        </styled.Container>
    );
};

LotEditorContainer.propTypes = {

};

export default LotEditorContainer;
