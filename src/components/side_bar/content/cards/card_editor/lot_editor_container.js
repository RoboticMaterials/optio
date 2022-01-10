import React, {
    useState,
    useMemo,
    useRef,
    useEffect,
    useCallback,
} from "react";
import { useFilePicker } from "use-file-picker";
import { useHistory, useParams } from 'react-router-dom'
// actions
import { postCard, putCard } from "../../../../../redux/actions/card_actions";

// api
import { getCardsCount } from "../../../../../api/cards_api";

// components internal
import LotEditor from "./lot_editor";
import StatusList from "../../../../basic/status_list/status_list";
import { PasteForm } from "../../../../basic/paste_mapper/paste_mapper";
import SimpleModal from "../../../../basic/modals/simple_modal/simple_modal";
import BackButton from "../../../../basic/back_button/back_button";
import LotCreatorForm from "../lot_template_editor/template_form";

// constants
import {
    BASIC_LOT_TEMPLATE,
    BASIC_LOT_TEMPLATE_ID,
    COUNT_FIELD,
    DEFAULT_COUNT_DISPLAY_NAME,
    DEFAULT_NAME_DISPLAY_NAME,
    FIELD_COMPONENT_NAMES,
    FORM_STATUS,
    NAME_FIELD,
} from "../../../../../constants/lot_contants";

// functions external
import PropTypes from "prop-types";
import { setNestedObjectValues } from "formik";
import { ValidationError } from "yup";
import { useDispatch, useSelector } from "react-redux";

// hooks
import usePrevious from "../../../../../hooks/usePrevious";

// utils
import {
    editLotSchema,
    uniqueNameSchema,
} from "../../../../../methods/utils/form_schemas";
import {
    immutableReplace,
    immutableSet,
    isArray,
    isNonEmptyArray,
} from "../../../../../methods/utils/array_utils";
import { convertPastePayloadToLot } from "../../../../../methods/utils/card_utils";
import {
    isObject,
    pathStringToObject,
} from "../../../../../methods/utils/object_utils";
import { getDisplayName } from "../../../../../methods/utils/lot_utils";
import { parseXML, parseCSV } from "../../../../../methods/utils/parsing_utils";

// styles
import * as styled from "./lot_editor_container.style";
import { postLocalSettings } from "../../../../../redux/actions/local_actions";
import { putProcesses } from "../../../../../redux/actions/processes_actions";
import { postLotTemplate } from '../../../../../redux/actions/lot_template_actions';
import LotHistory from "../lot_history/lot_history";

const LotEditorContainer = (props) => {
    const { merge, onClose } = props;

    const params = useParams()
    const history = useHistory()

    // actions
    const dispatch = useDispatch();
    const dispatchPostCard = async (card) => await dispatch(postCard(card));
    const dispatchPutCard = async (card, cardId) =>
        await dispatch(putCard(card, cardId));
    const dispatchPostLocalSettings = (settings) =>
        dispatch(postLocalSettings(settings));
    const dispatchPutProcess = (process, processId) =>
        dispatch(putProcesses(process, processId));

    // redux state
    // const selectedLotTemplatesId = useSelector(state => { return state.lotTemplatesReducer.selectedLotTemplatesId })
    const lotTemplates =
        useSelector((state) => {
            return state.lotTemplatesReducer.lotTemplates;
        }) || {};
    const cards = useSelector((state) => {
        return state.cardsReducer.cards;
    });
    const localReducer = useSelector((state) => state.localReducer) || {};
    const process = useSelector((state) => state.processesReducer.processes)[
        props.processId
    ];
    const { loaded: localSettingsLoaded, localSettings } = localReducer;
    const { lastLotTemplateId = null } = process || {};

    // component state
    const [mappedStatus, setMappedStatus] = useState([]); // array of form status objects
    const [selectedIndex, setSelectedIndex] = useState(null); // current selected index for mapped data arrays (values, errors, touched, etc)
    const [mappedValues, setMappedValues] = useState([]); // array of form values objects
    const [mappedErrors, setMappedErrors] = useState([]); // array of form errors objects
    // const [mappedWarnings, setMappedWarnings] = useState([])						// array of form errors objects
    const [mappedTouched, setMappedTouched] = useState([]); // array of form touched objects
    const [pasteTable, setPasteTable] = useState([]); // array structure for mapping pasted table
    const [disablePasteModal, setDisablePasteModal] = useState(false); // bool - used to determine whether or not to show the paste modal
    const [resetPasteTable, setResetPasteTable] = useState(false); // bool - used to reset values in pasteForm
    const [showPasteMapper, setShowPasteMapper] = useState(false); // bool - used for whether or not to render pasteForm
    const [showSimpleModal, setShowSimpleModal] = useState(false); // bool - controls rendering of simple modal for pasting
    const [pasteMapperHidden, setPasteMapperHidden] = useState(true); // bool - controls whether or not paste form is hidden (this is distinct from rendering)
    const [showStatusList, setShowStatusList] = useState(false); // bool - controls whether or not to show statusList
    const [createdLot, setCreatedLot] = useState(false); // bool - controls whether or not to show statusList
    const [fieldNameArr, setFieldNameArr] = useState([]);

    const [lotTemplateId, setLotTemplateId] = useState(null);
    const lotTemplate = useMemo(
        () => lotTemplates[lotTemplateId],
        [lotTemplates, lotTemplateId]
    );
    const { name: lotTemplateName = "" } = lotTemplate || {};

    const [card, setCard] = useState(cards[props.cardId] || null);
    const [collectionCount, setCollectionCount] = useState(null);
    const [lazyCreate, setLazyCreate] = useState(false);

    const [cardNames, setCardNames] = useState([]);
    const [showStatusListLazy, setShowStatusListLazy] = useState(null);

    const previousSelectedIndex = usePrevious(selectedIndex); // needed for useEffects
    const formRef = useRef(null); // gets access to form state
    const { current } = formRef || {};
    const {
        values = {},
        touched = {},
        errors = {},
        // status = {},
        setValues = () => {},
        setErrors = () => {},
        resetForm = () => {},
        setTouched = () => {},
        setFieldValue = () => {},
        setStatus = () => {},
    } = current || {};

    const [openFileSelector, { filesContent, loading, plainFiles }] =
        useFilePicker({
            multiple: false,
            readAs: "Text",
            readFilesContent: true,
            accept: [".xml", ".csv", 'xlsx'],
        });

    /*
     * This effect is used to update the current predicted lotNumber on an interval
     * The lotNumber here is just used for display, the actual assigned lotNumber should be handled on the backend
     * */
    useEffect(() => {
        getCount();
        handleSelectLotTemplate(
            !!props.cardId ? card.lotTemplateId : lastLotTemplateId
        ); // Initial Template
        let lotNumberTimer = setInterval(() => {
            getCount();
        }, 5000);

        return () => {
            clearInterval(lotNumberTimer);
        };
    }, []);

    useEffect(() => {
        if (!!filesContent[0]) {
            var content = filesContent[0].content;

            var extensionRe = /(?:\.([^.]+))?$/;
            let table;
            switch (
                extensionRe.exec(filesContent[0].name)[1] // Switch statement for file extension
            ) {
                case "csv":
                    table = parseCSV(content)
                    setPasteTable(table); // set paste table
                    break;
                case "xml":
                    table = parseXML(content);
                    setPasteTable(table);
                    break;
            }
            history.push(`/lots/${params.id}/paste`)
            setShowPasteMapper(true);
            setPasteMapperHidden(false);
            setShowSimpleModal(false);

            setResetPasteTable(true);
            setTimeout(() => {
                setResetPasteTable(false);
            }, 250);
            setDisablePasteModal(false);
        }

    }, [plainFiles.length]);

    useEffect(() => {
      if(params.subpage == 'create') {
        setShowPasteMapper(false);
        setPasteMapperHidden(true);
        setPasteTable([]); // clear table
        setShowStatusList(false); // display statusList
        setSelectedIndex(null);
        setMappedValues([]);
        setResetPasteTable(true)
      }
    },[params])

    // when card id changes, update card
    useEffect(() => {
        setCard(cards[props.cardId] || null);
    }, [props.cardId]);

    const handleSelectLotTemplate = (templateId) => {

        if (templateId === null) {
            templateId =
                Object.values(lotTemplates).find(
                    (lotTemplate) =>
                        (!process || lotTemplate.processId === process._id) &&
                        lotTemplate.name === "Basic"
                )?._id || null;
        }

        let newTemplateId = templateId;
        // if a template isn't provided by process, check if card has template id
        if (isObject(card) && card?.lotTemplateId) {
            if (!!templateId && templateId !== card.lotTemplateId) {
                dispatchPutCard(
                    { ...card, lotTemplateId: templateId },
                    card._id
                );
            } else {
                newTemplateId = card?.lotTemplateId;
            }
        }

        let template = lotTemplates[templateId];

        if (!isObject(card)) {
            // If you're in editing mode, dont update lastUsedTemplateId
            if (!!process)
                dispatchPutProcess(
                    {
                        ...process,
                        lastLotTemplateId: template?._id,
                    },
                    process._id
                );
        }

        setLotTemplateId(template?._id);

    };

    /*
     * This effect is used as a callback to call createLot after other useStates have run.
     * */
    useEffect(() => {
        if (lazyCreate) {
            setLazyCreate(false);
            createLot(selectedIndex, onAddCallback);
        }
    }, [lazyCreate]);

    useEffect(() => {
        if (!showStatusListLazy) {
            setShowStatusListLazy(null);
            if (showStatusList) {
                setShowStatusList(false);
            }
        }
    }, [showStatusListLazy]);

    /*
     * This hook is used for updating mappedValues, errors, touched state from form values when selectedIndex is changed
     * */
    useEffect(() => {
        if (
            isArray(mappedValues) &&
            mappedValues.length > 0 &&
            selectedIndex !== previousSelectedIndex &&
            previousSelectedIndex !== null
        ) {
            setMappedValues(
                immutableReplace(mappedValues, values, previousSelectedIndex)
            ); // update mapped values
            setMappedTouched(
                immutableReplace(mappedTouched, touched, previousSelectedIndex)
            ); // update mapped touched
            // setMappedStatus(immutableReplace(mappedStatus, status, previousSelectedIndex))	// update mapped status
        }
    }, [values, selectedIndex]);

    /*
     * This hook is used for updating form values from stored mapped state when selectedIndex is changed
     * */
    useEffect(() => {
        if (
            isArray(mappedValues) &&
            mappedValues.length > 0 &&
            mappedValues[selectedIndex] &&
            selectedIndex !== previousSelectedIndex
        ) {
            // get mapped state for current selectedIndex value
            const currMappedValue = mappedValues[selectedIndex] || {};
            const currMappedError = mappedErrors[selectedIndex] || {};
            const currMappedTouched = mappedTouched[selectedIndex] || {};
            const currMappedStatus = mappedStatus[selectedIndex] || {};

            resetForm(); // reset when switching

            // update form state
            setValues(currMappedValue);
            setErrors(currMappedError);
            setTouched(currMappedTouched);
            setStatus(currMappedStatus);
        }
    }, [mappedValues, selectedIndex]);

    /*
     * Updates collectionCount state var, used for displaying predicted lot number
     * */
    const getCount = async () => {
        const count = await getCardsCount();
        setCollectionCount(count);
    };

    /*
     * This function handles the logic for when the create button in the paste form is clicked
     * */
    const handlePasteFormCreateClick = (payload) => {
        let tempMappedValues = [];

        setPasteMapperHidden(true); // hide paste form
        setShowPasteMapper(false); // don't render paste form
        // setPasteTable([])					// clear pasteTable
        setShowStatusList(true); // display statusList

        // run validation for each lot
        payload.forEach((currMappedLot, currMappedLotIndex) => {
            let newLot = convertPastePayloadToLot(
                currMappedLot,
                lotTemplate,
                props.processId
            ); // convert to lot format
            tempMappedValues.push(newLot);

            // update status
            setMappedStatus((previous) => {
                const previousStatus = previous[selectedIndex] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        validationStatus: {
                            message: `Validating lot.`,
                            code: FORM_STATUS.VALIDATION_START,
                        },
                        resourceStatus: {
                            message: `-`,
                            code: FORM_STATUS.NOT_STARTED,
                        },
                    },
                    currMappedLotIndex
                );
            });

            // set touched
            const updatedTouched = setNestedObjectValues(newLot, true);
            setMappedTouched((previous) => {
                const previousTouched = previous[currMappedLotIndex] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousTouched,
                        ...updatedTouched,
                    },
                    currMappedLotIndex
                );
            });

            validateLot(newLot, currMappedLotIndex); // validate that bad boy
        });

        setMappedValues(tempMappedValues); // set mapped values to payload provided from paste form
    };

    /*
     * This effect runs whenever lotTemplate changes
     * It sets fieldNameArr to an array of all the fieldNames in the current template.
     * If there is no change in fieldNameArr, no update is performed. Otherwise it updates the array whenever lotTemplate changes
     *
     * This is necessary in order to update initialValues when a lotTemplate is edited
     * */
    useEffect(() => {
        // get fields
        const { fields } = lotTemplate || {};

        // check if array to prevent errors
        if (isArray(fields)) {
            let newFieldNameArr = []; // initialze arr for storing fieldNames

            fields.forEach((currRow) => {
                // loop through rows
                currRow.forEach((currItem) => {
                    // loop through items

                    // extract properties
                    const { fieldName, component, dataType, _id } =
                        currItem || {};

                    if (
                        component === FIELD_COMPONENT_NAMES.CALENDAR_START_END
                    ) {
                        newFieldNameArr.push({
                            _id,
                            fieldName: `${fieldName}`,
                            index: 0,
                            dataType: dataType,
                            displayName: `${fieldName} (start)`,
                        });
                        newFieldNameArr.push({
                            _id,
                            fieldName: `${fieldName}`,
                            index: 1,
                            dataType: dataType,
                            displayName: `${fieldName} (end)`,
                        });
                    } else {
                        newFieldNameArr.push({
                            _id,
                            fieldName,
                            dataType: component,
                            displayName: fieldName,
                        });
                    }
                });
            });

            setFieldNameArr([
                // ...REQUIRED_FIELDS,
                {
                    ...NAME_FIELD,
                    displayName: getDisplayName(
                        lotTemplate,
                        "name",
                        DEFAULT_NAME_DISPLAY_NAME
                    ),
                },
                {
                    ...COUNT_FIELD,
                    displayName: getDisplayName(
                        lotTemplate,
                        "count",
                        DEFAULT_COUNT_DISPLAY_NAME
                    ),
                },
                ...newFieldNameArr,
            ]);
        }
    }, [lotTemplate]);

    useEffect(() => {
        let tempCardNames = [];

        Object.values(cards).forEach((currCard) => {
            const { name, _id: currLotId } = currCard || {};

            tempCardNames.push({ name, id: currLotId });
        });

        setCardNames(tempCardNames);
    }, [cards]);

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
    }, [disablePasteModal]);

    const handleValidate = (values) => {
        if (selectedIndex !== null) {
            validateLot(values, selectedIndex);
        }
    };

    const setPending = (index) => {
        const values = mappedValues[index];
        if (values._id) return;

        // update status
        setMappedStatus((previous) => {
            const previousStatus = previous[index] || {};
            return immutableSet(
                previous,
                {
                    ...previousStatus,
                    resourceStatus: {
                        message: `Waiting.`,
                        code: FORM_STATUS.WAITING,
                    },
                },
                index
            );
        });
    };

    /*
     * handles logic for creating a lot from mappedValues
     * */
    const createLot = async (index, cb, ignoreWarnings=true) => {
        if (!createdLot) setCreatedLot(true);
        const values = mappedValues[index];
        if (values._id) return; // lot was already created, don't try creating it again

        // update status
        setMappedStatus((previous) => {
            const previousStatus = previous[index] || {};
            return immutableSet(
                previous,
                {
                    ...previousStatus,
                    resourceStatus: {
                        message: `Started.`,
                        code: FORM_STATUS.CREATE_START,
                    },
                },
                index
            );
        });

        // re-run validation right before submitting to ensure there are no errors
        try {
            const validationResult = validateLot(values, index);

            if (!ignoreWarnings) {
                if (Object.keys(mappedStatus[index]?.warnings || {}).length) {
                    setMappedStatus((previous) => {
                        const previousStatus = previous[index] || {};
                        return immutableSet(
                            previous,
                            {
                                ...previousStatus,
                                resourceStatus: {
                                    message: `Lot not created, lot already exists.`,
                                    code: FORM_STATUS.CANCELLED,
                                },
                            },
                            index
                        );
                    });
                    return
                }
            }

            const hasErrors = validationResult instanceof ValidationError;

            if (hasErrors) {
                // update status - found errors so create is cancelled
                setMappedStatus((previous) => {
                    const previousStatus = previous[index] || {};
                    return immutableSet(
                        previous,
                        {
                            ...previousStatus,
                            resourceStatus: {
                                message: `Creation cancelled due to validation errors.`,
                                code: FORM_STATUS.VALIDATION_ERROR,
                            },
                        },
                        index
                    );
                });
            } else {
                // no errors, POST it
                const {
                    name: newName,
                    bins: newBins,
                    processId: newProcessId,
                    lotNum: newLotNumber,
                    fields
                } = values || {}

                const submitItem = {
                    name: newName,
                    bins: newBins,
                    process_id: newProcessId,
                    lotTemplateId: lotTemplateId,
                    fields,
                    lotNum: collectionCount + index,
                    totalQuantity: newBins['QUEUE']?.count
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
        } catch (err) {
            console.error("create err", err);
        }
    };

    const mergeDisabled = (index) => {
      const values = mappedValues[index]
      let foundMatch = false
      if (values._id) return	// lot was already created, don't try creating it again

              const {
                  name: newName,
                  bins: newBins,
                  processId: newProcessId,
                  lotNumber: newLotNumber,
                  fields
              } = values || {}

              const submitItem = {
                  name: newName,
                  bins: newBins,
                  process_id: newProcessId,
                  lotTemplateId: lotTemplateId,
                  fields,
                  lotNumber: newLotNumber //collectionCount + index
              }


        Object.values(cards).forEach((card) => {
            if (card.name === submitItem.name) foundMatch = true;
        });

        return !foundMatch;
    };
    const mergeLot = async (index, cb) => {
        const values = mappedValues[index];
        if (values._id) return; // lot was already created, don't try creating it again

                const {
                    name: newName,
                    bins: newBins,
                    processId: newProcessId,
                    lotNumber: newLotNumber,
                    fields
                } = values || {}

                const submitItem = {
                    name: newName,
                    bins: newBins,
                    process_id: newProcessId,
                    lotTemplateId: lotTemplateId,
                    fields,
                    lotNumber: newLotNumber  //collectionCount + index
                }

                let workOrderNumber = ''
                let lotName = ''
                submitItem.fields.forEach((field) => {
                  lotName = submitItem.name
                  if(field[0].fieldName ==='WorkOrderNumber')
                  workOrderNumber = field[0].value
                })


        //Not robust or optimal... fix after alpen call
        let foundMerge = false;
        let foundMergeField = false;
        let cardID = null;
        let spreadExisting = true;
        let lotItem = {};
        var updatedFields = {};
        Object.values(cards).forEach((card) => {
            if (!!card.fields) {
                card.fields.forEach((field, index) => {
                    if (
                        (field[0].value == workOrderNumber &&
                            !!workOrderNumber) ||
                        card.name === lotName
                    ) {
                        foundMerge = true;
                        cardID = card._id;
                        submitItem.fields.forEach((newField) => {
                            card.fields.forEach((existingField, index) => {
                                if (
                                    existingField[0].fieldName ===
                                        newField[0].fieldName &&
                                    existingField[0].value === ""
                                ) {
                                    foundMergeField = true;
                                    var updatedField = {
                                        ...existingField[0],
                                        value: newField[0].value,
                                    };
                                    if (spreadExisting === true) {
                                        updatedFields = {
                                            ...card.fields,
                                            [index]: [updatedField],
                                        };
                                        spreadExisting = false;
                                    } else {
                                        updatedFields = {
                                            ...updatedFields,
                                            [index]: [updatedField],
                                        };
                                    }

                                    var fieldArray = [];
                                    for (var i in updatedFields) {
                                        fieldArray.push(updatedFields[i]);
                                    }

                                    lotItem = {
                                        ...card,
                                        fields: fieldArray,
                                    };
                                }
                            });
                        });
                    }
                });
            }
        });

        if (!!foundMerge && !!foundMergeField) {
            //  const result = await dispatchPutCard(lotItem,cardID)
            foundMerge = false;
            foundMergeField = false;

            await dispatchPutCard(lotItem, cardID)
                .then((result) => {
                    if (result) {
                        // successfully POSTed
                        const { _id = null } = result || {};

                        // update status, POST success
                        setMappedStatus((previous) => {
                            const previousStatus = previous[index] || {};
                            return immutableSet(
                                previous,
                                {
                                    ...previousStatus,
                                    resourceStatus: {
                                        message: `Successfully merged lot!`,
                                        code: FORM_STATUS.MERGE_SUCCESS,
                                    },
                                },
                                index
                            );
                        });

                        // update values (only difference should be ID added and maybe lotNumber was different
                        setMappedValues((previous) => {
                            return immutableSet(
                                previous,
                                {
                                    ...result,
                                },
                                index
                            );
                        });

                        // call callback if provided
                        cb && cb(_id);
                    } else {
                        // POST error, update status
                        setMappedStatus((previous) => {
                            const previousStatus = previous[index] || {};
                            return immutableSet(
                                previous,
                                {
                                    ...previousStatus,
                                    resourceStatus: {
                                        message: `Error merging lot.`,
                                        code: FORM_STATUS.MERGE_ERROR,
                                    },
                                },
                                index
                            );
                        });
                    }
                })
                .catch((err) => {
                    setMappedStatus((previous) => {
                        const previousStatus = previous[index] || {};
                        return immutableSet(
                            previous,
                            {
                                ...previousStatus,
                                resourceStatus: {
                                    message: `Error merging lot.`,
                                    code: FORM_STATUS.MERGE_ERROR,
                                },
                            },
                            index
                        );
                    });
                });
        } else {
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        resourceStatus: {
                            message: `No Mergeable Fields Found!`,
                            code: FORM_STATUS.MERGE_ERROR,
                        },
                    },
                    index
                );
            });
        }
    };

    /*
     * runs async validation for a lot and  updates its status
     * */
    const validateLot = (values, index) => {
        try {
            uniqueNameSchema.validateSync(
                {
                    name: values.name,
                    cardNames: cardNames,
                },
                { abortEarly: false }
            );

            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        warnings: {},
                    },
                    index
                );
            });
        } catch (err) {
            const {
                inner = [],
                // message
            } = err || {};

            let lotErrors = {};

            // collect errors
            inner.forEach((currErr) => {
                const {
                    // errors,
                    path,
                    message,
                    value,
                } = currErr || {};

                const { fieldName } = value || {};

                const errorObj = isObject(value)
                    ? { [fieldName]: message }
                    : pathStringToObject(path, ".", message);

                lotErrors = {
                    ...lotErrors,
                    ...errorObj,
                };
            });

            // set touched
            const updatedTouched = setNestedObjectValues(values, true);
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousTouched,
                        ...updatedTouched,
                    },
                    index
                );
            });

            // set errors
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        warnings: lotErrors,
                    },
                    index
                );
            });
        }

        try {
            editLotSchema.validateSync(values, { abortEarly: false });

            // clear errors and  touched
            setMappedErrors((previous) => {
                return immutableSet(previous, {}, index);
            });
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousTouched,
                    },
                    index
                );
            });

            // update status with success
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        validationStatus: {
                            message: `Successfully validated lot`,
                            code: FORM_STATUS.VALIDATION_SUCCESS,
                        },
                    },
                    index
                );
            });
        } catch (err) {
            // oh no there was an error
            const {
                inner = [],
                // message
            } = err || {};

            let lotErrors = {};

            // collect errors
            inner.forEach((currErr) => {
                const {
                    // errors,
                    path,
                    message,
                    value,
                } = currErr || {};

                const { fieldName } = value || {};

                const errorObj = isObject(value)
                    ? { [fieldName]: message }
                    : pathStringToObject(path, ".", message);

                lotErrors = {
                    ...lotErrors,
                    ...errorObj,
                };
            });

            // update status with errors
            setMappedStatus((previous) => {
                const previousStatus = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousStatus,
                        validationStatus: {
                            message: `Error validating lot`,
                            code: FORM_STATUS.VALIDATION_ERROR,
                        },
                    },
                    index
                );
            });

            // set errors
            setMappedErrors((previous) => {
                return immutableSet(previous, lotErrors, index);
            });

            // set touched
            const updatedTouched = setNestedObjectValues(lotErrors, true);
            setMappedTouched((previous) => {
                const previousTouched = previous[index] || {};
                return immutableSet(
                    previous,
                    {
                        ...previousTouched,
                        ...updatedTouched,
                    },
                    index
                );
            });

            return err;
        }

        // return
    };

    /*
     * Event handler for paste events
     *
     * converts tabular data to an array of arrays structure (1 column X n rows)
     * */
    const onPasteEvent = useCallback(
        (e) => {
            const plainText = e.clipboardData.getData("text/plain"); // get clipboard data
            const table = parseCSV(plainText, '\t')
            setPasteTable(table); // set paste table

            // need to call setShowSimpleModal with tiny delay in order to allow normal pasting
            if (!disablePasteModal) {
                setTimeout(() => {
                    setShowSimpleModal(true);
                }, 0);
            }

            return true;
        },
        [disablePasteModal]
    );

    /*
     * callback function used in createLot when submit is called from inside lot editor
     *
     * Updates form values with id of created lot
     * */
    const onAddCallback = (id) => {
        setFieldValue("_id", id);
    };

    const renderHeader = useMemo(() => {

        let onBack, title;
        switch (params.subpage) {
            case 'editing':
                onBack = null;
                title = 'Editing Lot'
                break;
            case 'create':
                onBack = null;
                title = 'Creating Lot'
                break;
            case 'template':
            onBack = () => history.push(`/lots/${params.id}/create`)
                title = 'Editing Template'
                break;
            case 'paste':
                onBack = () => history.push(`/lots/${params.id}/create`)
                title = 'Import Lots'
                break;
            case 'validate':
                onBack = () => history.push(`/lots/${params.id}/paste`)
                title = 'Validate Lots'
                break;
            case 'history':
                onBack = () => history.push(`/lots/${params.id}/editing`)
                title = 'Lot History'
                break;
        }

        return (
            <styled.Header>
                {!!onBack &&
                    <div style={{ position: "absolute" }}>
                        <BackButton
                            schema = {'lots'}
                            onClick={onBack}
                        ></BackButton>
                    </div>
                }
                <styled.Title>{title}</styled.Title>

                <styled.CloseIcon
                    className="fa fa-times"
                    aria-hidden="true"
                    onClick={() => onClose()}
                />
            </styled.Header>
        )
    })

    const renderContent = useMemo(() => {

        switch (params.subpage) {

            case 'paste':
                return (
                    <PasteForm
                        hidden={pasteMapperHidden}
                        reset={resetPasteTable}
                        availableFields={[...fieldNameArr]}
                        onCancel={() => {
                            setShowPasteMapper(false);
                            setPasteMapperHidden(true);
                            setPasteTable([]); // clear table
                            setShowStatusList(false); // display statusList
                            setSelectedIndex(null);
                            setMappedValues([]);
                        }}
                        table={pasteTable}
                        lotTemplate={lotTemplate}
                        onCreateClick={(payload) => {
                            handlePasteFormCreateClick(payload);
                        }}
                    />
                )

            case 'validate':
                return (
                    <StatusList
                        displayNames={lotTemplate?.displayNames || {}}
                        onItemClick={(item) => {
                            setSelectedIndex(item.index);
                            setShowStatusListLazy(false);
                        }}
                        onCreateClick={createLot}
                        onMergeClick={mergeLot}
                        mergeDisabled={mergeDisabled}
                        onCreateAllClick={async () => {
                            for (let i = 0; i < mappedValues.length; i++) {
                                setPending(i);
                            }
                            for (let i = 0; i < mappedValues.length; i++) {
                                await createLot(i);
                            }
                            setPasteTable([]);
                            props.close();
                        }}
                        onCreateAllWithoutWarningClick={async () => {
                            for (let i = 0; i < mappedValues.length; i++) {
                                setPending(i);
                            }
                            for (let i = 0; i < mappedValues.length; i++) {
                                await createLot(i, null, false);
                            }
                            setPasteTable([]);
                        }}
                        onCanceleClick={() => {
                            setShowStatusList(false);
                            setPasteTable([]);
                            setSelectedIndex(null);
                            setMappedValues([]);

                            if (createdLot) {
                                props.close();
                            }
                        }}
                        onBack={() => {
                            setShowPasteMapper(true);
                            setPasteMapperHidden(false);
                            setShowStatusList(false);
                        }}
                        onShowMapperClick={() => {
                            setShowStatusList(false);
                            setShowPasteMapper(true);
                            setPasteMapperHidden(false);
                        }}
                        data={mappedValues.map((currValue, currIndex) => {
                            const { name } = currValue;

                            const wholeVal = mappedValues[currIndex];

                            const { _id } = wholeVal;

                            const currStatus = mappedStatus[currIndex] || {};
                            return {
                                errors: mappedErrors[currIndex] || {},
                                title: name,
                                created: !!_id,
                                ...currStatus,
                                index: currIndex,
                            };
                        })}
                    />
                )

            case 'history':
                return <LotHistory />

            case 'template':
                return (
                  <LotCreatorForm
                      isOpen={true}
                      setSelectedTemplate = {handleSelectLotTemplate}
                      onAfterOpen={null}
                      lotTemplateId={lotTemplateId}
                      close={() => {
                          //setShowLotTemplateEditor(false);
                          //dispatchSetSelectedLotTemplate(null)
                      }}
                      processId={props.processId}
                  />
                )

            default:
                return (
                    <LotEditor
                        cardNames={cardNames}
                        lotTemplateName={lotTemplateName}
                        merge={merge}
                        close={onClose}
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
                            setMappedValues(
                                immutableReplace(mappedValues, values, selectedIndex)
                            ); // update mapped state
                            setMappedErrors(
                                immutableReplace(mappedErrors, errors, selectedIndex)
                            ); // update mapped state
                            setMappedTouched(
                                immutableReplace(mappedTouched, touched, selectedIndex)
                            ); // update mapped state
                            setLazyCreate(true); // have to submit in round-about way in order to ensure other state variables are up-to-date first
                        }}
                        collectionCount={parseInt(collectionCount + 1)}
                        lotTemplateId={lotTemplateId}
                        lotTemplate={lotTemplate}
                        cardId={params.subpage === 'create' ? null : params.id}
                        processId={params.subpage === 'create' ? params.id : cards[params.id]?.process_id}
                        onSelectLotTemplate={handleSelectLotTemplate}
                        showProcessSelector={false}
                        hidden={showStatusList || showPasteMapper}
                        onShowCreateStatusClick={() => {
                            setShowStatusList(true);
                            setSelectedIndex(null);
                        }}
                        onImportXML={() => {
                            //convertToCSV()
                            openFileSelector();
                        }}
                        disabledAddButton={
                            isArray(mappedValues) && mappedValues.length > 0
                        }
                        formRef={formRef}
                        showCreationStatusButton={
                            isArray(mappedValues) && mappedValues.length > 0
                        }
                        showPasteIcon={isNonEmptyArray(pasteTable)}
                        onPasteIconClick={() => {
                            setShowPasteMapper(true);
                            setPasteMapperHidden(false);
                            setResetPasteTable(true);
                            setTimeout(() => {
                                setResetPasteTable(false);
                            }, 250);
                            setDisablePasteModal(false);
                        }}
                        onValidate={handleValidate}
                        footerContent={() =>
                            isArray(mappedValues) &&
                            mappedValues.length > 0 && (
                                <styled.PageSelector>
                                    <styled.PageSelectorButton
                                        className="fas fa-chevron-left"
                                        onClick={() => {
                                            if (selectedIndex > 0) {
                                                setSelectedIndex(selectedIndex - 1);
                                            }
                                        }}
                                    />
                                    <styled.PageSelectorText>
                                        {selectedIndex + 1}/{mappedValues.length}
                                    </styled.PageSelectorText>
                                    <styled.PageSelectorButton
                                        className="fas fa-chevron-right"
                                        onClick={() => {
                                            if (
                                                selectedIndex <
                                                mappedValues.length - 1
                                            ) {
                                                setSelectedIndex(selectedIndex + 1);
                                            }
                                        }}
                                    />
                                </styled.PageSelector>
                            )
                        }
                    />
                )
        }

    })

    return (
        <styled.Container
            isOpen={true}
            onRequestClose={() => {
                // close()
                props.close();
            }}
            contentLabel="Lot Editor Form"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(4px)",
                },
                content: {},
            }}
        >
            {showSimpleModal && (
                <SimpleModal
                    isOpen={true}
                    title={
                        plainFiles.length === 1
                            ? "Import Event Detected"
                            : "Paste Event Detected"
                    }
                    onRequestClose={() => setShowSimpleModal(false)}
                    onCloseButtonClick={() => setShowSimpleModal(false)}
                    handleOnClick2={() => {
                        setShowPasteMapper(true);
                        setPasteMapperHidden(false);
                        setShowSimpleModal(false);

                        setResetPasteTable(true);
                        setTimeout(() => {
                            setResetPasteTable(false);
                        }, 250);
                        setDisablePasteModal(false);
                    }}
                    handleOnClick1={() => {
                        setShowSimpleModal(false);
                        setDisablePasteModal(true);
                    }}
                    button_2_text={"Yes"}
                    button_1_text={"No"}
                >
                    {plainFiles.length === 1 ? (
                        <styled.SimpleModalText>
                            Are you sure you want to import this file?
                        </styled.SimpleModalText>
                    ) : (
                        <styled.SimpleModalText>
                            A paste event was detected. Would you like to use
                            pasted data to create lots?
                        </styled.SimpleModalText>
                    )}
                </SimpleModal>
            )}

            {renderHeader}

            {renderContent}

        </styled.Container>
    );
};

LotEditorContainer.propTypes = {};

export default LotEditorContainer;
