import * as styled from "./zone_container.style";
import React, {useEffect, useState} from "react";
import useWindowSize from "../../../../../hooks/useWindowSize";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import TimelineZone from "../timeline_zone/timeline_zone";
import CardZone from "../card_zone/card_zone";
import {useSelector} from "react-redux";

const ZoneContainer = ((props) => {

	const {
		handleCardClick,
		currentProcess,
		id
	} = props

	const isCardDragging = useSelector(state => { return state.cardPageReducer.isCardDragging })
	const isHoveringOverColumn = useSelector(state => { return state.cardPageReducer.isHoveringOverColumn })

	const size = useWindowSize()
	console.log("ZoneContainer size",size)

	return(
		<div style={{background: "purple", height: "100%", maxWidth: "100%", maxHeight: "100%"}}>
			<TransformWrapper
				defaultScale={1}
				style={{background: "green", padding: "2rem", flex: 1}}
				options={{
					minScale: 0.2,
					limitToBounds: false,
					limitToWrapper: false,
					disabled: isCardDragging,
					centerContent: true
				}}
				pan={{
					disabled: isCardDragging
				}}
				enablePanPadding={false}
				enablePadding={false}
				wheel={{
					disabled: isHoveringOverColumn,
					// step: 50
				}}
				scalePadding={{
					disabled: false
				}}
				pinch={{
					disabled: isCardDragging
				}}


			>
				<TransformComponent>
					{
						{
							'summary':
								<div>THIS WILL BE THE SUMMARY ZONE</div>,
							'timeline':
								<TimelineZone
									handleCardClick={handleCardClick}
									initialProcesses={[currentProcess]}
								/>
						}[id] ||
						<CardZone
							processId={id}

							// stations={stations}
							handleCardClick={handleCardClick}
						/>
					}
				</TransformComponent>
			</TransformWrapper>
		</div>
	)





})

export default ZoneContainer

