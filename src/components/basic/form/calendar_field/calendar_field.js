import React, { useEffect, useState } from 'react'

// functions external
import PropTypes from 'prop-types'
import { useField, useFormikContext } from "formik"

// import styles
import * as styled from './calendar_field.style'

// components internal
import ErrorTooltip from "../error_tooltip/error_tooltip"
import Calendar from "../../calendar/calendar"

// utils
import {isArray} from "../../../../methods/utils/array_utils"
import { getMessageFromError } from "../../../../methods/utils/form_utils"


export const CALENDAR_FIELD_MODES = {
	START: "START",
	END: "END",
	RANGE: "RANGE",
	SINGLE: "SINGLE",
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
	index,
	...props
}) => {

	const { setFieldValue, setFieldTouched, ...formikContext } = useFormikContext()
	const [{value: fieldValue, name: fieldName, ...field}, {initialValue, ...meta}] = useField(props)
	const hasError = meta.touched && meta.error

	const [currentStartDate, setCurrentStartDate] = useState(isArray(fieldValue) ? fieldValue[0] : null)
	const [currentEndDate, setCurrentEndDate] = useState(isArray(fieldValue) ? fieldValue[1] : null)

	useEffect(() => {
		setCurrentStartDate(isArray(fieldValue) ? fieldValue[0] : null)
		setCurrentEndDate(isArray(fieldValue) ? fieldValue[1] : null)
	}, [fieldValue, index])

	const errorMessage = getMessageFromError(meta.error)
	console.log("calender fieldValue",fieldValue)

	return (
		<Container>
				<Calendar
					{...field}
					{...props}
					selectRange={selectRange}
					value={mapInput( fieldValue)}
					allowPartialRange
					minDate={minDate ? minDate : (index !== null && index !== 0) ? currentStartDate : null}
					maxDate={maxDate ? maxDate : (index !== null && index !== 1) ? currentEndDate : null}
					onChange={value => {
						const isTouched = meta.touched
						if(!isTouched) {
							setFieldTouched(true)
						}

						setFieldValue((index !== null) ? `${fieldName}[${index}]` : fieldName, mapOutput(value))

						onChange && onChange(value)
					}}

				/>
		</Container>
	)
}

// Specifies propTypes
CalendarField.propTypes = {
	selectRange: PropTypes.bool
}

// Specifies the default values for props:
CalendarField.defaultProps = {
	Container: styled.DefaultContainer,
	onChange: null,
	mapInput: (val) => val,
	mapOutput: (val) => val,
	selectRange: false
}

export default CalendarField
