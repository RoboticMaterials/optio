import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
import { useSelector, useDispatch } from 'react-redux'

import ErrorTooltip from '../error_tooltip/error_tooltip';
import useChange from '../../../basic/form/useChange'
import * as styled from './text_field.style'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

import { pageDataChanged } from '../../../../redux/actions/sidebar_actions'
import { ThemeContext } from "styled-components";


const TextField = ({
    InputComponent,
    ErrorComponent,
    LabelComponent,
    InputContainer,
    fieldLabel,
    onBlur,
    onFocus,
    onChange,
    inputStyleFunc,
    IconContainerComponent,
    ContentContainer,
    inputContainerStyle,
    errorTooltipContainerStyle,
    showErrorStyle,
    containerStyle,
    FieldContainer,
    mapInput,
    mapOutput,
    inputProps,

    style,
    ...props }) => {

    const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, status, validateForm, ...context } = useFormikContext();
    const [field, meta] = useField(props);
    const { touched, error } = meta
    const {
        name: fieldName
    } = field

    const {
        warnings
    } = status || {}

    const {
        [fieldName]: warning
    } = warnings || {}

    const themeContext = useContext(ThemeContext)

    const dispatch = useDispatch()
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))

    const hasError = touched && error
    const hasWarning = touched && warning

    useChange(setFieldValue)

    const inputStyle = inputStyleFunc(hasError, showErrorStyle);

    const errorMessage = getMessageFromError(error)
    const warningMessage = getMessageFromError(warning)
    useChange(setFieldValue)

    return (
        <>
            {fieldLabel &&
                <LabelComponent hasError={hasError} htmlFor={props.id || props.name}>{fieldLabel}</LabelComponent>
            }
            <ContentContainer style={containerStyle}>
                <InputContainer>
                    <InputComponent

                        // inputStyle={{...inputStyle, ...style}}
                        // inputStyle={inputStyle}
                        className='form-control'
                        {...field}
                        {...inputProps}
                        {...props}
                        style={{ ...style, ...inputStyle }}
                        value={mapInput(field.value)}
                        onChange={(event) => {
                            // update touched if necessary
                            if (!touched) {
                                setFieldTouched(fieldName, true)
                                dispatchPageDataChanged(true)
                            }

                            setFieldValue(fieldName, mapOutput(event.target.value)) // update field value

                            onChange(event) // call additional onChange prop if necessary
                        }}
                        // set field touched and call onBlur prop
                        onBlur={(event) => {
                            // update touched if necessary
                            if (!touched) {
                                setFieldTouched(fieldName, true)
                            }

                            // validateOnBlur && validateField(field.name) // validate if necessary
                            // validateField(field.name) // validate if necessary

                            onBlur(event) // call onBlur prop if passed
                        }}
                        tooltip={
                            <ErrorTooltip
                                visible={hasError || hasWarning}
                                text={hasError ? errorMessage : hasWarning ? warningMessage : null}
                                color={hasWarning && !hasError ? themeContext.warn : themeContext.bad}
                                ContainerComponent={IconContainerComponent}
                                containerStyle={errorTooltipContainerStyle}
                            />
                        }
                    />

                </InputContainer>

            </ContentContainer>



        </>
    );
};

/* *
*
* Returns style for input component
* Accepts hasError prop, which can be used to change styling based on presence of errors
*
* */
const defaultInputStyleFunc = (hasError, showErrorStyle) => {
    return {
        // borderColor: hasError && 'red',
        // border: hasError && '1px solid red',
        transition: "box-shadow .5s ease-in-out, border .5s ease-in-out",
        // boxShadow:  && `0 0 1px red !important`,
        boxShadow: (hasError && showErrorStyle) && `0 0 5px red`,

        borderLeft: (hasError && showErrorStyle) ? '1px solid red' : "1px solid transparent",
        borderTop: (hasError && showErrorStyle) ? '1px solid red' : "1px solid transparent",
        borderRight: (hasError && showErrorStyle) ? '1px solid red' : "1px solid transparent",
        borderBottom: (hasError && showErrorStyle) && '1px solid red',

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
}

// Specifies propTypes
TextField.propTypes = {
    LabelComponent: PropTypes.elementType,
    InputComponent: PropTypes.elementType,
    InputContainer: PropTypes.elementType,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    inputStyleFunc: PropTypes.func,
    fieldLabel: PropTypes.string,
    IconContainerComponent: PropTypes.elementType,
    ContentComponent: PropTypes.elementType,
    style: PropTypes.object,
    showErrorStyle: PropTypes.bool,
};

// Specifies the default values for props:
TextField.defaultProps = {
    LabelComponent: styled.DefaultLabelComponent,
    InputComponent: styled.DefaultInputComponent,
    InputContainer: styled.DefaultInputContainer,
    onBlur: () => { },
    onFocus: () => { },
    onChange: () => { },
    fieldLabel: "",
    inputStyleFunc: defaultInputStyleFunc,
    IconContainerComponent: styled.IconContainerComponent,
    ContentContainer: styled.DefaultContentContainer,
    FieldContainer: styled.DefaultFieldContainer,
    style: {},
    validateOnBlur: false,
    showErrorStyle: true,
    mapInput: (val) => val,
    mapOutput: (val) => val,
};

export default TextField;
