import Portal from "../../../../../../higher_order_components/portal";
import * as styled from "../../summary_zone/summary_zone.style";
import Button from "../../../../../basic/button/button";
import CardZone from "../card_zone";
import React, {useEffect, useRef, useState} from "react";

const SummaryCardZone = (props) => {

	const {
		wrapperPositionX,
		wrapperPositionY,
		processName,
		zoneSize,
		scale,
		selectedProcesses,
		setSelectedProcesses,
		currProcess,
		handleCardClick,
		containerSize,
		setContainerSize
	} = props


	const containerRef = useRef(null);
	// const [containerSize, setContainerSize] = useState({
	// 	width: undefined,
	// 	height: undefined,
	// 	offsetTop: undefined,
	// 	offsetWidth: undefined,
	// })
	//
	useEffect( () => {

		// The 'current' property contains info of the reference:
		// align, title, ... , width, height, etc.
		if(containerRef.current){

			console.log("containerRef.current",containerRef.current)
			let height = containerRef.current.offsetHeight;
			let width  = containerRef.current.offsetWidth;
			let offsetTop  = containerRef.current.offsetTop;
			let offsetLeft  = containerRef.current.offsetLeft;
			setContainerSize({width, height, offsetTop, offsetLeft});
		}

	}, [containerRef, zoneSize, selectedProcesses]);
	//
	console.log("containerSize",containerSize)
	console.log("zoneSize",zoneSize)
	console.log("wrapperPositionY",wrapperPositionY)




	return(
		<styled.CardZoneContainer ref={containerRef}>
			<CardZone
				processId={currProcess.id}
				handleCardClick={handleCardClick}
			/>
		</styled.CardZoneContainer>
	)
}


export default SummaryCardZone