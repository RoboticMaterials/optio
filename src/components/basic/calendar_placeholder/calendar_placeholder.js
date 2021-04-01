import React, {useState, useEffect} from "react"

// components internal
import Calendar from "../calendar/calendar"

// constants
import {BASIC_FIELD_DEFAULTS} from "../../../constants/form_constants"

// functions external
import Popup from 'reactjs-popup'
import PropTypes from "prop-types"

// styles
import * as styled from "./calendar_placeholder.style"
import {immutableSet, isNonEmptyArray} from "../../../methods/utils/array_utils";
import {dateRangeToStrings, jsDateToString} from "../../../methods/utils/card_utils";


const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		defaultText,
		defaultStartText,
		defaultEndText,
		name,
		selectRange,
		containerStyle,
		usable,
		CalendarComponent,
		onChange,
		closeOnSelect,
		minDate,
		maxDate,
		// value
	} = props

	const [showCalendarPopup, setShowCalendarPopup] = useState(false)
	const [rangeIndex, setRangeIndex] = useState(null)
	const [currentVal, setCurrentVal] = useState(selectRange ? [null, null] : null)
	const [displayName, setDisplayName] = useState(selectRange ? [defaultStartText, defaultEndText] : defaultText)

	const closePopup = () => {
		setShowCalendarPopup(false)
		setRangeIndex(null)
	}

	useEffect(() => {
		if(isNonEmptyArray(currentVal) && currentVal.length === 2) {
			let tempDisplayName = []
			if(currentVal[0]) {
				tempDisplayName[0] = jsDateToString(currentVal[0])
			}
			else {
				tempDisplayName[0] = defaultStartText
			}
			if(currentVal[1]) {
				tempDisplayName[1] = jsDateToString(currentVal[1])
			}
			else {
				tempDisplayName[1] = defaultEndText
			}

			setDisplayName(tempDisplayName)
		}
		else if(currentVal) {
			setDisplayName(jsDateToString(currentVal))
		}
		else {
			setDisplayName(defaultText)
		}
	}, [currentVal])

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
						minDate={Number.isInteger(rangeIndex) ? (rangeIndex === 1 ? minDate : null) : minDate}
						maxDate={Number.isInteger(rangeIndex) ? (rangeIndex === 0 ? maxDate : null) : maxDate}
						selectRange={false}
						index={rangeIndex}
						name={name}
						onChange={(val) => {
							let tempCurrVal = Number.isInteger(rangeIndex) ? immutableSet((isNonEmptyArray(currentVal) && currentVal.length > 0) ? currentVal : (BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE, val, rangeIndex) || BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE) : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE
							setCurrentVal(selectRange ? tempCurrVal : val)
							onChange(val)
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
				<styled.DateText>{displayName[0]}</styled.DateText>
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
				<styled.DateText>{displayName[1]}</styled.DateText>
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
			<styled.DateText>{displayName}</styled.DateText>
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
	minDate: null,
	maxDate: null,
	defaultStartText: "Select Start Date",
	defaultEndText: "Select End Date",
	defaultText: "Select Date",
}

export default CalendarPlaceholder