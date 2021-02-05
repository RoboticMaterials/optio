import React, {useState} from "react";

import * as styled from "./lot_form_creator.style"
import {isArray} from "../../../../../../methods/utils/array_utils";
import {uuidv4} from "../../../../../../methods/utils/utils";
import DropContainer from "../drop_container/drop_container";
import Textbox from "../../../../../basic/textbox/textbox";
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";

const LotFormCreator = (props) => {

	const {

	} = props

	const [dropContainers, setDropContainers] = useState([{_id: "1", content: [
			<Textbox
				style={{width: "30rem"}}
			/>
		]}])

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
		} = dropResult

		if(addedIndex !== null) {
			const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)

			const newItem = {
				_id: uuidv4(),
				content: [component]
			}

			selected.splice(finalIndex, isRow ? 1 : 0, isRow ? [newItem, selected[finalIndex]] : newItem)
			if(indexPattern.length === 0) setDropContainers(selected)
		}

	}

	const handleBottomDrop = (id, dropResult) => {
		const {
			addedIndex,
		} = dropResult

		if(addedIndex !== null) {
			const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)

			const newItem = {
				_id: uuidv4(),
				content: [component]
			}

			selected.splice(finalIndex, isRow ? 1 : 0, isRow ? [selected[finalIndex], newItem ] : newItem)
			if(indexPattern.length === 0) setDropContainers(selected)
		}

	}

	const handleLeftDrop = (id, dropResult) => {
		const {
			addedIndex,
		} = dropResult

		if(addedIndex !== null) {
			const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)

			const newItem = {
				_id: uuidv4(),
				content: [component]
			}

			selected.splice(finalIndex, !isRow ? 1 : 0, !isRow ? [newItem, selected[finalIndex]] : newItem)
			if(indexPattern.length === 0) setDropContainers(selected)
		}

	}

	const handleRightDrop = (id, dropResult) => {
		const {
			addedIndex,
		} = dropResult

		if(addedIndex !== null) {
			const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)

			const newItem = {
				_id: uuidv4(),
				content: [component]
			}


			selected.splice(!isRow ? finalIndex : finalIndex + 1, !isRow ? 1 : 0, !isRow ? [selected[finalIndex], newItem ] : newItem)
			if(indexPattern.length === 0) setDropContainers(selected)
		}
	}

	const getSelected = (id, dropResult) => {
		const {
			removedIndex,
			addedIndex,
			payload
		} = dropResult

		const {
			key,
			component
		} = payload

		console.log("getSelected id, dropResult",id, dropResult)

		let [indexPattern, found] = findArrLocation(id, dropContainers, [])
		const finalIndex = indexPattern.pop()

		let selected = [...dropContainers]
		let isRow = (indexPattern.length % 2 === 0)

		if (isArray(indexPattern)) {


			indexPattern.forEach((currIndex) => {

				selected = selected[currIndex]
			})
		}

		console.log("selected", selected)
		console.log("component", component)

		getUpdate(dropContainers, indexPattern, null)

		return [selected, component, key, indexPattern, finalIndex, isRow]
	}

	const getUpdate = (arr, indexPattern, updatedElement) => {





		let trimmedIndexPattern = [...indexPattern]

		// indexPattern.forEach((curIndex) => {

			let removed = trimmedIndexPattern.pop()

			const myImmutableList = Immutable.fromJS(arr[trimmedIndexPattern])
			const newList = myImmutableList.insert(removed, updatedElement)
		// })

		console.log("arr",arr)
		console.log("newList",newList)
		console.log("updatedElement",updatedElement)






	}

	const handleCenterDrop = (id, dropResult) => {
		const {
			addedIndex,
		} = dropResult

		console.log("addedIndex",addedIndex)

		if(addedIndex !== null) {
			const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(id, dropResult)

			selected.splice(finalIndex, 1,{
				...selected[finalIndex],
				content: [
					...selected[finalIndex].content,
					component
				]
			})
			if(indexPattern.length === 0) setDropContainers(selected)
		}

	}

	const mapContainers = (items, mode, prevItems) => {
		let Containerz
		if(mode) {
			Containerz = styled.RowContainer

		}
		else {
			Containerz = styled.ColumnContainer
		}

		return (

			<>
				<Container
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
							// const [selected, component, key, indexPattern, finalIndex, isRow] = getSelected(prevItems[0]._id, dropResult)


							console.log("prevItems",prevItems)
							const newItem = {
								_id: uuidv4(),
								content: [component]
							}
							//
							prevItems.unshift(newItem)
							// if(indexPattern.length === 0) setDropContainers(selected)

						}

					}}
					shouldAcceptDrop={()=>{return true}}
					// getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					style={{background: "coral", width: !mode && "1rem", height: mode && "1rem", alignSelf: "stretch"}}
					// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				>
				</Container>
				<Containerz>

					{items.map((currItem) => {

						if (isArray(currItem)) {
							return mapContainers(currItem, !mode, items)
						} else {
							const {
								_id: dropContainerId,
								content
							} = currItem || {}
							return (
								<DropContainer
									content={content}
									id={dropContainerId}
									onTopDrop={handleTopDrop}
									onBottomDrop={handleBottomDrop}
									onLeftDrop={handleLeftDrop}
									onRightDrop={handleRightDrop}
									onCenterDrop={handleCenterDrop}
								/>
							)
						}

					})}
			</Containerz>
		<Container
			// onDrop={(dropResult)=>onCenterDrop(id, dropResult)}
			shouldAcceptDrop={()=>{return true}}
			// getGhostParent={()=>document.body}
			groupName="lot_field_buttons"
			getChildPayload={index =>
				index
			}
			style={{background: "coral", width: !mode && "1rem", height: mode && "1rem"}}
			// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
		>
		</Container>
		</>
		)
	}

	return (
		<>
		{mapContainers(dropContainers, true, dropContainers)}
		</>
	)

}

export default LotFormCreator