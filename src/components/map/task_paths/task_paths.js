import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Actions
import { setTaskAttributes } from '../../../redux/actions/tasks_actions'

export default function TaskPaths(props) {

    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const positions = useSelector(state => state.locationsReducer.positions)
    const dispatch = useDispatch()

    const stateRef = useRef()
    stateRef.current = selectedTask

    const [mousePos] = useState({ x: 0, y: 0 })

    const [x1, setX1] = useState(0)
    const [y1, setY1] = useState(0)
    const [x2, setX2] = useState(0)
    const [y2, setY2] = useState(0)

    // To be able to remove the event listener, we need to reference the same function.
    // Therefore we save the function in the state
    const [lockToMouse] = useState(() => e => {
        setX2(e.clientX)
        setY2(e.clientY)
    })

    // A callback that will set the load position to null when you press escape
    const [exitTaskPath] = useState(() => e => {
        if (e.key == 'Escape') {
            let load = stateRef.current.load
            load.position = null
            dispatch(setTaskAttributes(stateRef.current._id.$oid, { load }))
        }
    })

    // Set the start and end position if they exist
    useEffect(() => {
        if (selectedTask !== null) {
            if (selectedTask.load.position !== null) {
                const startPos = positions[selectedTask.load.position]
                setX1(startPos.x)
                setY1(startPos.y)
            }
            if (selectedTask.unload.position !== null) {
                const endPos = positions[selectedTask.unload.position]
                setX2(endPos.x)
                setY2(endPos.y)
            }
        }
    })

    // If there is a load position but not an unload, set a listener to set the endpoint to the mouse position
    useEffect(() => {
        if (selectedTask !== null && selectedTask.load.position !== null && selectedTask.unload.position === null) {
            setX2(x1)
            setY2(y1)
            window.addEventListener('mousemove', lockToMouse, false)
            window.addEventListener('keydown', exitTaskPath)
        } else {
            window.removeEventListener('mousemove', lockToMouse, false)
            window.removeEventListener('keydown', exitTaskPath)
        }

        return () => {
          window.removeEventListener('mousemove', lockToMouse, false)
          window.removeEventListener('keydown', exitTaskPath)
        }
    }, [selectedTask])

    if (selectedTask !== null && selectedTask.load.position != null) {
        const startPos = positions[selectedTask.load.position]

        let endPos
        if (selectedTask.unload.position !== null) { // The task has a start AND end position
            endPos = positions[selectedTask.unload.position]
        } else { // Task has a start position but no end position (instead snap to mouse position)
            endPos = mousePos
        }

        const lineLen = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
        const lineRot = Math.atan2((y2 - y1), (x2 - x1))
        const arrowRot = lineRot * 180 / Math.PI

        // console.log(lineLen, (10*props.d3.scale), Math.ceil(lineLen/(10*props.d3.scale)))

        const dashes = [...Array(Math.ceil(lineLen / (10 * props.d3.scale))).keys()]

        return (
            <>
                <g>
                    <defs>

                        {/* a transparent glow that takes on the colour of the object it's applied to */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                    </defs>

                    <line x1={`${x1}`} y1={`${y1}`}
                        x2={`${x2}`} y2={`${y2}`}
                        strokeWidth={`${props.d3.scale * 8}`} stroke='rgba(56, 235, 135, 0.95)'
                        strokeLinecap="round"
                    />
                    <line x1={`${x1}`} y1={`${y1}`}
                        x2={`${x2}`} y2={`${y2}`}
                        strokeWidth={`${props.d3.scale * 6}`} stroke='rgba(184, 255, 215, 0.7)'
                        strokeLinecap="round"
                    />

                    {dashes.map(delta =>
                        <g key={`arrow-${delta}`}
                            transform={`translate(${x1 + delta * props.d3.scale * 10 * Math.cos(lineRot)} ${y1 + delta * props.d3.scale * 10 * Math.sin(lineRot)})`}>
                            <g viewBox="-50 -50 50 50" transform={`rotate(${arrowRot}) scale(${0.05 * props.d3.scale})`}>
                                <polygon points="-40,-50 -40,50 40,0" fill="rgba(56, 235, 135, 0.95)" />
                            </g>
                        </g>
                    )}
                </g>
            </>
        )
    }

    return (null)
}
