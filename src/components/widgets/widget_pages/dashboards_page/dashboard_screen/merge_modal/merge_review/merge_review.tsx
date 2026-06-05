import React from 'react';
import PropTypes from 'prop-types';
import LotContainer from "../../../../../../side_bar/content/cards/lot/lot_container";
import {FINISH_BIN_ID} from "../../../../../../../constants/lot_contants";
import Button from "../../../../../../basic/button/button";

import * as styled from './merge_review.style'
import * as sharedStyles from '../merge_modal.style'
const MergeReview = props => {

	const {
		quantityOptions,
		onOptionClick,
		onNext
	} = props

	const renderOptions = () => {
		return quantityOptions.map((option, index) => {

			const {
				lotId,
				quantity
			} = option

			return(
				<LotContainer
					// showCustomFields={false}
					lotId={lotId}
					processName={null}
					quantity={quantity}
					enableFlagSelector={false}
					onClick={() => {
						onOptionClick(index)
					}}
					containerStyle={{
						margin: ".5rem", alignSelf: 'stretch', height: 'auto',
					}}
				/>
			)
		})
	}
	return (
		<>
		<sharedStyles.BodyContainer>
			<sharedStyles.LotListContainer>
				{renderOptions()}
			</sharedStyles.LotListContainer>

		</sharedStyles.BodyContainer>
			<sharedStyles.Footer>
				<Button
					label={'Create New Lot'}
					onClick={onNext}
				/>
			</sharedStyles.Footer>
		</>
	);
};

MergeReview.propTypes = {

};

MergeReview.defaultProps = {
	quantityOptions: [],
	onOptionClick: () => {}
};

export default MergeReview;
