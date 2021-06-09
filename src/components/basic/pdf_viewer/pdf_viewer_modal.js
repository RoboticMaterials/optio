import React from 'react';
import PropTypes from 'prop-types';
import withModal from "../../../higher_order_components/with_modal/with_modal";
import PdfViewer from "./pdf_viewer";

import * as styled from './pdf_viewer.style'
import {Document, Page} from "react-pdf";
import PageSelector from "../page_selector/page_selector";
import Button from "../button/button";

const PdfViewerModal = props => {

	const {
		onOkClick,
		onCancelClick,
		file
	} = props

	return (
		<styled.Container>
			<styled.Header>
				<styled.Title>Review Document</styled.Title>
			</styled.Header>

			<styled.Body>
				<PdfViewer
					file={file}
				/>
			</styled.Body>

			<styled.Footer>
				<Button
					label={'Ok'}
					schema={'ok'}
					onClick={onOkClick}
				/>

				<Button
					label={'Cancel'}
					schema={'error'}
					onClick={onCancelClick}
				/>
			</styled.Footer>

		</styled.Container>
	);
};

PdfViewerModal.propTypes = {

};

PdfViewerModal.defaultProps = {

};


export default withModal(PdfViewerModal,'auto', '80%', '80%', '80%')
