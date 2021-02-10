import React, {useEffect, useRef, useState} from "react";
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
		children,
		onDeleteClick,
		name
	} = props


	// const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	// const [field, meta] = useField(props);
	const [updateColor, setUpdateColor] = useState(false)


	// extract field data
	// const {
	// 	value: fieldValue,
	// 	name: fieldName
	// } = field

	// extract meta data
	// const { touched, error } = meta

	// does the field contain an error?
	// const hasError = touched && error

	useEffect( () => {
		const timeout = setTimeout(() => {
			setUpdateColor(true)
		}, 200)

		return () => {
			clearTimeout(timeout)
		}
	}, []);





	return (
		<ContainerComponent>
			<styled.LabelContainer updateColor={updateColor}>
				{/*<styled.GapFiller/>*/}
				{/*<div style={{zIndex: 5}}>*/}
				<TextField
					InputComponent={Textbox}
					name={name}
					style={{width: "8rem"}}
					textboxContainerStyle={{zIndex: 5}}
				/>
				{/*</div>*/}
			</styled.LabelContainer>

			<styled.FieldComponentContainer updateColor={updateColor}>

				{children}

				<styled.DeleteIcon
					onClick={() => {
						onDeleteClick()
					}}
					color={"#EC0000"}
					className={"fas fa-trash"}
				/>

				<styled.StyleContainer>
					<styled.AlignIcon color={"black"} className="fas fa-align-left"></styled.AlignIcon>
					<styled.AlignIcon color={"black"} className="fas fa-align-justify"></styled.AlignIcon>
					<styled.AlignIcon color={"black"} className="fas fa-align-right"></styled.AlignIcon>
				</styled.StyleContainer>


			</styled.FieldComponentContainer>



			{/*<styled.DeleteContainer updateColor={updateColor}>*/}

			{/*</styled.DeleteContainer>*/}
			{/*<i className=""></i>*/}


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
