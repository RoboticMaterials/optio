import React, {useState, useEffect} from "react"

// components internal
import Calendar from "../calendar/calendar"

// functions external
import Popup from 'reactjs-popup'
import PropTypes from "prop-types"

// styles
import * as styled from "./calendar_placeholder.style"
import {BASIC_FIELD_DEFAULTS} from "../../../constants/form_constants";

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		text,
		name,
		selectRange,
		endText,
		startText,
		containerStyle,
		usable,
		CalendarComponent,
		onChange,
		closeOnSelect,
		calendarProps
	} = props

	const [showCalendarPopup, setShowCalendarPopup] = useState(false)
	const [rangeIndex, setRangeIndex] = useState(null)

	const closePopup = () => {
		setShowCalendarPopup(false)
		setRangeIndex(null)
	}

	const renderCalendar = () => {

		return(
			<styled.BodyContainer>
				<styled.ContentHeader
					style={{}}>
					<styled.ContentTitle>Select Date</styled.ContentTitle>
					<i
						className="fas fa-times"
						style={{cursor: 'pointer'}}
						onClick={closePopup}
					/>
				</styled.ContentHeader>

				<styled.CalendarContainer>
					<CalendarComponent
						{...calendarProps}
						selectRange={false}
						index={rangeIndex}
						name={name}
						onChange={(val) => {
							const {
								value
							} = calendarProps || {}

							let tempVal = value || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE
							if(Number.isInteger(rangeIndex)) tempVal[rangeIndex] = val
							onChange(selectRange ? tempVal : val)
							closeOnSelect && closePopup()
						}}
					/>
				</styled.CalendarContainer>
			</styled.BodyContainer>
		)
	}

	if(selectRange) return (
		<styled.DatesContainer
			style={containerStyle}
		>
			<styled.DateItem
				usable={usable}
				onClick={() => {
					if(usable) {
						onStartClick()
						setRangeIndex(0)
						setShowCalendarPopup(true)
					}
				}}
			>
				<styled.DateText>{startText}</styled.DateText>
			</styled.DateItem>

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			<styled.DateItem
				usable={usable}
				onClick={() => {
					if(usable) {
						onEndClick()
						setRangeIndex(1)
						setShowCalendarPopup(true)
					}
				}}
			>
				<styled.DateText>{endText}</styled.DateText>
			</styled.DateItem>

			{showCalendarPopup &&
			<Popup
				open={showCalendarPopup}
				closeOnDocumentClick={true}
				onClose={closePopup}
			>
				{renderCalendar()}
			</Popup>
			}
		</styled.DatesContainer>
	)

	return (
		<styled.DateItem
			usable={usable}
			style={containerStyle}
			onClick={() => {
				if(usable) {
					onClick()
					setShowCalendarPopup(true)
				}
			}}
		>
			<styled.DateText>{text}</styled.DateText>
			{showCalendarPopup &&
			<Popup
				open={showCalendarPopup}
				closeOnDocumentClick={true}
				onClose={closePopup}
			>
				{renderCalendar()}
			</Popup>
			}
		</styled.DateItem>
	)
}

// Specifies propTypes
CalendarPlaceholder.propTypes = {
	closeOnSelect: PropTypes.bool
}

// Specifies the default values for props:
CalendarPlaceholder.defaultProps = {
	setShowCalendarPopup: () => {},
	onClick: () => {},
	usable: true,
	CalendarComponent: Calendar,
	onChange: () => {},
	closeOnSelect: true,
	onEndClick: () => {},
	onStartClick: () => {},
}

export default CalendarPlaceholder