import React from 'react'

// functions external
import PropTypes from 'prop-types'

// style
import * as styled from './flexible_container.style'

const FlexibleContainer = props => {

	const {
		children
	} = props

	return (
		<styled.Container>
			{children}
		</styled.Container>
	)
}

FlexibleContainer.propTypes = {
	children: PropTypes.any
}

export default FlexibleContainer
