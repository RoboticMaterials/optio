import React from 'react';
import PropTypes from 'prop-types';

import * as styled from './calendar_placeholder_button.style'

const CalendarPlaceholderButton = (props) => {

	const {
		usable,
		onClick,
		label,
		containerStyle
	} = props

	return (
		<styled.DateItem
			usable={usable}
			onClick={onClick}
			style={containerStyle}
		>
			<styled.DateText>{label}</styled.DateText>
		</styled.DateItem>
	);
};

CalendarPlaceholderButton.propTypes = {
	usable: PropTypes.bool,
	label: PropTypes.string,
	onClick: PropTypes.func,
};

CalendarPlaceholderButton.defaultProps = {
	usable: true,
	label: "",
	onClick: () => {},
};

export default CalendarPlaceholderButton;
