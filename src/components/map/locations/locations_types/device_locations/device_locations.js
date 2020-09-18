import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Import styles
import * as styled from './device_locations.style'

// Import Actions
import { hoverStationInfo } from '../../../../../redux/actions/stations_actions'

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

    // console.log('QQQQ props of workstaion', props)


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


        // Gets the height of the workstation
        const el = document.getElementById(`${rd3tClassName}-device`)
        let bBox = null


        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        // TODO: Not currently working with these svgs....
        try {
            bBox = el.getBBox()
        } catch (error) {
            return widgetInfo
        }

        console.log('QQQQ BBOx',bBox.height)

        // Stops the widget from getting to small and keeping the widget relative to the location size
        if (d3.scale < .8) {
            widgetInfo.scale = .8
            widgetInfo.yPosition = location.y + bBox.height / 2 + 100
            // widgetInfo.yPosition = location.y + 100

        }

        // Stops the widget from getting to large and keeping the widget relatice to the location size
        else if (d3.scale > 1.3) {
            widgetInfo.scale = 1.3
            widgetInfo.yPosition = location.y + bBox.height / 2 + 180
            // widgetInfo.yPosition = location.y + 180
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

    const handleDeviceSVG = () => {

        try {

            if (devices[location.device_id].device_model === 'MiR100') {
                return <ArmDevice customClassName={rd3tClassName} />
            }
            else return <GenericDevice customClassName={rd3tClassName} />
        } catch (error) {

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
                    transform='scale(.07) translate(-180,-100)'
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