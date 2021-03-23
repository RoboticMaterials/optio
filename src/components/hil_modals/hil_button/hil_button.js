import React from 'react';
import PropTypes from 'prop-types';


import * as styled from "./hil_button.style";

const HilButton = (props) => {

	const {
		label,
		onClick,
		color,
		iconColor,
		iconName,
		textColor,
		containerCss,
		iconCss,
		textCss
	} = props

	return (
		<styled.Container
			color={color}
			onClick={onClick}
			css={containerCss}
		>
			{iconName &&
			<styled.HilIcon
				className={iconName}
				color={color}
				css={iconCss}

			/>
			}
			<styled.HilButtonText
				color={color}
				css={textCss}
			>
				{label}
			</styled.HilButtonText>
		</styled.Container>
	);
};

HilButton.propTypes = {
	label: PropTypes.string,
	onClick: PropTypes.string
};

HilButton.defaultProps = {
	label: "",
	onClick: () => {},
};

export default HilButton;
