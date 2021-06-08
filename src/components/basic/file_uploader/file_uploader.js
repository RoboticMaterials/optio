import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from './file_uploader.style'
import { Document, Page } from 'react-pdf';


const FileUploader = props => {

    const inputFile = useRef(null)

    const [val, setVal] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const onChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        console.log(file);
        setVal(file); /// if you want to upload latter

        var form = new FormData();
        form.append('file', file);
        console.log({form});

    }


    console.log('valvalvalval',val)

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    return (
        <styled.Container>
            <styled.UploadButton
                onClick={onButtonClick}
                className="fas fa-upload"
                color={'#34a8eb'}
            />

            <Document
                file={val}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>

            <input
                type='file'
                id='file'
                ref={inputFile}
                style={{display: 'none'}}
                onChange={onChange}
            />


        </styled.Container>
    );
};

FileUploader.propTypes = {
    
};

export default FileUploader;
