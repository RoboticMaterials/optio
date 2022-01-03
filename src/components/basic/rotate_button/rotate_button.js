import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

// styles
import * as styled from "./rotate_button.style"

// component constant
const STATES = {
	STATE_ONE: "STATE_ONE",
	STATE_TWO: "STATE_TWO"
}

const RotateButton = props => {
	const {
		iconName1,
		state,
		rotationTime,
		onStateOne,
		onStateTwo,
		containerCss,
		iconCss,
		setSortChanged,
		schema
	} = props

	const [currentState, setCurrentState] = useState(state == 1 ? STATES.STATE_ONE : STATES.STATE_TWO)	// rotation state
	const [rotate, setRotate] = useState(false)
	const [call, setCall] = useState(false)

	/*
	* sets rotate when currentState changes and calls appropriate callback funcs
	* */
	useEffect(() => {
		if(currentState === STATES.STATE_ONE) {
			setRotate(false)
			onStateOne()

		}
		else {
			setRotate(true)
			onStateTwo()
		}
	}, [currentState])

	return (
		<styled.Container
			css={containerCss}
			schema={schema}
			onClick={() => {
				setSortChanged(true)
				setCurrentState(currentState === STATES.STATE_ONE ? STATES.STATE_TWO : STATES.STATE_ONE)
			}}
		>
			<styled.Icon
				schema={schema}
				css={iconCss}
				rotate={rotate}
				rotationTime={rotationTime}
				className={iconName1}
			>
			</styled.Icon>
		</styled.Container>
	)
}

RotateButton.propTypes = {
	iconName1: PropTypes.string,
	rotationTime: PropTypes.number,
	onStateOne: PropTypes.func,
	onStateTwo: PropTypes.func,
	setSortChanged: PropTypes.func,
}

RotateButton.defaultProps = {
	iconName1: "",
	rotationTime: 500,
	onStateOne: () => {},
	onStateTwo: () => {},
	setSortChanged:() => {},
	schema: "default"
}

export default RotateButton
