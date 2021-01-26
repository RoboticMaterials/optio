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
import {getPreviousRoute} from "../../../../methods/utils/processes_utils";
import {
    getLoadStationId,
    isPositionAtLoadStation, isPositionAtUnloadStation,
    isPositionInRoutes,
    isStationInRoutes
} from "../../../../methods/utils/route_utils";

function Position(props) {

    const {
        d3,
        position,
        rd3tClassName,
        handleEnableDrag,
        handleDisableDrag,
    } = props

    const {
        _id: positionId
    } = position

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
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)

    // ======================================== //
    //                                          //
    //       Position Characteristics           //
    //                                          //
    // ======================================== //
    // Used to allow translating/rotation
    let isSelected = false
    // Set selected if the positon is part of a stations children copy and no selected task
    if (!!selectedStationChildrenCopy && (positionId in selectedStationChildrenCopy) && !selectedTask) isSelected = true
    // Set selected if there is a selected postion that is this position and no selected task
    else if (!!selectedPosition && selectedPosition._id === positionId && !selectedTask) isSelected = true
    // Set selected if the position is a temp right click
    else if(position.name === 'TempRightClickMovePosition') isSelected = true

    // Used to disable the ability to add position as a task
    let disabled = false
    // Disable if the selectedPosition is not this position
    if (!!selectedPosition && selectedPosition._id !== positionId) disabled = true
    // Disable if the position does not belong to the children copy
    else if (!!selectedStationChildrenCopy && !(positionId in selectedStationChildrenCopy)) disabled = true
    // Disbale if the selected stations children does not include this station
    else if (!!selectedStation && !selectedStation.children.includes(positionId)) disabled = true

    // This filters out positions when fixing a process
    // If the process is broken, then you can only start the task at the route before break's unload location
    else if (!!selectedTask && !!selectedProcess && !!fixingProcess) {

        // setting load (or both are set, in which case logic is the same, as click another position would be setting the load
        if( (selectedTask.load.station === null) || ((selectedTask.load.station !== null) && (selectedTask.unload.station !== null))) {
            // disable all positions except those at unload station of the route before the break
            const routeBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]
            disabled = !isPositionAtUnloadStation(routeBeforeBreak, positionId)
        }

        // setting unload
        else if(selectedTask.unload.station === null) {

            // don't allow selecting positions at stations already in process
            disabled = isPositionInRoutes(selectedProcess.routes, positionId)

            // if position is at station load station after the break, it should be enabled
            const routeAfterBreak = selectedProcess.routes[selectedProcess.broken]
            if(isPositionAtLoadStation(routeAfterBreak, positionId)) disabled = false
        }
    }
    // This filters positions when making a process
    // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
    // This eliminates process with gaps between stations
    else if (!!selectedProcess && !!selectedTask) {
        // extract insertIndex for adding new routes to beginning of a process
        const {
            temp
        } = selectedTask || {}
        const {
            insertIndex
        } = temp || {}

        // not first route
        if(selectedProcess.routes.length > 0) {

            // setting load (or both have been set)
            if( (selectedTask.load.station === null) || ((selectedTask.load.station !== null) && (selectedTask.unload.station !== null))) {

                // adding to beginning of process
                if(insertIndex === 0) {
                    // disable all positions already in the process
                    disabled = isPositionInRoutes(selectedProcess.routes, positionId)
                }

                else {
                    // must start at position at unload station of previous route
                    const previousRoute = getPreviousRoute(selectedProcess.routes, selectedTask._id)
                    disabled = !isPositionAtUnloadStation(previousRoute, positionId)
                }
            }

            // setting unload
            else if(selectedTask.unload.position === null) {

                // adding new to beginning of process
                if(insertIndex === 0) {
                    // disable positions already used
                    disabled = isPositionInRoutes(selectedProcess.routes, positionId)

                    // enable positions at first route since inserting at beginning
                    const firstRoute = selectedProcess.routes[0]
                    if(isPositionAtLoadStation(firstRoute, positionId)) disabled = false

                    // disable positions at load station of current route, as unload and load shouldn't be at same route
                    if(isPositionAtLoadStation(selectedTask, positionId)) disabled = true
                }

                else {
                    // disable positions already used
                    if(isPositionInRoutes(selectedProcess.routes, positionId)) disabled = true

                    // disable positions at load station of current route, as unload and load shouldn't be at same route
                    if(isPositionAtLoadStation(selectedTask, positionId)) disabled = true
                }
            }
        }

        // first route
        else {
            // setting load
            if(selectedTask.load.position === null) {
                // all positions are available for load position of first route
            }

            // setting unload
            else if(selectedTask.unload.position === null) {
                // disable positions at load station of current route, as unload and load shouldn't be at same route
                if(isPositionAtLoadStation(selectedTask, positionId)) disabled = true
            }
        }
    }

    // This filters out positions that aren't apart of a station when making a task
    // Should not be able to make a task for a random position
    else if (!!selectedTask && !position.parent) {
        disabled = true
    }

    // Tells the position to glow
    const shouldGlow = selectedTask !== null &&
        ((selectedTask.load.position == positionId && selectedTask.type == 'push') ||
            (selectedTask.unload.position == positionId && selectedTask.type == 'pull') ||
            (selectedTask.load.position == positionId && selectedTask.type == 'both') ||
            (selectedTask.unload.position == positionId && selectedTask.type == 'both'))


    // Used to highlight position if the position is part of the selected task
    let highlight = false
    if (!!selectedTask && (selectedTask.load.position === positionId || selectedTask.unload.position === positionId)) highlight = true


    // Set Color
    let color = PositionTypes[position.type].color
    if (!isSelected && disabled) color = '#afb5c9' // Grey
    else if (highlight) color = '#38eb87' // Green

    // ======================================== //
    //                                          //
    //           Position Functions             //
    //                                          //
    // ======================================== //

    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
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
                unload.position = positionId
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
                load.position = positionId
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
        if (!hoveringInfo && selectedTask === null && !position.temp) {
            setHovering(true)
            if (!editing() && !rotating && !translating && !selectedPosition && !selectedStation && !selectedTask) {
                dispatchHoverStationInfo(handleWidgetHover())
                dispatchSetSelectedPosition(position)

            }
        }

    }

    const renderParentLine = () => {

        const parent = ((!!selectedStationChildrenCopy && positionId in selectedStationChildrenCopy) && !!selectedStation) ? selectedStation : stations[position.parent]
        // TODO: Temp fix, Commented out to see if this temp fix is needed yet
        // if (!parent) return
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
        if (!isSelected) {
            setTranslating(bool)
        }
    }

    const onRotating = (bool) => {
        setRotating(bool)
        if (!bool) {
            setHovering(false)
        }
    }

    const onMouseLeave = () => {
        position.name !== 'TempRightClickMovePosition' && setHovering(false)
    }

    return (
        <React.Fragment key={`frag-loc-${positionId}`}>
            {!!position.parent && renderParentLine()}
            <LocationSvg
                location={position}
                rd3tClassName={rd3tClassName}
                color={color}
                d3={d3}
                isSelected={isSelected}
                hovering={hovering}
                rotating={rotating}
                hoveringInfo={position.name !== 'TempRightClickMovePosition' ? hoveringInfo : null}
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

                handleRotate={(rotation) => { dispatchSetPositionAttributes(positionId, { rotation }) }}
                handleTranslate={({ x, y }) => dispatchSetPositionAttributes(positionId, { x, y })}
                handleTranslateEnd={({ x, y }) => {
                    const pos = convertD3ToReal([x, y], props.d3)
                    dispatchSetPositionAttributes(positionId, { pos_x: pos[0], pos_y: pos[1] })
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
}

export default Position
