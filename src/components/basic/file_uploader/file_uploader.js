import React, {useRef, useState} from 'react'
import PropTypes from 'prop-types'

import * as styled from './file_uploader.style'
import PdfViewerModal from "../pdf_viewer/pdf_viewer_modal"
import PdfViewer from "../pdf_viewer/pdf_viewer"

const FileUploader = props => {

    const {
        value
    } = props

    const inputFile = useRef(null)

    const [file, setFile] = useState(value)
    const [showFile, setShowFile] = useState(false)

    const onChange = (event) => {
        event.stopPropagation()
        event.preventDefault()

        const file = event.target.files[0]
        setFile(file)
        setShowFile(true)
    }

    const onButtonClick = () => {
        inputFile.current.click()
    }

    return (
        <>
            {showFile &&
            <PdfViewerModal
                isOpen={true}
                close={() => setShowFile(false)}
                onOkClick={() => {
                    props.onChange(file)
                    setShowFile(false)
                }}
                onCancelClick={() => {
                    setShowFile(false)
                    setFile(value)
                    onButtonClick()
                }}
                file={file}
            />
            }
            <styled.Container>
                {(!file || showFile) ?
                    <styled.UploadButton
                        onClick={onButtonClick}
                        className="fas fa-upload"
                        color={'#34a8eb'}
                    />
                    :
                    <div onClick={onButtonClick} style={{cursor: 'pointer'}}>
                        <PdfViewer
                            file={file}
                        />
                    </div>
                }
            </styled.Container>
            <input
                type='file'
                id='file'
                ref={inputFile}
                style={{display: 'none'}}
                onChange={onChange}
            />
        </>
    )
}

FileUploader.propTypes = {
    onChange: PropTypes.func,
}

FileUploader.defaultProps = {
    onChange: () => null
}

export default FileUploader
