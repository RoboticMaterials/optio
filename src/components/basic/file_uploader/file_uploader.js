import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from './file_uploader.style'
import PdfViewerModal from "../pdf_viewer/pdf_viewer_modal";

const FileUploader = props => {

    const inputFile = useRef(null)

    const [val, setVal] = useState(null)

    const [showFile, setShowFile] = useState(false)



    const onChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        console.log(file);
        console.log('event.target', event.target);
        console.log('event.target.files', event.target.files);
        setVal(file); /// if you want to upload latter

        var form = new FormData();
        form.append('file', file);
        console.log({form});

        console.log('form.entries()', form.entries())


        form.forEach((thing) => console.log('thing', thing))

        setShowFile(true)
        // console.log('form.getAll()', form.getAll())


    }

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    return (
        <>
            {showFile &&
            <PdfViewerModal
                close={() => setShowFile(false)}
            />
            }
            <styled.Container>
                <styled.UploadButton
                    onClick={onButtonClick}
                    className="fas fa-upload"
                    color={'#34a8eb'}
                />
                <input
                    type='file'
                    id='file'
                    ref={inputFile}
                    style={{display: 'none'}}
                    onChange={onChange}
                />
            </styled.Container>
        </>
    );
};

FileUploader.propTypes = {
    
};

export default FileUploader;
