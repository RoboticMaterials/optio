import React from 'react'

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
			<sharedStyles.Container>
				{selectedCards.map((currItem) => {
					const {
						cardId = "",
						processId = "",
						binId = ""
					} = currItem || {}

					return(
						<LotContainer
							lotId={cardId}
							binId={binId}
							processId={processId}
							enableFlagSelector={false}
						/>
					)
				})}
			</sharedStyles.Container>
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
				// onDeleteLots()
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
