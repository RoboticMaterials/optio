import * as styled from "./summary_zone.style";
import StationsColumn from "../station_column/station_column";
import React, {useEffect, useRef, useState} from "react";
import {SortableContainer} from "react-sortable-hoc";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import CardZone from "../card_zone/card_zone";
import {useDispatch, useSelector} from "react-redux";
import ZoneHeader from "../zone_header/zone_header";
// import Portal from "../../../../../higher_order_components/portal";
import { throttle } from 'lodash'
import Button from "../../../../basic/button/button";
import SummaryCardZone from "../card_zone/summary_card_zone/summary_card_zone";
import {all} from "ramda";
import {setSize} from "../../../../../redux/actions/card_page_actions";


const SummaryZone = SortableContainer((props) => {

	const {
		zoneRef,
		handleCardClick,
		zoneSize
	} = props

	const dispatch = useDispatch()
	const onSetSize = async (processId, size) => await dispatch(setSize(processId, size))

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })
	const isCardDragging = useSelector(state => { return state.cardPageReducer.isCardDragging })
	const isHoveringOverColumn = useSelector(state => { return state.cardPageReducer.isHoveringOverColumn })
	const sizes = useSelector(state => { return state.cardPageReducer.sizes })

	console.log("sizes",sizes)

	const [selectedProcesses, setSelectedProcesses] = useState(processes)
	const [transformWrapperPosition, setTransformWrapperPosition] = useState(null)
	const wrapperPositionX = transformWrapperPosition?.positionX
	const wrapperPositionY = transformWrapperPosition?.positionY
	const scale=transformWrapperPosition?.scale


	const [allContainersSize, setAllContainersSize] = useState({})

	const [value, setValue] = useState(0)
	const throttled = useRef(throttle(setTransformWrapperPosition, 200))

	// useEffect(() => throttled.current && throttled.current(value), [value])

	useEffect( () => {
		 // handleInputThrottled = throttle(, 100)
	}, [])

	console.log("transformWrapperPosition",transformWrapperPosition)
	console.log("allContainersSize",allContainersSize)

	console.log("RENDER RENDER RENDER")
	return(
		<styled.Container  >
			<ZoneHeader
				selectedProcesses={selectedProcesses}
				setSelectedProcesses={setSelectedProcesses}
			/>
			<div style={{display: "flex", height: "100%", overflow: "hidden"}}>
				<styled.ProcessesList id={"adnwajkdnawk"}>
					{selectedProcesses.map((currProcess, processIndex) => {
						const processName = currProcess?.name
						const containerSize = sizes[currProcess._id]

						return(
							<styled.ProcessNameContainer className={"banana"} positionX={wrapperPositionX+containerSize?.offsetLeft -50} positionY={wrapperPositionY+((containerSize?.offsetTop) * scale)} >
								<styled.ProcessName>{processName}</styled.ProcessName>
									<i
										style={{fontSize: "1rem", padding: 0, margin: 0, marginLeft: ".25rem", marginRight: ".25rem"}}
										className="fas fa-times"
										onClick={()=>{
											const filteredProcesses = selectedProcesses.filter((item,index) => item._id !== currProcess._id)
											setSelectedProcesses((filteredProcesses))
										}}
									/>
							</styled.ProcessNameContainer>
						)
					})}
				</styled.ProcessesList>
				<styled.ProcessesContainer ref={zoneRef}>
				<TransformWrapper
					defaultScale={0.5}
					options={{
						minScale: 0.2,
						limitToBounds: false,
						limitToWrapper: false,
						disabled: isCardDragging,
					}}
					pan={{
						disabled: isCardDragging
					}}
					enablePanPadding={false}
					enablePadding={false}
					defaultPositionX={150}
					defaultPositionY={5}
					onPanning={(args)=>{
						console.log("onPanning args",args)
						console.log("onPanning throttled.current",throttled.current)
						throttled.current && throttled.current({
							positionX: args.positionX,
							positionY: args.positionY,
							scale: args.scale,
						})
					}}
					onWheel={(args)=>{
						console.log("onWheel args",args)
						throttled.current && throttled.current({
							positionX: args.positionX,
							positionY: args.positionY,
							scale: args.scale,
						})
						// setTransformWrapperPosition({
						// 	positionX: args.positionX,
						// 	positionY: args.positionY,
						// 	scale: args.scale,
						// })
					}}
					wheel={{
						disabled: isHoveringOverColumn,
						step: 50
					}}
					scalePadding={{
						disabled: false
					}}
					pinch={{
						disabled: isCardDragging
					}}
				>



					<TransformComponent>
						<div  style={{height: zoneSize.height + "px", position: "relative", display: "flex", flexDirection: "column", flex: 1}}>
							{selectedProcesses.map((currProcess, processIndex) => {

								const processName = currProcess?.name


								return <SummaryCardZone
									wrapperPositionX={wrapperPositionX}
									wrapperPositionY={wrapperPositionY}
									processName={processName}
									zoneSize={zoneSize}
									scale={transformWrapperPosition?.scale}
									selectedProcesses={selectedProcesses}
									setSelectedProcesses={setSelectedProcesses}
									currProcess={currProcess}
									containerSize={allContainersSize[currProcess._id]}
									setContainerSize={(val)=> {
										onSetSize(currProcess._id, val)
									}}
									handleCardClick={handleCardClick}
								/>

							})}
						</div>
					</TransformComponent>
				</TransformWrapper>
				</styled.ProcessesContainer>

			</div>

		</styled.Container>
	)





})

export default SummaryZone

