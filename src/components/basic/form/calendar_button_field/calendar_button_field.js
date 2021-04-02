import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import CalendarPlaceholder from "../../calendar_placeholder/calendar_placeholder"
import {useField, useFormikContext} from "formik";
import {isArray, isNonEmptyArray} from "../../../../methods/utils/array_utils";
import {getMessageFromError} from "../../../../methods/utils/form_utils";
import {jsDateToString} from "../../../../methods/utils/card_utils";
import Calendar from "../../calendar/calendar";
import CalendarField from "../calendar_field/calendar_field";

const CalendarButtonField = (props) => {
	const {
		name
	} = props

	// const formikContext = useFormikContext()
	const [field, meta] = useField(name)

	const {
		value: fieldValue,
	} = field
	const {
		touched,
		error
	} = meta

	const hasError = touched && error

	const errorMessage = getMessageFromError(error)

	return (
		<CalendarPlaceholder
			value={fieldValue}
			CalendarComponent={CalendarField}
			{...props}
		/>
	)
}

CalendarButtonField.propTypes = {
	name: PropTypes.string,
	defaultStartText: PropTypes.string,
	defaultEndText: PropTypes.string,
	defaultText: PropTypes.string,
}

CalendarButtonField.defaultProps = {
	name: "",
	defaultStartText: "Select Start Date",
	defaultEndText: "Select End Date",
	defaultText: "Select Date",
}

export default CalendarButtonField
