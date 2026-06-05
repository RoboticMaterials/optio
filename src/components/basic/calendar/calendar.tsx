import React from 'react'

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./calendar.style"

const Calendar = (props) => {

	const {
		value,

		...rest
	} = props

	return (
		<styled.StyledCalendar
			{...rest}
			value={value}
		/>
	)
}

Calendar.propTypes = {

}

Calendar.defaultTypes = {
	value: null
}

export default Calendar
