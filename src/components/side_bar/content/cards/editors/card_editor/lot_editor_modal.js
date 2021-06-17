import React from 'react';
import PropTypes from 'prop-types';
import withModal from "../../../../../../higher_order_components/with_modal/with_modal";
import SkuEditor from "../sku_editor/sku_editor";
import LotEditorContainer from "./lot_editor_container";

const LotEditorModal = withModal(LotEditorContainer, '95%', '95%', '95%', '95%')

export default LotEditorModal;
