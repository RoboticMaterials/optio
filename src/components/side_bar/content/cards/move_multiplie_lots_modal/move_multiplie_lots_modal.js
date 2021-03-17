import React from 'react'

// actions
import {deleteCard, putCard} from "../../../../../redux/actions/card_actions"

// components internal
import ConfirmDeleteModal from "../../../../basic/modals/confirm_delete_modal/confirm_delete_modal"
import DeleteLotItem from "./delete_lot_item/delete_lot_item"
import DeleteLotsHeader from "./delete_lots_header/delete_lots_header"

// functions external
import PropTypes from 'prop-types'
import {useDispatch, useSelector} from "react-redux"

// utils
import {isEmpty} from "../../../../../methods/utils/object_utils"
import {
	getBinName,
	getBinQuantity,
	getLotTemplateData,
	getLotTotalQuantity
} from "../../../../../methods/utils/lot_utils"
import {getProcessName} from "../../../../../methods/utils/processes_utils"
import Lot from "../lot/lot";

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

	const cards = useSelector(state => { return state.cardsReducer.cards })

	const renderSelectedLots = () => {
		return (
			<>
				<DeleteLotsHeader/>
				{selectedCards.map((currItem) => {
					const {
						cardId = "",
						processId = "",
						binId = ""
					} = currItem || {}

					const currLot = cards[cardId] || {}
					const {
						name = "",
						lotNumber=0
					} = currLot

					const binName = getBinName(binId)
					const processName = getProcessName(processId)

					const totalQuantity = getLotTotalQuantity({ bins }) || 0
					const count = getBinQuantity({bins}, binId)
					const templateValues = getLotTemplateData(lotTemplateId, card)


					return(
						<Lot
							templateValues={templateValues}
							totalQuantity={totalQuantity}
							lotNumber={lotNumber}
							processName={processName}
							flags={flags || []}
							enableFlagSelector={false}
							name={name}
							start_date={start_date}
							end_date={end_date}
							objectName={objectName}
							count={count}
							id={cardId}
							isSelected={false}
							selectable={false}
							onClick={() => {

							}}
							containerStyle={{ marginBottom: "0.5rem" }}
						/>
					)
				})}
			</>
			)
	}

	const onDeleteLots = async () => {
		for (const currItem of selectedCards) {
			const {
				cardId = "",
				processId = "",
				binId = ""
			} = currItem || {}

			const currLot = cards[cardId] || {}
			const {
				bins
			} = currLot

			const {
				[binId]: binToRemove,
				...remainingBins
			} = bins || {}

			// if there are no remaining bins, delete the card
			if(isEmpty(remainingBins)) {
				await dispatchDeleteCard(cardId, processId)
			}

			// otherwise update the card to contain only the remaining bins
			else {
				const submitItem = {
					...currLot,
					bins: {...remainingBins},
				}
				const result = await dispatchPutCard(submitItem, cardId)

				let requestSuccessStatus = false
				// check if request was successful
				if(!(result instanceof Error)) {
					requestSuccessStatus = true
				}
			}
		}

		setSelectedCards([])
	}

	return (
		<ConfirmDeleteModal
			isOpen={isOpen}
			close={handleClose}
			title={"Move Lots"}
			button_1_text={"Move"}
			button_2_text={"Cancel"}
			handleClose={handleClose}
			handleOnClick1={() => {
				onDeleteLots()
				setShowConfirmDeleteModal(false)
			}}
			handleOnClick2={() => {
				setShowConfirmDeleteModal(false)
			}}
			children={renderSelectedLots()}
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
