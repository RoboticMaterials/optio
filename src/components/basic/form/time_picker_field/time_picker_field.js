// import external modules
import React from "react";
import { useField, useFormikContext } from "formik";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

// import components
import ErrorTooltip from "../error_tooltip/error_tooltip";

// import styles
import * as styled from './time_picker_field.style'
import PropTypes from "prop-types";
import {getMessageFromError} from "../../../../methods/utils/form_utils";

const TimePickerField = (props) => {

	const {
		TimePickerCss,
		Container,
		ErrorContainerComponent,
		containerStyle,
		style,
		onChange,
		defaultOpenValue,
		defaultValue,
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

    // console.log('QQQQ error', field)

	const hasError = touched && error;
	const errorMessage = getMessageFromError(error);

	return (
			// <Container
			// 	style={containerStyle}
			// >
				<styled.TimePickerComponent
					{...style}
					{...field}
					{...rest}
					css={TimePickerCss}
					hasError={hasError}
					// showSecond={false}
					value={mapInput(fieldValue)}
					onChange={(val) => {

						if(!touched) setFieldTouched(fieldName, true)
						setFieldValue(fieldName, mapOutput(val))

						onChange && onChange(val)
					}}
				/>
			// 	<ErrorTooltip
			// 		visible={hasError}
			// 		text={errorMessage}
			// 		ContainerComponent={ErrorContainerComponent}
			// 	/>
			// </Container>
	)
}

// Specifies propTypes
TimePickerField.propTypes = {
	Container: PropTypes.elementType,
	ErrorContainerComponent: PropTypes.elementType,
	containerStyle: PropTypes.object,
	style: PropTypes.object,
	onChange: PropTypes.func,
	mapOutput: PropTypes.func,
	mapInput: PropTypes.func,
};

// Specifies the default values for props:
TimePickerField.defaultProps = {
	Container: styled.DefaultContainer,
	ErrorContainerComponent: styled.DefaultErrorContainerComponent,
	containerStyle: {},
	style: {},
	onChange: () => {},
	mapOutput: val => val,
	mapInput: val => val,
};

export default TimePickerField;
