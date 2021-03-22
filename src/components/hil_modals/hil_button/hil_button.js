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
	} = props

	return (
		<styled.Container
			color={color}
			onClick={onClick}
			css={containerCss}
		>
			{iconName &&
			<styled.HilIcon
				style={{ margin: 0, marginRight: "1rem", fontSize: "2.5rem" }}
				className={iconName}
				color={color}

			/>
			}
			<styled.HilButtonText
				color={color}
				style={{ margin: 0, padding: 0 }}
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
