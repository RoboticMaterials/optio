import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Document, Page} from "react-pdf";

import { pdfjs } from 'react-pdf';
import * as styled from './pdf_viewer.style'
import PageSelector from "../page_selector/page_selector";
import Button from "../button/button";
import MoonLoader from "react-spinners/MoonLoader";
import {LoaderContainer} from "./pdf_viewer.style";

pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

const PdfViewer = (props) => {

	const {
		onOkClick,
		onCancelClick,
		file
	} = props

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [loaded, setLoaded] = useState(false)

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1)
		setLoaded(true)
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
			{!loaded &&
			<styled.LoaderContainer>
				<MoonLoader
					loading={true}
					color={"#4a4a4a"}
					size={50}
				/>
			</styled.LoaderContainer>
			}
			<styled.DocumentOuterContainer loaded={loaded}>
				<styled.DocumentContainer>
					<Document
						file={file}
						onLoadSuccess={onDocumentLoadSuccess}
					>
						<Page pageNumber={pageNumber} />
					</Document>
				</styled.DocumentContainer>

				<PageSelector
					value={pageNumber}
					// disabled={pageNumber <= 1}
					// onClick={previousPage}
					onBack={previousPage}
					onForward={nextPage}
					maxValue={numPages}
				/>
			</styled.DocumentOuterContainer>
		</styled.Container>
	);
};

PdfViewer.propTypes = {
	onOkClick: PropTypes.func,
		onCancelClick: PropTypes.func,
};

PdfViewer.defaultProps = {
	onOkClick: () => null,
		onCancelClick: () => null,
};

export default PdfViewer;
