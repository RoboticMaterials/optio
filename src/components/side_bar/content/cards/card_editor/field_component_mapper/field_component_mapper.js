import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import * as styled from "./field_component_mapper.style"
import Textbox from "../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../basic/calendar_placeholder/calendar_placeholder";
import TextField from "../../../../../basic/form/text_field/text_field";
import NumberField from "../../../../../basic/form/number_field/number_field";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {jsDateToObjDate} from "../../../../../../methods/utils/card_utils";
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
		displayName
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
							// style={{width: "15rem"}}
							placeholder="Enter text..."
							textboxContainerStyle={{display: "flex", flex: 1}}
						/>
						</styled.TextContainer>
						:
						<TextField
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
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
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							lines={5}
							// style={{display: "flex", flex: 1}}
							textboxContainerStyle={{display: "flex", flex: 1}}
						/>
						</styled.TextContainer>
						:
						<TextField
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							InputComponent={Textbox}
							lines={5}

							// style={{width: "15rem"}}
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
						<NumberInput/>
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
			return(
				<styled.Container
					style={containerStyle}
				>
					{displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>
					}
						<CalendarPlaceholder
							containerStyle={{width: "6rem"}}
							onClick={onCalendarClick}
							text={"Date"}
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
	preview: PropTypes.bool
};

// Specifies the default values for props:
FieldComponentMapper.defaultProps = {
	preview: true,
	onCalendarClick: () => {}
};


export default FieldComponentMapper