import React from 'react'

// functions external
import PropTypes from 'prop-types'

// constants
import {BIN_IDS, BIN_THEMES} from "../../../../../../../constants/lot_contants"
import {StationTypes} from "../../../../../../../constants/station_constants"
import {PositionTypes} from "../../../../../../../constants/position_constants"

// styles
import * as styled from "./footer_content.style"

const FooterContent = (props) => {

	const {
		stationsAttributes,
		selectedStationId,
		setSelectedStationId
	} = props

	return (
		<styled.StationSelectorContainerWrapper>
		
		</styled.StationSelectorContainerWrapper>
	)
}

FooterContent.propTypes = {
	selectedStationId: PropTypes.string,
	stationsAttributes: PropTypes.array,
	setSelectedStationId: PropTypes.func
}

FooterContent.defaultProps = {
	selectedStationId: null,
	stationsAttributes: [],
	setSelectedStationId: () => {}
}

export default FooterContent
