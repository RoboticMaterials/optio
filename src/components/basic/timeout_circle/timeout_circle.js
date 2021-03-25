import React, {useEffect, useState} from 'react'

// components internal
import ProgressCircle from "../progress_circle/progress_circle"
import BounceButton from "../bounce_button/bounce_button"

// functions external
import PropTypes from 'prop-types'

// hooks
import useLongPress from "../../../hooks/useLongPress"

// styles
import * as styled from "./timeout_circle.style"

// options for useLongPress hook
const longPressOptions = {
	shouldPreventDefault: true,
	delay: 0,
}

const TimeoutButton = props => {

	const {
		timeout,
		onTimeoutSuccess,
		onTimeoutFailure
	} = props

	const [clickProgress, setClickProgress] = useState(0)
	const [clickInterval, setClickInterval] = useState(null)
	const [clicking, setClicking] = useState(false)

	useEffect(() => {
		if(!clicking || !(clickProgress < 100)) clearInterval(clickInterval)
	}, [clicking, clickProgress])

	const beginClickCounter = () => {
		const interval = 50
		clearInterval(clickInterval)
		setClickInterval(setInterval(() => {
			setClickProgress((previous)=> {
				if((previous + 100 * ((interval) / timeout)) < 100) {
					return previous + 100 * ((interval) / timeout)
				}
				else {
					clearInterval(clickInterval)
					onTimeoutSuccess()
					return 100
				}
			})
		}, interval))
	}

	const onLongPress = () => {
		beginClickCounter()
		setClicking(true)
	}

	const onLongPressEnd = () => {
		setClicking(false)
		if(clickProgress < 100) onTimeoutFailure()
		setClickProgress(0)

	}

	// filler func for useLongPress
	const onClick = () => {
	}

	// create events for long press
	const longPressEvent = useLongPress(onLongPress, onLongPressEnd, onClick, longPressOptions)

	return (
		<BounceButton
			color={"black"}
			width={"3rem"}
			height={"3rem"}
			onClick={(e) => {
				console.log("hi")
			}}
			containerStyle={{
				position: "relative"
			}}
			onlongPress={longPressEvent}
		>
			{clicking ?
				<ProgressCircle
					progress={clickProgress}
				/>
				:
				<styled.Icon
					className={"fa fa-times"}
				/>
			}
		</BounceButton>
	)
}

TimeoutButton.propTypes = {
	timeout: PropTypes.number,
	onTimeoutSuccess: PropTypes.func,
	onTimeoutFailure: PropTypes.func
}

TimeoutButton.defaultProps = {
	timeout: 2000,
	onTimeoutSuccess: () => {},
	onTimeoutFailure: () => {},
}

export default TimeoutButton
