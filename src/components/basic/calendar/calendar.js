import React from 'react'

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./calendar.style"

const Calendar = (props) => {

	const {
		...rest
	} = props

	return (
		<styled.StyledCalendar
			{...rest}
		/>
	)
}

Calendar.propTypes = {

}

Calendar.defaultTypes = {

}

export default Calendar
