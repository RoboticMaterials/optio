import React, {useEffect, useState, useRef} from "react";

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
import CheckboxField from '../../../../../basic/form/checkbox_field/checkbox_field'
import {getProcessStations} from "../../../../../../methods/utils/processes_utils";
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
		selectedEditingField,
		setSelectedEditingField
	} = props


	const processes = useSelector(state => state.processesReducer.processes)
	const [draggingRow, setDraggingRow] = useState(null)
	const [hoveringRow, setHoveringRow] = useState(null)
	const [draggingFieldId, setDraggingFieldId] = useState(null)
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


	const handleAddField = (componentType, dataType) => {

		let existingFields = values.fields
		let newField = []
		if(componentType === 'WORK_INSTRUCTIONS'){
			newField.push({
				component: componentType,
				dataType: dataType,
				workInstructions: [],
				fieldName: '',
				required: false,
				showInPreview: false,
				_id: uuidv4()
			})
		}
		else{
			newField.push({
				component: componentType,
				dataType: dataType,
				fieldName: '',
				required: false,
				showInPreview: false,
				_id: uuidv4()
			})
		}

		let id = newField[0]._id
		existingFields.push(newField)
		setFieldValue("fields", existingFields)
		setSelectedEditingField(id)
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

	const handleRenderComponentOptions = () => {
		return (
			<styled.RowContainer>
			<styled.ComponentOptionContainer
				onClick = {()=> {
					handleAddField('TEXT_BOX', 'STRING')
				}}
				>
				<styled.RowContainer
				 style = {{
					background: '#f7f7fa', width: '100%', height: '2rem',
					boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
					border: '0.1rem solid transparent',
					borderRadius: '0.2rem',
					padding: '0.5rem',
					marginRight: '1rem'
				}}
				>
				<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6', marginTop: '0.4rem'}}>single-line input...</styled.FieldName>
				</styled.RowContainer>
				</styled.ComponentOptionContainer>

				<styled.ComponentOptionContainer onClick = {()=> handleAddField('TEXT_BOX_BIG', 'STRING')}>
					<styled.RowContainer
					 style = {{
						background: '#f7f7fa', width: '100%', height: '4rem',
						boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
						border: '0.1rem solid transparent',
						borderRadius: '0.2rem',
						padding: '0.5rem',
						marginRight: '1rem'
					}}
					>
					<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6',}}>multi-line input...</styled.FieldName>
					</styled.RowContainer>
				</styled.ComponentOptionContainer>

				<styled.ComponentOptionContainer onClick = {()=> handleAddField('NUMBER_INPUT', 'INTEGER')}>
					<NumberInput
						containerSyle = {{pointerEvents: 'none', userSelect: 'none', width: '15%'}}
						inputStyle = {{pointerEvents: 'none', userSelect: 'none'}}
						buttonStyle = {{pointerEvents: 'none', userSelect: 'none'}}
						inputDisabled={false}
						minusDisabled={false}
						plusDisabled={false}
					/>
				</styled.ComponentOptionContainer>

				<styled.ComponentOptionContainer onClick = {()=> handleAddField('CALENDAR_SINGLE', 'DATE')}>
					<CalendarPlaceholder
							usable={false}
							selectRange = {false}
							defaultText = {'start date'}
							containerStyle={{ width: "23rem", userSelect: 'none', pointerEvents: 'none', marginTop: '0.5rem' }}
					/>
				</styled.ComponentOptionContainer>

				<styled.ComponentOptionContainer onClick = {()=> handleAddField('CALENDAR_START_END', 'DATE_RANGE')}>
					<CalendarPlaceholder
							usable={false}
							selectRange = {true}
							defaultStartText = {'start date'}
							defaultEndText = {'end date'}
							containerStyle={{ width: "23rem", userSelect: 'none', pointerEvents: 'none' }}
						/>
					</styled.ComponentOptionContainer>

					<styled.ComponentOptionContainer
						onClick = {()=> handleAddField('WORK_INSTRUCTIONS', 'FILE')}
						style = {{flexDirection: 'row'}}
						>
						<styled.FieldName style = {{paddingTop: '.5rem'}}>work instructions</styled.FieldName>
						<i class="far fa-file-alt" style = {{fontSize: '2.5rem', color: '#b8b9bf'}}></i>
					</styled.ComponentOptionContainer>

			</styled.RowContainer>
		)
	}

	const handleRenderComponentType = (component, fieldId) => {
		switch(component) {
			case 'TEXT_BOX':
				return (
							<styled.RowContainer
							 style = {{
							 	background: '#f7f7fa', width: fieldId === selectedEditingField ? '70%' : '20rem', height: '2rem',
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
					 	background: '#f7f7fa', width: fieldId === selectedEditingField ? '70%' : '20rem', height: '4rem',
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
					<styled.FieldName style= {{fontSize: '0.9rem', opacity: '0.6'}}>dashboard text input...</styled.FieldName>
					</styled.RowContainer>
				)

			case 'NUMBER_INPUT':
				return (
					<>
						{fieldId !== selectedEditingField ?
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

							:

							<NumberInput
								containerSyle = {{pointerEvents: 'none', userSelect: 'none'}}
								inputStyle = {{pointerEvents: 'none', userSelect: 'none'}}
								buttonStyle = {{pointerEvents: 'none', userSelect: 'none'}}
								inputDisabled={false}
								minusDisabled={false}
								plusDisabled={false}
							/>
						}
					</>
				)

			case 'CALENDAR_SINGLE':
				return (
					<>
						{fieldId !== selectedEditingField ?
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

							:

							<CalendarPlaceholder
									usable={false}
									selectRange = {false}
									defaultText = {'start date'}
									containerStyle={{ width: "23rem", cursor: 'default', userSelect: 'none', marginTop: '0.5rem' }}
							/>
						}
					</>
				)

			case 'CALENDAR_START_END':
				return (
					<>
						{fieldId!==selectedEditingField ?
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
							:
							<CalendarPlaceholder
									usable={false}
									selectRange = {true}
									defaultStartText = {'start date'}
									defaultEndText = {'end date'}
									containerStyle={{ width: "23rem", cursor: 'default', userSelect: 'none' }}
							/>
						}
					</>
				)

				case 'WORK_INSTRUCTIONS':
					return (
						<styled.RowContainer
						 style = {{
							background: '#f7f7fa', width: '3rem',
							boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
							border: '0.1rem solid transparent',
							borderRadius: '0.2rem',
							padding: '0.5rem'
						}}
						>
							<i class="far fa-file-alt" style = {{fontSize: '2.5rem', color: '#7e7e7e'}}></i>
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
										draggable = {true}
										style = {{
											borderBottom: draggingFieldId === currItem._id && '.3rem solid #dedfe3',
											borderLeft: draggingFieldId === currItem._id && '0.1rem solid #dedfe3',
											borderRight: draggingFieldId === currItem._id && '0.2rem solid #dedfe3',
											borderTop: draggingFieldId === currItem._id && '0.1rem solid #dedfe3',
											margin: '1rem'
										}}
										onDragStart = {(e)=>{
											setDraggingFieldId(currItem._id)
											e.target.style.opacity = '0.001'
										}}
										onDrag = {(e)=> {

										}}
										onDragEnd = {(e)=>{
											setDraggingFieldId(null)
											e.target.style.opacity = '1'
										}}
									 selected = {false}

									 onClick = {()=>{
										setSelectedEditingField(currItem._id)
									}}>
										<styled.FieldName>{fieldName}</styled.FieldName>
										{handleRenderComponentType(component, currItem._id)}
									</styled.ColumnFieldContainer>

									:

									<styled.ColumnFieldContainer
									 selected = {true}
									 draggable = {true}
									 style = {{margin: '1rem', flexDirection: 'row', justifyContent: 'spaceBetween'}}
									 onClick = {()=>{
										setSelectedEditingField(currItem._id)
									}}>
									<styled.ColumnContainer>
									<TextField
										style={{
											fontSize: '1rem',
											whiteSpace: "nowrap" ,
											marginRight: "2rem",
											marginBottom: ".5rem",
											width: "20rem",
											marginTop: '0.4rem'
										}}
										schema='lots'
										focus = {true}
										placeholder = {'Enter a field name...'}
										inputStyle={{fontSize: '1rem'}}
										name={`fields[${currRowIndex}][${currItemIndex}].fieldName`}
										InputComponent={Textbox}
									/>
									{handleRenderComponentType(component, currItem._id)}
									</styled.ColumnContainer>
									<styled.OptionContainer>
									<styled.RowContainer>
										<CheckboxField
											name={`fields[${currRowIndex}][${currItemIndex}].showInPreview`}
											css = {{background: !!values.fields[currRowIndex][currItemIndex].showInPreview && '#924dff', border: '0.1rem solid #924dff'}}
										/>
										<styled.FieldName style = {{margin: '0.3rem 0.8rem 0rem 0.2rem'}}>show in cards</styled.FieldName>

										<CheckboxField
											name={`fields[${currRowIndex}][${currItemIndex}].required`}
											css = {{background: !!values.fields[currRowIndex][currItemIndex].required && '#924dff', border: '0.1rem solid #924dff'}}
										/>
										<styled.FieldName style = {{margin: '0.3rem 0.8rem 0rem 0.2rem'}}>required</styled.FieldName>
										<i
										className = 'fas fa-trash'
										style = {{color: '#7e7e7e', fontSize: '1.2rem', marginRight: '0.5rem', cursor: 'pointer'}}
										onClick = {()=> {
											handleDeleteClick(currItem._id)
										}}

										/>
									</styled.RowContainer>


									</styled.OptionContainer>
									</styled.ColumnFieldContainer>
								}
								</>
							)
						})}
					</styled.ColumnContainer>
					</div>
				})}
				</div>
				<styled.ColumnFieldContainer
				 style = {{margin: '1rem', paddingTop: '1.2rem', paddingLeft: '1.2rem', flexDirection: selectedEditingField !== 'ADDING' ? 'row' : 'column', maxHeight: selectedEditingField !== 'ADDING' ? '4rem' : '10rem'}}
				 onClick = {()=>{
					 if(selectedEditingField!=='ADDING'){
						 setSelectedEditingField('ADDING')
					 }
				 }}
				 selected = {selectedEditingField === 'ADDING'}
				 >
				 {selectedEditingField !== 'ADDING' ?
				 	<>
					 <i className = 'fas fa-plus' style = {{fontSize: '1.2rem', paddingRight: '.5rem'}}/>
					 <styled.FieldName>Add New Field</styled.FieldName>
				  </>
				 	:
					 <>
						 <styled.FieldName style = {{marginBottom: '1rem'}}>Choose a component type</styled.FieldName>
						 {handleRenderComponentOptions()}
					 </>
	 			 }

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
