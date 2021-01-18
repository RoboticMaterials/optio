import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import * as styled from './station.style'

// Import actions
import { hoverStationInfo } from '../../../../../redux/actions/widget_actions'
import { selectLocation, deselectLocation } from '../../../../../redux/actions/locations_actions'
import { setTaskAttributes } from '../../../../../redux/actions/tasks_actions'

// Import Utils
import { DeviceItemTypes } from '../../../../../methods/utils/device_utils'
import { LocationTypes, handleWidgetHoverCoord } from '../../../../../methods/utils/locations_utils'
import { deepCopy } from '../../../../../methods/utils/utils'

function Station(props) {


    const {
        rd3tClassName,
        location,
        isSelected,
        d3,
        color,
    } = props


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const hoveringID = useSelector(state => state.locationsReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverStationInfo)
    const devices = useSelector(state => state.devicesReducer.devices)
    const editing = useSelector(state => state.locationsReducer.editingLocation)


    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchSelectLocation = (locationId) => dispatch(selectLocation(locationId))
    const dispatchSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))

    // Used to see if a widget Page is opened
    let params = useParams()
    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        return () => {
            window.removeEventListener("mouseup", () => { setRotating(false); setTranslating(false) })
        }

    }, [])

    /**
    * This runs on page load (thats mean location are mounted) and shows a widget page if it returns true.
    * If there is a station ID in the params (URL) and it matches this location,
    * and the URL (params) container a widget page then the widget page should be showing
    */
    useEffect(() => {
        if (params.stationID !== undefined && params.stationID === props.location._id && !!params.widgetPage) {
            dispatchHoverStationInfo(handleWidgetHover())
        }
    }, [])

    /**
     * Passes the X, Y, scale and ID of location to redux which is then used in widgets
     */
    const handleWidgetHover = () => {

        return handleWidgetHoverCoord(location, rd3tClassName, d3)

    }

    // Handles if URL has widget page open
    const onWidgetPageOpen = () => {
        // If widget page is open, hovering is false and the open widget page locations id matches the location ID, set it to true so
        // that the widget page doesn't disappear when mouse goes out of page
        if (!!params.widgetPage && !hovering && params.locationID === location._id) {
            setHovering(true)
            dispatchHoverStationInfo(handleWidgetHover())

        }

        // If hovering is true but there's no hoverInfo in the reducer (see widgets for when hoverInfo is set to null), set hovering to false
        else if (!isSelected && hovering && hoveringInfo === null) {
            setHovering(false)
        }
    }

    const shouldGlow = hovering && !props.isSelected && selectedTask == null

    // Handles what type of svg to return based on the device model
    const onDeviceSVG = () => {

        // This will gray out devices that arent selected. The device becomes selected either on hover in device side bar list or editing device
        let selected = true
        if (!!selectedLocation && !!selectedLocation.device_id && location.device_id !== selectedLocation.device_id) selected = false
        if (!!selectedLocation && !selectedLocation.device_id) selected = false

        let device = {}
        try {
            device = devices[location.device_id]

        } catch (error) {
            console.log('Device is undefined and I dont know why...')
            return (<></>)
        }

        // Sets the device type, if the device does not exits in the list of device item types, then it uses the generic device
        let deviceType = DeviceItemTypes['generic']
        try {

            if (!!device && !!device.device_model && !!DeviceItemTypes[device.device_model]) deviceType = DeviceItemTypes[device.device_model]
            else if (device.device_model === 'MiR100') deviceType = DeviceItemTypes['cart']

        } catch (error) {
            console.log('QQQQ error', device)
            throw 'Get Kalervo and show him the console logs'

        }

        try {
            return (

                <svg xmlns="http://www.w3.org/2000/svg" id={`${rd3tClassName}-device`}>
                    <defs>
                        <linearGradient id={device._id} x1="72.95" y1="153" x2="287.05" y2="153" gradientUnits="userSpaceOnUse">
                            <stop offset="0" style={{ stopColor: deviceType.startGradientColor }} />
                            <stop offset="1" style={{ stopColor: deviceType.stopGradientColor }} />
                        </linearGradient>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                            <rect fill='#4d4d4d' width="360" height="240" rx="30" />
                            <path style={{ fill: !selected ? 'gray' : `url(#${device._id})` }} d={deviceType.svgPath} />
                        </g>
                    </g>
                </svg>
            )

        } catch (error) {
            console.log('Catching error, please fix', error)
        }
    }

    /**
     * Handles SVG for normal stations
     */
    const onStationSVG = () => {

        return (
            <svg id={`${rd3tClassName}-station`} x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" style={{ filter: shouldGlow ? 'url(#glow2)' : 'none' }}>

                {LocationTypes[location.type].svgPath}
            </svg>

        )
    }

    /**
     * This handles when a station is selected for a task
     * Can only add a station to a task if the station is a warehouse or a human
     *
     * For a warehouse, the thing to remember is that you push to a warehouse and pull from a warehouse
     */
    const onSetStationTask = () => {

        // Make sure there is a selected task and that its a station type you can assign a task too
        if (selectedTask !== null && (location.type === 'human' || location.type === 'warehouse')) {

            // Commented out for now
            // // If there's a selected process and the process has routes and the station is not selected, then disable it from being selected
            // if (!!selectedProcess && selectedProcess.routes.length > 0 && !isSelected) return

            // If the load location has been defined but the unload position hasnt, assign the unload position
            if (selectedTask.load.position !== null && selectedTask.unload.position === null) {
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type

                // If it's a station then set hadnoff to true
                let handoff = selectedTask.handoff
                handoff = true

                // Since it's a station, set both the position and station to the location ID
                unload.position = location._id
                unload.station = location._id

                // If it's a warehouse and the load station has been selected, then the task type has to be a push
                // You can only push to a ware house
                type = location.type === 'warehouse' ? 'push' : type

                // if (location.parent !== null) {
                //     unload.station = location._id
                // } else {
                //     type = 'push'
                // }
                console.log('QQQQ Setting task in station', selectedTask)
                dispatchSetTaskAttributes(selectedTask._id, { unload, type, handoff })
            }

            // Otherwise assign the load position and clear the unload position (to define a new unload)
            else {
                console.log('QQQQ Setting task in station', selectedTask)
                let load = deepCopy(selectedTask.load)
                let unload = deepCopy(selectedTask.unload)
                let type = selectedTask.type

                // If it's a station then set hadnoff to true
                let handoff = selectedTask.handoff
                handoff = true

                // Since it's a station, set both the position and station to the location ID
                load.position = location._id
                load.station = location._id

                // If it's a warehouse and the load position has not been selected then the task type is a pull
                // You can only pull from a ware house
                type = location.type === 'warehouse' ? 'pull' : type

                // if (location.parent !== null) {
                //     load.station = location._id
                // } else {
                //     type = 'pull'
                // }
                unload.position = null
                unload.station = null
                dispatchSetTaskAttributes(selectedTask._id, { load, unload, type, handoff })
            }
        }
    }

    return (
        <>
            <styled.WorkstationGroup
                id={rd3tClassName}
                className={rd3tClassName}
                style={{ fill: color, stroke: color }}
                onMouseEnter={() => {

                    // Only allow hovering if there is no selected task
                    if (!hoveringID && selectedTask === null) {
                        setHovering(true)

                        if (!rotating && !translating && selectedLocation == null && selectedTask == null) {
                            dispatchHoverStationInfo(handleWidgetHover())
                            dispatchSelectLocation(location._id)
                        }
                    }
                }
                }
                onMouseDown={() => {
                    onSetStationTask()
                }}
                // onClick={() => {
                //     console.log('Station clicked')
                // }}

                transform={`translate(${location.x},${location.y}) rotate(${location.rotation}) scale(${d3.scale / d3.imgResolution})`}
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

                    <filter id="glow2" height="300%" width="300%" x="-75%" y="-75%">
                        <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />
                        <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
                        <feFlood floodColor={color} result="glowColor" />
                        <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                        <feMerge>
                            <feMergeNode in="softGlow_colored" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                </defs>

                <g className={`${rd3tClassName}-rot`} onMouseLeave={() => { if (isSelected == true) { setHovering(false) } }}>
                    <circle x="-20" y="-20" r="20" strokeWidth="0" fill="transparent" style={{ cursor: rotating ? "pointer" : "grab" }}></circle>
                    {isSelected && (hovering || rotating) && hoveringInfo === null &&
                        <>
                            <circle x="-20" y="-20" r="18" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }} onMouseDown={() => setRotating(true)}></circle>
                            <circle x="-18" y="-18" r="18" fill="none" strokeWidth="0.8" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                        </>
                    }
                </g>

                <g
                    className={`${rd3tClassName}-trans`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => {

                        // Only allow hovering if there is no selected task
                        if (selectedTask === null) {
                            setHovering(true)

                        }
                    }}
                    onMouseDown={() => setTranslating(true)}
                    // onClick={() => {
                    //     console.log('Station clicked')
                    // }}
                    transform={location.type === 'device' && 'scale(.07) translate(-180,-140)'}
                >

                    {location.type === 'device' ?
                        onDeviceSVG()

                        :
                        onStationSVG()
                    }

                </g>

                {/* TODO: Commented out, this is just for reference to make sure that the devices are showing up in the correct space */}
                {/* <g
                    className={`${rd3tClassName}-trans`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => {
                        setHovering(true)
                    }}
                    onMouseDown={() => setTranslating(true)}
                    // transform="translate(-13.7,-92)"
                    // transform='scale(.07) translate(-13.7,-92)'
                >
                    <rect id={`${rd3tClassName}-rectQ`} x="-8" y="-8" rx="0.2" ry="0.2" width="16" height="16" fill="transparent" strokeWidth="1" style={{ filter: hovering && !isSelected && selectedTask == null ? 'url(#glow2)' : 'none' }} />

                </g> */}

            </styled.WorkstationGroup>
            {onWidgetPageOpen()}

        </>
    )

}

export default Station
