import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import CalendarPlaceholder from "../../calendar_placeholder/calendar_placeholder"
import {useField, useFormikContext} from "formik";
import {isArray} from "../../../../methods/utils/array_utils";
import {getMessageFromError} from "../../../../methods/utils/form_utils";

const CalendarButtonField = (props) => {
	const {
		name
	} = props

	const { setFieldValue, setFieldTouched, ...formikContext } = useFormikContext()
	const [field, meta] = useField(name)

	const {
		value: fieldValue,
		name: fieldName
	} = field
	const {
		touched,
		error
	} = meta

	const hasError = touched && error

	const [currentStartDate, setCurrentStartDate] = useState(isArray(fieldValue) ? fieldValue[0] : null)
	const [currentEndDate, setCurrentEndDate] = useState(isArray(fieldValue) ? fieldValue[1] : null)

	useEffect(() => {
		setCurrentStartDate(isArray(fieldValue) ? fieldValue[0] : null)
		setCurrentEndDate(isArray(fieldValue) ? fieldValue[1] : null)
	}, [fieldValue])

	const errorMessage = getMessageFromError(error)

	return (
		<CalendarPlaceholder
			{...props}
		/>
	)
}

CalendarButtonField.propTypes = {

}

export default CalendarButtonField
