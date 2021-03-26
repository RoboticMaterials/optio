import React, {useEffect, useState, useContext} from "react";
import PropTypes from "prop-types";
import * as styled from "./field_component_mapper.style"
import { ThemeContext } from 'styled-components'
import Textbox from "../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../basic/calendar_placeholder/calendar_placeholder";
import TextField from "../../../../../basic/form/text_field/text_field";
import NumberField from "../../../../../basic/form/number_field/number_field";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {jsDateToObjDate, jsDateToString} from "../../../../../../methods/utils/card_utils";
import {FIELD_COMPONENT_NAMES} from "../../../../../../constants/lot_contants";
import {CALENDAR_FIELD_MODES} from "../../../../../basic/form/calendar_field/calendar_field";
import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

const FieldComponentMapper = (props) => {
	const {
		component,
		fieldName,
		containerStyle,
		preview,
		onCalendarClick,
		style,
		value,
		displayName
	} = props

	const themeContext = useContext(ThemeContext);


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
								// style={{width: "15rem"}}
								placeholder="Enter text..."
								textboxContainerStyle={{display: "flex", flex: 1}}
								schema={"lots"}
								style={{...style}}
								inputStyle={{flex: 1, background: LightenDarkenColor(themeContext.bg.secondary, 10), cursor: 'default', pointerEvents: 'none'}}
							/>
						</styled.TextContainer>
						:
						<TextField
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							schema={"lots"}
							// style={{...style}}
							inputStyle={{}}
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
						flex: 1,
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
								type="text"
								placeholder="Enter text..."
								InputComponent={Textbox}
								lines={5}
								style={{...style}}
								// style={{display: "flex", flex: 1}}
								textboxContainerStyle={{display: "flex", flex: 1}}
								inputStyle={{background: LightenDarkenColor(themeContext.bg.secondary, 10), cursor: 'default', pointerEvents: 'none'}}
								schema={"lots"}
							/>
						</styled.TextContainer>
						:
						<TextField
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							inputStyle={{}}
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
						alignItems: "center",
					}}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
					{preview ?
						<NumberInput themeContext={themeContext} buttonStyle={{pointerEvents: 'none'}} inputStyle={{pointerEvents: 'none'}}/>
						:
						<NumberField
							name={fieldName}
							minValue={0}
							// maxValue={100000000}
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
							containerStyle={{width: "8rem", cursor: 'default', userSelect: 'none'}}
							calendarContent={props.calendarContent}
							setShowCalendarPopup={props.setShowCalendarPopup}
							showCalendarPopup={props.showCalendarPopup}
							onClick={() => {return onCalendarClick(CALENDAR_FIELD_MODES.SINGLE)}}
							text={dateText ? dateText : "Select Date"}
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
							calendarContent={props.calendarContent}
							setShowCalendarPopup={props.setShowCalendarPopup}
							showCalendarPopup={props.showCalendarPopup}
							selectRange={true}
							startText={(startDay && startMonth && startYear) ? `${startMonth}/${startDay}/${startYear}` : "Select Start Date"}
							endText={(endDay && endMonth && endYear) ? `${endMonth}/${endDay}/${endYear}` : "Select End Date"}
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
	preview: PropTypes.bool
};

// Specifies the default values for props:
FieldComponentMapper.defaultProps = {
	preview: true,
	onCalendarClick: () => {}
};


export default FieldComponentMapper