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

    const {
        isOpen,
        onAfterOpen,
        cardId,
        processId,
        close,
        processOptions,
        showProcessSelector
    } = props

    // actions
    const dispatch = useDispatch()
    const dispatchPostCard = async (card) => await dispatch(postCard(card))

    // redux state
    const selectedProcess = useSelector(state => { return state.processesReducer.processes[processId] || null})
    const selectedCard = useSelector(state => { return state.cardsReducer.cards[cardId] || null})

    console.log(selectedProcess)

    return null;
    
};

LotEditorContainer.propTypes = {

};

export default LotEditorContainer;
