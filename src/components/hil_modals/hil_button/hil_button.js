import React from 'react';
import PropTypes from 'prop-types';


import * as styled from "./hil_button.style";
import FlexibleContainer from "../../basic/flexible_container/flexible_container";

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
		<FlexibleContainer>
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
				// style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;"
				unselectable="on"
				onselectstart="return false;"
				onmousedown="return false;"
				color={color}
				css={textCss}
			>
				{label}
			</styled.HilButtonText>
		</styled.Container>
		</FlexibleContainer>
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
