import {Container} from "react-smooth-dnd";
import React from "react";
import * as styled from "./drop_container.style"
import FieldWrapper from "../../../../../basic/form/field_wrapper/field_wrapper";

const DropContainer = (props) => {
	const {
		id,
		onTopDrop,
		onBottomDrop,
		onLeftDrop,
		onRightDrop,
		onCenterDrop,
		content,
	} = props

	const shouldAcceptDrop = (sourceContainerOptions, payload) => {
		return true
	}

	return (
		<styled.ColumnContainer>
			{/* Insert a New Row Above */}
			<Container
				onDrop={(dropResult)=>onTopDrop(id, dropResult)}
				shouldAcceptDrop={shouldAcceptDrop}
				// getGhostParent={()=>document.body}
				groupName="lot_field_buttons"
				getChildPayload={index =>
					index
				}
				style={{ alignSelf: "stretch", display: "flex", height: ".5rem"}}
				// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
			>
				<div style={{background: "orange", flex: 1, alignSelf: "stretch"}}></div>
			</Container>

			{/* Insert Into Current Row*/}
			<styled.RowContainer>
				<Container
					orientation={"horizontal"}
					onDrop={(dropResult)=>onLeftDrop(id, dropResult)}
					shouldAcceptDrop={()=>{return true}}
					// getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					style={{width: ".5rem", alignSelf: "stretch", display: "flex"}}
					// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				>
					<div style={{background: "red", flex: 1, alignSelf: "stretch"}}></div>
				</Container>

				{/*<Container*/}
				{/*	onDrop={(dropResult)=>onCenterDrop(id, dropResult)}*/}
				{/*	shouldAcceptDrop={()=>{return true}}*/}
				{/*	// getGhostParent={()=>document.body}*/}
				{/*	groupName="lot_field_buttons"*/}
				{/*	getChildPayload={index =>*/}
				{/*		index*/}
				{/*	}*/}
				{/*	style={{alignSelf: "stretch", display: "flex"}}*/}
				{/*	// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}*/}
				{/*>*/}
					<div style={{background: "blue", flex: 5, alignSelf: "stretch"}}>

						{content.map((Component) => {
							return(
								<styled.ComponentContainer>
									<FieldWrapper>
									{Component}
									</FieldWrapper>
								</styled.ComponentContainer>
							)
						})}
					</div>
				{/*</Container>*/}

				{/* Insert Into New Row Below*/}
				<Container
					// orientation={"horizontal"}
					onDrop={(dropResult)=>onRightDrop(id, dropResult)}
					shouldAcceptDrop={()=>{return true}}
					// getGhostParent={()=>document.body}
					groupName="lot_field_buttons"
					getChildPayload={index =>
						index
					}
					style={{width: ".5rem", alignSelf: "stretch", display: "flex"}}
					// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
				>
					<div style={{background: "green", flex: 1, alignSelf: "stretch"}}></div>
				</Container>


			</styled.RowContainer>

			<Container
				onDrop={(dropResult)=>onBottomDrop(id, dropResult)}
				shouldAcceptDrop={()=>{return true}}
				// getGhostParent={()=>document.body}
				groupName="lot_field_buttons"
				getChildPayload={index =>
					index
				}
				style={{height: ".5rem", alignSelf: "stretch", display: "flex"}}
				// style={{overflow: "auto",height: "100%", padding: "1rem 1rem 2rem 1rem" }}
			>
				<div style={{background: "purple", flex: 1, alignSelf: "stretch"}}></div>
			</Container>
		</styled.ColumnContainer>

	)
}

export default DropContainer