import React, {useEffect, useState} from "react";
import * as styled from "./timer_picker.style"
import PropTypes from "prop-types";
import {hoursRegex, minutesRegex, secondsRegex} from "../../../methods/utils/regex_utils";

const COLUMNS = {
	HOURS:"HOURS",
	SECONDS:"SECONDS",
	MINUTES:"MINUTES"
}

const TimePicker = (props) => {
	const {
		showSeconds,
		showMinutes,
		showHours,
		showAmPm,
		defaultShowMilitaryTime,
		onChange
	} = props

	const [hours, setHours] = useState(null)
	const [minutes, setMinutes] = useState(null)
	const [seconds, setSeconds] = useState(null)
	const [showMilitaryTime, setShowMilitaryTime] = useState(defaultShowMilitaryTime)

	useEffect( () => {
		onChange({hours, minutes, seconds})
	}, [hours,minutes,seconds])



	const handleChange = (changeEvent, regex, setField) => {
		const value = parseInt(changeEvent.target.value)

		const testResult = regex.test(value)
		if(value) {
			if(testResult) {
				setField(value)
			}
		}
		else {
			setField(null)
		}


	}

	const renderColumn = (type) => {
		let options
		let setField
		let field
		let title
		let regex

		switch(type) {
			case COLUMNS.HOURS:
				if(showMilitaryTime) {
					options = [...Array(24).keys()]
				}
				else {
					options = [...Array(12).keys()]
				}

				setField = setHours
				field = hours
				title = "Hours"
				regex = hoursRegex
				break
			case COLUMNS.MINUTES:
				options = [...Array(60).keys()]
				setField = setMinutes
				field = minutes
				title = "Minutes"
				regex = minutesRegex
				break
			case COLUMNS.SECONDS:
				options = [...Array(60).keys()]
				setField = setSeconds
				field = seconds
				title = "Seconds"
				regex = secondsRegex
				break

			default:
				break
		}


		return(
			<styled.Column>
				<styled.ColumnHeader>{title}</styled.ColumnHeader>
				<input
					type={"number"}
					value={field}
					onChange={(changeEvent) => handleChange(changeEvent, regex, setField)}
				/>
				<styled.OptionsContainer>
					{options.map((option, index) => {
						const selected = parseInt(option) === parseInt(field)
						return (
							<styled.Option
								selected={selected}
								key={field + "-" + option}
								onClick={()=>{
									setField(option)
								}}
							>
								{option}
							</styled.Option>
						)
					})}
				</styled.OptionsContainer>
			</styled.Column>
		)
	}
	return(
		<styled.Container>
			<styled.ColumnsContainer>
				{showHours &&
					renderColumn(COLUMNS.HOURS)
				}
				{showMinutes &&
					renderColumn(COLUMNS.MINUTES)
				}
				{showSeconds &&
					renderColumn(COLUMNS.SECONDS)
				}
			</styled.ColumnsContainer>

		</styled.Container>
	)

}

// Specifies propTypes
TimePicker.propTypes = {
	showSeconds: PropTypes.bool,
	showMinutes: PropTypes.bool,
	showHours: PropTypes.bool,
	showAmPm: PropTypes.bool,
	defaultShowMilitaryTime: PropTypes.bool,
};

// Specifies the default values for props:
TimePicker.defaultProps = {
	showSeconds: true,
	showMinutes: true,
	showHours: true,
	showAmPm: true,
	defaultShowMilitaryTime: true,
};

export default TimePicker