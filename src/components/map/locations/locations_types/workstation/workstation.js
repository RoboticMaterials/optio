import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// import Widgets from '../../../widgets/widgets'
import * as d3 from 'd3'

import * as styled from './workstation.style'

import { hoverStationInfo } from '../../../../../redux/actions/stations_actions'

function Workstation(props) {

    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    // const [hoveringID, setHoveringID] = useState('')
    const [translating, setTranslating] = useState(false)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const hoveringID = useSelector(state => state.locationsReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))

    // Used to see if a widget Page is opened
    let params = useParams()

    const color = (!!props.isSelected && props.isSelected) || (hovering && selectedTask == null) ? '#6283f0' : '#afb5c9'

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
        if(params.stationID !== undefined && params.stationID === props.location._id && !!params.widgetPage) {
            dispatchHoverStationInfo(handleWidgetHover())
        }
    }, [])

    /**
     * Passes the X, Y, scale and ID of location to redux which is then used in widgets
     * The calculations for X and Y aren't 100% working
     */
    const handleWidgetHover = () => {
        let widgetInfo = {}

        widgetInfo.id = props.location._id

        widgetInfo.heightWidth = '1'

        // Initial Ratios
        widgetInfo.yPosition = props.location.y + 140 * props.d3.scale
        widgetInfo.xPosition = props.location.x - 243
        widgetInfo.scale = props.d3.scale

        // Gets the height of the workstation
        const el = document.getElementById(`${props.rd3tClassName}-rectQ`)
        let bBox = null

        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        try {
            bBox = el.getBoundingClientRect()
        } catch (error) {
            return widgetInfo
        }

        // Stops the widget from getting to small and keeping the widget relative to the location size
        if (props.d3.scale < .8) {
            widgetInfo.scale = .8
            widgetInfo.yPosition = props.location.y + bBox.height / 2 + 100

        }

        // Stops the widget from getting to large and keeping the widget relatice to the location size
        else if (props.d3.scale > 1.3) {
            widgetInfo.scale = 1.3
            widgetInfo.yPosition = props.location.y + bBox.height / 2 + 180
        }
        return widgetInfo
    }

    // Handles if URL has widget page open 
    const handleWidgetPageOpen = () => {
        // If widget page is open, hovering is false and the open widget page locations id matches the location ID, set it to true so 
        // that the widget page doesn't disappear when mouse goes out of page
        if (!!params.widgetPage && !hovering && params.locationID === props.location._id) {
            setHovering(true)
            dispatchHoverStationInfo(handleWidgetHover())

        }

        // If hovering is true but there's no hoverInfo in the reducer (see widgets for when hoverInfo is set to null), set hovering to false
        else if (!props.isSelected && hovering && hoveringInfo === null) {
            setHovering(false)
        }
    }

    return (
        <>
            <styled.WorkstationGroup
                id={props.rd3tClassName}
                className={props.rd3tClassName}
                style={{ fill: props.color, stroke: props.color }}
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

                transform={`translate(${props.location.x},${props.location.y}) rotate(${props.location.rotation}) scale(${props.d3.scale/props.d3.imgResolution})`}
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
                        <feFlood floodColor={props.color} result="glowColor" />
                        <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                        <feMerge>
                            <feMergeNode in="softGlow_colored" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                </defs>

                <g className={`${props.rd3tClassName}-rot`} onMouseLeave={() => { if (props.isSelected == true) { setHovering(false) } }}>
                    <circle x="-20" y="-20" r="20" strokeWidth="0" fill="transparent" style={{ cursor: rotating ? "pointer" : "grab" }}></circle>
                    {props.isSelected && (hovering || rotating) &&
                        <>
                            <circle x="-20" y="-20" r="18" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }} onMouseDown={() => setRotating(true)}></circle>
                            <circle x="-18" y="-18" r="18" fill="none" strokeWidth="0.8" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                        </>
                    }
                </g>

                <g
                    className={`${props.rd3tClassName}-trans`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => {
                        setHovering(true)
                    }}
                    onMouseDown={() => setTranslating(true)}
                >
                    <rect x="-7" y="-7" rx="0" ry="0" width="14" height="14" />
                    <rect id={`${props.rd3tClassName}-rectQ`} x="-8" y="-8" rx="0.2" ry="0.2" width="16" height="16" fill="transparent" strokeWidth="1" style={{ filter: hovering && !props.isSelected && selectedTask == null ? 'url(#glow2)' : 'none' }} />
                
                </g>

            </styled.WorkstationGroup>
            {handleWidgetPageOpen()}

        </>
    )
}

export default Workstation