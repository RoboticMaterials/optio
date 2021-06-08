import React from 'react';
import PropTypes from 'prop-types';
import withModal from "../../../higher_order_components/with_modal/with_modal";
import PdfViewer from "./pdf_viewer";

const PdfViewerModal = withModal(PdfViewer, 'auto', '80%')

PdfViewerModal.propTypes = {

};

PdfViewerModal.defaultProps = {

};


export default PdfViewerModal;
