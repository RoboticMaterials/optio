import React, {useEffect, useState} from "react";

// external components
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {getCards, getProcessCards, putCard} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './merge_modal.style'
import {useTheme} from "styled-components";
import {getProcesses} from "../../../../../../redux/actions/processes_actions";
import FadeLoader from "react-spinners/FadeLoader";
import Textbox from "../../../../../basic/textbox/textbox";
import {SORT_MODES} from "../../../../../../constants/common_contants";
import {sortBy} from "../../../../../../methods/utils/card_utils";
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import {getCustomFields, getLotTotalQuantity, getMatchesFilter} from "../../../../../../methods/utils/lot_utils";
import Card from "../../../../../side_bar/content/cards/lot/lot";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal";
import {quantityOneSchema} from "../../../../../../methods/utils/form_schemas";
import ZoneHeader from "../../../../../side_bar/content/cards/zone_header/zone_header";
import LotSortBar from "../../../../../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../../../constants/lot_contants";
import LotFilterBar from "../../../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import {getLotTemplates} from "../../../../../../redux/actions/lot_template_actions";
import LotEditorContainer from "../../../../../side_bar/content/cards/card_editor/lot_editor_container";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";
import PropTypes from "prop-types";
import TextField from "../../../../../basic/form/text_field/text_field";

Modal.setAppElement('body');

const MergeModal = (props) => {

    const {
        stationId,
        close
    } = props



    return (
        <styled.Container
            isOpen={true}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.Header>
                stationId
            </styled.Header>

            <styled.BodyContainer>

            </styled.BodyContainer>
        </styled.Container>
    );
};

MergeModal.propTypes = {

};

// Specifies the default values for props:
MergeModal.defaultProps = {

};

export default MergeModal
