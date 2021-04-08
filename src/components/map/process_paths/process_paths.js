import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import TaskPaths from '../task_paths/task_paths'
import {isObject} from "../../../methods/utils/object_utils";

const ProcessPaths = (props) => {
    const {
        d3
    } = props

    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const tasks = useSelector(state => state.tasksReducer.tasks)

    // Maps through all the associated routes with the process and displays them
    const handleTaskPaths = () => {
        // return Object.keys(selectedProcess.routes).map((station, ind) => {
        return selectedProcess.routes.map((route, ind) => {
            if( isObject(route) ) {
                return (
                    <TaskPaths d3={d3} route={route} key={route.id} />
                )
            }
            else {
                return (
                    <TaskPaths d3={d3} route={tasks[route]} key={route} />
                )
            }
        })

        // })
    }

    return (
        <>
            {handleTaskPaths()}
        </>
    )

}

export default ProcessPaths