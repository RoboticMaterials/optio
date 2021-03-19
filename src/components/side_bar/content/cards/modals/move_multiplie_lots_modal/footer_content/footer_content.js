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
							_id
						} = currStation

						const isSelected = selectedStationId === _id
						const greyed = selectedStationId !== null && !isSelected

						if(_id !== BIN_IDS.FINISH && _id !== BIN_IDS.QUEUE) {
							const locationTypes = {
								...StationTypes,
								...PositionTypes
							}

							let color = StationTypes[currStation.type].color


							return(
								<styled.StationContainer
									isSelected={isSelected}
									key={_id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(_id)
									}}
								>
									<styled.StationName>{name}</styled.StationName>
									<styled.StationSvgContainer
										isSelected={isSelected}
										greyed={greyed}

									>
										<svg
											width={"100%"}
											height={"100%"}
											style={{ fill: color, stroke:color }}
											viewBox={"50 50 300 300"}
										>
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
									key={_id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(_id)
									}}
								>
									<styled.StationName>{name}</styled.StationName>
									<styled.StationSvgContainer
										isSelected={isSelected}
										greyed={greyed}

									>
										<styled.StationButton
											isSelected={isSelected}
											className={_id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.ICON : BIN_THEMES.FINISH.ICON}
											color={_id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.COLOR : BIN_THEMES.FINISH.COLOR}

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
