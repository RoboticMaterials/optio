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
	value,
	plusDisabled,
	inputCss,
	longPlusPressEvent,
	longMinusPressEvent,
	usable,
	inputChildren,
	...props }) => {


	return (
		<styled.Container>
			<styled.Button
				color={'#ff1818'}
				className='fas fa-minus-circle'
				usable={usable}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onMinusClick()
				}}
				{...longMinusPressEvent}
				disabled={minusDisabled}
			/>
			<div style={{position: "relative"}}>
				<styled.Input
					usable={usable}
					readOnly={props.readOnly || !usable}
					disabled={props.inputDisabled || !usable}
					inputCss={inputCss}
					type="number"
					onChange={onInputChange}
					value={value}
				>
				</styled.Input>
				{inputChildren}
			</div>
			<styled.Button
				usable={usable}
				className='fas fa-plus-circle'
				color={'#1c933c'}
				disabled={plusDisabled}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onPlusClick()
				}}
				{...longPlusPressEvent}
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
	usable: true,
	onMinusClick: () => {},
	onPlusClick: () => {}
}

export default NumberInput
