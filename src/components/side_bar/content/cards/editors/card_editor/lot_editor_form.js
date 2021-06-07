import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import LotEditor from "./lot_editor";
import {useDispatch, useSelector} from "react-redux";
import {getCard, postCard, putCard} from "../../../../../../redux/actions/card_actions";
import {getLotTemplates, setSelectedLotTemplate} from "../../../../../../redux/actions/lot_template_actions";
import {FORM_MODES} from "../../../../../../constants/scheduler_constants";
import {Formik} from "formik";
import {CONTENT, defaultBins, FORM_BUTTON_TYPES} from "../../../../../../constants/lot_contants";
import {getFormCustomFields} from "../../../../../../methods/utils/card_utils";
import {CARD_SCHEMA_MODES, getCardSchema} from "../../../../../../methods/utils/form_schemas";
import {isEmpty, isObject} from "../../../../../../methods/utils/object_utils";
import * as styled from "./lot_editor.style";
import FadeLoader from "react-spinners/FadeLoader";

const LotEditorForm = (props) => {

    const {
        isOpen,
        onAddClick,
        footerContent,
        lotTemplateId,
        lotTemplate,
        hidden,
        onShowCreateStatusClick,
        showCreationStatusButton,
        showPasteIcon,
        close,
        processId,
        processOptions,
        showProcessSelector,
        disabledAddButton,
        collectionCount,
        initialValues,
        formRef,
        onValidate,
        onPasteIconClick,
        cardNames,
    } = props

    // redux state
    const cards = useSelector(state => { return state.cardsReducer.cards })
    const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})

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
    const [formMode, ] = useState(props.cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new
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
        if(cardId) {
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

        if(collectionCount !== null) {
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
        }

    }, [card, lotTemplate, lotTemplateId, collectionCount])

    useEffect( () => {
        dispatchGetLotTemplates()
        dispatchSetSelectedLotTemplate(null)

        // return () => {
        // 	close()
        // }

    }, [])



    if(loaded) {
        return(
            <>

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
                                defaultBins,
                            fields: getFormCustomFields((useCardFields && !card?.syncWithTemplate) ? ( card?.fields || []) : lotTemplate.fields, card?.fields ? card?.fields : null)

                        }}
                        validationSchema={getCardSchema((content === CONTENT.MOVE) ? CARD_SCHEMA_MODES.MOVE_LOT : CARD_SCHEMA_MODES.EDIT_LOT, bins[binId]?.count ? bins[binId].count : 0)}
                        validate={onValidate}
                        validateOnChange={true}
                        // validateOnMount={true} // leave false, if set to true it will generate a form error when new data is fetched
                        validateOnBlur={true}
                        onSubmit={()=>{}} // this is necessary

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
                                if(!isEmpty(submissionErrors)) {
                                    setSubmitting(false)
                                    return false
                                }

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


                                if(content === CONTENT.MOVE) {
                                    // moving card need to update count for correct bins
                                    if(moveCount && moveLocation) {

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
                                    if(values._id) {

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


                                        if(!(requestResult instanceof Error)) {
                                            const {
                                                _id = null
                                            } = requestResult || {}

                                            setFieldValue("_id", _id)
                                        }
                                        else {
                                            console.error("requestResult error",requestResult)
                                        }

                                    }


                                }

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

                                return requestResult
                                // return true
                            }

                            if(hidden || showLotTemplateEditor) return null
                            return (
                                <LotEditor
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
                                    content={content}
                                    setContent={setContent}
                                    card={card}
                                    onPasteIconClick={onPasteIconClick}
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
LotEditorForm.propTypes = {
    binId: PropTypes.string,
    showProcessSelector: PropTypes.bool,
};

// Specifies the default values for props:
LotEditorForm.defaultProps = {
    binId: "QUEUE",
    showProcessSelector: false,
    providedValues: []
};

export default LotEditorForm;
