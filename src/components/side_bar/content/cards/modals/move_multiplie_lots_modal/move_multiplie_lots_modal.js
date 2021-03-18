import React, {useEffect, useState} from 'react'

// actions
import {deleteCard, putCard} from "../../../../../../redux/actions/card_actions"

// components internal
import ConfirmDeleteModal from "../../../../../basic/modals/confirm_delete_modal/confirm_delete_modal"

// functions external
import PropTypes from 'prop-types'
import {useDispatch, useSelector} from "react-redux"

// utils
import {isEmpty} from "../../../../../../methods/utils/object_utils"

import LotContainer from "../../lot/lot_container";

import * as sharedStyles from "../modals.style"
import * as styled from "./move_multiplie_lots_modal.style"
import {lotContainerStyle} from "../modals.style";
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal";
import {getProcessName, getStationAttributes, getStationIds} from "../../../../../../methods/utils/processes_utils";
import CardZone from "../../card_zone/card_zone";
import {BIN_IDS, BIN_THEMES} from "../../../../../../constants/lot_contants";
import LocationSvg from "../../../../../map/locations/location_svg/location_svg";
import {StationTypes} from "../../../../../../constants/station_constants";
import {PositionTypes} from "../../../../../../constants/position_constants";
import {isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
const MoveMultipleLotsModal = (props) => {

	const {
		selectedCards,
		isOpen,
		handleClose,
		setShowConfirmDeleteModal,
		setSelectedCards
	} = props

	const dispatch = useDispatch()
	const dispatchDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
	const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))

	const [processBins, setProcessBins] = useState([])
	const [processIds, setProcessIds] = useState([])
	const [processIdsIndex, setProcessIdsIndex] = useState(0)
	const [stationsAttributes, setStationsAttributes] = useState([])
	const [selectedStationId, setSelectedStationId] = useState(null)
	const [processName, setProcessName] = useState("")

	/*
	* this effect is used to separate lots by processId, since difference processes will have different stations available to move to,
	* moving lots from different processes must be handled separately
	* */
	useEffect(() => {
		let tempProcessBins = {}

		selectedCards.forEach((currLot) => {
			const {
				cardId = "",
				processId = "",
				binId = ""
			} = currLot

			// if tempProcessBins already contains key for current lots processId, add to it
			if(tempProcessBins[processId]) {
				tempProcessBins[processId].push(currLot)
			}

			// otherwise, create the key, initialize as array with first value as currLot
			else {
				tempProcessBins[processId] = [currLot]
			}
		})

		// update state
		setProcessBins(tempProcessBins)
		setProcessIds(Object.keys(tempProcessBins))

	}, [selectedCards])

	useEffect(() => {
		const tempStationAttributes = getStationAttributes(processIds[processIdsIndex], [])

		setStationsAttributes([
			{
				name: BIN_THEMES.QUEUE.DISPLAY_NAME,
				_id: BIN_IDS.QUEUE
			},
			...tempStationAttributes,
			{
				name: BIN_THEMES.FINISH.DISPLAY_NAME,
				_id: BIN_IDS.FINISH
			}
		])

		setProcessName(getProcessName(processIds[processIdsIndex]))
	}, [processIds, processIdsIndex])

	const renderSelectedLots = () => {
		const lotsToRender = processBins[processIds[processIdsIndex]] || []

		return (
			<sharedStyles.Container>
				{lotsToRender.map((currItem) => {
					const {
						cardId = "",
						processId = "",
						binId = ""
					} = currItem || {}

					return(
						<sharedStyles.LotWrapper key={cardId}>
						<LotContainer
							lotId={cardId}
							binId={binId}
							processId={processId}
							enableFlagSelector={false}
							containerStyle={lotContainerStyle}
						/>
						</sharedStyles.LotWrapper>
					)
				})}
			</sharedStyles.Container>
			)
	}

	const renderAvailableBins = () => {
		return(
			<sharedStyles.StationSelectorContainer>
				<sharedStyles.SubTitle>Select Destination</sharedStyles.SubTitle>
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
			</sharedStyles.StationSelectorContainer>
		)
	}

	const renderChildren = () => {
		return(
			<sharedStyles.Containerrr>
				<sharedStyles.ProcessHeader>
					<sharedStyles.SubTitle>Process: {processName}</sharedStyles.SubTitle>
				</sharedStyles.ProcessHeader>
				{renderSelectedLots()}
				{renderAvailableBins()}
			</sharedStyles.Containerrr>
		)
	}

	const onMoveClick = () => {
		const lotsToRender = processBins[processIds[processIdsIndex]] || []
		const isLastProcess = processIdsIndex === (processIds.length - 1)

		// *** first, handle moving the lots ***
		if(isNonEmptyArray(lotsToRender)) {

		}


		// *** now, handle toggling to next process or closing modal ***

		// if last process was just handled, close it
		if(isLastProcess) {
			handleClose()
		}

		// otherwise, go to next process, and clear selectedStationId
		else {
			setProcessIdsIndex(processIdsIndex + 1)
			setSelectedStationId(null)
		}
	}

	return (

		<SimpleModal
			isOpen={isOpen}
			close={handleClose}
			title={"Move Lots"}
			button_1_text={"Move"}
			button_2_text={"Cancel"}
			onCloseButtonClick={handleClose}
			onRequestClose={handleClose}
			handleOnClick1={onMoveClick}
			handleOnClick2={() => {
				setShowConfirmDeleteModal(false)
			}}
			children={renderChildren()}
		/>
	)
}

MoveMultipleLotsModal.propTypes = {
	selectedCards: PropTypes.array
}

MoveMultipleLotsModal.defaultProps = {
	selectedCards: []
}

export default MoveMultipleLotsModal
