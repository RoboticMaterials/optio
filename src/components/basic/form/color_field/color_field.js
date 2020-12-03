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
		mode
	} = props

	// formik related
	const { setFieldValue, setFieldTouched, validateOnChange, validateOnBlur, validateField, validateForm, ...context } = useFormikContext();
	const [field, meta] = useField(props);
	const hasError = meta.touched && meta.error;


	return (
		<Container>

			{mode === "twitter" ?
				<styled.StyledTwitterPicker
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
					{...props}
					triangle={"hide"}
				/>
				:
				<styled.ColorPicker>
					<div className="dropdown show" style={{zIndex: '1'}}>
						<styled.ColorButton className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Color
						</styled.ColorButton>

						<styled.DropdownMenu className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<styled.ColorOption type={type} className="dropdown-item" color={'#bcbcbc'} onClick={() => setFieldValue(field.name, '#bcbcbc')}>Gray</styled.ColorOption>
							<styled.ColorOption type={type} className="dropdown-item" color={'#FF4B4B'} onClick={() => setFieldValue(field.name, '#FF4B4B')}>Red</styled.ColorOption>
							<styled.ColorOption type={type} className="dropdown-item" color={'#56d5f5'} onClick={() => setFieldValue(field.name, '#56d5f5')}>Blue</styled.ColorOption>
							<styled.ColorOption type={type} className="dropdown-item" color={'#50de76'} onClick={() => setFieldValue(field.name, '#50de76')}>Green</styled.ColorOption>
							<styled.ColorOption type={type} className="dropdown-item" color={'#f2ae41'} onClick={() => setFieldValue(field.name, '#f2ae41')}>Orange</styled.ColorOption>
							<styled.ColorOption type={type} className="dropdown-item" color={'#c7a0fa'} onClick={() => setFieldValue(field.name, '#c7a0fa')}>Purple</styled.ColorOption>
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
	mode: PropTypes.string
};

// Specifies the default values for props:
ColorField.defaultProps = {
	Container: styled.DefaultContainer,
	mode: null
};

export default ColorField;
