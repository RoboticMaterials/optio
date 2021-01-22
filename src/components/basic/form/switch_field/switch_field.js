import React from "react";
import { useField, useFormikContext } from "formik";
import Switch from 'react-ios-switch';
import ErrorTooltip from "../error_tooltip/error_tooltip";
import PropTypes from "prop-types";
import * as styled from "./switch_field.style";
import {getMessageFromError} from "../../../../methods/utils/form_utils";

const SwitchField = (props) => {

    const {
        Container,
        containerStyle,
        ErrorContainerComponent,
        style,
        onChange,
        mapOutput,
        mapInput,
        ...rest
    } = props

    const { setFieldValue, setFieldTouched } = useFormikContext();
    const [field, meta] = useField(props);

    const {
        value: fieldValue,
        name: fieldName
    } = field

    const {
        touched,
        error
    } = meta

    const hasError = touched && error;
    const errorMessage = getMessageFromError(error);

    return (
        <Container
            style={containerStyle}
        >
            <Switch
                checked={mapInput(fieldValue)}
                {...rest}
                onChange={val => {
                    if(!touched) setFieldTouched(fieldName, true);

                    setFieldValue(fieldName, mapOutput(val))

                    onChange && onChange(val)
                }}
            />
            {/*<ErrorTooltip*/}
            {/*    visible={hasError}*/}
            {/*    text={errorMessage}*/}
            {/*    ContainerComponent={ErrorContainerComponent}*/}
            {/*/>*/}

        </Container>
    );
};

// Specifies propTypes
SwitchField.propTypes = {
    Container: PropTypes.elementType,
    ErrorContainerComponent: PropTypes.elementType,
    containerStyle: PropTypes.object,
    style: PropTypes.object,
    onChange: PropTypes.func,
    mapInput: PropTypes.func,
    mapOutput: PropTypes.func,
};

// Specifies the default values for props:
SwitchField.defaultProps = {
    Container: styled.DefaultContainer,
    ErrorContainerComponent: styled.DefaultErrorContainerComponent,
    containerStyle: {},
    style: {},
    onChange: () => {},
    mapInput: (val) => val,
    mapOutput: (val) => val
};

export default SwitchField;
