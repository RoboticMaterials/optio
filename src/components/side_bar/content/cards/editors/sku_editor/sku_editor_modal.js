import React from 'react';
import SkuEditor from "./sku_editor";
import withModal from "../../../../../../higher_order_components/with_modal/with_modal";

const SkuEditorModal = withModal(SkuEditor, '95%', '95%')
export default SkuEditorModal;
