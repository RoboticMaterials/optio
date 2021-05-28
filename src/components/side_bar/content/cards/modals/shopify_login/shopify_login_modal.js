import React from 'react'

import PropTypes from "prop-types"

// components internal
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal"
import PreBodyContent from "./pre_body_content/pre_body_content"

const ShopifyLoginModal = (props) => {

	const {
		isOpen,
		handleClose,
		setShowConfirmDeleteModal,
		setShopifyColumn
	} = props

	console.log(props);

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
				setShopifyColumn(true)
				setShowConfirmDeleteModal(false)
			}}
			handleOnClick2={() => {
				setShopifyColumn(true)
				setShowConfirmDeleteModal(false)
			}}
			PreBodyContent={
				<PreBodyContent
				/>
			}
		/>
	)
}

// Specifies propTypes
ShopifyLoginModal.propTypes = {
	isOpen: PropTypes.bool,
	handleClose: PropTypes.func,
	setShowConfirmDeleteModal: PropTypes.func,
	setShopifyColumn: PropTypes.func
}

// Specifies the default values for props:
ShopifyLoginModal.defaultProps = {
	isOpen: false,
	handleClose: () => {},
	setShowConfirmDeleteModal: () => {},
	setShopifyColumn: () => {}
}

export default ShopifyLoginModal
