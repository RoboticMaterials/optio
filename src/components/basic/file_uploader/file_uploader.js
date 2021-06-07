import React from 'react';
import PropTypes from 'prop-types';

import * as styled from './file_uploader.style'

const FileUploader = props => {
    return (
        <styled.Container>
            <styled.UploadButton
                className="fas fa-upload"
                color={'#34a8eb'}
            />

        </styled.Container>
    );
};

FileUploader.propTypes = {
    
};

export default FileUploader;
