import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { deepCopy } from '../../../../../methods/utils/utils'
import * as taskActions from '../../../../../redux/actions/tasks_actions'

function CartPosition(props) {

    const [hovering, setHovering] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [disableDrag] = useState(() => setDragging(false))

    const dispatch = useDispatch()
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)


    useEffect(() => {
        window.addEventListener("mouseup", disableDrag)

        return function cleanup() {
            window.removeEventListener("mousup", disableDrag)
        }
    })

    const shouldGlow = selectedTask !== null &&
        ((selectedTask.load.position == props.location._id && selectedTask.type == 'push') ||
            (selectedTask.unload.position == props.location._id && selectedTask.type == 'pull') ||
            (selectedTask.load.position == props.location._id && selectedTask.type == 'both') ||
            (selectedTask.unload.position == props.location._id && selectedTask.type == 'both'))

    return (
        <g
            className={props.rd3tClassName}
            style={{ fill: props.color, stroke: props.color, strokeWidth: '0', opacity: '0.8', cursor: "pointer" }}
            onMouseEnter={() => { setHovering(true) }}
            onMouseLeave={() => { setHovering(false) }}
            onClick={() => {
                if (selectedTask !== null) {
                    // If the load location has been defined but the unload position hasnt, assign the unload position
                    if (selectedTask.load.position !== null && selectedTask.unload.position === null) {
                        let unload = deepCopy(selectedTask.unload)
                        let type = selectedTask.type
                        unload.position = props.location._id
                        if (props.location.parent !== null) {
                            unload.station = props.location.parent
                        } else {
                            type = 'push'
                        }
                        dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { unload, type }))
                    } else { // Otherwise assign the load position and clear the unload position (to define a new unload)
                        let load = deepCopy(selectedTask.load)
                        let unload = deepCopy(selectedTask.unload)
                        let type = selectedTask.type
                        load.position = props.location._id
                        if (props.location.parent !== null) {
                            load.station = props.location.parent
                        } else {
                            type = 'pull'
                        }
                        unload.position = null
                        unload.station = null
                        dispatch(taskActions.setTaskAttributes(selectedTask._id.$oid, { load, unload, type }))
                    }
                }
            }}
            transform={`translate(${props.location.x},${props.location.y}) rotate(${360 - props.location.rotation}) scale(${props.d3.scale / props.d3.imgResolution})`}
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

                <filter id={`glow-${props.rd3tClassName}`} height="300%" width="300%" x="-75%" y="-75%">
                    <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
                    <feGaussianBlur in="thicken" stdDeviation="3" result="blurred" />
                    <feFlood floodColor={props.color} result="glowColor" />
                    <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                    <feMerge>
                        <feMergeNode in="softGlow_colored" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>


            <g className={`${props.rd3tClassName}-rot`}>
                {props.isSelected && (hovering || dragging) &&
                    <>
                        <circle x="-16" y="-16" r="16" strokeWidth="0" fill="transparent" style={{ cursor: dragging ? "pointer" : "default" }}></circle>
                        <circle x="-18" y="-18" r="14" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }} onMouseDown={() => setDragging(true)}></circle>
                        <circle x="-14" y="-14" r="14" fill="none" strokeWidth="0.6" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                    </>
                }
            </g>

            <g className={`${props.rd3tClassName}-trans`} transform="scale(1, 1)">


                <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400" >
                    <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill={selectedTask == null ? "transparent" : "rgba(255,255,255,0.95)"} strokeMiterlimit="10" strokeWidth="20" />

                    <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" strokeMiterlimit="10" strokeWidth="10" />
                    <circle cx="200" cy="200" r="15" />
                    <circle cx="150" cy="200" r="10" />
                    <circle cx="102.5" cy="200" r="7.5" />


                </svg>
            </g>

            {shouldGlow &&
                <rect x="-8" y="-5" height="10" width="16" rx="1.5" style={{ filter: `url(#glow-${props.rd3tClassName})` }} fill="none" strokeMiterlimit="0.5" strokeWidth="1"></rect>
            }


        </g>
    )
}

export default CartPosition