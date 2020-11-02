import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Utils
import { deepCopy } from '../../../../../methods/utils/utils'
import { LocationTypes } from '../../../../../methods/utils/locations_utils'

// Import Actions
import { setTaskAttributes } from '../../../../../redux/actions/tasks_actions'
import { hoverStationInfo } from '../../../../../redux/actions/stations_actions'
import { selectLocation, deselectLocation } from '../../../../../redux/actions/locations_actions'


// Import Utils
import { handleWidgetHoverCoord } from '../../../../../methods/utils/locations_utils'


const Position = (props) => {

    const {
        color,
        d3,
        isSelected,
        location,
        onDisableDrag,
        onEnableDrag,
        rd3tClassName,
    } = props

    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const dispatch = useDispatch()
    const onSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onSelectLocation = (locationId) => dispatch(selectLocation(locationId))

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const hoveringID = useSelector(state => state.locationsReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)


    useEffect(() => {
        window.addEventListener("mouseup", () => { setRotating(false); setTranslating(false) })

        return () => {
            // window.removeEventListener("mousup", disableDrag)
        }
    })

    // Automatically opens widget pages and sets hovering to true in the location is a temp right click
    useEffect(() => {
        if(location !== null && location.name === 'TempRightClickMoveLocation'){
            setHovering(true)
            dispatchHoverStationInfo(handleWidgetHover())
            onSelectLocation(location._id)
        }
    }, [])

    /**
    * Passes the X, Y, scale and ID of location to redux which is then used in widgets
    */
    const handleWidgetHover = () => {

        return handleWidgetHoverCoord(location, rd3tClassName, d3)

    }

    const shouldGlow = selectedTask !== null &&
        ((selectedTask.load.position == location._id && selectedTask.type == 'push') ||
            (selectedTask.unload.position == location._id && selectedTask.type == 'pull') ||
            (selectedTask.load.position == location._id && selectedTask.type == 'both') ||
            (selectedTask.unload.position == location._id && selectedTask.type == 'both'))

    return (
        <g
            className={rd3tClassName}
            style={{ fill: color, stroke: color, strokeWidth: '0', opacity: '0.8', cursor: "pointer" }}
            onMouseEnter={() => {
                setHovering(true)
                if (!rotating && !translating && selectedLocation == null && selectedTask == null) {
                    dispatchHoverStationInfo(handleWidgetHover())
                    onSelectLocation(location._id)
                }
            }}
            onMouseLeave={() => { location.name !== 'TempRightClickMoveLocation' && setHovering(false) }}
            onClick={() => {
                if (selectedTask !== null) {
                    // If the load location has been defined but the unload position hasnt, assign the unload position
                    if (selectedTask.load.position !== null && selectedTask.unload.position === null) {
                        let unload = deepCopy(selectedTask.unload)
                        let type = selectedTask.type
                        unload.position = location._id
                        if (location.parent !== null) {
                            unload.station = location.parent
                        } else {
                            type = 'push'
                        }
                        onSetTaskAttributes(selectedTask._id.$oid, { unload, type })
                    } else { // Otherwise assign the load position and clear the unload position (to define a new unload)
                        let load = deepCopy(selectedTask.load)
                        let unload = deepCopy(selectedTask.unload)
                        let type = selectedTask.type
                        load.position = location._id
                        if (location.parent !== null) {
                            load.station = location.parent
                        } else {
                            type = 'pull'
                        }
                        unload.position = null
                        unload.station = null
                        onSetTaskAttributes(selectedTask._id.$oid, { load, unload, type })
                    }
                }
            }}
            transform={`translate(${location.x},${location.y}) rotate(${360 - location.rotation}) scale(${d3.scale / d3.imgResolution})`}
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
                {/* Only show rotating when editing or its a right click location */}
                {isSelected && (hovering || rotating) && (hoveringInfo === null || location.name === 'TempRightClickMoveLocation') &&
                    <>
                        <circle x="-16" y="-16" r="16" strokeWidth="0" fill="transparent" style={{ cursor:  "pointer"  }}></circle>
                        <circle x="-18" y="-18" r="14" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }} onMouseDown={() => setRotating(true)}></circle>
                        <circle x="-14" y="-14" r="14" fill="none" strokeWidth="0.6" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                    </>
                }
            </g>

            <g className={`${rd3tClassName}-trans`} id={`${rd3tClassName}-trans`} transform={"scale(1, 1)", location.type === 'shelf_position' && "rotate(90)"} onMouseDown={() => setTranslating(true)}>


                <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" style={{ filter: shouldGlow && `url(#glow-${rd3tClassName})` }}>

                    {location.type === 'cart_position' ?
                        LocationTypes['cartPosition'].svgPath
                        :
                        location.type === 'charger_position' ?
                            LocationTypes['chargePosition'].svgPath
                            :
                            LocationTypes['shelfPosition'].svgPath
                    }


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