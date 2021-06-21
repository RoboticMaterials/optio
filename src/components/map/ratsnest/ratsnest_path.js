import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Actions
import { setTaskAttributes } from '../../../redux/actions/tasks_actions'
import {getLoadPositionId, getUnloadPositionId, getRouteEnd, getRouteStart } from "../../../methods/utils/route_utils";

export default function RatsnestPaths(props) {

    const {
        route,
        d3Scale
    } = props

    // console.log(route)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const positions = useSelector(state => state.positionsReducer.positions)
    const stations = useSelector(state => state.stationsReducer.stations)

    const loadPositionId = getLoadPositionId(tasks[route])
    const unloadPositionId = getUnloadPositionId(tasks[route])

    const startPos = !!positions[loadPositionId] ? positions[loadPositionId] : stations[loadPositionId]
    const endPos = !!positions[unloadPositionId] ? positions[unloadPositionId] : stations[unloadPositionId]
    

    return (
        <>
            {/* <g>
                <line x1={`${startPos.x}`} y1={`${startPos.y}`}
                    x2={`${endPos.x}`} y2={`${endPos.y}`}
                    strokeWidth={`${d3Scale * 0.8}`} stroke={'lightgrey'}
                    strokeLinecap="round"
                />
            </g> */}
        </>
    )
}