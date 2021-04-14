import React, {useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./control_button.style"

const ControlButton = props => {

	const {
		content,
		on,
		onClick,
		schema
	} = props

	return (
		<styled.Container
			on={on}
			onClick={onClick}
			schema={schema}
		>
			<styled.Content
				schema={schema}
			>{content}</styled.Content>
		</styled.Container>
	);
};

ControlButton.propTypes = {
	content: PropTypes.string
};

ControlButton.defaultProps = {
	content: ""
};


export default ControlButton;
