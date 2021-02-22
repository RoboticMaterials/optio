import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_item.style"
import TextField from "../../form/text_field/text_field";
import ErrorTooltip from "../../form/error_tooltip/error_tooltip";
import {isEmpty} from "../../../../methods/utils/object_utils";
import MoonLoader from "react-spinners/MoonLoader";
import PulseLoader from "react-spinners/PulseLoader";
import {CONTENT, FORM_BUTTON_TYPES, FORM_STATUS} from "../../../../constants/lot_contants";
import {yellow} from "@material-ui/core/colors";
import Button from "../../button/button";
import {FORM_MODES} from "../../../../constants/scheduler_constants";
import {isArray} from "../../../../methods/utils/array_utils";
import {themeContext} from "@nivo/core";

const FADE_LOADER_COLORS = {
	red: "#f01000",
	yellow: "#e3cc00",
	green: "#17e300",
	grey: "#363636"

}

const StatusListItem = (props) => {

	const {
		title,
		errors,
		resourceCode,
		resourceMessage,
		validationCode,
		validationMessage,
		onEditClick,
		item,
		index,
		showTopBorder,
		showBottomBorer,
		created
	} = props

	const [mappedErrors, setMappedErrors] = useState({})

	useEffect(() => {
		// setMappedErrors(
		let tempMappedErrors = {}

		Object.entries(errors).forEach((currErr) => {
			const [ currKey, currVal] = currErr
			const split = currKey.split(".")
			console.log("split",split)
			const newKey = split[split.length - 1]

			tempMappedErrors[newKey] = currVal
		})

		setMappedErrors(tempMappedErrors)

	}, [errors])

	console.log("StatusListItem errors", errors)

	const renderErrorTooltip = () => {
		return(
			<styled.InsideTooltipContainer>

				<styled.ErrorHeader>
					<styled.ErrorLabel>Field Name</styled.ErrorLabel>
					<styled.ErrorLabel>Description</styled.ErrorLabel>
				</styled.ErrorHeader>

				<styled.ListContainer>
				{Object.entries(mappedErrors).map((currErr, currErrIndex) => {
					const [ currKey, currVal ] = currErr

					return(
						<styled.ItemContainer key={currErrIndex}>
							<styled.ErrorKey>{currKey}</styled.ErrorKey>
							<styled.ErrorColumn>
							{currVal.map((currItem, currItemIndex) => {
								return(
									<styled.ErrorValue key={currItemIndex}>
										{currItem}
									</styled.ErrorValue>
								)
							})}
							</styled.ErrorColumn>
						</styled.ItemContainer>
					)
				})}
				</styled.ListContainer>
			</styled.InsideTooltipContainer>
		)

	}

	return (
		<styled.Container
			// onClick={() => onEditClick(item)}
			showTopBorder={showTopBorder}
			showBottomBorer={showBottomBorer}
		>
			<styled.NameContainer>
				<styled.Index>{index}.</styled.Index>
				<styled.Name>{title}</styled.Name>
			</styled.NameContainer>

			<styled.StatusContainer>
				<styled.StatusMessage>{validationMessage}</styled.StatusMessage>

				{/* icon switch/case */}
				{
					{
						[FORM_STATUS.VALIDATION_START]:
							<MoonLoader
								loading={true}
								color={FADE_LOADER_COLORS.yellow}
								size={20}
							/>,

						[FORM_STATUS.VALIDATION_SUCCESS]:
							<styled.StatusIcon
								className={"fas fa-check"}
								color={FADE_LOADER_COLORS.green}
							/>,

						[FORM_STATUS.VALIDATION_ERROR]:
							<ErrorTooltip
								visible={true}
								// text={validationMessage}
								tooltip={renderErrorTooltip()}
								ContainerComponent={styled.TooltipContainer}
							/>,
						[FORM_STATUS.WAITING]:
							<PulseLoader
								loading={true}
								color={FADE_LOADER_COLORS.grey}
								size={10}
							/>,
						[FORM_STATUS.CANCELLED]:
							<ErrorTooltip
								visible={true}
								text={validationMessage}
								ContainerComponent={styled.TooltipContainer}
							/>,
					}[validationCode] ||
					<PulseLoader
						loading={true}
						color={FADE_LOADER_COLORS.grey}
						size={10}
					/>
				}
			</styled.StatusContainer>

			<styled.ColumnWrapper>
				<styled.StatusContainer>
					<styled.StatusMessage>{resourceMessage}</styled.StatusMessage>

					{/* icon switch/case */}
					{
						{
							[FORM_STATUS.CREATE_START]:
								<MoonLoader
									loading={true}
									color={FADE_LOADER_COLORS.yellow}
									size={20}
								/>,

							[FORM_STATUS.CREATE_SUCCESS]:
								<styled.StatusIcon
									className={"fas fa-check"}
									color={FADE_LOADER_COLORS.green}
								/>,

							[FORM_STATUS.CREATE_ERROR]:
								<ErrorTooltip
									visible={true}
									text={resourceMessage}
									ContainerComponent={styled.TooltipContainer}
								/>,

							[FORM_STATUS.WAITING]:
								<PulseLoader
									loading={true}
									color={FADE_LOADER_COLORS.grey}
									size={10}
								/>,

							[FORM_STATUS.CANCELLED]:
								null,
						}[resourceCode] ||
						null
					}
				</styled.StatusContainer>

				<styled.EditButton
					color={"white"}
					type={"button"}
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						onEditClick(item)
					}}
					className="fas fa-edit"
				/>
			</styled.ColumnWrapper>

		</styled.Container>
	);
};

StatusListItem.propTypes = {

};

StatusListItem.defaultProps = {
	showTopBorder: true,
	showBottomBorer: true,
};



export default StatusListItem;
