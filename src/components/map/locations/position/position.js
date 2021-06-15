import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { handleWidgetHoverCoord } from '../../../../methods/utils/widget_utils'
import { convertD3ToReal } from '../../../../methods/utils/map_utils'
import { editing } from '../../../../methods/utils/locations_utils'
import { getProcessStationsWhileEditing } from '../../../../methods/utils/processes_utils'

// Import Constants
import { PositionTypes } from '../../../../constants/position_constants'

// Import Actions
import { selectTask, setTaskAttributes } from '../../../../redux/actions/tasks_actions'
import { setSelectedPosition, setPositionAttributes } from '../../../../redux/actions/positions_actions'
import { hoverStationInfo } from '../../../../redux/actions/widget_actions'
import { pageDataChanged } from '../../../../redux/actions/sidebar_actions'

// Import Components
import LocationSvg from '../location_svg/location_svg'
import DragEntityProto from '../drag_entity_proto'
import { getPreviousRoute } from "../../../../methods/utils/processes_utils";
import {
    getLoadPositionId,
    getLoadStationId, getRouteEnd, getRouteIndexInRoutes, getRouteStart,
    isPositionAtLoadStation, isPositionAtUnloadStation,
    isPositionInRoutes,
    isStationInRoutes, isStationLoadStation, isStationUnloadStation
} from "../../../../methods/utils/route_utils";
import {immutableDelete} from "../../../../methods/utils/array_utils";

function Position(props) {

    const {
        d3,
        position,
        rd3tClassName,
        handleEnableDrag,
        handleDisableDrag,
        mouseDown
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
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(true))

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const hoveringID = useSelector(state => state.widgetReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)

    // ======================================== //
    //                                          //
    //       Position Characteristics           //
    //                                          //
    // ======================================== //
    const routeStart = getRouteStart(selectedTask)
    const routeEnd = getRouteEnd(selectedTask)
    // Used to allow translating/rotation
    let isSelected = false
    // Set selected if the positon is part of a stations children copy and no selected task
    if (!!selectedStationChildrenCopy && (positionId in selectedStationChildrenCopy) && !selectedTask) isSelected = true
    // Set selected if there is a selected postion that is this position and no selected task
    else if (!!selectedPosition && selectedPosition._id === positionId && !selectedTask) isSelected = true
    // Set selected if the position is a temp right click
    else if (position.schema === 'temporary_position') isSelected = true

    // Used to disable the ability to add position as a task
    let disabled = false

    if(selectedTask && selectedProcess) {


        if (!position.parent) {
            disabled = true
        }

        // This filters out positions when fixing a process
        // If the process is broken, then you can only start the task at the route before break's unload location
        if (!!fixingProcess) {
            if (!position.parent) {
                disabled = true
            }
            else {
                // setting load (or both are set, in which case logic is the same, as click another position would be setting the load
                if ((!routeStart) || (routeStart && routeEnd)) {
                    // disable all positions except those at unload station of the route before the break
                    const routeBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]
                    disabled = !isPositionAtUnloadStation(routeBeforeBreak, positionId)
                }

                // setting unload
                else if (!routeEnd) {
                    if (!positions[selectedTask?.load?.position]) disabled = true

                    // don't allow selecting positions at stations already in process
                    const routeAfterBreak = selectedProcess.routes[selectedProcess.broken]

                    if(isPositionInRoutes(selectedProcess.routes, positionId) && !isPositionAtLoadStation(routeAfterBreak, positionId)) disabled = true
                }
            }
        }
            // This filters positions when making a process
            // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
        // This eliminates process with gaps between stations
        else {

             {
                // extract insertIndex for adding new routes to beginning of a process
                const {
                    temp
                } = selectedTask || {}
                const {
                    insertIndex
                } = temp || {}

                // not first route
                if (selectedProcess.routes.length > 0) {
                    const routeIndex = getRouteIndexInRoutes(selectedProcess.routes.map((currProcess) => currProcess._id), selectedTask?._id)

                    // setting load (or both have been set)
                    if (!routeStart || (routeStart && routeEnd)) {

                        // adding to beginning of process
                        if (insertIndex === 0) {
                            // disable all positions already in the process
                            if(isPositionInRoutes(selectedProcess.routes, positionId)) disabled = true
                        }

                        else if (routeIndex === 0) {
                            if (isPositionInRoutes(immutableDelete(selectedProcess.routes, 0), positionId)) disabled = true
                        }

                        else {
                            // must start at position at unload station of previous route
                            const previousRoute = getPreviousRoute(selectedProcess.routes, selectedTask._id)
                            const previousRouteEnd = getRouteEnd(previousRoute)
                            if(!isPositionAtUnloadStation(previousRoute, positionId) && previousRouteEnd) disabled = true



                            const loadPositionId = getLoadPositionId(selectedTask)
                            const loadStationId = getLoadStationId(selectedTask)

                            if (isPositionInRoutes(selectedProcess.routes, positionId) && (previousRouteEnd !== position.parent) && positionId !== loadPositionId && loadStationId !== position.parent) disabled = true
                        }
                    }

                    // setting unload
                    else if (!routeEnd) {

                        if (!positions[selectedTask?.load?.position]) disabled = true

                        // adding new to beginning of process
                        if (insertIndex === 0) {
                            // disable positions already used
                            const firstRoute = selectedProcess.routes[0]
                            if(isPositionInRoutes(selectedProcess.routes, positionId) && !isPositionAtLoadStation(firstRoute, positionId)) disabled = true

                            // disable positions at load station of current route, as unload and load shouldn't be at same route
                            if (isPositionAtLoadStation(selectedTask, positionId)) disabled = true
                        }

                        else if (routeIndex === 0) {
                            const nextRoute = selectedProcess.routes[1]
                            if (isPositionInRoutes(selectedProcess.routes, positionId) && !isPositionAtLoadStation(nextRoute, positionId)) disabled = true
                        }

                        else {
                            const nextRoute = selectedProcess.routes[routeIndex + 1]
                            // disable positions already used
                            if (isPositionInRoutes(selectedProcess.routes, positionId) && (!isPositionAtLoadStation(nextRoute, positionId) || routeIndex === -1)) disabled = true

                            // disable positions at load station of current route, as unload and load shouldn't be at same route
                            if (isPositionAtLoadStation(selectedTask, positionId)) disabled = true
                        }
                    }
                }

                // first route
                else {
                    // setting load
                    if (!routeStart || (routeStart && routeEnd)) {
                        // all positions are available for load position of first route
                    }

                    // setting unload
                    else if (!routeEnd) {
                        // disable positions at load station of current route, as unload and load shouldn't be at same route
                        if (isPositionAtLoadStation(selectedTask, positionId)) disabled = true
                    }
                }
            }
        }
    }
    else {
        // Disable if the selectedPosition is not this position
        if (!!selectedPosition && selectedPosition._id !== positionId) disabled = true

        // Disable if making a task and this position does not have a parent
        else if (!!selectedTask && !position.parent) disabled = true

        // Disable if the position does not belong to the children copy
        else if (!!selectedStationChildrenCopy && !(positionId in selectedStationChildrenCopy)) disabled = true

        // Disbale if the selected stations children does not include this station
        else if (!!selectedStation && !selectedStation.children.includes(positionId)) disabled = true
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
        window.addEventListener("mouseup", onSetListener, {passive: true})
        return () => {
            window.removeEventListener("mouseup", onSetListener)
        }

    }, [])

    const onSetListener = () => {
        setRotating(false)
        setTranslating(false)
    }


    // Automatically opens widget pages and sets hovering to true in the position is a temp right click
    useEffect(() => {
        if (position !== null && position.schema === 'temporary_position') {
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
        if (!hoveringInfo && selectedTask === null && !position.temp && !mouseDown) {
            setHovering(true)
            if (!editing() && !rotating && !translating && !selectedPosition && !selectedStation && !selectedTask) {
                dispatchHoverStationInfo(handleWidgetHover())
                dispatchSetSelectedPosition(position)

            }
        }

    }

    const renderParentLine = () => {

        const parent = ((!!selectedStationChildrenCopy && positionId in selectedStationChildrenCopy) && !!selectedStation) ? selectedStation : stations[position.parent]
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
        if(selectedPosition?.schema!=="temporary_position"){
        dispatchPageDataChanged(true)
      }
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
        position.schema !== 'temporary_position' && setHovering(false)
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
                hoveringInfo={position.schema !== 'temporary_position' ? hoveringInfo : null}
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
