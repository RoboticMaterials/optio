import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import locations
import Position from './locations_types/position/position'
import Station from './locations_types/station/station'

import * as d3 from 'd3'
import uuid from 'uuid';

// Import Actions
import { setPositionAttributes } from '../../../redux/actions/positions_actions'
import { setStationAttributes } from '../../../redux/actions/stations_actions'

// Import Utils
import { convertD3ToReal, convertRealToD3, getRelativeD3, getRelativeOffset } from '../../../methods/utils/map_utils'

// Import Constants
import { StationTypes } from '../../../constants/station_constants'
import { PositionTypes } from '../../../constants/position_constants'

// Import Components
import DragEntityProto from './drag_entity_proto'

import { select } from 'd3'

/**
 * This functional component binds the position functionality to a group of SVG elements.
 * This serves as a modular way to define these callbacks, making it easier to add new elements
 * to the map that have the same functionality as any other position.
 *
 */
// const DragEntityProto = (props) => {

//     const [rotating, setRotating] = useState(false)
//     const [translating, setTranslating] = useState(false)

//     const currentMap = useSelector(state => state.mapReducer.currentMap)

//     useEffect(() => {
//         bindDragListener()
//     })

//     let rotateStart = null          // Inital rotation angle
//     let originalRotation = null     // Original rotation of location
//     let deltaRotation = null        // Change in rotation (current angle - start angle)

//     let translateStart = null       // Initial coordinates of translate
//     let originalTranslation = []    // Original coordinates of location
//     let deltaTranslation = []       // Change in coordinates (over course of the drag event)

//     /** Callback on continuous rotate event */
//     const rotate = (event, element) => {

//         // Cant rotate if this location is not selected
//         if (!props.isSelected) { return }
//         if (!rotating) { setRotating(true) }

//         // The angle is calculated between the current cursor location and the center of the location
//         // NOTE: Im not sure why the 160 offset is neccessary. I think it might have to do with the way the menu/status bar
//         // is layered.
//         let angle
//         if (event.sourceEvent.type == "mousemove") {    // Computer
//             // For some reason, position rotation is mapped backwards
//             if (props.location.schema === 'position' || props.location.schema === 'positions') {
//                 angle = - Math.atan2(event.sourceEvent.clientY - props.location.y, event.sourceEvent.clientX - props.location.x) * 180 / Math.PI
//             }
//             else {
//                 angle = Math.atan2(event.sourceEvent.clientY - props.location.y, event.sourceEvent.clientX - props.location.x) * 180 / Math.PI
//             }
//         } else if (event.sourceEvent.type == "touchmove") { // Tablet
//             if (props.location.schema === 'position') {
//                 angle = - Math.atan2(event.sourceEvent.touches[0].clientY - props.location.y, event.sourceEvent.touches[0].clientX - props.location.x) * 180 / Math.PI
//             }
//             else {
//                 angle = Math.atan2(event.sourceEvent.touches[0].clientY - props.location.y, event.sourceEvent.touches[0].clientX - props.location.x) * 180 / Math.PI
//             }
//         }

//         // Keep track of BOTH the initial rotation of the position, and the start angle of the drag
//         if (rotateStart == null) {
//             originalRotation = props.location.rotation
//             rotateStart = angle
//         }
//         // The delta is the current angle - the start angle (round to nearest 5th degree or nearest 45 degree)
//         deltaRotation = angle - rotateStart
//         if (Math.abs(deltaRotation % 45) < 5) {
//             deltaRotation = Math.round(deltaRotation / 45) * 45
//         } else {
//             deltaRotation = Math.round(deltaRotation / 10) * 10
//         }

//         // Callback passed from props to set the appropriate location atttribute
//         props.onRotate(originalRotation + deltaRotation)
//     }

//     const rotateEnd = () => {
//         // Effectivly clears the rotate event
//         rotateStart = null
//     }

//     const translate = (event, element) => {

//         // Cant move location if the location isnt selected
//         if (!props.isSelected) { return }
//         if (!translating) { setTranslating(true) }

//         // Set the translation based on the event
//         let translation = []
//         if (event.sourceEvent.type == "mousemove") {    // Computer
//             translation = [event.sourceEvent.clientX, event.sourceEvent.clientY]
//         } else if (event.sourceEvent.type == "touchmove") { // Tablet
//             translation = [event.sourceEvent.touches[0].clientX, event.sourceEvent.touches[0].clientY]
//         }

//         // Keep track of the initial positon coords and the start coords of the event
//         if (translateStart == null) {
//             translateStart = translation
//             originalTranslation = [props.location.x, props.location.y]
//         }
//         // Calculate the change in translation relative to the start coordinates (round to nearest 5th pixel)
//         deltaTranslation[0] = Math.round((translation[0] - translateStart[0]) / 5) * 5
//         deltaTranslation[1] = Math.round((translation[1] - translateStart[1]) / 5) * 5

//         // Callback to set the appropriate location attributes
//         props.onTranslate({ x: originalTranslation[0] + deltaTranslation[0], y: originalTranslation[1] + deltaTranslation[1] })
//     }

//     const translateEnd = () => {
//         translateStart = null
//     }

//     /* translateStart = nullconvertRealToD3
//      * Bind the listener that will listen for events that are made directly to this element
//      */
//     const bindDragListener = () => {

//         const mainElement = d3.select(`.${props.rd3tClassName}`)
//         const ringElement = d3.select(`.${props.rd3tClassName}-rot`)
//         const rectElement = d3.select(`.${props.rd3tClassName}-trans`)

//         // Define drag callbacks for dragging the ring (which rotates the location)
//         ringElement.call(
//             d3.behavior.drag()
//                 .on("dragstart", () => {
//                     if (props.isSelected) {
//                         props.onDisableDrag()
//                     }
//                 })
//                 .on("drag", function (d, i) {
//                     if (props.isSelected) {
//                         rotate(d3.event, mainElement)
//                     }
//                 })
//                 .on("dragend", () => {
//                     if (props.isSelected) {
//                         rotateEnd()
//                         props.onEnableDrag()
//                         setRotating(false)
//                     }
//                 })
//         )

//         // Define drag callbacks for the element itself (which translates location)
//         rectElement.call(
//             d3.behavior.drag()
//                 .on("dragstart", () => {
//                     if (props.isSelected) {
//                         props.onDisableDrag()
//                     }
//                 })
//                 .on("drag", function (d, i) {
//                     if (props.isSelected) {
//                         translate(d3.event, mainElement)
//                     }
//                 })
//                 .on("dragend", async () => {
//                     if (props.isSelected) {
//                         props.onTranslateEnd({ x: originalTranslation[0] + deltaTranslation[0], y: originalTranslation[1] + deltaTranslation[1] })
//                         translateEnd()
//                         props.onEnableDrag()
//                         setTranslating(false)
//                     }
//                 })
//         )
//     }

//     return (null)
// }




/**
 * Rendered location on the map. Each location is either a STATION or a POSITION (cart position).
 * If the location is a STATION then it can have POSTIONS associated with it (cart or shelf position)
 *
 * @param {object} props
 */
const Location = (props) => {

    let {
        location,
        rd3tClassName,
        d3,
        onEnableDrag,
        onDisableDrag,
    } = props

    const dispatch = useDispatch()
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setPositionAttributes(id, attr))

    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    //const [showSideBar, setShowSideBar] = useState(false)


    // Is this location selected, or is it's parent selected
    let isSelected =
        selectedTask === null ?
            (
                !!selectedLocation && selectedLocation._id == location._id
                ||
                !!location.parent && !!selectedLocation && selectedLocation._id == location._id
                ||
                !!location.parent && !!selectedLocation && selectedLocation._id == location.parent
            )
            :
            !!selectedProcess &&
            (
                !!selectedLocation && selectedLocation._id == location._id
                ||
                !!location.parent && !!selectedLocation && selectedLocation._id == location._id
                ||
                !!location.parent && !!selectedLocation && selectedLocation._id == location.parent
            )

    let pos

    let color = '#6283f0' // Blue

    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes
    }

    // Try catch for unknown location types
    try {
        color = LocationTypes[location.type].color

    } catch (error) {
        color = '#6283f0' // Blue
    }

    if (selectedTask === null) {
        if (selectedLocation !== null && !isSelected && selectedTask === null) {
            color = '#afb5c9' // Grey
        }
    }

    else if (!!selectedProcess) {
        if (selectedLocation !== null && !isSelected) {
            color = '#afb5c9' // Grey
        }
    }

    // If load is undefined, then its a simple move
    else if (selectedTask.load === undefined) {
        color = '#afb5c9' // Grey
    }

    else {
        if (selectedTask.load.station == location._id || selectedTask.load.position == location._id
            || selectedTask.unload.station == location._id || selectedTask.unload.position == location._id) {
            color = '#38eb87' // Green
        }
    }

    const handleRenderedLocations = useMemo(() => {

        // TODO: Temp fix for now
        // Hides locations that should have parents, but they're parents are deleted
        if (!!location.parent && (stations[location.parent] === undefined || stations[location.parent].x === undefined)) {
            return null
        }

        switch (location.type) {
            case 'workstation':
            case 'device':
            case 'warehouse':
            case 'human':
                return (
                    <React.Fragment key={`frag-loc-${location._id}`}>
                        <Station isSelected={isSelected} color={color} {...props} />
                        <DragEntityProto isSelected={isSelected} {...props}
                            onRotate={(rotation) => {
                                dispatchSetStationAttributes(location._id, { rotation })
                            }}
                            onTranslate={({ x, y }) => dispatchSetStationAttributes(location._id, { x, y })}
                            onTranslateEnd={({ x, y }) => {
                                pos = convertD3ToReal([x, y], props.d3)
                                dispatchSetStationAttributes(location._id, { pos_x: pos[0], pos_y: pos[1] })
                            }}
                        />
                    </React.Fragment>
                )

            case 'cart_position':
            case "human_position":
            case 'shelf_position':
            case 'charger_position':

                return (
                    <React.Fragment key={`frag-loc-${location._id}`}>
                        {location.parent !== null && location.parent !== undefined && location.parent.length > 0 &&
                            <line x1={`${location.x}`} y1={`${location.y}`}
                                x2={`${stations[location.parent].x}`} y2={`${stations[location.parent].y}`}
                                stroke={color} strokeWidth="1.4" shape-rendering="geometricPrecision" style={{ opacity: '0.3', }} />
                        }
                        <Position isSelected={isSelected} color={color} {...props} />
                        <DragEntityProto isSelected={isSelected} {...props}
                            onRotate={(rotation) => {
                                dispatchSetPositionAttributes(location._id, { rotation })
                            }}
                            onTranslate={({ x, y }) => {
                                dispatchSetPositionAttributes(location._id, { x, y })
                            }}
                            onTranslateEnd={({ x, y }) => {
                                pos = convertD3ToReal([x, y], props.d3)
                                dispatchSetPositionAttributes(location._id, { pos_x: pos[0], pos_y: pos[1] })
                            }}
                        />
                    </React.Fragment>
                )

            case 'cart_entry_position':
            case 'shelf_entry_position':
            case 'charger_entry_position':
            case 'other':
                // TODO: Currently returning nothing for entry positions, eventually entry positions should be editable
                return (
                    <>
                    </>
                )



            default:
                throw "Nothing is returned from render because a location has a 'type' that does not match the available types. Make sure all locations have valid types"
        }

    }, [locations, selectedLocation, selectedProcess, selectedTask])


    return (
        <>
            {handleRenderedLocations}
        </>
    )
}

export default Location
