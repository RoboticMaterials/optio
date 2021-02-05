import React from "react";
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";

import ErrorTooltip from '../error_tooltip/error_tooltip';
import * as styled from './field_wrapper.style'
import NumberInput from "../../number_input/number_input";
import TextField from "../text_field/text_field";
import Textbox from "../../textbox/textbox";


const FieldWrapper = (props) => {

	const {
		ContainerComponent,
		// FieldComponent,
		children
	} = props

	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(props);

	// extract field data
	const {
		value: fieldValue,
		name: fieldName
	} = field

	// extract meta data
	const { touched, error } = meta

	// does the field contain an error?
	const hasError = touched && error

	return (
		<ContainerComponent>
			<styled.LabelContainer>
				{/*<styled.GapFiller/>*/}
				<div style={{zIndex: 5}}>
				<Textbox
					style={{width: "8rem"}}
					textboxContainerStyle={{marginRight: "1rem", zIndex: 5}}
				/>
				</div>
			</styled.LabelContainer>

			<styled.FieldComponentContainer>
				{children}
			</styled.FieldComponentContainer>
		</ContainerComponent>
	);
};

// Specifies propTypes
FieldWrapper.propTypes = {

};

// Specifies the default values for props:
FieldWrapper.defaultProps = {
	ContainerComponent: styled.DefaultContainerComponent,
};

export default FieldWrapper;
