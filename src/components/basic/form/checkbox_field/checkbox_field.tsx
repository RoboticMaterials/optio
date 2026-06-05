import React from "react";
import { useField, useFormikContext } from "formik";

import * as styled from './checkbox_field.style'
import FieldWrapper from "../field_wrapper/field_wrapper";
import Checkbox from "../../checkbox/checkbox";
const CheckboxField = ({ children, ...props }) => {

	const {
		css,
		CheckBoxComponent,
		...rest
	} = props

	// We need to tell useField what type of input this is
	// since React treats radios and checkboxes differently
	// than inputs/select/textarea.
	const [field, meta] = useField({ ...props, type: 'checkbox' });
	return (
		<CheckBoxComponent
			css={css}
			{...field}
			{...rest}
		/>
	);
};

// Specifies propTypes
CheckboxField.propTypes = {

};

// Specifies the default values for props:
CheckboxField.defaultProps = {
	CheckBoxComponent: Checkbox
};

export default CheckboxField;
