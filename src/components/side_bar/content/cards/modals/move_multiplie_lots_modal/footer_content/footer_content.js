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
		<styled.StationSelectorContainer>
			<styled.SubTitle>Select Destination</styled.SubTitle>

			<styled.StationsScrollWrapper>
				<styled.StationsContainer>
					{stationsAttributes.map((currStation, currIndex) => {
						const {
							name,
							id
						} = currStation

						const isSelected = selectedStationId === id
						const greyed = selectedStationId !== null && !isSelected

						if(id !== BIN_IDS.FINISH && id !== BIN_IDS.QUEUE) {
							const locationTypes = {
								...StationTypes,
								...PositionTypes
							}

							let color = StationTypes[currStation.type].color


							return(
								<styled.StationContainer
									isSelected={isSelected}
									key={id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(id)
									}}
								>
									<styled.StationName>{name}</styled.StationName>
									<styled.StationSvgContainer
										isSelected={isSelected}
										greyed={greyed}

									>
										<svg height="100%" width="100%" viewBox="0 0 400 400" style={{ fill: color, stroke:color }}>
											{locationTypes[currStation.type].svgPath}
										</svg>
									</styled.StationSvgContainer>
								</styled.StationContainer>
							)
						}
						else {
							return(
								<styled.StationContainer
									isSelected={isSelected}
									key={id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(id)
									}}
								>
									<styled.StationName>{name}</styled.StationName>
									<styled.StationSvgContainer
										isSelected={isSelected}
										greyed={greyed}

									>
										<styled.StationButton
											isSelected={isSelected}
											className={id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.ICON : BIN_THEMES.FINISH.ICON}
											color={id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.COLOR : BIN_THEMES.FINISH.COLOR}

										/>
									</styled.StationSvgContainer>
								</styled.StationContainer>
							)
						}
					})

					}
				</styled.StationsContainer>
			</styled.StationsScrollWrapper>
		</styled.StationSelectorContainer>
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
