import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Document, Page} from "react-pdf";
import samplePDF from "../file_uploader/asurion_protection_plan.pdf";

import { pdfjs } from 'react-pdf';
import * as styled from './pdf_viewer.style'
import {DocumentContainer, DocumentOuterContainer} from "./pdf_viewer.style";


pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

const PdfViewer = (props) => {

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1)
	}

	function changePage(offset) {
		setPageNumber(prevPageNumber => prevPageNumber + offset);
	}

	function previousPage() {
		changePage(-1);
	}

	function nextPage() {
		changePage(1);
	}

	return (
		<styled.Container>
			<styled.Header>
				<styled.Title>Title</styled.Title>
			</styled.Header>

			<styled.Body>
				<styled.DocumentOuterContainer>
				<styled.DocumentContainer>
				<Document
					file={samplePDF}
					onLoadSuccess={onDocumentLoadSuccess}
				>
					<Page pageNumber={pageNumber} />
				</Document>
				</styled.DocumentContainer>
				</styled.DocumentOuterContainer>



				<styled.Nav>
					<p>
						Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
					</p>
					<button
						type="button"
						disabled={pageNumber <= 1}
						onClick={previousPage}
					>
						Previous
					</button>
					<button
						type="button"
						disabled={pageNumber >= numPages}
						onClick={nextPage}
					>
						Next
					</button>
				</styled.Nav>
			</styled.Body>

			<styled.Footer>

			</styled.Footer>

		</styled.Container>
	);
};

PdfViewer.propTypes = {

};

PdfViewer.defaultProps = {

};

export default PdfViewer;
