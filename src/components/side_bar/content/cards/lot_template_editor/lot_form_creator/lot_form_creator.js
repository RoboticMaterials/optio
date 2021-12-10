import React, {useEffect, useState, useRef} from "react";

import * as styled from "./lot_form_creator.style"
import {immutableDelete, immutableInsert, immutableReplace, isArray} from "../../../../../../methods/utils/array_utils";
import {putLotTemplate} from "../../../../../../redux/actions/lot_template_actions";
import {arraysEqual, uuidv4, deepCopy} from "../../../../../../methods/utils/utils";
//import DropContainer from "../drop_container/drop_container";
import AWS from 'aws-sdk/global'
import Textbox from "../../../../../basic/textbox/textbox";
import Button from '../../../../../basic/button/button'
import {Container} from "react-smooth-dnd";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import DropDownIcon from '../../../../../basic/drop_down_icon/drop_down_icon'
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import CalendarPlaceholder from '../../../../../basic/calendar_placeholder/calendar_placeholder'
import {FIELD_COMPONENT_NAMES, LOT_EDITOR_SIDEBAR_OPTIONS} from "../lot_template_editor_sidebar/lot_template_editor_sidebar";
import {FIELD_TYPES, ICONS} from '../../../../../../constants/lot_template_constants'
import TextField from "../../../../../basic/form/text_field/text_field";
import {useSelector, useDispatch} from "react-redux";
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
		setSelectedEditingField,
		lotTemplateId
	} = props

	const processes = useSelector(state => state.processesReducer.processes)
	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})
	const dispatch = useDispatch()
	const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

	const [draggingRow, setDraggingRow] = useState(null)
	const [hoveringRow, setHoveringRow] = useState(null)
	const [draggingFieldId, setDraggingFieldId] = useState(null)
	const [dragOverId, setDragOverId] = useState(null)
	const [clientY, setClientY] = useState(null)
	const [clientX, setClientX] = useState(null)
	const [dragIndex, setDragIndex] = useState(null)
	const [startIndex, setStartIndex] = useState(null)
	const [divHeight, setDivHeight] = useState(null)
	const [divWidth, setDivWidth] = useState(null)
	const [mouseOffsetY, setMouseOffsetY] = useState(null)
	const [mouseOffsetX, setMouseOffsetX] = useState(null)
	const [xDrag, setXDrag] = useState(null)
	const [changeFieldTypes, setChangeFieldTypes] = useState(null)
	const [newFieldChosen, setNewFieldChosen] = useState(null)
	const [allowHomeDrop, setAllowHomeDrop] = useState(null)//once youve draggged out of 'home' position the drop box can be shown once you go back
	//this prevents flickering when dragStart occurs
	const {
		fields: items = []
	} = values || {}
	useEffect(() => {
		setDragIndex(dragIndexSearch(values.fields.length))
	}, [clientY])

	useEffect(() => {
		handleSetDragColumnIndex()
	}, [clientX])

	useEffect(() => {//when changing field dont show the current fieldtype in dropdown
		let removeType
		for(const i in values.fields){
			for(const j in values.fields[i]){
				if(values.fields[i][j]._id === selectedEditingField) {
					removeType = values.fields[i][j].component
					break
				}
			}
		}

		let ind = FIELD_TYPES.findIndex(field => field.type === removeType)
		let updatedFields = deepCopy(FIELD_TYPES)
		if(ind>-1) updatedFields.splice(ind,1)
		setChangeFieldTypes(updatedFields)
		setNewFieldChosen(false)
	}, [selectedEditingField, values, newFieldChosen])


	useEffect(() => {
		if(dragIndex && startIndex){
				setAllowHomeDrop(true)
				let fieldDiv = document.getElementById(draggingFieldId)
				let fieldContainer = document.getElementById(draggingFieldId + 'container')
				fieldContainer.style.display = 'none'
				fieldDiv.style.display = 'none'
				fieldContainer.style.padding = '0.05rem'
		}
	}, [dragIndex])

//This function finds the which index the dragging field is currently at
// based on drag target midpoint and the bounding box of all fields on the page
//A blank drop box can then be generated between the two field boxes where dragging
//happening
//switch this over to binary search right now it just loops....
	const dragIndexSearch = (length) => {
		//let mid = Math.round(length/2)
		if(!!draggingFieldId){
		for(const i in values.fields){
			if(values.fields[i]){
				let ele = document.getElementById(values.fields[i][0]?._id)
				if(ele?.getBoundingClientRect().width === 0 && values.fields[i].length>1) ele = document.getElementById(values.fields[i][1]._id)
				let offset = xDrag !== 'center' && !!ele ? ele.getBoundingClientRect().height : 0
				let midY = (ele?.getBoundingClientRect().bottom + ele?.getBoundingClientRect().top)/2
				let draggingY = clientY + mouseOffsetY + (offset*.66)
				let deltaY = Math.abs(midY - draggingY)
				if(!!ele && midY > draggingY) {
					if(xDrag!=='center' && i == startIndex && values.fields[i][0]._id !==draggingFieldId && values.fields[i-1].length<2){
					 return parseInt(i-1) //weird case for dragging to side of field 1 above dragging field
					}
					else{
					 return parseInt(i)
				 }
				}
				else if(i == values.fields.length-1 && startIndex===values.fields.length && values.fields[i].length<2){//dragging from end
					return values.fields.length-1
				}
			}
		}
	}
	let endEle = document.getElementById(values.fields[values.fields.length-1][0]._id)
	let offset = xDrag !== 'center' && !!endEle ? endEle.getBoundingClientRect().height : 0
	if(endEle && (endEle.getBoundingClientRect().bottom + endEle.getBoundingClientRect().top)/2 < (clientY + mouseOffsetY)+ (offset*.66)){
		return values.fields.length
	}
}

	const handleSetDragColumnIndex = (length) => {
		if(!!draggingFieldId){
			let ele = document.getElementById('container')
			if(!!ele){
			let val = (ele.getBoundingClientRect().right + ele.getBoundingClientRect().left)/2
			if((val-270) > (clientX + mouseOffsetX)){
				setXDrag('left')
			}
			else if((val + 270) < (clientX + mouseOffsetX)){
				setXDrag('right')
			}
			else if((val + 200) > (clientX + mouseOffsetX) && (val-200) < (clientX + mouseOffsetX)) {
				setXDrag('center')
			}
			else{
				 setXDrag(null)
			 }
		 }
		}
	}

	const handleChangeFieldType = (componentType, dataType)=> {
		let newFields = values.fields
		for(const i in values.fields){
			for(const j in values.fields[i]){
				if(values.fields[i][j]._id === selectedEditingField) {
					let changedField = values.fields[i][j]
					changedField.dataType = dataType
					changedField.component = componentType
					newFields[i][j] = changedField
					break
				}
			}
		}
		setFieldValue("fields", newFields)
		setFieldValue("changed", true)
		setNewFieldChosen(true)
	}

	const handleDropField = (e) => {//rewrite this function... kept adding for edge cases and it became a mess
		if(!!xDrag){
			let column, insertIndex, startRow, existingInd, fromColumn
			let multipleInRow = false
			if(xDrag !== 'center'){
				startRow = startIndex-1
				if(startRow<dragIndex) insertIndex = dragIndex
				else insertIndex = dragIndex-1
				if(xDrag === 'left') column = 0
				else if(xDrag === 'right') column = 1
			}
			else insertIndex = dragIndex

			let insertField = []
			for(const i in values.fields){
				for(const j in values.fields[i]){
					if(values.fields[i][j]._id === draggingFieldId){
						if(values.fields[i].length>1){
							multipleInRow = true
							fromColumn = j
						}
						if(xDrag === 'left' && values.fields[dragIndex-1]?.length<2){
							existingInd = i
							insertField.push(values.fields[i][j])
							insertField.push(values.fields[dragIndex-1][0])
						}
						else if(xDrag === 'right' && values.fields[dragIndex-1]?.length<2){
							existingInd = i
							insertField.push(values.fields[dragIndex-1][0])
							insertField.push(values.fields[i][j])
						}
						else if (xDrag === 'center'){
						 insertField.push(values.fields[i][j])
						}
					}
				}
			}
			if((dragIndex!==startIndex && insertField.length>0) || xDrag === 'center'){
				let newFields = deepCopy(values.fields)
				newFields.splice(insertIndex, 0, insertField)
				if(xDrag!=='center'){
					let toDouble = false
					if(startRow<dragIndex){//dragging field downwards and to side
						newFields.splice(insertIndex-1, 1)
						if(!multipleInRow) newFields.splice(existingInd, 1)
						else newFields[existingInd].splice(fromColumn, 1)
					}
					else{//dragging field upwards and to side
						newFields.splice(insertIndex+1, 1)
						if(!multipleInRow) newFields.splice(existingInd, 1)
						else newFields[existingInd].splice(fromColumn, 1)
					}
				}
				else{//dragging fields straight up and down
					if(startIndex<dragIndex){//down
						if(!multipleInRow) newFields.splice(startIndex-1, 1)
						else newFields[startIndex-1].splice(fromColumn,1)
					}
					else if(startIndex>dragIndex){//up
						if(!multipleInRow) newFields.splice(startIndex, 1)
						else newFields[startIndex].splice(fromColumn,1)
					}
					else{
						newFields[startIndex-1].splice(fromColumn,1)
					}
				}
				setFieldValue("fields", newFields)
				setFieldValue("changed", true)
			}
			else if(multipleInRow && ((fromColumn == 1 && xDrag=='left') || (fromColumn == 0 && xDrag=='right'))){
				let newFields = deepCopy(values.fields)
				let updatedField = []
				updatedField[0] = newFields[startIndex-1][1]//swaparooooo
				updatedField[1] = newFields[startIndex-1][0]
				newFields[startIndex-1] = updatedField
				setFieldValue("fields", newFields)
				setFieldValue("changed", true)
			}
		}
		setStartIndex(null)
		setDragOverId(null)
		setDragIndex(null)
		e.target.style.opacity = '1'
	}

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
				if(currItem?._id === id) {
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
				workInstructions: {},
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

	const handleRenderComponentType = (component, fieldId) => {
		switch(component) {
			case 'TEXT_BOX':
				return (
							<styled.RowContainer
							 style = {{
							 	background: '#f7f7fa', width: '50%', height: '2rem',
							 	boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
							 	border: '0.1rem solid transparent',
								borderRadius: '0.2rem',
								padding: '0.5rem',
								overflow: 'hidden',
							}}
							>
							<styled.FieldName style= {{zIndex: '1',fontSize: '0.9rem', opacity: '0.6', marginTop: '0.4rem', overflow: 'hidden'}}>single-line input...</styled.FieldName>
							</styled.RowContainer>
				)
			case 'TEXT_BOX_BIG':
				return (
					<styled.RowContainer
					 style = {{
					 	background: '#f7f7fa', width: '50%', height: '3.5rem',
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
			}
		}

	const mapContainers = (items, mode, prevItems, indexPattern, thisIndex) => {
		return (
				<styled.ColumnContainer
					id = 'container'
				 	onDragOver = {(e)=> {
						setClientY(e.clientY)
						setClientX(e.clientX)
					}}
				>
					{dragIndex === 0 && startIndex !==1 &&
						<styled.DropContainer
							divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
							divWidth = {!!divWidth ? divWidth +'px' : '100%'}
						/>
					}
					<div>
					{items.map((currRow, currRowIndex) => {

						const isLastRow = currRowIndex === items.length - 1
						return <div
							style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
							key={currRowIndex}
						>
						<styled.FieldRowContainer>
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
									{!!draggingFieldId && xDrag === 'left' && !!startIndex && !!dragIndex && currItem?._id!==draggingFieldId && allowHomeDrop && (currRow.length<2 || startIndex ===dragIndex)
									 && dragIndex === currRowIndex+1 &&
										<styled.DropContainer
											style = {{marginTop: '1rem'}}
											divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
											divWidth = {startIndex === dragIndex ? divWidth +'px' : '48%'}
										/>
									}
										<div
											id = {currItem?._id + 'container'}
											style = {{padding: '1.2rem', display: 'flex', flex: '1'}}
											onDragOver = {(e)=>{
												setDragOverId(currItem?._id)
											}}
											>
										<div id = {'emptyDiv'}/>
										<styled.ColumnFieldContainer
											id = {currItem?._id}
											draggable = {true}
											style = {{
												borderBottom: draggingFieldId === currItem?._id && '.3rem solid #dedfe3',
												borderLeft: draggingFieldId === currItem?._id && currItem?._id !==selectedEditingField && '0.1rem solid #dedfe3',
												borderRight: draggingFieldId === currItem?._id && '0.3rem solid #dedfe3',
												borderTop: draggingFieldId === currItem?._id && '0.1rem solid #dedfe3',
												boxShadow: draggingFieldId === currItem?._id && 'none',
												flexDirection: selectedEditingField === currItem?._id && 'row',
												pointerEvents: dragOverId === currItem?._id && 'none',
												borderRadius: draggingFieldId === currItem?._id && '0.5rem',
												margin: draggingFieldId === currItem?._id && '0.1rem',
											}}
											onDragStart = {(e)=>{
												setDivHeight(e.target.offsetHeight+5)
												let containerWidth = document.getElementById('container')
												let itemWidth = document.getElementById(currItem?._id)
												let width = currRow.length === 2 ? itemWidth.getBoundingClientRect().width + containerWidth.getBoundingClientRect().width*0.014 : containerWidth.getBoundingClientRect().width

												setDivWidth(width*0.98)
												setStartIndex(currRowIndex+1)
												setDraggingFieldId(currItem?._id)
												let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
												let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

												setMouseOffsetY(offsetY)
												setMouseOffsetX(offsetX)
												e.target.style.opacity = '0.001'
											}}
											onDragEnd = {(e)=>{
												let ele = document.getElementById('emptyDiv')
												e.dataTransfer.setDragImage(ele,0,0)

												let fieldContainer = document.getElementById(draggingFieldId + 'container')
												let fieldDiv = document.getElementById(draggingFieldId)
												fieldContainer.style.padding = '1.2rem'
												fieldDiv.style.display = 'flex'
												fieldContainer.style.display = 'flex'
												if(!!currItem && (dragIndex !== startIndex) && (dragIndex || dragIndex === 0)){
													handleDropField(e)
												}
												else if(currItem && currRow.length>1 && dragIndex === startIndex){
													handleDropField(e)
												}
												else {
													setStartIndex(null)
													setDragOverId(null)
													setDragIndex(null)
													e.target.style.opacity = '1'
												}
												setAllowHomeDrop(null)
												setDraggingFieldId(null)
												setMouseOffsetY(null)
											}}
										 selected = {currItem?._id === selectedEditingField}

										 onClick = {()=>{
											setSelectedEditingField(currItem?._id)
											}}
										>
											{currItem?._id !== selectedEditingField ?
												<>
												<styled.FieldName>{fieldName}</styled.FieldName>
												{handleRenderComponentType(component, currItem?._id)}
												</>
												:
												<>
													<styled.ColumnContainer>
													<TextField
														style={{
															fontSize: '1rem',
															whiteSpace: "nowrap" ,
															marginRight: "2rem",
															marginBottom: ".5rem",
															width: "20rem",
															marginTop: '0.4rem',
															overflow: 'hidden',
															textOverflow: 'ellipsis'
														}}
														schema='lots'
														focus = {true}
														placeholder = {'Enter a field name...'}
														inputStyle={{fontSize: '1rem'}}
														name={`fields[${currRowIndex}][${currItemIndex}].fieldName`}
														InputComponent={Textbox}
													/>
													{handleRenderComponentType(component, currItem?._id)}
														</styled.ColumnContainer>
														<styled.OptionContainer>
														<styled.RowContainer style = {{justifyContent: 'end'}}>
														<styled.FieldName style = {{margin: '0.4rem 0rem 0rem 0.2rem'}}>show</styled.FieldName>
														<CheckboxField
															name={`fields[${currRowIndex}][${currItemIndex}].showInPreview`}
															css = {{background: !!values.fields[currRowIndex][currItemIndex].showInPreview && '#924dff', border: '0.1rem solid #924dff'}}
														/>
														<styled.FieldName style = {{margin: '0.4rem 0rem 0rem 1.5rem'}}>require</styled.FieldName>
														<CheckboxField
															name={`fields[${currRowIndex}][${currItemIndex}].required`}
															css = {{background: !!values.fields[currRowIndex][currItemIndex].required && '#924dff', border: '0.1rem solid #924dff'}}
														/>
														<i
														className = 'fas fa-trash'
														style = {{color: '#7e7e7e', fontSize: '1.2rem', marginRight: '0.5rem', marginLeft: '2rem', cursor: 'pointer'}}
														onClick = {()=> {
															handleDeleteClick(currItem?._id)
														}}
														/>
													</styled.RowContainer>
													<styled.DropDownContainer style = {{minWidth: '22rem', paddingRight: '.5rem'}}>
														 <DropDownIcon
																 placeholder="Change field type"
																 schema = {'lots'}
																 labelField="name"
																 valueField="name"
																 options={changeFieldTypes}
																 height = {'2rem'}
																 values={[]}
																 dropdownGap={5}
																 noDataLabel="No matches found"
																 closeOnSelect="true"
																 setFieldType = {(item, dataType)=>{
																	 handleChangeFieldType(item,dataType)
																 }}
																 className="w-100"
														 />
													 </styled.DropDownContainer>
													</styled.OptionContainer>
												</>
											}
										</styled.ColumnFieldContainer>
										</div>

										{!!draggingFieldId && xDrag === 'right' && !!startIndex && !!dragIndex && currItem?._id!==draggingFieldId && allowHomeDrop && (currRow.length<2 || startIndex ===dragIndex)
										 && dragIndex === currRowIndex+1 &&
											<styled.DropContainer
												style = {{marginTop: '1rem'}}
												divHeight = {!!divHeight ? divHeight +'px' : '7rem'}
												divWidth = {startIndex === dragIndex ? divWidth +'px' : '48%'}

											/>
										}
									</>
								)
							})}
						</styled.FieldRowContainer>
						{!!draggingFieldId && xDrag === 'center' && !!startIndex && !!dragIndex && dragIndex === currRowIndex+1 && allowHomeDrop &&
							<styled.DropContainer
								divHeight = {!!divHeight ? divHeight +'px' : '7rem'}
								divWidth = {'98%'}
							/>
						}
						</div>
					})}
					</div>
					<styled.DropDownContainer>
						 <DropDownIcon
								 placeholder="Add a new field"
								 schema = {'lots'}
								 labelField="name"
								 valueField="name"
								 options={FIELD_TYPES}
								 values={[]}
								 height = {'4rem'}
								 dropdownGap={5}
								 noDataLabel="No matches found"
								 closeOnSelect="true"
								 setFieldType = {(item, dataType)=>{
									 handleAddField(item, dataType)
								 }}
								 className="w-100"
						 />
					 </styled.DropDownContainer>
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
