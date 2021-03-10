import { useState, useEffect } from 'react'
import * as d3 from 'd3'


const DragEntityProto = (props) => {
    const {
        isSelected,
        location,
        handleRotate,
        handleTranslate,
        handleDisableDrag,
        handleEnableDrag,
        handleTranslateEnd,
        rd3tClassName,
        // d3
    } = props

    const [rotating, setRotating] = useState(false)
    const [translating, setTranslating] = useState(false)

    useEffect(() => {
        bindDragListener()
    })

    let rotateStart = null          // Inital rotation angle
    let originalRotation = null     // Original rotation of location
    let deltaRotation = null        // Change in rotation (current angle - start angle)

    let translateStart = null       // Initial coordinates of translate
    let originalTranslation = []    // Original coordinates of location
    let deltaTranslation = []       // Change in coordinates (over course of the drag event)

    /** Callback on continuous rotate event */
    const rotate = (event, element) => {
        // console.log('QQQQ event', event)

        // Cant rotate if this location is not selected
        if (!isSelected) { return }
        if (!rotating) { setRotating(true) }

        // The angle is calculated between the current cursor location and the center of the location
        // NOTE: Im not sure why the 160 offset is neccessary. I think it might have to do with the way the menu/status bar
        // is layered.
        let angle
        if (event.sourceEvent.type === "mousemove") {    // Computer
            angle = Math.atan2(event.sourceEvent.clientY - location.y, event.sourceEvent.clientX - location.x) * 180 / Math.PI
        } else if (event.sourceEvent.type === "touchmove") { // Tablet
            angle = Math.atan2(event.sourceEvent.touches[0].clientY - location.y, event.sourceEvent.touches[0].clientX - location.x) * 180 / Math.PI
        }

        // Keep track of BOTH the initial rotation of the position, and the start angle of the drag
        if (rotateStart == null) {
            originalRotation = location.rotation
            rotateStart = angle
        }
        // The delta is the current angle - the start angle (round to nearest 5th degree or nearest 45 degree)
        deltaRotation = angle - rotateStart
        if (Math.abs(deltaRotation % 45) < 5) {
            deltaRotation = Math.round(deltaRotation / 45) * 45
        } else {
            deltaRotation = Math.round(deltaRotation / 10) * 10
        }

        // Callback passed from props to set the appropriate location atttribute
        handleRotate(originalRotation + deltaRotation)
    }

    const rotateEnd = () => {
        // Effectivly clears the rotate event
        rotateStart = null
    }

    const translate = (event, element) => {

        // Cant move location if the location isnt selected
        if (!isSelected) { return }
        if (!translating) { setTranslating(true) }

        // Set the translation based on the event
        let translation = []
        if (event.sourceEvent.type === "mousemove") {    // Computer
            translation = [event.sourceEvent.clientX, event.sourceEvent.clientY]
        } else if (event.sourceEvent.type === "touchmove") { // Tablet
            translation = [event.sourceEvent.touches[0].clientX, event.sourceEvent.touches[0].clientY]
        }

        // Keep track of the initial positon coords and the start coords of the event
        if (translateStart == null) {
            translateStart = translation
            originalTranslation = [location.x, location.y]
        }
        // Calculate the change in translation relative to the start coordinates (round to nearest 5th pixel)
        deltaTranslation[0] = Math.round((translation[0] - translateStart[0]) / 5) * 5
        deltaTranslation[1] = Math.round((translation[1] - translateStart[1]) / 5) * 5

        // Callback to set the appropriate location attributes
        handleTranslate({ x: originalTranslation[0] + deltaTranslation[0], y: originalTranslation[1] + deltaTranslation[1] })
    }

    const translateEnd = () => {
        translateStart = null
    }

    /* translateStart = nullconvertRealToD3
     * Bind the listener that will listen for events that are made directly to this element
     */
    const bindDragListener = () => {

        const mainElement = d3.select(`.${rd3tClassName}`)
        const ringElement = d3.select(`.${rd3tClassName}-rot`)
        const rectElement = d3.select(`.${rd3tClassName}-trans`)

        // Define drag callbacks for dragging the ring (which rotates the location)
        ringElement.call(
            d3.behavior.drag()
                .on("dragstart", () => {
                    if (isSelected) {
                        handleDisableDrag()
                    }
                })
                .on("drag", function (d, i) {
                    if (isSelected) {
                        rotate(d3.event, mainElement)
                    }
                })
                .on("dragend", () => {
                    if (isSelected) {
                        rotateEnd()
                        handleEnableDrag()
                        setRotating(false)
                    }
                })
        )

        // Define drag callbacks for the element itself (which translates location)
        rectElement.call(
            d3.behavior.drag()
                .on("dragstart", () => {
                    if (isSelected) {
                        handleDisableDrag()
                    }
                })
                .on("drag", function (d, i) {
                    if (isSelected) {
                        translate(d3.event, mainElement)
                    }
                })
                .on("dragend", async () => {
                    if (isSelected) {
                        handleTranslateEnd({ x: originalTranslation[0] + deltaTranslation[0], y: originalTranslation[1] + deltaTranslation[1] })
                        translateEnd()
                        handleEnableDrag()
                        setTranslating(false)
                    }
                })
        )
    }

    return (null)
}

export default DragEntityProto