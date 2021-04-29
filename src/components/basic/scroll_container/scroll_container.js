import React, {useEffect, useRef, useState} from 'react'

// functions extenral
import PropTypes from 'prop-types'

// hooks
import useScrollInfo from "../../../hooks/useScrollInfo"

// styles
import * as styled from "./scroll_container.style"


const ScrollContainer = (props) => {

	const {
		children
	} = props

	const [scrollInfo, setRef] = useScrollInfo()

	const [showDivider, setShowDivider] = useState(false)

	useEffect(() => {
		setShowDivider(scrollInfo?.y?.value > 1)


		return () => {

		}
	}, [scrollInfo])

	return (
		<styled.Container>
			<styled.Divider visible={showDivider}/>

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
	children: PropTypes.any
}

ScrollContainer.defaultProps = {

}

export default ScrollContainer
