import React from 'react'

// functions external
import PropTypes from 'prop-types'
import {useHistory} from "react-router-dom"

// styles
import * as styled from "./summary_header.style"

const SummaryHeader = (props) => {
	const {
		showBackButton,
		title
	} = props

	const history = useHistory()

	return (
		<styled.Header>
			{showBackButton ?
				<styled.MenuButton
					style={{ marginRight: "auto" }}
					className="fas fa-chevron-left"
					aria-hidden="true"
					onClick={() => {
						history.replace('/processes')
					}
					}
				/>
				:
				<styled.InvisibleItem style={{ marginRight: "auto" }} /> // used for spacing
			}
			<styled.TitleContainer style={{  }}>
				<styled.Title>{title ? title : "untitled"}</styled.Title>
			</styled.TitleContainer>
			<styled.InvisibleItem
				style={{ marginLeft: "auto" }}
			/>
		</styled.Header>
	)
}

SummaryHeader.propTypes = {
	showBackButton: PropTypes.bool,
	title: PropTypes.string
}

SummaryHeader.defaultProps = {
	showBackButton: false,
	title: ""
}

export default SummaryHeader
