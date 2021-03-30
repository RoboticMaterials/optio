import React, {useEffect, useState} from 'react'

// actions
import {deleteCard, putCard} from "../../../../../../redux/actions/card_actions"

// components external
import MoonLoader from "react-spinners/MoonLoader"

// components internal
import LotContainer from "../../lot/lot_container"
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal"
import FooterContent from "./footer_content/footer_content"
import PreBodyContent from "./pre_body_content/pre_body_content"

// constants
import {BIN_IDS, BIN_THEMES} from "../../../../../../constants/lot_contants"
import {StationTypes} from "../../../../../../constants/station_constants"
import {PositionTypes} from "../../../../../../constants/position_constants"

// functions external
import PropTypes from 'prop-types'
import {useDispatch, useSelector} from "react-redux"

// utils
import {getProcessName, getStationAttributes, getStationIds} from "../../../../../../methods/utils/processes_utils"
import {immutableDelete, isNonEmptyArray} from "../../../../../../methods/utils/array_utils"
import {getLotAfterBinMerge} from "../../../../../../methods/utils/lot_utils"

// styles
import * as sharedStyles from "../modals.style"
import {lotContainerStyle} from "../modals.style"

const MoveMultipleLotsModal = (props) => {

	const {
		selectedCards,
		isOpen,
		handleClose,
		setShowConfirmDeleteModal,
		setSelectedCards
	} = props

	const dispatch = useDispatch()
	const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))

	const cards = useSelector(state => { return state.cardsReducer.cards })

	const [processBins, setProcessBins] = useState([])
	const [processIds, setProcessIds] = useState([])
	const [processIdsIndex, setProcessIdsIndex] = useState(0)
	const [stationsAttributes, setStationsAttributes] = useState([])
	const [selectedStationId, setSelectedStationId] = useState(null)
	const [processName, setProcessName] = useState("")
	const [isMoving, setIsMoving] = useState(false)

	/*
	* this effect is used to separate lots by processId, since difference processes will have different stations available to move to,
	* moving lots from different processes must be handled separately
	* */
	useEffect(() => {
		let tempProcessBins = {}

		selectedCards.forEach((currLot) => {
			const {
				processId = "",
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
			<sharedStyles.ContainerWrapper>
				<sharedStyles.LoaderWrapper>
					<MoonLoader
						loading={isMoving}
						color={"#4ffff0"}
						size={50}
					/>
				</sharedStyles.LoaderWrapper>
			<sharedStyles.Container
				greyed={isMoving}
			>

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
			</sharedStyles.ContainerWrapper>

			)
	}

	const renderChildren = () => {
		return(
			<sharedStyles.Containerrr>
				{renderSelectedLots()}
			</sharedStyles.Containerrr>
		)
	}

	const onMoveClick = async () => {
		setIsMoving(true)
		const currentProcessId = processIds[processIdsIndex]
		const {
			[currentProcessId]: lotsToRender = [],
			...unchangedProcessBins
		} = processBins || {}

		const isLastProcess = processIdsIndex === (processIds.length - 1)

		// *** first, handle moving the lots ***
		if(isNonEmptyArray(lotsToRender)) {
			let index = 0
			for(const currItem of lotsToRender) {
				const {
					cardId = "",
					binId = ""
				} = currItem || {}

				const currLot = cards[cardId] || {}
				const lotWithUpdatedBins = getLotAfterBinMerge(currLot, binId, selectedStationId)

				await dispatchPutCard(lotWithUpdatedBins, cardId)
				setProcessBins((previous) => {
					return {
						...previous,
						[currentProcessId]: immutableDelete(lotsToRender, index)
					}
				})
			}

			index = index + 1
		}

		// *** now, handle toggling to next process or closing modal ***
		setProcessBins(unchangedProcessBins)

		// if last process was just handled, close it
		if(isLastProcess) {
			setSelectedCards([])
			handleClose()
		}

		// otherwise, go to next process, and clear selectedStationId
		else {
			setProcessIdsIndex(processIdsIndex + 1)
			setSelectedStationId(null)
		}

		setIsMoving(false)
	}

	return (

		<SimpleModal
			isOpen={isOpen}
			close={handleClose}
			title={"Move Lots"}
			button_2_text={"Move"}
			button_2_disabled={isMoving || selectedStationId === null}
			button_1_text={"Cancel"}
			onCloseButtonClick={handleClose}
			onRequestClose={handleClose}
			handleOnClick2={onMoveClick}
			handleOnClick1={() => {
				setShowConfirmDeleteModal(false)
			}}
			PreBodyContent={
				<PreBodyContent
					processName={processName}
				/>
			}
			FooterContent={
				<FooterContent
					stationsAttributes={stationsAttributes}
					selectedStationId={selectedStationId}
					setSelectedStationId={setSelectedStationId}
				/>
			}
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
