import {Container, Draggable} from "react-smooth-dnd";
import React, {useEffect, useState} from "react";
import * as styled from "./drop_container.style"
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import Textbox from "../../../../../basic/textbox/textbox";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import FieldComponentMapper from "../field_component_mapper/field_component_mapper";
import {useDispatch, useSelector} from "react-redux";
import {LOT_EDITOR_SIDEBAR_OPTIONS} from "../editor_sidebar/editor_sidebar";
import {setFieldDragging} from "../../../../../../redux/actions/card_page_actions";

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
		clearDraggingRow

	} = props

	console.log("dropcontainr payload",payload)

	const dispatch = useDispatch()
	const dispatchSetFieldDragging = (bool) => dispatch(setFieldDragging(bool))

	const draggingFieldId = useSelector(state=> {return state.cardPageReducer.isFieldDragging})


	const [deleted, setDeleted] = useState(false)
	const [isThisFieldDragging, setIsThisFieldDragging] = useState(false)

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

	console.log("draggingFieldId",draggingFieldId)
	console.log("isThisFieldDragging",isThisFieldDragging)

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
					getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					isRow={false}
					style={{display: "flex", flex: 1, alignSelf: "stretch"}}
				/>
				}

				<Container
					groupName="lot_field_buttons"
					onDragStart={(dragStartParams, b, c)=>{
						console.log("onDragStart")
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
						console.log("onDragEnd")
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
						console.log("dropR aaaa",dropR)
						dispatchSetFieldDragging(null)
						clearDraggingRow()
					}}
					getChildPayload={index => {
						return payload
					}}
					getGhostParent={()=>{
						return document.body
					}}
					style={{
						// position: "relative",
						//
						// display: "flex",
						// flexDirection: "column",
						// alignSelf: "stretch",
						// flex: 1,
						// alignItems: "center",
						// overflowY: "auto",
						// overflowX: "hidden",

					}}
				>
					{/*<div style={{}}>*/}
						<Draggable key={id} >
							<div style={{position: "relative", }}>
								{draggingFieldId &&
								<div style={{position: "absolute", display: "flex", flexDirection: "column", alignItems: "stretch", left: 0, bottom: 0, top: 0, right: 0}}>
									<ContainerWrapper
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
								component={component}
								fieldName={fieldName}
							/>
							:
							<FieldWrapper
								name={`fields[${indexPattern[0]}][${indexPattern[1]}.fieldName]`}
								onDeleteClick={() => setDeleted(true)}
							>
								<FieldComponentMapper
									// fieldName={fieldName}
									component={component}
								/>
							</FieldWrapper>
						}
							</div>
						</Draggable>
					{/*</div>*/}
				</Container>

				{/* Insert Into New Row Below*/}
				{(right && !isThisFieldDragging) &&
				<ContainerWrapper
					// orientation={"horizontal"}
					onDrop={(dropResult)=>onRightDrop(id, dropResult)}
					shouldAcceptDrop={()=>{return true}}
					getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					isRow={false}
					getChildPayload={index =>
						index
					}
					style={{display: "flex", flex: 1, alignSelf: "stretch"}}
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
				// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
			>
				<styled.BottomContainer
					// hovering={hoveringBottom}
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