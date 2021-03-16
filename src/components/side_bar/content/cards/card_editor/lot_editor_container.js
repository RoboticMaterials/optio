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
import { editLotSchema } from "../../../../../methods/utils/form_schemas";
import { immutableReplace, immutableSet, isArray, isNonEmptyArray } from "../../../../../methods/utils/array_utils";
import { convertExcelToLot, convertLotToExcel } from "../../../../../methods/utils/card_utils";
import { isObject, pathStringToObject } from "../../../../../methods/utils/object_utils";
import { getDisplayName } from "../../../../../methods/utils/lot_utils";

// styles
import * as styled from "./lot_editor_container.style";



const LotEditorContainer = (props) => {

    // actions
    const dispatch = useDispatch()
    const dispatchPostCard = async (card) => await dispatch(postCard(card))

    // redux state
    const selectedLotTemplatesId = useSelector(state => { return state.lotTemplatesReducer.selectedLotTemplatesId })
    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}
    const cards = useSelector(state => { return state.cardsReducer.cards })

    // component state
    const [mappedStatus, setMappedStatus] = useState([])						// array of form status objects
    const [selectedIndex, setSelectedIndex] = useState(null)					// current selected index for mapped data arrays (values, errors, touched, etc)
    const [mappedValues, setMappedValues] = useState([])						// array of form values objects
    const [mappedErrors, setMappedErrors] = useState([])						// array of form errors objects
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
    const [lotTemplateId, setLotTemplateId] = useState([])
    const [card, setCard] = useState(cards[props.cardId] || null)
    const [collectionCount, setCollectionCount] = useState(null)
    const [lazyCreate, setLazyCreate] = useState(false)

    const previousSelectedIndex = usePrevious(selectedIndex) // needed for useEffects

    const formRef = useRef(null)	// gets access to form state
    const {
        current
    } = formRef || {}

    const {
        values = {},
        touched = {},
        errors = {},
        setValues = () => { },
        setErrors = () => { },
        resetForm = () => { },
        setTouched = () => { },
        setFieldValue = () => { },
    } = current || {}

    useEffect(() => {
        getCount()
        let lotNumberTimer = setInterval(() => {
            getCount()
        }, 5000)

        return () => {
            clearInterval(lotNumberTimer)
        }
    }, [])

    useEffect(() => {
        setCard(cards[props.cardId] || null)
    }, [props.cardId])

    useEffect(() => {
        let tempLotTemplateId = selectedLotTemplatesId  // set template id to selected template from redux - set by sidebar when you pick a template

        // if a template isn't provided by redux, check if card has template id
        if (!tempLotTemplateId && isObject(card) && card?.lotTemplateId) {
            tempLotTemplateId = card?.lotTemplateId
        }

        if (!tempLotTemplateId) tempLotTemplateId = BASIC_LOT_TEMPLATE_ID
        let tempLotTemplate = lotTemplates[tempLotTemplateId] || BASIC_LOT_TEMPLATE
        if (!lotTemplates[tempLotTemplateId]) {
            tempLotTemplateId = BASIC_LOT_TEMPLATE_ID
            tempLotTemplate = BASIC_LOT_TEMPLATE
        }

        setLotTemplateId(tempLotTemplateId)
        setLotTemplate(tempLotTemplate)
    }, [selectedLotTemplatesId, card, lotTemplates])


    useEffect(() => {
        if (lazyCreate) {
            setLazyCreate(false)
            createLot(selectedIndex, onAddCallback)
        }
    }, [lazyCreate])

    /*
    * This hook is used for updating mappedValues, errors, touched state from form values when selectedIndex is changed
    * */
    useEffect(() => {
        if (isArray(mappedValues) && mappedValues.length > 0 && selectedIndex !== previousSelectedIndex && previousSelectedIndex !== null) {
            const newValue = convertLotToExcel(values, lotTemplateId)							// convert values format from form to excel
            setMappedValues(immutableReplace(mappedValues, newValue, previousSelectedIndex))	// update mapped values
            setMappedErrors(immutableReplace(mappedErrors, errors, previousSelectedIndex))		// update mapped errors
            setMappedTouched(immutableReplace(mappedTouched, touched, previousSelectedIndex))	// update mapped touched
        }
    }, [values, selectedIndex])

    /*
    * This hook is used for updating form values from mapped state when selectedIndex is changed
    * */
    useEffect(() => {
        if (isArray(mappedValues) && mappedValues.length > 0 && mappedValues[selectedIndex] && selectedIndex !== previousSelectedIndex) {
            // get mapped state for current selectedIndex value
            const currMappedValue = mappedValues[selectedIndex] || {}
            const currMappedError = mappedErrors[selectedIndex] || {}
            const currMappedTouched = mappedTouched[selectedIndex] || {}

            // convert format from excel to form
            const currMappedLot = convertExcelToLot(currMappedValue, lotTemplate, values.processId)

            resetForm()	// reset when switching

            // update form state
            setValues(currMappedLot)
            setErrors(currMappedError)
            setTouched(currMappedTouched)
        }
    }, [mappedValues, selectedIndex])


    /*
    * Updates collectionCount state var, used for displaying lot number
    * */
    const getCount = async () => {
        const count = await getCardsCount()
        setCollectionCount(count)
    }

    /*
    * This function handles the logic for when the create button in the paste form is clicked
    * */
    const handlePasteFormCreateClick = (payload) => {


        setMappedValues(payload)				// set mapped values to payload provided from paste form
        setPasteMapperHidden(true)		// hide paste form
        setShowPasteMapper(false)			// don't render paste form
        setPasteTable([])					// clear pasteTable
        setShowStatusList(true)			// display statusList

        // run validation for each lot
        payload.forEach((currMappedLot, currMappedLotIndex) => {

            let newLot = convertExcelToLot(currMappedLot, lotTemplate, props.processId)		// convert to lot format

            // update status
            setMappedStatus((previous) => {
                return immutableSet(previous, {
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


            validateLot(newLot, currMappedLotIndex)		// validate that bad boy
        })
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
                        dataType
                    } = currItem || {}

                    if (component === FIELD_COMPONENT_NAMES.CALENDAR_START_END) {
                        newFieldNameArr.push({ fieldName: `${fieldName}`, index: 0, dataType: dataType, displayName: `${fieldName} (start)` })
                        newFieldNameArr.push({ fieldName: `${fieldName}`, index: 1, dataType: dataType, displayName: `${fieldName} (end)` })
                    }
                    else {
                        newFieldNameArr.push({ fieldName, dataType: component, displayName: fieldName })
                    }

                })
            })

            setFieldNameArr(newFieldNameArr)
        }
    }, [lotTemplate])

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

            editLotSchema.validate(values, { abortEarly: false })
                .then((ayo) => {
                    const previousStatus = mappedStatus[selectedIndex] || {}
                    setMappedStatus((previous) => {
                        return immutableSet(previous, {
                            ...previousStatus,
                            validationStatus: {
                                message: `Successfully validated lot!`,
                                code: FORM_STATUS.VALIDATION_SUCCESS
                            }
                        }, selectedIndex)
                    })
                })
                .catch((err) => {
                    const previousStatus = mappedStatus[selectedIndex] || {}
                    setMappedStatus((previous) => {
                        return immutableSet(previous, {
                            ...previousStatus,
                            validationStatus: {
                                message: `Error validating lot.`,
                                code: FORM_STATUS.VALIDATION_ERROR
                            }
                        }, selectedIndex)
                    })
                });
        }
    }

    /*
    * handles logic for creating a lot from mappedValues
    * */
    const createLot = (index, cb) => {
        if(!createdLot) setCreatedLot(true)
        const values = convertExcelToLot(mappedValues[index], lotTemplate, props.processId)		// convert mappedValues at selectedIndex to form format
        if (values._id) return	// lot was already created, don't try creating it again

        // update status
        const previousStatus = mappedStatus[index] || {}
        setMappedStatus((previous) => {
            return immutableSet(previous, {
                ...previousStatus,
                resourceStatus: {
                    message: `Started creating lot.`,
                    code: FORM_STATUS.CREATE_START
                }
            }, index)
        })

        // re-run validation right before submitting to ensure there are no errors
        validateLot(values, index)
            .then((validationResult) => {
                const hasErrors = validationResult instanceof ValidationError

                if (hasErrors) {
                    // update status - found errors so create is cancelled
                    const previousStatus = mappedStatus[index] || {}
                    setMappedStatus((previous) => {
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
                        [lotTemplateId]: templateValues,
                    } = values || {}

                    const submitItem = {
                        name: newName,
                        bins: newBins,
                        process_id: newProcessId,
                        lotTemplateId: lotTemplateId,
                        ...templateValues,
                        lotNumber: index //collectionCount + index
                    }

                    dispatchPostCard(submitItem)
                        .then((result) => {
                            if (result) {
                                // successfully POSTed
                                const {
                                    _id = null
                                } = result || {}

                                // update status, POST success
                                const previousStatus = mappedStatus[index] || {}
                                setMappedStatus((previous) => {
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
                                const previousStatus = mappedStatus[index] || {}
                                setMappedStatus((previous) => {
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
                            const previousStatus = mappedStatus[index] || {}
                            setMappedStatus((previous) => {

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
            })
        // .catch(() => {
        // })
    }

    /*
    * runs async validation for a lot and  updates its status
    * */
    const validateLot = (values, index) => {
        return editLotSchema.validate(values, { abortEarly: false })
            .then(() => {
                // clear errors and  touched
                setMappedErrors((previous) => {
                    return immutableSet(previous, {}, index)
                })
                setMappedTouched((previous) => {
                    return immutableSet(previous, {}, index)
                })

                // update status with success
                const previousStatus = mappedStatus[index] || {}
                setMappedStatus((previous) => {
                    return immutableSet(previous, {
                        ...previousStatus,
                        validationStatus: {
                            message: `Successfully validated lot!`,
                            code: FORM_STATUS.VALIDATION_SUCCESS
                        }
                    }, index)
                })
            })
            .catch((err) => {
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
                        message
                    } = currErr || {}

                    // let existingErrors = lotErrors[path] || []

                    const errorObj = pathStringToObject(path, ".", message)

                    lotErrors = {
                        ...lotErrors,
                        ...errorObj
                    }
                })

                // update status with errors
                const previousStatus = mappedStatus[index] || {}
                setMappedStatus((previous) => {
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
                    return immutableSet(previous, updatedTouched, index)
                })

                return err
            });
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
                    zIndex: 500
                },
                content: {

                }
            }}
        >
            {showStatusList &&
                <StatusList
                    onItemClick={(item) => {
                        setSelectedIndex(item.index)
                        setShowStatusList(false)
                    }}
                    onCreateClick={createLot}
                    onCreateAllClick={() => {
                        for (let i = 0; i < mappedValues.length; i++) {
                            createLot(i)
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
                        // ...REQUIRED_FIELDS,
                        {
                            ...NAME_FIELD,
                            displayName: getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)
                        },
                        {
                            ...COUNT_FIELD,
                            displayName: getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)
                        }
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
                    handleOnClick1={() => {
                        setShowPasteMapper(true)
                        setPasteMapperHidden(false)
                        setShowSimpleModal(false)

                        setResetPasteTable(true)
                        setTimeout(() => {
                            setResetPasteTable(false)
                        }, 250)
                        setDisablePasteModal(false)

                    }}
                    handleOnClick2={() => {
                        setShowSimpleModal(false)
                        setDisablePasteModal(true)
                    }}
                    button_1_text={"Yes"}
                    button_2_text={"No"}

                >
                    <styled.SimpleModalText>A paste event was detected. Would you like to use pasted data to create lots?</styled.SimpleModalText>
                </SimpleModal>
            }

            <LotEditor
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
                    const newValue = convertLotToExcel(values, lotTemplateId)						// convert form values format to mapped excel format
                    setMappedValues(immutableReplace(mappedValues, newValue, selectedIndex))		// update mapped state
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
