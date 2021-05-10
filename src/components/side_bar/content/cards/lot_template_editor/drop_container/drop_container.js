import {Container, Draggable} from "react-smooth-dnd";

// components internal
import {LOT_EDITOR_SIDEBAR_OPTIONS} from "../lot_template_editor_sidebar/lot_template_editor_sidebar";
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import FieldComponentMapper from "../field_component_mapper/field_component_mapper";

// functions external
import React, {useEffect, useState, useContext} from "react";
import { ThemeContext } from 'styled-components'
import {useDispatch, useSelector} from "react-redux";

// actions
import {setFieldDragging} from "../../../../../../redux/actions/card_page_actions";

// constants
import {FIELD_COMPONENT_NAMES} from "../../../../../../constants/lot_contants";

// styles
import * as styled from "./drop_container.style"

const DropContainer = (props) => {
	const {
		id,
		onTopDrop,
		onBottomDrop,
		onLeftDrop,
		onRightDrop,
		onCenterDrop,
		component,
		onDragTopEnter,
		onDragTopLeave,
		onDragBottomEnter,
		onDragBottomLeave,
		onDeleteClick,
		top,
		bottom,
		left,
		right,
		preview,
		indexPattern,
		fieldName,
		payload,
		setDraggingRow,
		clearDraggingRow,
		setHoveringRow,
		currRowIndex,
		clearHoveringRow,
		hoveringRow,

	} = props

	const dispatch = useDispatch()
	const dispatchSetFieldDragging = (bool) => dispatch(setFieldDragging(bool))

	const draggingFieldId = useSelector(state=> {return state.cardPageReducer.isFieldDragging})

	const [deleted, setDeleted] = useState(false)
	const [isThisFieldDragging, setIsThisFieldDragging] = useState(false)
	const [hoveringTop, setHoveringTop] = useState(false)
	const [hoveringBottom, setHoveringBottom] = useState(false)
	const [hoveringLeft, setHoveringLeft] = useState(false)
	const [hoveringRight, setHoveringRight] = useState(false)

	const themeContext = useContext(ThemeContext);

	useEffect(() => {
		const topRowIndex = currRowIndex-1
		const bottomRowIndex = currRowIndex

		if(hoveringTop && hoveringRow !== topRowIndex) {
			setHoveringRow(topRowIndex)
		}
		else if(hoveringBottom && hoveringRow !== bottomRowIndex) {
			setHoveringRow(bottomRowIndex)
		}

		else if(!hoveringTop && hoveringRow === topRowIndex) {
			clearHoveringRow()
		}

		else if(!hoveringBottom && hoveringRow === bottomRowIndex) {
			clearHoveringRow()
		}


	}, [hoveringTop, hoveringBottom])

	useEffect( () => {
		let timeout

		if(deleted) {
			timeout = setTimeout(() => {
				onDeleteClick(id)
			}, 500)
		}

		return () => {
			clearTimeout(timeout)
		}
	}, [deleted]);

	useEffect( () => {
		if(draggingFieldId && (draggingFieldId === id)) {
			if(!isThisFieldDragging) setIsThisFieldDragging(true)
		}
		else if(isThisFieldDragging) {
			setIsThisFieldDragging(false)
		}

	}, [draggingFieldId]);


	useEffect( () => {
		setDeleted(false)

		return () => {
		}
	}, [id]);

	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		return true
	}

	return (
		<styled.ColumnContainer isThisFieldDragging={isThisFieldDragging} deleted={deleted || isThisFieldDragging }>
			{/* Insert a New Row Above */}
			{top &&
			<ContainerWrapper
				onDrop={(dropResult)=>onTopDrop(dropResult)}
				shouldAcceptDrop={shouldAcceptDrop}
				// getGhostParent={()=>document.body}
				groupName="lot_field_buttons"
				getChildPayload={index =>
					index
				}
				style={{ alignSelf: "stretch", display: "flex"}}
				// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
			>
				<styled.TopContainer
					// hovering={hoveringTop}
				/>
			</ContainerWrapper>
			}


			{/* Insert Into Current Row*/}
			<styled.RowContainer>
				{!isThisFieldDragging &&
				<ContainerWrapper
					onDrop={(dropResult)=>onLeftDrop(id, dropResult)}
					shouldAcceptDrop={()=>{return true}}
					showHighlight={false}
					getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					hovering={hoveringLeft}
					isRow={false}
					style={{alignSelf: "stretch"}}
				/>
				}

				<Container
					groupName="lot_field_buttons"
					onDragStart={(dragStartParams, b, c)=>{
						const {
							isSource,
							payload,
							willAcceptDrop
						} = dragStartParams

						if(isSource) {
							dispatchSetFieldDragging(id)
							setDraggingRow()
						}

					}}
					onDragEnd={(dragEndParams)=>{
						const {
							isSource,
							payload,
							willAcceptDrop
						} = dragEndParams

						if(isSource) {
							dispatchSetFieldDragging(null)
							clearDraggingRow()
						}

					}}
					onDrop={(dropR) => {
						dispatchSetFieldDragging(null)
						clearDraggingRow()
					}}
					getChildPayload={index => {
						return payload
					}}
					getGhostParent={()=>{
						return document.body
					}}
					dragClass={"dragging-field"}
					style={{flex: 1, display: "flex"}}
				>
					<Draggable
						key={id}
						style={{flex: 1}}
					>
						<div style={{position: "relative", display: "flex", justifyContent: "center" }}>
							{(draggingFieldId !== null) &&
							<div style={{border: `2px solid ${themeContext.bg.secondary}`, position: "absolute", display: "flex", flexDirection: "column", alignItems: "stretch", left: 0, bottom: 0, top: 0, right: 0}}>
								<ContainerWrapper
									onHoverChange={(hoverState) => setHoveringTop(hoverState)}
									showHighlight={false}
									onDrop={(dropResult)=>onTopDrop(dropResult)}
									shouldAcceptDrop={()=>{return true}}
									getGhostParent={()=>document.body}
									groupName="lot_field_buttons"
									getChildPayload={index =>
										index
									}
									isRow={false}
									style={{flex: 0.1, zIndex: 10}}
								/>
								<div style={{display: "flex", flex: 5}}>
									<ContainerWrapper
										showHighlight={false}
										onHoverChange={(hoverState) => setHoveringLeft(hoverState)}
										onDrop={(dropResult)=>onLeftDrop(id, dropResult)}
										shouldAcceptDrop={()=>{return true}}
										getGhostParent={()=>document.body}
										groupName="lot_field_buttons"
										getChildPayload={index =>
											index
										}
										isRow={false}
										style={{flex: 1, alignSelf: "stretch", zIndex: 50}}
									/>
									<ContainerWrapper
										showHighlight={false}
										onHoverChange={(hoverState) => setHoveringRight(hoverState)}
										onDrop={(dropResult)=>onRightDrop(id, dropResult)}
										shouldAcceptDrop={()=>{return true}}
										getGhostParent={()=>document.body}
										groupName="lot_field_buttons"
										getChildPayload={index =>
											index
										}
										isRow={false}
										style={{flex: 1, alignSelf: "stretch", zIndex: 50}}

									/>
								</div>

								<ContainerWrapper
									showHighlight={false}
									onHoverChange={(hoverState) => setHoveringBottom(hoverState)}
									onDrop={(dropResult)=>onBottomDrop(dropResult)}
									shouldAcceptDrop={()=>{return true}}
									getGhostParent={()=>document.body}
									groupName="lot_field_buttons"
									getChildPayload={index =>
										index
									}
									isRow={false}
									style={{flex: 0.15, zIndex: 10}}
								/>
							</div>
							}
							{preview ?
								<FieldComponentMapper
									usable={false}
									component={component}
									fieldName={fieldName}
									containerStyle={{width: "100%", height: '100%'}}
								/>
								:
								<FieldWrapper
									containerStyle={{flex: (component === FIELD_COMPONENT_NAMES.TEXT_BOX || component === FIELD_COMPONENT_NAMES.TEXT_BOX_BIG) && 1}}
									// name={`fields[${indexPattern[0]}][${indexPattern[1]}.fieldName]`}
									fieldPath={`fields[${indexPattern[0]}][${indexPattern[1]}]`}
									onDeleteClick={() => setDeleted(true)}
								>
									<FieldComponentMapper
										usable={false}
										style={{flex: 1}}
										// fieldName={fieldName}
										component={component}
									/>
								</FieldWrapper>
							}
						</div>
					</Draggable>
				</Container>

				{/* Insert Into New Row Below*/}
				{(right && !isThisFieldDragging) &&
				<ContainerWrapper
					onDrop={(dropResult)=>onRightDrop(id, dropResult)}
					hovering={hoveringRight}
					shouldAcceptDrop={()=>{return true}}
					getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					isRow={false}
					getChildPayload={index =>
						index
					}
					showHighlight={false}
					style={{alignSelf: "stretch"}}
				/>
				}
			</styled.RowContainer>

			{bottom &&
			<ContainerWrapper
				onDrop={(dropResult)=>onBottomDrop(dropResult)}
				shouldAcceptDrop={()=>{return true}}
				// getGhostParent={()=>document.body}
				groupName="lot_field_buttons"
				getChildPayload={index =>
					index
				}
				style={{alignSelf: "stretch", display: "flex"}}
			>
				<styled.BottomContainer
				/>
			</ContainerWrapper>
			}
		</styled.ColumnContainer>

	)
}

// Specifies propTypes
DropContainer.propTypes = {
};

// Specifies the default values for props:
DropContainer.defaultProps = {
	top: true,
	bottom: true,
	left: true,
	right: true,
};




export default DropContainer