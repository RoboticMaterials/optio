import {Container, Draggable} from "react-smooth-dnd";
import React, {useEffect, useState} from "react";
import * as styled from "./drop_container.style"
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";
import Textbox from "../../../../../basic/textbox/textbox";
import ContainerWrapper from "../../../../../basic/container_wrapper/container_wrapper";
import FieldComponentMapper from "../field_component_mapper/field_component_mapper";

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
		fieldName

	} = props

	// const [hoveringLeft, setHoveringLeft] = useState(false)
	// const [hoveringRight, setHoveringRight] = useState(false)
	// const [hoveringTop, setHoveringTop] = useState(false)
	// const [hoveringBottom, setHoveringBottom] = useState(false)
	const [deleted, setDeleted] = useState(false)

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
		setDeleted(false)

		return () => {
		}
	}, [id]);

	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		return true
	}

	return (
		<styled.ColumnContainer deleted={deleted}>
			{/* Insert a New Row Above */}
			{top &&
			<ContainerWrapper
				onDrop={(dropResult)=>onTopDrop(id, dropResult)}
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
					{/*<div style={{}}>*/}
						<Draggable key={id} >
							<div style={{position: "relative"}}>
								<div style={{position: "absolute", display: "flex", alignItems: "stretch", left: 0, bottom: 0, top: 0, right: "40%", background: "green"}}>
									<ContainerWrapper
										onDrop={(dropResult)=>onLeftDrop(id, dropResult)}
										shouldAcceptDrop={()=>{return true}}
										getGhostParent={()=>document.body}
										groupName="lot_field_buttons"
										getChildPayload={index =>
											index
										}
										isRow={false}
										style={{background: "red", flex: 1, alignSelf: "stretch", zIndex: 50}}

									/>
								</div>



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
									fieldName={fieldName}
									component={component}
								/>
							</FieldWrapper>
						}
							</div>
						</Draggable>
					{/*</div>*/}

				{/* Insert Into New Row Below*/}
				{right &&
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
				onDrop={(dropResult)=>onBottomDrop(id, dropResult)}
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