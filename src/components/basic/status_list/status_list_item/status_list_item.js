import React, {useEffect, useState, useContext } from 'react'

// components external
import MoonLoader from "react-spinners/MoonLoader"
import PulseLoader from "react-spinners/PulseLoader"

// components internal
import Button from "../../button/button"
import ErrorTooltip from "../../form/error_tooltip/error_tooltip"

// constants
import {FORM_STATUS} from "../../../../constants/lot_contants"

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./status_list_item.style"

// utils
import {isEmpty, isObject} from "../../../../methods/utils/object_utils"
import {getMessageFromError} from "../../../../methods/utils/form_utils"
import { ThemeContext } from 'styled-components'

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
		warnings,
		resourceCode,
		resourceMessage,
		validationCode,
		validationMessage,
		onEditClick,
		item,
		index,
		showTopBorder,
		showBottomBorer,
		created,
		onCreateClick,
		onMergeClick,
		mergeDisabled,
		displayNames
	} = props

	const themeContext = useContext(ThemeContext)

	const [mappedErrors, setMappedErrors] = useState({})
	const [hasErrors, setHasErrors] = useState(false)
	const [mappedWarnings, setMappedWarnings] = useState({})
	const [hasWarnings, setHasWarnings] = useState(false)

	useEffect(() => {
		let tempMappedErrors = {}

		Object.keys(errors).forEach((currKey) => {
			let tempCurrKey = currKey
			let currErrCopy = errors[currKey]

			while(isObject(currErrCopy)) {
				tempCurrKey = Object.keys(currErrCopy)[0]
				currErrCopy = currErrCopy[tempCurrKey]
			}

			if(Object.keys(displayNames).includes(tempCurrKey)) {
				tempCurrKey = displayNames[tempCurrKey]
			}

			tempMappedErrors[tempCurrKey] = [getMessageFromError(currErrCopy)]
		})

		setMappedErrors(tempMappedErrors)
		setHasErrors(!isEmpty(tempMappedErrors))

	}, [errors])

	useEffect(() => {
		// setMappedErrors(
		let tempMappedWarnings = {}

		Object.keys(warnings).forEach((currKey) => {
			let tempCurrKey = currKey
			let currErrCopy = warnings[currKey]

			while(isObject(currErrCopy)) {
				tempCurrKey = Object.keys(currErrCopy)[0]
				currErrCopy = currErrCopy[tempCurrKey]
			}

			if(Object.keys(displayNames).includes(tempCurrKey)) {
				tempCurrKey = displayNames[tempCurrKey]
			}

			tempMappedWarnings[tempCurrKey] = [getMessageFromError(currErrCopy)]
		})

		setMappedWarnings(tempMappedWarnings)
		setHasWarnings(!isEmpty(tempMappedWarnings))

	}, [warnings])

	const submitDisabled = (validationCode !== FORM_STATUS.VALIDATION_SUCCESS) || (resourceCode === FORM_STATUS.CREATE_SUCCESS)


	const renderErrorTooltip = (mappedErrors) => {

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
				<styled.Index>{index + 1}.</styled.Index>
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
								color={themeContext.bad}
								// text={validationMessage}
								tooltip={renderErrorTooltip(mappedErrors)}
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

				{hasWarnings &&
				<ErrorTooltip
					visible={true}
					containerStyle={{
						marginLeft: ".5rem"
					}}
					color={"yellow"}
					tooltip={renderErrorTooltip(mappedWarnings)}
					ContainerComponent={styled.TooltipContainer}
				/>
				}
			</styled.StatusContainer>

			<styled.StatusContainer style={{flex: 0.5}}>
				<Button
					type={"button"}
					label={"Create"}
					schema={"ok"}
					disabled={submitDisabled}
					onClick={(e) => {
						onCreateClick(index)
					}}
				/>

				<Button
					type={"button"}
					label={"Merge"}
					schema={"processes"}
					disabled = {mergeDisabled(index)}
					onClick={(e) => {
						onMergeClick(index)
					}}
				/>
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
					color={themeContext.bg.quaternary}
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
	)
}

StatusListItem.propTypes = {
	showTopBorder: PropTypes.bool,
	showBottomBorer: PropTypes.bool,
	title: PropTypes.string,
	errors: PropTypes.object,
	warnings: PropTypes.object,
	resourceCode: PropTypes.number,
	resourceMessage: PropTypes.string,
	validationCode: PropTypes.number,
	validationMessage: PropTypes.string,
	onEditClick: PropTypes.func,
	item: PropTypes.object,
	index: PropTypes.number,
	created: PropTypes.bool,
	onCreateClick: PropTypes.func,
}

StatusListItem.defaultProps = {
	showTopBorder: true,
	showBottomBorer: true,
	title: "",
	errors: {},
	warnings: {},
	resourceCode: 0,
	resourceMessage: "",
	validationCode: 0,
	validationMessage: "",
	onEditClick: () => {},
	item: {},
	index: 0,
	created: false,
	onCreateClick: () => {}
}

export default StatusListItem
