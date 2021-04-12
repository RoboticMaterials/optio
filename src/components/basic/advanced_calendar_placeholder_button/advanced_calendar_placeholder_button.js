import React, {useEffect, useState} from 'react';

// functions external
import PropTypes from 'prop-types';

// components internal
import ControlButton from "./control_button/control_button";
import CalendarPlaceholderButton from "../calendar_placeholder_button/calendar_placeholder_button";

// styles
import * as styled from "./advanced_calendar_placeholder_button.style"
import {isNonEmptyArray} from "../../../methods/utils/array_utils";

export const FILTER_DATE_OPTIONS = {
	LESS_THAN: "LESS_THAN",
	EQUAL: "EQUAL",
	GREATER_THAN: "GREATER_THAN"
}

const AdvancedCalendarPlaceholderButton = (props) => {

	const {
		usable,
		onClick,
		label,
		onOptionClick,
		index,
		filterValue,
		schema
	} = props

	const [containsLessThan, setContainsLessThan] = useState(false)
	const [containsGreaterThan, setContainsGreaterThan] = useState(false)
	const [containsEquals, setContainsEquals] = useState(false)

	useEffect(() => {

		if(isNonEmptyArray(filterValue)) {
			const {
				options = []
			} = filterValue[index] || {}

			setContainsLessThan(options.includes(FILTER_DATE_OPTIONS.LESS_THAN))
			setContainsGreaterThan(options.includes(FILTER_DATE_OPTIONS.GREATER_THAN))
			setContainsEquals(options.includes(FILTER_DATE_OPTIONS.EQUAL))
		}
		else {
			const {
				options = []
			} = filterValue || {}

			setContainsLessThan(options.includes(FILTER_DATE_OPTIONS.LESS_THAN))
			setContainsGreaterThan(options.includes(FILTER_DATE_OPTIONS.GREATER_THAN))
			setContainsEquals(options.includes(FILTER_DATE_OPTIONS.EQUAL))
		}

		return () => {

		};
	}, [filterValue, index]);

	return (
		<styled.Container>
			<CalendarPlaceholderButton
				usable={usable}
				onClick={onClick}
				label={label}
				containerStyle={{
					alignSelf: "stretch",
					minWidth: "fit-content",
					width: "unset",
					borderBottomLeftRadius: 0,
					borderBottomRightRadius: 0,
				}}
			/>

			<styled.ControlsContainer>
				<ControlButton
					schema={schema}
					on={containsLessThan}
					content={"<"}
					onClick={() => {
						onOptionClick(index, FILTER_DATE_OPTIONS.LESS_THAN)
					}}
				/>

				<ControlButton
					schema={schema}
					on={containsEquals}
					content={"="}
					onClick={() => {
						onOptionClick(index, FILTER_DATE_OPTIONS.EQUAL)
					}}
				/>

				<ControlButton
					schema={schema}
					on={containsGreaterThan}
					content={">"}
					onClick={() => {
						onOptionClick(index, FILTER_DATE_OPTIONS.GREATER_THAN)
					}}
				/>
			</styled.ControlsContainer>
		</styled.Container>
	);
};

AdvancedCalendarPlaceholderButton.propTypes = {
	onOptionClick: PropTypes.func,
};

AdvancedCalendarPlaceholderButton.defaultProps = {
	onOptionClick: () => {},
	filterValue: []
};



export default AdvancedCalendarPlaceholderButton;
