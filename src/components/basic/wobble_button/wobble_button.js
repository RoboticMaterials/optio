import React, { useState, useEffect, } from 'react';
import PropTypes from 'prop-types';

import * as styled from './wobble_button.style'

/*
* A button that wobbles
* */
const WobbleButton = (props) => {

	const {
		containerStyle,
		onDuration,		// how long should it wobble
		offDuration,	// how long should it pause between wobbles
		children,		// children to render
		repeat,
	} = props

	const [wobble, setWobble] = useState(true)

	useEffect(() => {
		let timeout = setTimeout(() => {
			if((repeat && !wobble) || wobble) setWobble(!wobble)
		}, wobble ? onDuration : offDuration)

		return () => {
			clearTimeout(timeout)
		}

	}, [wobble])

	return (
		<styled.Container
			wobble={wobble}
			style={containerStyle}
		>
			{children}
		</styled.Container>
	);
};

WobbleButton.propTypes = {
	onDuration: PropTypes.number,
	offDuration: PropTypes.number,
	repeat: PropTypes.bool
};

WobbleButton.defaultProps = {
	onDuration: 1000,
	offDuration: 5000,
	repeat: true,
};
export default WobbleButton;
