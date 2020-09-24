import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Import styles
import * as styled from './device_locations.style'

// Import Actions
import { hoverStationInfo } from '../../../../../redux/actions/stations_actions'

// Import Utils
import { DeviceItemTypes } from '../../../../../methods/utils/device_utils'

// Import Types
import GenericDevice from './device_types/generic_device'
import ArmDevice from './device_types/arm_device'
import RanpakTrident from './device_types/ranpak_tident'

const DeviceLocations = (props) => {

    const {
        rd3tClassName,
        location,
        isSelected,
        d3,
        color,
    } = props


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    // const [hoveringID, setHoveringID] = useState('')
    const [translating, setTranslating] = useState(false)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const hoveringID = useSelector(state => state.locationsReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)
    const devices = useSelector(state => state.devicesReducer.devices)

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))

    // Used to see if a widget Page is opened
    let params = useParams()

    // const color = (!!isSelected && isSelected) || (hovering && selectedTask == null) ? '#6283f0' : '#afb5c9'

    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })

        // if (hovering) {
        //     dispatchHoverStationInfo(handleWidgetHover())
        // }
    })

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
     * The calculations for X and Y aren't 100% working
     */
    const handleWidgetHover = () => {
        let widgetInfo = {}

        widgetInfo.id = location._id

        widgetInfo.heightWidth = '1'

        // Initial Ratios
        widgetInfo.yPosition = location.y + 140 * d3.scale
        widgetInfo.xPosition = location.x - 243
        widgetInfo.scale = d3.scale


        // Gets the height of the device
        const el = document.getElementById(`${rd3tClassName}-device`)
        let bBox = null


        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        try {
            bBox = el.getBoundingClientRect()
        } catch (error) {
            return widgetInfo
        }

        // Stops the widget from getting to0 small and keeping the widget relative to the location size
        if (d3.scale < .8) {
            widgetInfo.scale = .8
            widgetInfo.yPosition = location.y + bBox.height / 2 + 105

        }

        // Stops the widget from getting to0 large and keeping the widget relative to the location size
        else if (d3.scale > 1.3) {
            widgetInfo.scale = 1.3
            widgetInfo.yPosition = location.y + bBox.height / 2 + 150
        }
        return widgetInfo
    }

    // Handles if URL has widget page open 
    const handleWidgetPageOpen = () => {
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

    // Handles what type of svg to return based on the device model
    const handleDeviceSVG = () => {

        // This will gray out devices that arent selected. The device becomes selected either on hover in device side bar list or editing device
        let selected = true
        if (!!selectedLocation && !!selectedLocation.device_id && location.device_id !== selectedLocation.device_id) selected = false
        if (!!selectedLocation && !selectedLocation.device_id) selected = false

        const device = devices[location.device_id]

        // Sets the device type, if the device does not exits in the list of device item types, then it uses the generic device
        let deviceType = DeviceItemTypes['generic']
        if (!!DeviceItemTypes[device.device_model]) deviceType = DeviceItemTypes[device.device_model]
        else if (device.device_model === 'MiR100') deviceType = DeviceItemTypes['cart']

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
                            <path style={{ fill: `url(#${device._id})` }} d={deviceType.svgPath} />
                        </g>
                    </g>
                </svg>
            )

        } catch (error) {
            console.log('QQQQ Catching error, please fix', error)
        }
    }

    return (
        <>
            <styled.WorkstationGroup
                id={rd3tClassName}
                className={rd3tClassName}
                style={{ fill: color, stroke: color }}
                onMouseLeave={() => {
                    // Nothing here because hovering is handled in handleWidgetPageOpen
                    dispatchHoverStationInfo(null)

                }}

                onMouseEnter={() => {
                    if (!hoveringID) {
                        setHovering(true)

                        if (!rotating && !translating && selectedLocation == null && selectedTask == null) {
                            dispatchHoverStationInfo(handleWidgetHover())
                        }
                    }


                }}

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
                    {isSelected && (hovering || rotating) &&
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
                        setHovering(true)
                    }}
                    onMouseDown={() => setTranslating(true)}
                    transform='scale(.07) translate(-180,-140)'
                >

                    {handleDeviceSVG()}

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
            {handleWidgetPageOpen()}

        </>
    )

}

export default DeviceLocations