import {Container} from "react-smooth-dnd";
import React, {useEffect, useState} from "react";

const ContainerWrapper = (props) => {
	const {
		children,
		onDragEnter,
		onDragLeave,
		style,
		isRow,
		onDrop,
		color,
		showHighlight,
		onHoverChange,
		...rest
	} = props

	const [hovering, setHovering] = useState(false)

	useEffect(() => {
		onHoverChange && onHoverChange(hovering)
	}, [hovering])

	// useEffect(() => {
	// 	if(props.hovering && !hovering) setHovering(true)
	// }, [props.hovering])


	return (
		<Container
			onDragEnter={() => {
				setHovering(true)
				onDragEnter && onDragEnter()
			}}
			onDragLeave={()=>{
				setHovering(false)
				onDragLeave && onDragLeave()
			}}
			onDrop={(dropResult)=>{
				setHovering(false)
				onDrop && onDrop(dropResult)
			}}
			style={{
				...style,
				// border: "1px solid black",
				transition: "all 0.5s ease",
				padding: (hovering || props.hovering) ? (isRow ? "2.5rem 0" : "0 2.5rem") : 0,
				background: (hovering || props.hovering) ? (showHighlight ? "rgb(50,50,50)" : "transparent") : (color ? color : "transparent"),
			}}
			{...rest}
		>
			{children}
		</Container>
	)
}

// Specifies propTypes
ContainerWrapper.propTypes = {
};

// Specifies the default values for props:
ContainerWrapper.defaultProps = {
	onDragEnter: null,
	onDragLeave: null,
	onDrop: null,
	showHighlight: true,
	onHoverChange: null,
	hovering: false
};

export default ContainerWrapper