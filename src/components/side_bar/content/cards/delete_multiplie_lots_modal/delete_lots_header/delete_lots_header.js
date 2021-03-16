import React from 'react'

// functions external
import PropTypes from 'prop-types'

import * as styled from "./delete_lots_header.style"

const DeleteLotsHeader = (props) => {

	return (
		<styled.Container>
			<styled.Item>Name</styled.Item>
			<styled.Item>Lot Number</styled.Item>
			<styled.Item>Station</styled.Item>
			<styled.Item>Process</styled.Item>
		</styled.Container>
	)
}

DeleteLotsHeader.propTypes = {

}

export default DeleteLotsHeader
