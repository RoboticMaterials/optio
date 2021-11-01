import React, {useEffect, useState} from "react";

import * as styled from "./lot_form_creator.style"
import {immutableDelete, immutableInsert, immutableReplace, isArray} from "../../../../../../methods/utils/array_utils";
import {arraysEqual, uuidv4} from "../../../../../../methods/utils/utils";
//import DropContainer from "../drop_container/drop_container";
import Textbox from "../../../../../basic/textbox/textbox";
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import CalendarPlaceholder from '../../../../../basic/calendar_placeholder/calendar_placeholder'
import {FIELD_COMPONENT_NAMES, LOT_EDITOR_SIDEBAR_OPTIONS} from "../lot_template_editor_sidebar/lot_template_editor_sidebar";
import TextField from "../../../../../basic/form/text_field/text_field";
import {useSelector} from "react-redux";
import NumberInput from '../../../../../basic/number_input/number_input'
const LotFormCreator = (props) => {

	const {
		preview,
		formMode,
		errors,
		values,
		touched,
		isSubmitting,
		submitCount,
		setFieldValue,
		submitForm,
		loaded,
		fieldName,
		fieldParent,
	} = props

	const draggingFieldId = useSelector(state=> {return state.cardPageReducer.isFieldDragging})
	const [draggingRow, setDraggingRow] = useState(null)
	const [hoveringRow, setHoveringRow] = useState(null)
	const [selectedEditingField, setSelectedEditingField] = useState(null)
	const {
		fields: items = []
	} = values || {}


	const findArrLocation = (id, arr, prev) => {
		let indices = [...prev]
		let found = false

		arr.forEach((currItem, currIndex) => {

			if (isArray(currItem)) {
				let [newIndices, newFound] = findArrLocation(id, currItem, [currIndex])
				if(newFound) {
					found = true
					if(newIndices.length > 0) indices = [...indices, ...newIndices]
				}



			} else {
				if(currItem._id === id) {
					found = true
					indices = [...indices, currIndex]
				}
			}
		})

		return [indices, found]
	}

	const handleVerticalDrop = (dropResult, currRowIndex) => {
		const {
			removedIndex,
			addedIndex,
			payload
		} = dropResult

		const {
			key,
			component,
			_id: payloadId
		} = payload
		if(addedIndex !== null) {
			const [oldSelected, oldIndexPattern, oldFinalIndex, ] = getSelected(payloadId)

			let updatedData
			let removedImmutable
			let removedLastItemInRow
			if(isArray(oldIndexPattern) && oldIndexPattern.length > 0) {
				removedImmutable = immutableDelete(oldSelected, oldFinalIndex)
				if(removedImmutable.length === 0) {
					removedLastItemInRow = true
					updatedData = immutableDelete(items, oldIndexPattern[0])
				}
				else {
					updatedData = getUpdate(items, oldIndexPattern, removedImmutable)
				}
			}

			const movingDown = (currRowIndex > oldIndexPattern[0]) && removedLastItemInRow
			if(!(removedLastItemInRow && (currRowIndex === (oldIndexPattern[0] + 1)))) {
				const newItem = {
					...payload
				}

				const withInsert = immutableInsert(updatedData ? updatedData : items, [newItem], movingDown ? currRowIndex - 1 : currRowIndex)
				setFieldValue("fields", withInsert)
			}
		}

	}

	const handleSideDrop = (id, dropResult, isRight) => {
		const {
			addedIndex,
			payload
		} = dropResult

		const {
			_id: payloadId
		} = payload

		if(addedIndex !== null) {

			const [oldSelected, oldIndexPattern, oldFinalIndex, ] = getSelected(payloadId)
			const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

			const patternsAreEqual = arraysEqual(oldIndexPattern, indexPattern)

			const noMoveRight = (oldFinalIndex === (finalIndex + 1)) && isRight
			const noMoveLeft = (oldFinalIndex === (finalIndex - 1)) && !isRight

			if(patternsAreEqual && (noMoveRight || noMoveLeft)) {

			}
			else {
				let updatedData
				let removedImmutable
				let removedLastItemInRow
				if(isArray(oldIndexPattern) && oldIndexPattern.length > 0) {
					removedImmutable = immutableDelete(oldSelected, oldFinalIndex)

					if(removedImmutable.length === 0) {
						updatedData = immutableDelete(items, oldIndexPattern[0])
						removedLastItemInRow = true
					}
					else {
						updatedData = getUpdate(items, oldIndexPattern, removedImmutable)
					}
				}

				const newItem = {
					...payload
				}

				const didThing = removedLastItemInRow && indexPattern[0] > oldIndexPattern[0]
				const selected_IMMUTABLE = immutableInsert(patternsAreEqual ? removedImmutable : selected, newItem,(isRight && !patternsAreEqual) ? finalIndex + 1 : finalIndex)
				updatedData = getUpdate(updatedData ? updatedData : items, didThing ? [indexPattern[0] - 1] : indexPattern, selected_IMMUTABLE)
				setFieldValue("fields", updatedData, true)
			}
		}
	}

	const getSelected = (id) => {

		let [indexPattern, found] = findArrLocation(id, items, [])
		const finalIndex = indexPattern.pop()

		let selected = [...items]
		let isRow = (indexPattern.length % 2 === 0)

		if (isArray(indexPattern)) {


			indexPattern.forEach((currIndex) => {

				selected = selected[currIndex]
			})
		}

		return [selected, indexPattern, finalIndex, isRow]
	}

	const getUpdate = (arr, indexPattern, element) => {

		let trimmedIndexPattern = [...indexPattern]
		// trimmedIndexPattern.pop()

		let listRef = element
		let currItem = element
		if(trimmedIndexPattern.length > 0) {
			let removedIndex = trimmedIndexPattern[0]// = trimmedIndexPattern.pop()
			while (trimmedIndexPattern.length > 1) {
				removedIndex = trimmedIndexPattern.pop()
				listRef = immutableReplace(getNested(arr, trimmedIndexPattern), currItem, removedIndex)
				currItem = listRef
			}
			if(trimmedIndexPattern.length === 1) removedIndex = trimmedIndexPattern.pop()
			listRef = immutableReplace(arr, listRef, removedIndex)
		}
		else {
			return element
		}

		return listRef
	}

	const getNested = (arr, indices) => {
		let item = arr
		indices.forEach((curr) => {
			item = item[curr]
		})
		return item

	}

	const handleCenterDrop = (id, dropResult) => {}

	const handleDeleteClick = (id) => {
		const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

		const selected_IMMUTABLE = immutableDelete(selected, finalIndex)

		let updatedData
		if(selected_IMMUTABLE.length > 0) {
			updatedData = getUpdate(items, indexPattern, selected_IMMUTABLE)
		}
		else {
			updatedData = immutableDelete(items, indexPattern.pop())
		}

		setFieldValue("fields", updatedData, true)
	}

	const handleRenderComponentType = (component) => {
		switch(component) {
			case 'TEXT_BOX':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '20rem', height: '2rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
					<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6', marginTop: '0.4rem'}}>single-line input...</styled.FieldName>
					</styled.RowContainer>
				)
			case 'TEXT_BOX_BIG':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '20rem', height: '4rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
					<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6',}}>multi-line input...</styled.FieldName>
					</styled.RowContainer>
				)

			case 'INPUT_BOX':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '20rem', height: '3rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
					<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6'}}>add dashboard text...</styled.FieldName>
					</styled.RowContainer>
				)

			case 'NUMBER_INPUT':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '8rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
						<i class="fas fa-plus" style = {{color: '#7e7e7e', fontSize: '2rem'}}></i>
						<i class="fas fa-minus" style = {{color: '#7e7e7e', fontSize: '2rem', marginLeft: '2.5rem'}}></i>
					</styled.RowContainer>
				)

			case 'CALENDAR_SINGLE':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '4.4rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
						<i class="far fa-calendar" style = {{color: '#7e7e7e', fontSize: '2rem', marginRight: '.75rem', marginLeft: '0.75rem'}}></i>
					</styled.RowContainer>
				)

			case 'CALENDAR_START_END':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '8rem',
					 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					 	border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem'
					}}
					>
						<i class="far fa-calendar" style = {{color: '#7e7e7e', fontSize: '2rem', marginRight: '.75rem'}}></i>
						<i class="fas fa-long-arrow-alt-right" style = {{color: '#7e7e7e', fontSize: '2rem'}}></i>
						<i class="far fa-calendar" style = {{color: '#7e7e7e', fontSize: '2rem', marginLeft: '.75rem'}}></i>
					</styled.RowContainer>
				)
			}
		}

	const mapContainers = (items, mode, prevItems, indexPattern, thisIndex) => {

		return (
			<styled.ColumnContainer>
				<div>
				{items.map((currRow, currRowIndex) => {

					const isLastRow = currRowIndex === items.length - 1
					return <div
						style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
						key={currRowIndex}
					>

					<styled.ColumnContainer>

						{currRow.map((currItem, currItemIndex) => {
							const {
								_id: dropContainerId,
								component,
								fieldName
							} = currItem || {}
							const isLastItem = currItemIndex === currRow.length - 1
							const indexPattern = [currRowIndex, currItemIndex]
							const isOnlyItem = currRow.length === 1

							return (
								<>
								{currItem?._id !== selectedEditingField ?
									<styled.ColumnFieldContainer
									 style = {{margin: '1rem'}}
									 onClick = {()=>{
										setSelectedEditingField(currItem._id)
									}}>
										<styled.FieldName>{fieldName}</styled.FieldName>
										{handleRenderComponentType(component)}
									</styled.ColumnFieldContainer>
									:
									<styled.ColumnFieldContainer
									 style = {{margin: '1rem'}}
									 onClick = {()=>{
										setSelectedEditingField(currItem._id)
									}}>
										<styled.FieldName>{fieldName}</styled.FieldName>
										{handleRenderComponentType(component)}
									</styled.ColumnFieldContainer>								}
								</>
							)
						})}
					</styled.ColumnContainer>
					</div>
				})}
				</div>
				<styled.ColumnFieldContainer style = {{margin: '1rem', paddingTop: '1.2rem', paddingLeft: '1.2rem', flexDirection: 'row', maxHeight: '4rem'}}>
					<i className = 'fas fa-plus' style = {{fontSize: '1.2rem', paddingRight: '.5rem'}}/>
					<styled.FieldName>Add New Field</styled.FieldName>
				</styled.ColumnFieldContainer>
			</styled.ColumnContainer>
		)
	}

	return (
		<>
			{mapContainers(items, true, items)}
		</>
	)

}

export default LotFormCreator
