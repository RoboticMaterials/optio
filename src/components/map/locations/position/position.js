import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { handleWidgetHoverCoord } from '../../../../methods/utils/widget_utils'
import { convertD3ToReal } from '../../../../methods/utils/map_utils'
import { editing } from '../../../../methods/utils/locations_utils'

// Import Constants
import { PositionTypes } from '../../../../constants/position_constants'

// Import Actions
import { setTaskAttributes } from '../../../../redux/actions/tasks_actions'
import { setSelectedPosition, setPositionAttributes } from '../../../../redux/actions/positions_actions'
import { hoverStationInfo } from '../../../../redux/actions/widget_actions'

// Import Components
import LocationSvg from '../location_svg/location_svg'
import DragEntityProto from '../drag_entity_proto'

// Commented out for now, but will need to use logic for disabling locations
// // This filters out positions when fixing a process
// // If the process is broken, then you can only start the task at the route before break's unload location
// if (!!this.props.selectedTask && !!this.props.selectedProcess && !!this.props.fixingProcess && this.props.selectedTask.load.station === null) {

//     // Gets the route before break
//     const routeBeforeBreak = this.props.selectedProcess.routes[this.props.selectedProcess.broken - 1]
//     const taskBeforeBreak = this.props.tasks[routeBeforeBreak]

//     if (!!taskBeforeBreak.unload) {
//         const unloadStationID = taskBeforeBreak.unload.station
//         const unloadStation = this.props.locations[unloadStationID]

//         if (unloadStation.children.includes(position._id)) {
//             return true

//         }
//     }
// }

// // This filters positions when making a process
// // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
// // This eliminates process with gaps between stations
// else if (!!this.props.selectedTask && !!this.props.selectedProcess && this.props.selectedProcess.routes.length > 0 && this.props.selectedTask.load.position === null) {
//     // Gets the last route in the routes array
//     const previousRoute = this.props.selectedProcess.routes[this.props.selectedProcess.routes.length - 1]
//     const previousTask = this.props.tasks[previousRoute]

//     if (!!previousTask.unload) {

//         const unloadStationID = previousTask.unload.station
//         const unloadStation = this.props.locations[unloadStationID]

//         if (unloadStation.children.includes(position._id)) {
//             return true

//         }
//     }
// }

// This filters out positions that aren't apart of a station when making a task
// Should not be able to make a task for a random position
// else if (!!this.props.selectedTask) {
//     return !!position.parent
// }

function Position(props) {

    const {
        d3,
        position,
        rd3tClassName,
        handleEnableDrag,
        handleDisableDrag,
    } = props

    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const dispatch = useDispatch()
    const dispatchSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setPositionAttributes(id, attr))

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const hoveringID = useSelector(state => state.widgetReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)

    let isSelected = false
    // Set selected to true if the selected task inculdes the position
    if (!!selectedTask && (selectedTask.load.position === position._id || selectedTask.unload.position === position._id)) isSelected = true
    // else if(!!selectedStationChildrenCopy && (position._id in selectedStationChildrenCopy)) isSelected = true

    if (!!selectedProcess) console.log('QQQQ Selected Process', selectedProcess)


    let disabled = false
    // Disable if the selectedPosition is not this position
    if (!!selectedPosition && selectedPosition._id !== position._id) disabled = true
    // Disable if the position does not belong to the children copy
    else if (!!selectedStationChildrenCopy && !(position._id in selectedStationChildrenCopy)) disabled = true
    // Disbale if the selected stations children does not include this station
    else if (!!selectedStation && !selectedStation.children.includes(position._id)) disabled = true

    // This filters positions when making a process
    // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
    // This eliminates process with gaps between stations
    else if (!!selectedProcess && !!selectedTask && selectedProcess.routes.length > 0 && selectedTask.load.position === null) {
        // Gets the last route in the routes array
        const previousRoute = this.props.selectedProcess.routes[this.props.selectedProcess.routes.length - 1]
        const previousTask = this.props.tasks[previousRoute]

        if (!!previousTask.unload) {

            const unloadStationID = previousTask.unload.station
            const unloadStation = this.props.locations[unloadStationID]

            if (!unloadStation.children.includes(position._id)) {
                disabled = true
            }
        }
    }

    // Tells the position to glow
    const shouldGlow = selectedTask !== null &&
        ((selectedTask.load.position == position._id && selectedTask.type == 'push') ||
            (selectedTask.unload.position == position._id && selectedTask.type == 'pull') ||
            (selectedTask.load.position == position._id && selectedTask.type == 'both') ||
            (selectedTask.unload.position == position._id && selectedTask.type == 'both'))

    // Set Color
    let color = PositionTypes[position.type].color
    if (!isSelected && disabled) color = '#afb5c9' // Grey
    else if (isSelected) color = '#38eb87' // Green

    useEffect(() => {
        //window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })

        return () => {
            window.removeEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        }
    }, [])

    // Automatically opens widget pages and sets hovering to true in the position is a temp right click
    useEffect(() => {
        if (position !== null && position.name === 'TempRightClickMovePosition') {
            setHovering(true)
            dispatchHoverStationInfo(handleWidgetHover())
            dispatchSetSelectedPosition(position)
        }
    }, [])


    /**
    * Passes the X, Y, scale and ID of position to redux which is then used in widgets
    */
    const handleWidgetHover = () => {

        return handleWidgetHoverCoord(position, rd3tClassName, d3)

    }

    const onSetPositionTask = () => {

        // Commented out for now
        // If there's a selected process and the process has routes and the station is not selected, then disable it from being selected
        // if (!!selectedProcess && selectedProcess.routes.length > 0 && !isSelected) return


        if (selectedTask !== null) {
            // If the load position has been defined but the unload position hasnt, assign the unload position
            if (selectedTask.load.position !== null && selectedTask.unload.position === null) {
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type
                unload.position = position._id
                if (position.parent !== null) {
                    unload.station = position.parent
                } else {
                    type = 'push'
                }
                dispatchSetTaskAttributes(selectedTask._id, { unload, type })
            } else { // Otherwise assign the load position and clear the unload position (to define a new unload)
                let load = deepCopy(selectedTask.load)
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type
                load.position = position._id
                if (position.parent !== null) {
                    load.station = position.parent
                } else {
                    type = 'pull'
                }
                unload.position = null
                unload.station = null
                dispatchSetTaskAttributes(selectedTask._id, { load, unload, type })
            }
        }
    }

    const onMouseEnter = () => {
        // Only hover if there is no selected task
        if (!hoveringInfo && selectedTask === null) {
            setHovering(true)
            if (!editing() && !rotating && !translating && !selectedPosition && !selectedStation && !selectedTask && !position.temp) {
                dispatchHoverStationInfo(handleWidgetHover())
                dispatchSetSelectedPosition(position)

            }
        }

    }

    const renderParentLine = () => {
        const parent = (!!position.new && !!selectedStation) ? selectedStation : stations[position.parent]
        // TODO: Temp fix
        if (!parent) return
        return (
            <line x1={`${position.x}`} y1={`${position.y}`}
                x2={`${parent.x}`} y2={`${parent.y}`}
                stroke={color} strokeWidth="1.4" shapeRendering="geometricPrecision" style={{ opacity: '0.3', }}
            />
        )
    }

    const onMouseDown = () => {
        if (!disabled) onSetPositionTask()
    }

    const onTranslating = (bool) => {
        setTranslating(bool)
    }

    const onRotating = (bool) => {
        setRotating(bool)
    }

    const onMouseLeave = () => {
        position.name !== 'TempRightClickMovePosition' && setHovering(false)
    }

    return (
        <React.Fragment key={`frag-loc-${position._id}`}>
            {!!position.parent && renderParentLine()}
            <LocationSvg
                location={position}
                rd3tClassName={rd3tClassName}
                color={color}
                d3={d3}
                isSelected={isSelected}
                hovering={hovering}
                rotating={rotating}
                hoveringInfo={hoveringInfo}
                shouldGlow={shouldGlow}

                handleMouseEnter={onMouseEnter}
                handleMouseLeave={onMouseLeave}
                handleMouseDown={onMouseDown}
                handleTranslating={onTranslating}
                handleRotating={onRotating}

            />

            <DragEntityProto
                isSelected={isSelected}
                location={position}
                rd3tClassName={rd3tClassName}
                d3={() => d3()}

                handleRotate={(rotation) => { dispatchSetPositionAttributes(position._id, { rotation }) }}
                handleTranslate={({ x, y }) => dispatchSetPositionAttributes(position._id, { x, y })}
                handleTranslateEnd={({ x, y }) => {
                    const pos = convertD3ToReal([x, y], props.d3)
                    dispatchSetPositionAttributes(position._id, { pos_x: pos[0], pos_y: pos[1] })
                }}

                handleEnableDrag={() => {
                    handleEnableDrag()
                }}
                handleDisableDrag={() => {
                    handleDisableDrag()
                }}


            />
        </React.Fragment>
    )

    return (
        <g
            className={rd3tClassName}
            style={{ fill: color, stroke: color, strokeWidth: '0', opacity: '0.8', cursor: "pointer" }}
            onMouseEnter={() => {

            }}
            onMouseLeave={() => { }}
            onMouseDown={() => {

            }}
            transform={`translate(${position.x},${position.y}) rotate(${360 - position.rotation}) scale(${d3.scale / d3.imgResolution})`}
        >
            <defs>

                {/* a transparent glow that takes on the colour of the object it's applied to */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id={`glow-${rd3tClassName}`} height="300%" width="300%" x="-75%" y="-75%">
                    <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
                    <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
                    <feFlood floodColor={color} result="glowColor" />
                    <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                    <feMerge>
                        <feMergeNode in="softGlow_colored" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>


            <g className={`${rd3tClassName}-rot`}>
                {/* Only show rotating when editing or its a right click position */}
                {isSelected && (hovering || rotating) && (hoveringInfo === null || position.name === 'TempRightClickMovePosition') &&
                    <>
                        <circle x="-16" y="-16" r="16" strokeWidth="0" fill="transparent" style={{ cursor: "pointer" }}></circle>
                        <circle x="-18" y="-18" r="14" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }}
                            //  onMouseDown={() => {setRotating(true)
                            //  }}

                            onMouseUp={() => {
                                //  setRotating(false)
                            }}
                        />
                        <circle x="-14" y="-14" r="14" fill="none" strokeWidth="0.6" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                    </>
                }
            </g>

            <g className={`${rd3tClassName}-trans`} id={`${rd3tClassName}-trans`} transform={"scale(1, 1)", position.type === 'shelf_position' && "rotate(90)"}
            >


                <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" style={{ filter: shouldGlow && `url(#glow-${rd3tClassName})` }}>

                    {PositionTypes[position.type].svgPath}

                </svg>
            </g>

            {/* Commented out for now, glowing just adds a rando rectangle that no one wants arround. But we're all too awkward to say anything about this rectangle. Rectangle's life is hard. */}
            {/* {shouldGlow &&
                <rect x="-8" y="-5" height="10" width="16" rx="1.5" style={{ filter: `url(#glow-${rd3tClassName})` }} fill="none" strokeMiterlimit="0.5" strokeWidth="1"></rect>
            } */}


        </g>
    )
}

export default Position
