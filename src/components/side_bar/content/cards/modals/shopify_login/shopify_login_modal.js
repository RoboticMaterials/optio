import React from 'react'

// components internal
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal"
import PreBodyContent from "./pre_body_content/pre_body_content"

const ShopifyLoginModal = (props) => {

	const {
		isOpen,
		handleClose,
		setShowConfirmDeleteModal
	} = props


	return (
		<SimpleModal
			isOpen={isOpen}
			close={handleClose}
			title={"Connect Shopify To RM Studio"}
			button_2_text={"Sign In"}
			button_1_text={"Cancel"}
			onCloseButtonClick={handleClose}
			onRequestClose={handleClose}
			handleOnClick1={() => {
				setShowConfirmDeleteModal(false)
			}}
			handleOnClick2={() => setShowConfirmDeleteModal(false)}
			PreBodyContent={
				<PreBodyContent
				/>
			}
		/>
	)
}

export default ShopifyLoginModal
