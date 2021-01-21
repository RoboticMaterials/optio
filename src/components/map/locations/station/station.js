import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import * as styled from './station.style'

// Import actions
import { hoverStationInfo } from '../../../../redux/actions/widget_actions'
import { setSelectedStation, setStationAttributes } from '../../../../redux/actions/stations_actions'
import { setTaskAttributes } from '../../../../redux/actions/tasks_actions'

// Import Utils
import { handleWidgetHoverCoord } from '../../../../methods/utils/widget_utils'
import { deepCopy } from '../../../../methods/utils/utils'
import { convertD3ToReal } from '../../../../methods/utils/map_utils'
import { editing } from '../../../../methods/utils/locations_utils'

// Import Constants
import { StationTypes } from '../../../../constants/station_constants'

// Import Components
import LocationSvg from '../location_svg/location_svg'
import DragEntityProto from '../drag_entity_proto'

function Station(props) {


    const {
        station,
        rd3tClassName,
        d3,
        handleEnableDrag,
        handleDisableDrag,
    } = props


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))

    const isSelected = !!selectedStation && selectedStation._id === station._id
    const shouldGlow = hovering && !isSelected && selectedTask == null

    // Set Color
    let color = StationTypes[station.type].color
    if (!isSelected && !!selectedStation) color = '#afb5c9' // Grey
    else if (isSelected) color = '#38eb87' // Green

    // Used to see if a widget Page is opened
    let params = useParams()
    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        return () => {
            window.removeEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        }

    }, [])


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

        // Make sure there is a selected task and that its a station type you can assign a task too
        if (selectedTask !== null && (station.type === 'human' || station.type === 'warehouse')) {

            // Commented out for now
            // // If there's a selected process and the process has routes and the station is not selected, then disable it from being selected
            // if (!!selectedProcess && selectedProcess.routes.length > 0 && !isSelected) return

            // If the load station has been defined but the unload position hasnt, assign the unload position
            if (selectedTask.load.position !== null && selectedTask.unload.position === null) {
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type

                // If it's a station then set hadnoff to true
                let handoff = selectedTask.handoff
                handoff = true

                // Since it's a station, set both the position and station to the station ID
                unload.position = station._id
                unload.station = station._id

                // If it's a warehouse and the load station has been selected, then the task type has to be a push
                // You can only push to a ware house
                type = station.type === 'warehouse' ? 'push' : type

                // if (station.parent !== null) {
                //     unload.station = station._id
                // } else {
                //     type = 'push'
                // }
                dispatchSetTaskAttributes(selectedTask._id, { unload, type, handoff })
            }

            // Otherwise assign the load position and clear the unload position (to define a new unload)
            else {
                let load = deepCopy(selectedTask.load)
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type

                // If it's a station then set hadnoff to true
                let handoff = selectedTask.handoff
                handoff = true

                // Since it's a station, set both the position and station to the station ID
                load.position = station._id
                load.station = station._id

                // If it's a warehouse and the load position has not been selected then the task type is a pull
                // You can only pull from a ware house
                type = station.type === 'warehouse' ? 'pull' : type

                // if (station.parent !== null) {
                //     load.station = station._id
                // } else {
                //     type = 'pull'
                // }
                unload.position = null
                unload.station = null
                dispatchSetTaskAttributes(selectedTask._id, { load, unload, type, handoff })
            }
        }
    }

    const onMouseEnter = () => {
        // Only allow hovering if there is no selected task
        if (!hoveringInfo && selectedTask === null && !station.temp) {
            setHovering(true)

            if (!editing() && !rotating && !translating && !selectedStation && !selectedTask) {
                dispatchHoverStationInfo(handleWidgetHover())
                dispatchSetSelectedStation(station)
            }
        }
    }

    const onMouseDown = () => {
        onSetStationTask()
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

            />

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
            {onWidgetPageOpen()}
        </React.Fragment>
    )
}

export default Station
