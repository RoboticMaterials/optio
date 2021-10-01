import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import * as styled from './station.style'

// Import actions
import { hoverStationInfo } from '../../../../redux/actions/widget_actions'
import { setSelectedStation, setStationAttributes } from '../../../../redux/actions/stations_actions'
import { setSelectedTask, setTaskAttributes } from '../../../../redux/actions/tasks_actions'
import { pageDataChanged } from '../../../../redux/actions/sidebar_actions'

// Import Utils
import { handleWidgetHoverCoord } from '../../../../methods/utils/widget_utils'
import { deepCopy } from '../../../../methods/utils/utils'
import { convertD3ToReal } from '../../../../methods/utils/map_utils'
import { editing } from '../../../../methods/utils/locations_utils'
import { getProcessStationsWhileEditing } from '../../../../methods/utils/processes_utils'

// Import Constants
import { StationTypes } from '../../../../constants/station_constants'
import { defaultTask } from '../../../../constants/route_constants'

// Import Components
import LocationSvg from '../location_svg/location_svg'
import DragEntityProto from '../drag_entity_proto'
import { getPreviousRoute } from "../../../../methods/utils/processes_utils";
import {
    generateDefaultRoute,
    getHasStartAndEnd, getLoadStationId,
    getRouteEnd,
    getRouteIndexInRoutes, getRouteStart,
    getUnloadStationId,
    isNextRouteViable, isPositionAtLoadStation, isPositionInRoutes,
    isStationInRoutes,
    isStationLoadStation, isStationUnloadStation
} from "../../../../methods/utils/route_utils";
import {immutableDelete} from "../../../../methods/utils/array_utils";

function Station(props) {
    const {
        station,
        rd3tClassName,
        d3,
        handleEnableDrag,
        handleDisableDrag,
        mouseDown,
        isSelected
    } = props


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingProcess = useSelector(state => state.processesReducer.editingProcess)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)
    const positions = useSelector(state => state.positionsReducer.positions)

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchSetSelectedTask = async (task) => await dispatch(setSelectedTask(task))
    const dispatchSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(true))


    // ======================================== //
    //                                          //
    //        Station Characteristics           //
    //                                          //
    // ======================================== //

    const routeStart = getRouteStart(selectedTask)
    const routeEnd = getRouteEnd(selectedTask)

    console.log(selectedStation)

    let disabled = false;
    if(!!selectedTask && !!selectedProcess) {

    } else {
        // Disable if the selected station is not this station
        if (!!selectedStation && selectedStation._id !== station._id) disabled = true

        // Disable if theres a selected position and the station's children dont contain that position
        else if (!!selectedPosition && !station.children.includes(selectedPosition._id)) disabled = true
}

    // if (isStationInRoutes(selectedProcess.routes, station._id)) disabled = true;

    // NOTE: This is legacy disable fields. With process splitting these are irrelevant (7/18/21)
    // if(!!selectedTask && !!selectedProcess) {
    //     // This filters out stations when fixing a process
    //     // If the process is broken, then you can only start the task at the route before break's unload location
    //     if (!!fixingProcess) {
    //         // setting load
    //         if (!routeStart || (routeStart && routeEnd)) {

    //             // must start at unload station of route before the break
    //             const routeBeforeBreak = selectedProcess.routes[selectedProcess.broken - 1]
    //             if (!isStationUnloadStation(routeBeforeBreak, station._id)) disabled = true
    //         }

    //         // setting unload
    //         else if (!routeEnd) {
    //             if (!!positions[selectedTask?.load?.position]) disabled = true

    //             // can't pick same station for load and unload
    //             if (isStationLoadStation(selectedTask, station._id)) disabled = true

    //             // always allow picking load station of route after the break, as this would fix the break
    //             const routeAfterBreak = selectedProcess.routes[selectedProcess.broken] || {}

    //             // disable stations already in process
    //             if (isStationInRoutes(selectedProcess.routes, station._id) && !isStationLoadStation(routeAfterBreak, station._id)) disabled = true
    //         }
    //     }

    //     // This filters stations when making a process
    //     // If the process has routes, and you're adding a new route, you should only be able to add a route starting at the last station
    //     // This eliminates process with gaps between stations
    //     else {
    //         const {
    //             temp
    //         } = selectedTask || {}
    //         const {
    //             insertIndex
    //         } = temp || {}


    //         if (selectedProcess.routes.length > 0) {
    //             const routeIndex = getRouteIndexInRoutes(selectedProcess.routes.map((currProcess) => currProcess._id), selectedTask?._id)

    //             // setting load station
    //             if (!routeStart || (routeStart && routeEnd)) {

    //                 // adding to beginning
    //                 if (insertIndex === 0) {
    //                     // disable is station is already in process
    //                     if (isStationInRoutes(selectedProcess.routes, station._id)) disabled = true
    //                 }


    //                 else if (routeIndex === 0) {
    //                     if (isStationInRoutes(immutableDelete(selectedProcess.routes, 0), station._id)) disabled = true
    //                 }

    //                 else {
    //                     // must select unload station of previous route
    //                     const previousRoute = getPreviousRoute(selectedProcess.routes, selectedTask._id)
    //                     const previousRouteEnd = getRouteEnd(previousRoute)

    //                     if (!isStationUnloadStation(previousRoute, station._id) && previousRouteEnd) disabled = true

    //                     const loadStationId = getLoadStationId(selectedTask)
    //                     if (isStationInRoutes(selectedProcess.routes, station._id) && station._id !== loadStationId && previousRouteEnd !== station._id) disabled = true
    //                 }
    //             }

    //             else if (!routeEnd) {
    //                 if (!!positions[selectedTask?.load?.position]) disabled = true

    //                 // adding to beginning of process
    //                 if (insertIndex === 0) {

    //                     // disable stations already in process
    //                     const firstRoute = selectedProcess.routes[0]
    //                     if (isStationInRoutes(selectedProcess.routes, station._id) && !isStationLoadStation(firstRoute, station._id)) disabled = true

    //                     // don't allow selecting same station for load and unload
    //                     if (isStationLoadStation(selectedTask, station._id)) disabled = true
    //                 }

    //                 else if (routeIndex === 0) {
    //                     // disable stations already in process
    //                     const nextRoute = selectedProcess.routes[1]
    //                     if (isStationInRoutes(selectedProcess.routes, station._id) && !isStationLoadStation(nextRoute, station._id)) disabled = true
    //                 }

    //                 else {
    //                     // disable stations already in process
    //                     const nextRoute = selectedProcess.routes[routeIndex + 1]
    //                     if (isStationInRoutes(selectedProcess.routes, station._id) && (!isStationLoadStation(nextRoute, station._id) || routeIndex === -1)) disabled = true
    //                 }
    //             }
    //         }

    //         // editing first route
    //         else {
    //             if ((selectedTask.load.station && selectedTask.unload.station === null)) {
    //                 // don't allow selecting same station for load and unload
    //                 if (isStationLoadStation(selectedTask, station._id)) disabled = true
    //             }
    //         }
    //     }
    // }
    // else {
    //     // Disable if the selected station is not this station
    //     if (!!selectedStation && selectedStation._id !== station._id) disabled = true

    //     // Disable if theres a selected position and the station's children dont contain that position
    //     else if (!!selectedPosition && !station.children.includes(selectedPosition._id)) disabled = true
    // }


    const shouldGlow = false

    let highlight = false
    // Set selected to true if the selected task inculdes the station
    if ((!!selectedTask && (selectedTask?.load === station._id || selectedTask?.unload === station._id))) highlight = true

    // Set Color
    let color = StationTypes[station.type].color
    if (!isSelected && disabled) color = '#afb5c9' // Grey
    else if (highlight) color = '#38eb87' // Green

    // ======================================== //
    //                                          //
    //            Station Functions             //
    //                                          //
    // ======================================== //

    // Used to see if a widget Page is opened
    let params = useParams()
    useEffect(() => {
        window.addEventListener("mouseup", onSetListener)
        return () => {
            window.removeEventListener("mouseup", onSetListener)
        }

    }, [])

    const onSetListener = () => {
        setRotating(false)
        setTranslating(false)
    }


    /**
    * This runs on page load (thats mean station are mounted) and shows a widget page if it returns true.
    * If there is a station ID in the params (URL) and it matches this station,
    * and the URL (params) container a widget page then the widget page should be showing
    */
    useEffect(() => {
        if (params.stationID !== undefined && params.stationID === props.station._id && !!params.widgetPage) {
            dispatchHoverStationInfo(handleWidgetHover())
        }
    }, [])

    /**
     * Passes the X, Y, scale and ID of station to redux which is then used in widgets
     */
    const handleWidgetHover = () => {
        return handleWidgetHoverCoord(station, rd3tClassName, d3)
    }

    // Handles if URL has widget page open
    const onWidgetPageOpen = () => {
        // If widget page is open, hovering is false and the open widget page stations id matches the station ID, set it to true so
        // that the widget page doesn't disappear when mouse goes out of page
        if (!!params.widgetPage && !hovering && params.stationID === station._id) {
            setHovering(true)
            dispatchHoverStationInfo(handleWidgetHover())

        }

        // If hovering is true but there's no hoverInfo in the reducer (see widgets for when hoverInfo is set to null), set hovering to false
        else if (!isSelected && hovering && hoveringInfo === null) {
            setHovering(false)
        }
    }


    /**
     * This handles when a station is selected for a task
     * Can only add a station to a task if the station is a warehouse or a human
     *
     * For a warehouse, the thing to remember is that you push to a warehouse and pull from a warehouse
     */
    const onSetStationTask = () => {

        if (!!selectedTask) {
            if (selectedTask?.load !== null && selectedTask?.unload === null && selectedTask.load !== station._id) {
                // If it's a warehouse and the load station has been selected, then the task type has to be a push
                // You can only push to a ware house
                let type = station.type === 'warehouse' ? 'push' : 'push'

                dispatchSetTaskAttributes(selectedTask._id, { unload: station._id, type })
            } else {
                // If it's a warehouse and the load position has not been selected then the task type is a pull
                // You can only pull from a ware house
                let type = station.type === 'warehouse' ? 'pull' : 'push'

                dispatchSetTaskAttributes(selectedTask._id, { load: station._id, unload: null, type })
            }
        } else if (!!selectedProcess) {
            let newRoute = generateDefaultRoute(selectedProcess._id)
            newRoute.type = station.type === 'warehouse' ? 'push' : 'push'
            newRoute.load = station._id
            newRoute.unload = null

            dispatchSetSelectedTask(newRoute)
        }

    }

    const onMouseEnter = () => {
        // Only allow hovering if there is no selected task and mouse is not down on the map
        if (!hoveringInfo && selectedTask === null && !station.temp && !mouseDown && !editingProcess) {
            setHovering(true)

            if (!editing() && !rotating && !translating && !selectedStation && !selectedTask && !selectedProcess) {
                dispatchHoverStationInfo(handleWidgetHover())
                dispatchSetSelectedStation(station)
            }
        }
    }

    const onMouseDown = () => {
        if (!disabled) onSetStationTask()
        dispatchPageDataChanged(true)
    }

    const onTranslating = (bool) => {
        setTranslating(bool)
    }

    const onRotating = (bool) => {
        setRotating(bool)
    }

    const onMouseLeave = () => {
        setHovering(false)

    }


    return (
        <React.Fragment key={`frag-loc-${station._id}`}>
            <LocationSvg
                location={station}
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

            >

            </LocationSvg>

            {isSelected &&
                <DragEntityProto
                    isSelected={isSelected}
                    location={station}
                    rd3tClassName={rd3tClassName}
                    d3={() => d3()}

                    handleRotate={(rotation) => { dispatchSetStationAttributes(station._id, { rotation }) }}
                    handleTranslate={({ x, y }) => dispatchSetStationAttributes(station._id, { x, y })}
                    handleTranslateEnd={({ x, y }) => {
                        const pos = convertD3ToReal([x, y], props.d3)
                        dispatchSetStationAttributes(station._id, { pos_x: pos[0], pos_y: pos[1] })
                    }}

                    handleEnableDrag={() => {
                        handleEnableDrag()

                    }}
                    handleDisableDrag={() => {
                        handleDisableDrag()
                    }}


                />
            }
            {onWidgetPageOpen()}
        </React.Fragment>
    )
}

export default Station
