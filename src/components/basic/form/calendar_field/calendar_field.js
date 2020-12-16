import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from "formik";
import Calendar from 'react-calendar'
import { getMessageFromError } from "../../../../methods/utils/form_utils";

// import styles
import * as styled from './calendar_field.style'
import ErrorTooltip from "../error_tooltip/error_tooltip";
import {isEmpty} from "ramda";


const CalendarField = ({
								 onChange,
								 Container,
						   onDropdownClose,
								 ...props
							 }) => {

	const { setFieldValue, setFieldTouched, ...formikContext } = useFormikContext();
	const [{value, ...field}, {initialValue, ...meta}] = useField(props);
	const hasError = meta.touched && meta.error;

	const errorMessage = getMessageFromError(meta.error);

	// console.log("CalendarField value",value)
	// console.log("CalendarField field",field)
	// console.log("CalendarField formikContext",formikContext)
	// console.log("CalendarField meta",meta)

	// const {
	// 	start: {
	// 		year: startYear = 0,
	// 		month: startMonth = 0,
	// 		day: startDay = 0
	// 	} = {},
	// 	end: {
	// 		year: endYear = 0,
	// 		month: endMonth = 0,
	// 		day: endDay = 0
	// 	} = {},
	// } = initialValue || {}

	// const {
	// 	start: {
	// 	} = {},
	// 	end: {
	// 	} = {},
	// } = value || {}

	const startYearVal = value?.start?.year || 0
	const startMonthVal = value?.start?.month || 0
	const startDayVal = value?.start?.day || 0

	const endYearVal = value?.end?.year || 0
	const endMonthVal = value?.end?.month || 0
	const endDayVal = value?.end?.day || 0


	// const initialStartDate = (startYear && startMonth && startDay) ? new Date(startYear, startMonth, startDay, 0, 0, 0, 0) : new Date()
	// const initialEndDate = (endYear && endMonth && endDay) ? new Date(endYear, endMonth, endDay, 0, 0, 0, 0) : null

	const startDate = (startYearVal && startMonthVal && startDayVal) ? new Date(startYearVal, startMonthVal, startDayVal, 0, 0, 0, 0) : new Date()
	const endDate = (endYearVal && endMonthVal && endDayVal) ? new Date(endYearVal, endMonthVal, endDayVal, 0, 0, 0, 0) : null

	return (
		<Container>
				<styled.StyledCalendar
					onDropdownClose={()=>{
						// set this field to touched if not already

						// call any additional function that was passed as prop
						onDropdownClose && onDropdownClose();
					}}
					{...field}
					selectRange={true}
					// defaultValue={[initialStartDate, initialEndDate]}
					value={[startDate, endDate]}
					allowPartialRange
					// defaultActiveStartDate={initialStartDate}
					// defaultValue={value}
					{...props}
					onChange={value => {
						const isTouched = meta.touched;
						if(!isTouched) {
							setFieldTouched(true)
						}

						console.log("CalendarField onChange value", value)
						const startDate = value[0]


						let month = startDate.getUTCMonth()
						let day = startDate.getUTCDate();
						let year = startDate.getUTCFullYear();

						let newValue = {
							start: {year, month, day}
						}

						if(Array.isArray(value) && value.length > 1) {
							const endDate = value[1]
							let month = endDate.getUTCMonth()
							let day = endDate.getUTCDate() - 1
							let year = endDate.getUTCFullYear()
							newValue["end"] = {year, month, day}
						}

						//
						//
						// console.log("year",year)
						// console.log("month",month)
						// console.log("day",day)
						setFieldValue(field.name, newValue);
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
};

export default CalendarField;
