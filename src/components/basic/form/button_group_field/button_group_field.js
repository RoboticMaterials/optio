import React from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

// import components
import ErrorTooltip from "../error_tooltip/error_tooltip";
import ButtonGroup from '../../button_group/button_group';

// import styles
import * as style from './button_group_field.style'
import * as button_group_style from '../../button_group/button_group.style'

const ButtonGroupField = (
    {
        label,
        containerStyle,
        LabelComponent,
        Container,
        ButtonView,
        Button,
        ButtonViewStyle,
        // ButtonViewErrorCss,
        enableErrorTooltip,
        ...props
    }) => {

    const { setFieldValue, setFieldTouched } = useFormikContext();
    const [field, meta] = useField(props);
    const hasError = meta.touched && meta.error;

    return (
        <>
            {label &&
                <LabelComponent htmlFor={props.id || props.name}>{label}</LabelComponent>
            }

            <style.Container
                hasError={hasError}
            >
                {enableErrorTooltip &&
                    <ErrorTooltip
                        visible={hasError}
                        text={meta.error}
                        ContainerComponent={style.ErrorContainerComponent}
                    />
                }

                <ButtonGroup
                    {...field}
                    {...props}
                    hasError={hasError}
                    Container={Container}
                    // ButtonView={<Wrapper hasError={hasError}/>}
                    ButtonView={ButtonView}
                    // ButtonView={React.cloneElement(ButtonView, { size: 24 })}
                    // ButtonView={renderClone(ButtonView)}
                    Button={Button}
                    selectedIndexes={field.value}
                    onPress={(val) => {
                        const isTouched = meta.touched;
                        if (!isTouched) {
                            setFieldTouched(field.name, true)
                        }
                        setFieldValue(field.name, val);
                    }}
                />
            </style.Container>


            {/*
            {meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
            */}

        </>
    );
};

// Specifies propTypes
ButtonGroupField.propTypes = {

};

// Specifies the default values for props:
ButtonGroupField.defaultProps = {
    LabelComponent: null,
    // ButtonViewErrorCss: style.DefaultButtonViewErrorCss,
    ButtonView: button_group_style.ButtonView,
    enableErrorTooltip: true,
};

export default ButtonGroupField;
