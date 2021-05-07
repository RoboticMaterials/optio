import React, {useEffect, useState} from "react";

import * as styled from "./lot_form_creator.style"
import {immutableDelete, immutableInsert, immutableReplace, isArray} from "../../../../../../methods/utils/array_utils";
import {arraysEqual, uuidv4} from "../../../../../../methods/utils/utils";
import DropContainer from "../drop_container/drop_container";
import Textbox from "../../../../../basic/textbox/textbox";
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import {FIELD_COMPONENT_NAMES, LOT_EDITOR_SIDEBAR_OPTIONS} from "../lot_template_editor_sidebar/lot_template_editor_sidebar";
import TextField from "../../../../../basic/form/text_field/text_field";
import {useSelector} from "react-redux";

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
				if(currItem.id === id) {
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
			id: payloadId
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
			id: payloadId
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

	const mapContainers = (items, mode, prevItems, indexPattern, thisIndex) => {

		return (
			<styled.ColumnContainer>
				<ContainerWrapper
					onDrop={(dropResult)=>{
						handleVerticalDrop(dropResult, 0)
					}}
					shouldAcceptDrop={()=>{return true}}
					// getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					hovering={hoveringRow === -1}
					showHighlight={false}
					isRow={true}
					style={{ background: "coral", width: !mode && "1rem", height: mode && "1rem", alignSelf: "stretch", flex: items.length === 0 && 1}}
					// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				/>
				{items.map((currRow, currRowIndex) => {

					const isLastRow = currRowIndex === items.length - 1
					return <div
						style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
						key={currRowIndex}
					>

					<styled.RowContainer>

						{currRow.map((currItem, currItemIndex) => {
							const {
								id: dropContainerId,
								component,
								fieldName
							} = currItem || {}

							const isLastItem = currItemIndex === currRow.length - 1
							const indexPattern = [currRowIndex, currItemIndex]
							const isOnlyItem = currRow.length === 1

							return <DropContainer
								currRowIndex={currRowIndex}
								setDraggingRow={() => setDraggingRow(currRowIndex)}
								clearDraggingRow={() => setDraggingRow(null)}
								hoveringRow={hoveringRow}
								setHoveringRow={(val) => setHoveringRow(val)}
								clearHoveringRow={() => setHoveringRow(null)}
								fieldName={fieldName}
								payload={items[currRowIndex][currItemIndex]}
								key={dropContainerId}
								indexPattern={indexPattern}
								onDeleteClick={handleDeleteClick}
								component={component}
								id={dropContainerId}
								onBottomDrop={(dropResult) => handleVerticalDrop(dropResult, currRowIndex + 1)}
								onTopDrop={(dropResult) => handleVerticalDrop(dropResult, currRowIndex)}
								onLeftDrop={(id, dropResult) => handleSideDrop(id, dropResult, false)}
								onRightDrop={(id, dropResult) => handleSideDrop(id, dropResult, true)}
								onCenterDrop={handleCenterDrop}
								top={false}
								bottom={false}
								right={true}
								left={true}
								preview={preview}
							/>
						})}

					</styled.RowContainer>

						{!((draggingRow === currRowIndex) && (currRow.length === 1)) &&
						<ContainerWrapper
							onDrop={(dropResult)=>{
								handleVerticalDrop(dropResult, currRowIndex + 1)
							}}
							hovering={hoveringRow === currRowIndex}
							shouldAcceptDrop={()=>{return true}}
							getGhostParent={()=>document.body}
							groupName="lot_field_buttons"
							getChildPayload={index =>
								index
							}
							showHighlight={false}
							isRow={true}
							style={{minHeight: isLastRow && "10rem",flex: isLastRow ? 1 : 0, background: "coral", width: !mode && "1rem", height: mode && "1rem"}}
						/>
						}

					</div>
				})}
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