import React from 'react';

import PropTypes from 'prop-types';

import * as sharedStyles from "../../modals.style";

import {BIN_IDS, BIN_THEMES} from "../../../../../../../constants/lot_contants";
import {StationTypes} from "../../../../../../../constants/station_constants";
import {PositionTypes} from "../../../../../../../constants/position_constants";

const Footer_content = (props) => {

	const {
		stationsAttributes,
		selectedStationId,
		setSelectedStationId
	} = props

	return (
		<sharedStyles.StationSelectorContainerWrapper>
		<sharedStyles.StationSelectorContainer>
			<sharedStyles.SubTitle>Select Destination</sharedStyles.SubTitle>

			<sharedStyles.StationsScrollWrapper>
				<sharedStyles.StationsContainer>
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
								<sharedStyles.StationContainer
									isSelected={isSelected}
									key={_id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(_id)
									}}
								>
									<sharedStyles.StationName>{name}</sharedStyles.StationName>
									<sharedStyles.StationSvgContainer
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
									</sharedStyles.StationSvgContainer>
								</sharedStyles.StationContainer>
							)
						}
						else {
							return(
								<sharedStyles.StationContainer
									isSelected={isSelected}
									key={_id}
									style={{

									}}
									onClick={() => {
										setSelectedStationId(_id)
									}}
								>
									<sharedStyles.StationName>{name}</sharedStyles.StationName>
									<sharedStyles.StationSvgContainer
										isSelected={isSelected}
										greyed={greyed}

									>
										<sharedStyles.StationButton
											isSelected={isSelected}
											className={_id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.ICON : BIN_THEMES.FINISH.ICON}
											color={_id === BIN_IDS.QUEUE ? BIN_THEMES.QUEUE.COLOR : BIN_THEMES.FINISH.COLOR}

										/>
									</sharedStyles.StationSvgContainer>
								</sharedStyles.StationContainer>
							)
						}
					})

					}
				</sharedStyles.StationsContainer>
			</sharedStyles.StationsScrollWrapper>
		</sharedStyles.StationSelectorContainer>
		</sharedStyles.StationSelectorContainerWrapper>
	);
};

Footer_content.propTypes = {

};

export default Footer_content;
