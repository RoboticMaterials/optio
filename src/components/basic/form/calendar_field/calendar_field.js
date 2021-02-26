import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
import Calendar from 'react-calendar'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from './calendar_field.style'
import ErrorTooltip from "../error_tooltip/error_tooltip";
import {isEmpty} from "ramda";
import {isArray} from "../../../../methods/utils/array_utils";

export const CALENDAR_FIELD_MODES = {
	START: "START",
	END: "END",
	RANGE: "RANGE"
}

const CalendarField = ({
	onChange,
	Container,
	onDropdownClose,
	mode,
	mapInput,
	mapOutput,
	minDate,
	maxDate,
   selectRange,
	...props
}) => {

	console.log("cal minDate",minDate)
	console.log("cal maxDate",maxDate)
	const { setFieldValue, setFieldTouched, ...formikContext } = useFormikContext();
	const [{value: fieldValue, ...field}, {initialValue, ...meta}] = useField(props);
	const hasError = meta.touched && meta.error;

	const errorMessage = getMessageFromError(meta.error);

	return (
		<Container>
				<styled.StyledCalendar
					onDropdownClose={()=>{
						// set this field to touched if not already

						// call any additional function that was passed as prop
						onDropdownClose && onDropdownClose();
					}}
					{...field}
					selectRange={selectRange}
					// defaultValue={[initialStartDate, initialEndDate]}
					value={mapInput(fieldValue)}
					allowPartialRange
					minDate={minDate}
					maxDate={maxDate}
					// defaultActiveStartDate={initialStartDate}
					// defaultValue={value}
					{...props}
					onChange={value => {
						const isTouched = meta.touched;
						if(!isTouched) {
							setFieldTouched(true)
						}

						setFieldValue(field.name, mapOutput(value))

						onChange && onChange(value)
					}}
				/>
				{/*</style.DefaultFieldDropdownContainer>*/}

				<ErrorTooltip
					visible={hasError}
					text={errorMessage}
					ContainerComponent={styled.IconContainerComponent}
				/>
		</Container>
	);
};

// Specifies propTypes
CalendarField.propTypes = {
};

// Specifies the default values for props:
CalendarField.defaultProps = {
	Container: styled.DefaultContainer,
	onChange: null,
	mapInput: (val) => val,
	mapOutput: (val) => val,
	selectRange: false
};

export default CalendarField;
