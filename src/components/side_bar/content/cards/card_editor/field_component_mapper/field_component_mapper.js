import React, {useEffect, useState} from "react";
import * as styled from "./field_component_mapper.style"
import {FIELD_COMPONENT_NAMES} from "../editor_sidebar/editor_sidebar";
import Textbox from "../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../basic/calendar_placeholder/calendar_placeholder";

const FieldComponentMapper = (props) => {
	const {
		component,
		fieldName
	} = props


	switch(component) {
		case FIELD_COMPONENT_NAMES.TEXT_BOX: {
			return(
				<styled.Container>
					{fieldName &&
					<styled.Label>{fieldName}:</styled.Label>
					}
					<Textbox style={{width: "15rem"}}/>
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
			return(
				<styled.Container>
					{fieldName &&
					<styled.Label>{fieldName}:</styled.Label>
					}
				<NumberInput/>
				</styled.Container>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
			return(
				<CalendarPlaceholder text={fieldName ? fieldName : "Start Date"}/>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
			return(
				<CalendarPlaceholder selectRange={true} startText="Start" endText={"End"}/>
			)
		}
		default:
			return null
	}
}

// Specifies propTypes
FieldComponentMapper.propTypes = {
};

// Specifies the default values for props:
FieldComponentMapper.defaultProps = {
};




export default FieldComponentMapper