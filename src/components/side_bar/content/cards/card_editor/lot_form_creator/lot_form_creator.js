import React, {useEffect, useState} from "react";

import * as styled from "./lot_form_creator.style"
import {isArray} from "../../../../../../methods/utils/array_utils";
import {arraysEqual, uuidv4} from "../../../../../../methods/utils/utils";
import DropContainer from "../drop_container/drop_container";
import Textbox from "../../../../../basic/textbox/textbox";
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import { fromJS } from "immutable";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import {FIELD_COMPONENT_NAMES, LOT_EDITOR_SIDEBAR_OPTIONS} from "../editor_sidebar/editor_sidebar";
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

	console.log("")
	const {
		fields: items = []
	} = values || {}

	// const [items, setFieldValue] = useState([])

	useEffect( () => {
		console.log("LotFormCreator values",values)

	}, [items])
	useEffect( () => {
		console.log("LotFormCreator values",values)

	}, [values])
	useEffect( () => {
		console.log("LotFormCreator errors",errors)

	}, [errors])
	console.log("LotFormCreator errors",errors)

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




	const immutableInsert = (arr, ele, index) => {
		return [...arr.slice(0, index), ele, ...arr.slice(index, arr.length)]
	}

	const immutableDelete = (arr, index) => {
		return [...arr.slice(0, index), ...arr.slice(index+1, arr.length)]
	}

	const immutableReplace = (arr, ele, index) => {
		return [...arr.slice(0, index), ele, ...arr.slice(index+1, arr.length)]
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
			console.log("handleVerticalDrop currRowIndex",currRowIndex)
			console.log("handleVerticalDrop oldIndexPattern",oldIndexPattern)

			let updatedData
			let removedImmutable
			let removedLastItemInRow
			if(isArray(oldIndexPattern) && oldIndexPattern.length > 0) {
				removedImmutable = immutableDelete(oldSelected, oldFinalIndex)
				console.log("removedImmutable",removedImmutable)
				if(removedImmutable.length === 0) {
					removedLastItemInRow = true
					updatedData = immutableDelete(items, oldIndexPattern[0])
				}
				else {
					updatedData = getUpdate(items, oldIndexPattern, removedImmutable)
				}
			}

			if(!(removedLastItemInRow && (currRowIndex === (oldIndexPattern[0] + 1)))) {
				const newItem = {
					...payload
				}

				const withInsert = immutableInsert(updatedData ? updatedData : items, [newItem], currRowIndex)
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

				console.log("updatedData",updatedData)


				const newItem = {
					...payload
				}

				console.log("newItem",newItem)

				const didThing = removedLastItemInRow && indexPattern[0] > oldIndexPattern[0]
				const selected_IMMUTABLE = immutableInsert(patternsAreEqual ? removedImmutable : selected, newItem,(isRight && !patternsAreEqual) ? finalIndex + 1 : finalIndex)
				console.log("selected_IMMUTABLE",selected_IMMUTABLE)
				console.log("indexPattern",indexPattern)
				updatedData = getUpdate(updatedData ? updatedData : items, didThing ? oldIndexPattern : indexPattern, selected_IMMUTABLE)
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

	console.log("draggingRow", draggingRow)

	const mapContainers = (items, mode, prevItems, indexPattern, thisIndex) => {
		// if(indexPattern === null) indexPattern = 0


		let Containerz
		if(mode) {
			// Containerz = styled.RowContainer
			Containerz = styled.ColumnContainer

		}
		else {
			Containerz = styled.ColumnContainer
		}



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
								_id: dropContainerId,
								component,
								fieldName
							} = currItem || {}

							const isLastItem = currItemIndex === currRow.length - 1
							const indexPattern = [currRowIndex, currItemIndex]
							const isOnlyItem = currRow.length === 1

							return <DropContainer
								setDraggingRow={() => setDraggingRow(currRowIndex)}
								clearDraggingRow={() => setDraggingRow(null)}
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
							shouldAcceptDrop={()=>{return true}}
							getGhostParent={()=>document.body}
							groupName="lot_field_buttons"
							getChildPayload={index =>
								index
							}
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