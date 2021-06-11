import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import FileUploader from "../../file_uploader/file_uploader";
import {useField, useFormikContext} from "formik";
import {ThemeContext} from "styled-components";
import {getMessageFromError} from "../../../../methods/utils/form_utils";

const FileUploaderField = (props) => {

    const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, status, validateForm, ...context } =  useFormikContext() || {}
    const [field, meta] = useField(props);
    const { touched, error } = meta
    const {
        name: fieldName,
        value: fieldValue
    } = field

    const {
        warnings
    } = status || {}

    const {
        [fieldName]: warning
    } = warnings || {}

    const themeContext = useContext(ThemeContext)

    const hasError = touched && error
    const hasWarning = touched && warning

    const errorMessage = getMessageFromError(error)
    const warningMessage = getMessageFromError(warning)

    return (
        <FileUploader
            value={fieldValue}
            onChange={(value) => setFieldValue(fieldName, value)}
        />
    );
};

FileUploaderField.propTypes = {

};

export default FileUploaderField;
