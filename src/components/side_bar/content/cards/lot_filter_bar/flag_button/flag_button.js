import React from 'react';
import PropTypes from 'prop-types';
import * as styled from "../../zone_header/zone_header.style";

const FlagButton = (props) => {

	const {
		color,
		style,
		onClick,
		...rest
	} = props

	return (
		<styled.FlagButton
			style={style}
			type={"button"}
			color={color}
			className="fas fa-square"
			onClick={onClick}
			{...rest}
		/>
	);
};

FlagButton.propTypes = {
	color: PropTypes.string,
	onClick: PropTypes.func
};

FlagButton.defaultTypes = {
	color: "",
	onClick: () => {},
};

export default FlagButton;
