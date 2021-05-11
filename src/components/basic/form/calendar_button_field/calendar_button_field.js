import React, {useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import CalendarPlaceholder from "../../calendar_placeholder/calendar_placeholder"
import {useField, useFormikContext} from "formik";
import {isArray, isNonEmptyArray} from "../../../../methods/utils/array_utils";
import {getMessageFromError} from "../../../../methods/utils/form_utils";
import {jsDateToString} from "../../../../methods/utils/card_utils";
import Calendar from "../../calendar/calendar";
import CalendarField from "../calendar_field/calendar_field";
import ErrorTooltip from "../error_tooltip/error_tooltip";

import * as styled from './calendar_button_field.style'
import {ThemeContext} from "styled-components";
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

	const themeContext = useContext(ThemeContext)

	const hasError = touched && error

	const errorMessage = getMessageFromError(error)

	return (
		<styled.Container>
		<CalendarPlaceholder
			value={fieldValue}
			CalendarComponent={CalendarField}
			{...props}
			containerStyle={hasError ?
				{
					...props.containerStyle,
					border: "1px solid red",
					boxShadow: "0 0 5px red"
				} :
				{...props.containerStyle}}
		/>
			<ErrorTooltip
				visible={hasError}
				text={errorMessage}
				color={themeContext.bad}
				ContainerComponent={styled.IconContainerComponent}
			/>


		</styled.Container>
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
