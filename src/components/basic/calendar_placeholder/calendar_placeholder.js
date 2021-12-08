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
import {jsDateToString} from "../../../methods/utils/card_utils";
import CalendarPlaceholderButton from "../calendar_placeholder_button/calendar_placeholder_button";


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
		value,
		PlaceholderButton,
		schema
	} = props

	const [showCalendarPopup, setShowCalendarPopup] = useState(false)
	const [rangeIndex, setRangeIndex] = useState(null)
	const [displayName, setDisplayName] = useState(selectRange ? [defaultStartText, defaultEndText] : defaultText)

	const closePopup = () => {
		setShowCalendarPopup(false)
		setRangeIndex(null)
	}

	useEffect(() => {
		// value is array
		if(selectRange) {
			let tempDisplayName = []
			if(isNonEmptyArray(value) && value[0]) {
				tempDisplayName[0] = jsDateToString(value[0])
			}
			else {
				tempDisplayName[0] = defaultStartText
			}
			if(isNonEmptyArray(value) && value[1]) {
				tempDisplayName[1] = jsDateToString(value[1])
			}
			else {
				tempDisplayName[1] = defaultEndText
			}

			setDisplayName(tempDisplayName)
		}

		// value is single value
		else if(value) {
			setDisplayName(jsDateToString(value))
		}
		else {
			setDisplayName(defaultText)
		}
	}, [value])

	const renderCalendar = () => {
		return(
			<styled.BodyContainer>
				<styled.ContentHeader>
					<styled.ContentTitle>Select Date</styled.ContentTitle>
					<i
						className="fas fa-times"
						style={{cursor: 'pointer'}}
						onClick={closePopup}
					/>
				</styled.ContentHeader>

				<styled.CalendarContainer>
					<CalendarComponent
						value={value}
						minDate={Number.isInteger(rangeIndex) ? (rangeIndex === 1 ? minDate : null) : minDate}
						maxDate={Number.isInteger(rangeIndex) ? (rangeIndex === 0 ? maxDate : null) : maxDate}
						selectRange={false}
						index={rangeIndex}
						name={name}
						onChange={(val) => {
							let tempCurrVal = Number.isInteger(rangeIndex) ?
								immutableSet((isNonEmptyArray(value) && value.length > 0) ? value
									: BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE, val, rangeIndex) ||
								BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE

							// setCurrentVal(selectRange ? tempCurrVal : val)
							onChange(selectRange ? tempCurrVal : val)
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
			{typeof PlaceholderButton === "object" ?
				React.cloneElement(PlaceholderButton,{
					label: displayName[0],
					usable: usable,
					index: 0,
					schema,
					onClick: () => {
						if(usable) {
							onStartClick()
							setRangeIndex(0)
							setShowCalendarPopup(true)
						}}
				})
				:
				<PlaceholderButton
					schema={schema}
					containerStyle={{backgroundColor: !usable && '#f7f7fa', boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)'}}
					usable={usable}
					onClick={() => {
						if(usable) {
							onStartClick()
							setRangeIndex(0)
							setShowCalendarPopup(true)
						}
					}}
					label={displayName[0]}
				/>
			}

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			{typeof PlaceholderButton === "object" ?
				React.cloneElement(PlaceholderButton,{
					label: displayName[1],
					usable,
					index: 1,
					schema,
					onClick: () => {
						if(usable) {
							onEndClick()
							setRangeIndex(1)
							setShowCalendarPopup(true)
						}}
				})
				:
				<PlaceholderButton
					schema={schema}
					containerStyle={{backgroundColor: !usable && '#f7f7fa', boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)'}}
					usable={usable}
					onClick={() => {
						if(usable) {
							onEndClick()
							setRangeIndex(1)
							setShowCalendarPopup(true)
						}
					}}
					label={displayName[1]}
				/>
			}

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

	return(
		<>
			{typeof PlaceholderButton === "object" ?
				React.cloneElement(PlaceholderButton,{
					label: displayName,
					usable: usable,
					containerStyle: containerStyle,
					schema,
					onClick: () => {
						if(usable) {
							onClick()
							setShowCalendarPopup(true)
						}}
				})
				:
				<PlaceholderButton
					usable={usable}
					schema={schema}
					containerStyle={{backgroundColor: !usable && '#f7f7fa', boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)'}}
					onClick={() => {
						if(usable) {
							onClick()
							setShowCalendarPopup(true)
						}
					}}
					label={displayName}
				/>
			}

			{showCalendarPopup &&
			<Popup
				open={showCalendarPopup}
				closeOnDocumentClick={true}
				onClose={closePopup}
			>
				{renderCalendar()}
			</Popup>
			}
		</>
	)

	// if() {
	// 	return(
	//
	// 	)
	// }
	//
	// return(
	//
	// )
}

// Specifies propTypes
CalendarPlaceholder.propTypes = {
	closeOnSelect: PropTypes.bool,
	PlaceholderButton: PropTypes.any
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
	PlaceholderButton: CalendarPlaceholderButton
}

export default CalendarPlaceholder
