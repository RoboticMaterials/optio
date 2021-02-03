import React from "react";
import PropTypes from 'prop-types';

import * as styled from './number_input.style'

const NumberInput = ({
	maxValue,
	minValue,
	onMinusClick,
	onPlusClick,
	minusDisabled,
	hasError,
	onInputChange,
	value,
	plusDisabled,
						 inputCss,
	inputChildren,
	...props }) => {


	return (
		<styled.Container>
			<styled.Button
				color={'#ff1818'}
				className='fas fa-minus-circle'
				onClick={onMinusClick}
				disabled={minusDisabled}
			/>
			<div style={{position: "relative"}}>
				<styled.Input
					inputCss={inputCss}
					type="number"
					onChange={onInputChange}
					value={value}
				>
				</styled.Input>
				{inputChildren}
			</div>
			<styled.Button
				className='fas fa-plus-circle'
				color={'#1c933c'}
				disabled={plusDisabled}
				onClick={onPlusClick}
			/>
		</styled.Container>
	);
};

// Specifies propTypes
NumberInput.propTypes = {
	plusDisabled: PropTypes.bool,

};

// Specifies the default values for props:
NumberInput.defaultProps = {
	plusDisabled: false,
};

export default NumberInput;
