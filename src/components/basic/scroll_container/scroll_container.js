import React, {useEffect, useRef, useState} from 'react'

// functions extenral
import PropTypes from 'prop-types'

// hooks
import useScrollInfo from "../../../hooks/useScrollInfo"

// styles
import * as styled from "./scroll_container.style"


const ScrollContainer = (props) => {

	const {
		children,
		axis,
		setScrolling,
		containerStyle,
		threshold,
		dividerTransition
	} = props

	const [scrollInfo, setRef] = useScrollInfo()

	const [showDivider, setShowDivider] = useState(false)

	useEffect(() => {
		setShowDivider(axis === 'y' ? scrollInfo?.y?.value > threshold : scrollInfo?.x?.value > threshold)
		setScrolling(axis === 'y' ? scrollInfo?.y?.value > threshold : scrollInfo?.x?.value > threshold)

		return () => {

		}
	}, [scrollInfo])

	return (
		<styled.Container
			style={containerStyle}
		>
			<styled.Divider axis={axis} visible={showDivider} transition={dividerTransition}/>

			<styled.ScrollContainer
				ref={setRef}
			>
				<styled.ContentContainer>
					{children}
				</styled.ContentContainer>
			</styled.ScrollContainer>
		</styled.Container>
	)
}

ScrollContainer.propTypes = {
	children: PropTypes.any,
	threshold: PropTypes.number,
	dividerTransition: PropTypes.string,
}

ScrollContainer.defaultProps = {
	axis: 'y',
	setScrolling: () => null,
	threshold: 1,
	dividerTransition: '0s'
}

export default ScrollContainer
