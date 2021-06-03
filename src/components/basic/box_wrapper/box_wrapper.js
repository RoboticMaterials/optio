import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

const BoxWrapper = (props) => {

	const {
		children,
		sizeCb,
		containerStyle
	} = props

	const boxRef = useRef(null)

	const {
		offsetHeight,
		offsetLeft,
		offsetTop,
		offsetWidth
	} = boxRef?.current || {}


	useEffect(() => {
		let x, y, width, height

		if(boxRef?.current) {
			const {x: x2, y:y2, width:width2, height:height2} = boxRef?.current.getBoundingClientRect()

			x=x2
			y=y2
			height=height2
			width=width2
		}
		sizeCb({offsetHeight: height, offsetLeft: x, offsetTop: y, offsetWidth: width})

		return () => {};
	}, [offsetHeight, offsetLeft, offsetTop, offsetWidth]);

	return (
		<div ref={boxRef} style={containerStyle}>
			{children}
		</div>
	);
};

BoxWrapper.propTypes = {
	sizeCb: PropTypes.func
};

BoxWrapper.defaultProps = {
	sizeCb: () => null
};

export default BoxWrapper;
