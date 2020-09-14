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

const TimePickerField = ({LabelComponent, ErrorComponent, TimePickerCss, testInitialVal,label, ...props }) => {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(props);

	//const format = 'h:mm a';
	const now = moment().hour(1).minute(0);
	const displayVal = moment(testInitialVal)
	const valString  = field.value;
	const hasError = meta.touched && meta.error;
	/*{styled.sharedStyle}*/

	return (
		<>
			{label &&
				<LabelComponent htmlFor={props.id || props.name}>{label}</LabelComponent>
			}


			<styled.ContentContainer>
				<styled.TimePickerComponent
					css={TimePickerCss}
					hasError={hasError}
					{...field}
					{...props}
					showSecond={false}
					value={field.value}
					onChange={val => {
						setFieldValue(field.name, val);
					}}
				/>
				<ErrorTooltip
					visible={hasError}
					text={meta.error}
					ContainerComponent={styled.ErrorContainerComponent}
				/>
			</styled.ContentContainer>


			{/*
			{hasError ? (
				<ErrorComponent className="error">{meta.error}</ErrorComponent>
			) : null}
			*/}


		</>

	);
};

// Specifies propTypes
TimePickerField.propTypes = {

};

// Specifies the default values for props:
TimePickerField.defaultProps = {
	LabelComponent: null,
	ErrorComponent: "div",
	// TimePickerCss: styled.TimePickerComponent
};

export default TimePickerField;
