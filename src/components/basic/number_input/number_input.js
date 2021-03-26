import React from "react"

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from './number_input.style'

export const NUMBER_INPUT_BUTTON_TYPES = {
	PLUS: "PLUS",
	MINUS: "MINUS"
}

const NumberInput = ({
	maxValue,
	minValue,
	onMinusClick,
	onPlusClick,
	minusDisabled,
	hasError,
	onInputChange,
	inputDisabled,
	themeContext,
	value,
	plusDisabled,
	inputCss,
	longPlusPressEvent,
	longMinusPressEvent,
	inputChildren,
	inputStyle,
	buttonStyle,
	containerStyle,
	...props }) => {


	return (
		<styled.Container style={containerStyle}>
			<styled.Button
				// color={'#ff1818'}
				color={themeContext.fg.primary}
				className='fas fa-minus-square'
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onMinusClick()
				}}
				{...longMinusPressEvent}
				disabled={minusDisabled}
				style={buttonStyle}
			/>
			<div style={{position: "relative"}}>
				<styled.Input
					disabled={inputDisabled}
					inputCss={inputCss}
					type="number"
					onChange={onInputChange}
					value={value}
					style={inputStyle}
				>
				</styled.Input>
				{inputChildren}
			</div>
			<styled.Button
				className='fas fa-plus-square'
				// color={'#1c933c'}
				color={themeContext.fg.primary}
				disabled={plusDisabled}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onPlusClick()
				}}
				{...longPlusPressEvent}
				style={buttonStyle}
			/>
		</styled.Container>
	)
}

// Specifies propTypes
NumberInput.propTypes = {
	plusDisabled: PropTypes.bool,
	inputDisabled: PropTypes.bool,
}

// Specifies the default values for props:
NumberInput.defaultProps = {
	plusDisabled: false,
	inputDisabled: false,
	onMinusClick: () => {},
	onPlusClick: () => {}
}

export default NumberInput
