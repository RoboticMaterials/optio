import React, {useEffect, useState} from "react";

import * as styled from "./lot_form_creator.style"
import {isArray} from "../../../../../../methods/utils/array_utils";
import {uuidv4} from "../../../../../../methods/utils/utils";
import DropContainer from "../drop_container/drop_container";
import Textbox from "../../../../../basic/textbox/textbox";
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import { fromJS } from "immutable";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import {FIELD_COMPONENT_NAMES, LOT_EDITOR_SIDEBAR_OPTIONS} from "../editor_sidebar/editor_sidebar";
import TextField from "../../../../../basic/form/text_field/text_field";

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

	const handleTopDrop = (id, dropResult) => {
		const {
			addedIndex,
			payload
		} = dropResult

		const {
			component,
			key
		} = payload


		if(addedIndex !== null) {
			const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

			const newItem = {
				_id: uuidv4(),
				component
			}

			let selected_IMMUTABLE
			if(isRow) {
				selected_IMMUTABLE = immutableReplace(selected, [newItem, selected[finalIndex]], finalIndex)
			}
			else {
				selected_IMMUTABLE = immutableInsert(selected, newItem, finalIndex)
			}

			const updatedData = getUpdate(items, indexPattern, selected_IMMUTABLE)
			setFieldValue("fields", updatedData, true)
		}

	}


	const handleBottomDrop = (id, dropResult) => {
		const {
			addedIndex,
			payload
		} = dropResult

		const {
			component,
			key
		} = payload

		if(addedIndex !== null) {
			const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

			const newItem = {
				_id: uuidv4(),
				component
			}

			let selected_IMMUTABLE //= fromJS(selected)

			// let updated
			if(isRow) {
				selected_IMMUTABLE = immutableReplace(selected, [selected[finalIndex], newItem], finalIndex)

			}
			else {
				selected_IMMUTABLE = immutableInsert(selected, newItem, finalIndex)
			}

			const updatedData = getUpdate(items, indexPattern, selected_IMMUTABLE)
			setFieldValue("fields", updatedData, true)

			// selected.splice(finalIndex, isRow ? 1 : 0, isRow ? [selected[finalIndex], newItem ] : newItem)
		}

	}

	const handleLeftDrop = (id, dropResult) => {
		const {
			addedIndex,
			payload
		} = dropResult

		const {
			component,
			key
		} = payload

		if(addedIndex !== null) {
			const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

			const newItem = {
				_id: uuidv4(),
				component
			}

			const selected_IMMUTABLE = immutableInsert(selected, newItem, finalIndex)
			const updatedData = getUpdate(items, indexPattern, selected_IMMUTABLE)
			setFieldValue("fields", updatedData, true)
		}

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

	const handleRightDrop = (id, dropResult) => {
		const {
			addedIndex,
			payload
		} = dropResult

		const {
			component,
			key
		} = payload

		if(addedIndex !== null) {
			const [selected, indexPattern, finalIndex, isRow] = getSelected(id)

			const newItem = {
				_id: uuidv4(),
				component
			}

			const selected_IMMUTABLE = immutableInsert(selected, newItem, finalIndex + 1)

			const updatedData = getUpdate(items, indexPattern, selected_IMMUTABLE)
			setFieldValue("fields", updatedData, true)
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

	const handleCenterDrop = (id, dropResult) => {
		// const {
		// 	addedIndex,
		// } = dropResult
		//
		// console.log("addedIndex",addedIndex)
		//
		// if(addedIndex !== null) {
		// 	const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)
		//
		// 	selected.splice(finalIndex, 1,{
		// 		...selected[finalIndex],
		// 		content: [
		// 			...selected[finalIndex].content,
		// 			component
		// 		]
		// 	})
		// 	if(indexPattern.length === 0) setDropContainers(selected)
		// }

	}

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
			// <Container
			// 	groupName="lot_field_buttons"
			// 	// getChildPayload={index => {
			// 	// 	const payload = Object.entries(OPTIONS)[index]
			// 	// 	console.log("payload",payload)
			// 	// 	return {
			// 	// 		key: payload[0],
			// 	// 		...payload[1]
			// 	// 	}
			// 	// }}
			// 	getGhostParent={()=>{
			// 		return document.body
			// 	}}
			// >
			<styled.ColumnContainer>
				<ContainerWrapper
					onDrop={(dropResult)=>{

						const {
							removedIndex,
							addedIndex,
							payload
						} = dropResult

						const {
							key,
							component
						} = payload

						if(addedIndex !== null) {
							console.log("prevItems",prevItems)
							const newItem = {
								_id: uuidv4(),
								component
							}

							const withInsert = immutableInsert(items, [newItem],0)
							setFieldValue("fields", withInsert)
						}

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

							return <DropContainer
								fieldName={fieldName}
								key={dropContainerId}
								indexPattern={[currRowIndex, currItemIndex]}
								onDeleteClick={handleDeleteClick}
								component={component}
								id={dropContainerId}
								onTopDrop={handleTopDrop}
								onBottomDrop={handleBottomDrop}
								onLeftDrop={handleLeftDrop}
								onRightDrop={handleRightDrop}
								onCenterDrop={handleCenterDrop}
								top={false}
								bottom={false}
								right={true}
								left={true}
								preview={preview}
								// hoveringLeft={}
								// hoveringRight={}
								// onDragTopEnter={}
								// onDragTopLeave={}
								// onDragBottomEnter={}
								// onDragBottomLeave={}
							/>
						})}

					</styled.RowContainer>
					<ContainerWrapper
						onDrop={(dropResult)=>{

							const {
								removedIndex,
								addedIndex,
								payload
							} = dropResult

							const {
								key,
								component
							} = payload

							if(addedIndex !== null) {
								const newItem = {
									_id: uuidv4(),
									component
								}
								const withInsert = immutableInsert(items, [newItem],currRowIndex+1)
								setFieldValue("fields", withInsert)
							}
						}}
						shouldAcceptDrop={()=>{return true}}
						// getGhostParent={()=>document.body}
						groupName="lot_field_buttons"
						getChildPayload={index =>
							index
						}
						isRow={true}
						style={{minHeight: isLastRow && "10rem",flex: isLastRow ? 1 : 0, background: "coral", width: !mode && "1rem", height: mode && "1rem"}}
						// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
					/>
					</div>
				})}
			</styled.ColumnContainer>
			// </Container>
		)
	}

	return (
		<>

			{mapContainers(items, true, items)}
		</>
	)

}

export default LotFormCreator