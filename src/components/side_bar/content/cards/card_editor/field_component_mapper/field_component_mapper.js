import React, {useEffect, useState} from "react";
import * as styled from "./field_component_mapper.style"
import {FIELD_COMPONENT_NAMES} from "../editor_sidebar/editor_sidebar";
import Textbox from "../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../basic/number_input/number_input";
import CalendarPlaceholder from "../../../../../basic/calendar_placeholder/calendar_placeholder";

const FieldComponentMapper = (props) => {
	const {
		component
	} = props


	switch(component) {
		case FIELD_COMPONENT_NAMES.TEXT_BOX: {
			return(
				<Textbox style={{width: "15rem"}}/>
			)
		}
		case FIELD_COMPONENT_NAMES.NUMBER_INPUT: {
			return(
				<NumberInput/>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_SINGLE: {
			return(
				<CalendarPlaceholder text="Start Date"/>
			)
		}
		case FIELD_COMPONENT_NAMES.CALENDAR_START_END: {
			return(
				<CalendarPlaceholder selectRange={true} startText="Start Date" endText={"End Date"}/>
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