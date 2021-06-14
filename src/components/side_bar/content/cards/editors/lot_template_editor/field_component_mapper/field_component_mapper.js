import React, {useEffect, useState, useContext} from "react";

// components internal
import Textbox from "../../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../../basic/calendar_placeholder/calendar_placeholder";
import TextField from "../../../../../../basic/form/text_field/text_field";
import NumberField from "../../../../../../basic/form/number_field/number_field";
import CalendarButtonField from "../../../../../../basic/form/calendar_button_field/calendar_button_field";

// constants
import {FIELD_COMPONENT_NAMES} from "../../../../../../../constants/lot_contants";

// functions external
import PropTypes from "prop-types";
import { ThemeContext } from 'styled-components'

// utils
import {jsDateToString} from "../../../../../../../methods/utils/card_utils";
import { LightenDarkenColor } from '../../../../../../../methods/utils/color_utils'

// styles
import * as styled from "./field_component_mapper.style"
import TimePickerField from "../../../../../../basic/form/time_picker_field/time_picker_field";
import FileUploaderField from "../../../../../../basic/form/file_uploader_field/file_uploader_field";

const REQUIRED_TEXT = "This field is required."

const FieldComponentMapper = (props) => {
	const {
		component,
		fieldName,
		containerStyle,
		preview,
		style,
		displayName,
		usable,
		required,
		showName,
		...rest
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
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}
					{preview ?
						<styled.TextContainer>
							<Textbox
								usable={usable}
								placeholder="Enter text..."
								style={{}}
								schema={"lots"}
								style={{display: "flex", flex: 1, ...style}}
								inputStyle={{flex: 1, background: LightenDarkenColor(themeContext.bg.secondary, 10), cursor: 'default', pointerEvents: 'none'}}
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
							// style={{...style}}
							inputStyle={{}}
							showErrorStyle={true}
						/>
					}

					{required &&
						<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
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
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}
					{preview ?
						<styled.TextContainer>
							<Textbox
								type="text"
								usable={usable}
								placeholder="Enter text..."
								InputComponent={Textbox}
								lines={5}
								style={{...style, display: "flex", flex: 1, alignSelf: 'stretch'}}
								textboxContainerStyle={{}}
								inputStyle={{background: LightenDarkenColor(themeContext.bg.secondary, 10), cursor: 'default', pointerEvents: 'none'}}
								schema={"lots"}
							/>
						</styled.TextContainer>
						:
						<TextField
							usable={usable}
							name={fieldName}
							type="text"
							placeholder="Enter text..."
							inputStyle={{}}
							InputComponent={Textbox}
							lines={5}
							schema={"lots"}
							showErrorStyle={true}
						/>
					}

					{required &&
					<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
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
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}
					{preview ?
						<NumberInput
							usable={usable}
							themeContext={themeContext}
							buttonStyle={{pointerEvents: 'none'}}
							inputStyle={{pointerEvents: 'none'}}
						/>
						:
						<NumberField
							usable={usable}
							name={fieldName}
							minValue={required ? 1 : 0}
						/>
					}

					{required &&
					<styled.RequiredText
						style={{alignSelf: "center"}}
					>
						{REQUIRED_TEXT}
					</styled.RequiredText>
					}
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}

					{preview ?
						<CalendarPlaceholder
							usable={usable}
							containerStyle={{width: "8rem", cursor: 'default', userSelect: 'none'}}
						/>
						:
						<CalendarButtonField
							name={fieldName}
							usable={usable}
							containerStyle={{width: "8rem", cursor: 'default', userSelect: 'none'}}
						/>
					}


					{required &&
					<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
					}
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}

					{preview ?
					<CalendarPlaceholder
						usable={usable}
						selectRange={true}
					/>
						:
						<CalendarButtonField
							name={fieldName}
							usable={usable}
							selectRange={true}
						/>
					}

					{required &&
					<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
					}

				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.TIME_SELECTOR: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}

					{preview ?
						<div>NOT YET IMPLEMENTED</div>
						:
						<TimePickerField
							name={fieldName}
							usable={usable}
						/>
					}

					{required &&
					<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
					}

				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.PDF_SELECTOR: {
			return(
				<styled.Container
					style={{
						...containerStyle,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					{showName && (displayName ?
						<styled.Label>{displayName}:</styled.Label>
						:
						fieldName && <styled.Label>{fieldName}:</styled.Label>)
					}

					{preview ?
						<div>NOT YET IMPLEMENTED</div>
						:
						<FileUploaderField
							name={fieldName}
							usable={usable}
							{...rest}
						/>
					}

					{required &&
					<styled.RequiredText>{REQUIRED_TEXT}</styled.RequiredText>
					}

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
	usable: PropTypes.bool,
	showName: PropTypes.bool,
};

// Specifies the default values for props:
FieldComponentMapper.defaultProps = {
	preview: true,
	onCalendarClick: () => {},
	usable: true,
	showName: true,
};


export default FieldComponentMapper