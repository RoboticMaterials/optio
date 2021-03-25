import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import * as styled from "./field_component_mapper.style"
import Textbox from "../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../basic/calendar_placeholder/calendar_placeholder";
import TextField from "../../../../../basic/form/text_field/text_field";
import NumberField from "../../../../../basic/form/number_field/number_field";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {jsDateToObjDate, jsDateToString} from "../../../../../../methods/utils/card_utils";
import {FIELD_COMPONENT_NAMES} from "../../../../../../constants/lot_contants";
import {CALENDAR_FIELD_MODES} from "../../../../../basic/form/calendar_field/calendar_field";

const FieldComponentMapper = (props) => {
	const {
		component,
		fieldName,
		containerStyle,
		preview,
		onCalendarClick,
		value,
		displayName,
		usable
	} = props

	switch(component) {
		case FIELD_COMPONENT_NAMES.TEXT_BOX: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						flex: 1
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
					{preview ?
						<styled.TextContainer>
						<Textbox
							usable={usable}
							placeholder="Enter text..."
							style={{display: "flex", flex: 1}}
							schema={"lots"}
						/>
						</styled.TextContainer>
						:
						<TextField
							usable={usable}
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							schema={"lots"}
						/>
					}

				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.TEXT_BOX_BIG: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						flex: 1
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
					{preview ?
						<styled.TextContainer>
						<Textbox
							usable={usable}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							lines={5}
							style={{display: "flex", flex: 1}}
							schema={"lots"}
						/>
						</styled.TextContainer>
						:
						<TextField
							usable={usable}
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							lines={5}
							schema={"lots"}
						/>
					}
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
			return(
				<styled.Container
					style={{

						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
					{preview ?
						<NumberInput
							usable={usable}
						/>
						:
						<NumberField
							usable={usable}
							name={fieldName}
							minValue={0}
						/>
					}
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
			const dateText = jsDateToString(value)

			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
						<CalendarPlaceholder
							usable={usable}
							containerStyle={{width: "6rem"}}
							onClick={() => onCalendarClick(CALENDAR_FIELD_MODES.SINGLE)}
							text={dateText ? dateText : "Date"}
						/>

				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
			let startDate, endDate
			if(isArray(value) && value.length > 0) {
				startDate = jsDateToObjDate(value[0])

				if(value.length > 1) {
					endDate = jsDateToObjDate(value[1])
				}

			}

			const {
				year: startYear,
				month: startMonth,
				day: startDay
			} = startDate || {}
			const {
				year: endYear,
				month: endMonth,
				day: endDay
			} = endDate || {}

			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
						<CalendarPlaceholder
							usable={usable}
							selectRange={true}
							startText={(startDay && startMonth && startYear) ? `${startMonth}/${startDay}/${startYear}` : "Start"}
							endText={(endDay && endMonth && endYear) ? `${endMonth}/${endDay}/${endYear}` : "End"}
							onEndClick={() => onCalendarClick(CALENDAR_FIELD_MODES.END)}
							onStartClick={() => onCalendarClick(CALENDAR_FIELD_MODES.START)}
						/>

				</styled.Container>
			)
		}
		default:
			return null
	}
}

// Specifies propTypes
FieldComponentMapper.propTypes = {
	preview: PropTypes.bool,
	usable: PropTypes.bool
};

// Specifies the default values for props:
FieldComponentMapper.defaultProps = {
	preview: true,
	onCalendarClick: () => {},
	usable: true
};


export default FieldComponentMapper