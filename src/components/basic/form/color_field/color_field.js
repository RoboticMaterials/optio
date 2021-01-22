import React from "react";

// external functions
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
// external components
import { TwitterPicker } from 'react-color'

// internal components
import ErrorTooltip from '../error_tooltip/error_tooltip';

// styles
import * as styled from './color_field.style'

const ColorField = (props) => {

	const {
		Container,
		type,
		mode,
		colors,
		...rest
	} = props

	// formik related
	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(props);
	const hasError = meta.touched && meta.error;


	return (
		<Container>

			{mode === "twitter" ?
				<styled.StyledTwitterPicker>
				<TwitterPicker
					color={ field.value }
					onChangeComplete={(color)=>{
						setFieldValue(field.name, color.hex);
						console.log("ColorField: onChangeComplete: color",color)
					}}
					onChange={(color)=>{
						console.log("ColorField: onChange: color",color)
						// setFieldValue(field.name, color.hex);
					}}
					style={{zIndex: 10}}
					colors={colors.map(currColor => currColor.hex)}
					{...rest}
					triangle={"hide"}
				/>
				</styled.StyledTwitterPicker>

				:
				<styled.ColorPicker>
					<div className="dropdown show" style={{zIndex: '1'}}>
						<styled.ColorButton className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Color
						</styled.ColorButton>

						<styled.DropdownMenu className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							{colors.map((currColor) => {
								const {
									hex,
									label
								} = currColor

								return(
									<styled.ColorOption type={type} className="dropdown-item" color={hex} onClick={() => setFieldValue(field.name, hex)}>{label}</styled.ColorOption>
								)
							})}
						</styled.DropdownMenu>
					</div>
				</styled.ColorPicker>

			}




			
		</Container>
	);
};


// Specifies propTypes
ColorField.propTypes = {
	Container: PropTypes.elementType,
	mode: PropTypes.string,
	colors: PropTypes.arrayOf(PropTypes.string),
};

// Specifies the default values for props:
ColorField.defaultProps = {
	Container: styled.DefaultContainer,
	mode: null,
	colors: [
		{
			hex: '#FF4B4B',
			label: "Red"
		},
		{
			hex: '#56d5f5',
			label: "Blue"
		},
		{
			hex: '#50de76',
			label: "Green"
		},
		{
			hex: '#f2ae41',
			label: "Orange"
		},
		{
			hex: '#c7a0fa',
			label: "Purple"
		}
	]
};

export default ColorField;
