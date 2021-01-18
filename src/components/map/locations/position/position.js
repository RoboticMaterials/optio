import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'


// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { handleWidgetHoverCoord } from '../../../../methods/utils/locations_utils'

// Import Constants
import { PositionTypes } from '../../../../constants/position_constants'

// Import Actions
import { setTaskAttributes } from '../../../../redux/actions/tasks_actions'
import { hoverStationInfo } from '../../../../redux/actions/stations_actions'
import { setSelectedPosition } from '../../../../redux/actions/positions_actions'

function Position(props) {

    const {
        color,
        d3,
        isSelected,
        position,
        onDisableDrag,
        onEnableDrag,
        rd3tClassName,
    } = props


    const [hovering, setHovering] = useState(false)
    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    const dispatch = useDispatch()
    const dispatchSetTaskAttributes = (id, load) => dispatch(setTaskAttributes(id, load))
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const hoveringID = useSelector(state => state.locationsReducer.hoverLocationID)
    const hoveringInfo = useSelector(state => state.locationsReducer.hoverStationInfo)

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

    // Tells the position to glow
    const shouldGlow = selectedTask !== null &&
        ((selectedTask.load.position == position._id && selectedTask.type == 'push') ||
            (selectedTask.unload.position == position._id && selectedTask.type == 'pull') ||
            (selectedTask.load.position == position._id && selectedTask.type == 'both') ||
            (selectedTask.unload.position == position._id && selectedTask.type == 'both'))

    return (
        <g
            className={rd3tClassName}
            style={{ fill: color, stroke: color, strokeWidth: '0', opacity: '0.8', cursor: "pointer" }}
            onMouseEnter={() => {
                // Only hover if there is no selected task
                if (selectedTask === null) {
                    setHovering(true)
                    if (!rotating && !translating && selectedPosition === null && selectedTask === null) {
                        dispatchHoverStationInfo(handleWidgetHover())
                        dispatchSetSelectedPosition(position)

                    }
                }

            }}
            onMouseLeave={() => { position.name !== 'TempRightClickMovePosition' && setHovering(false) }}
            onMouseDown={() => {
                onSetPositionTask()

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
                onMouseDown={() => {
                    setTranslating(true)
                }}

                onMouseUp={() => {
                    setTranslating(false)
                }}

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
