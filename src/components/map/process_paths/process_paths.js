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
    const editingTask = useSelector(state => state.tasksReducer.editingTask)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)

    // Maps through all the associated routes with the process and displays them
    const handleTaskPaths = () => {
        return selectedProcess.routes
            .filter((route) => {
                const {
                    load,
                    unload,
                    id: routeId
                } = (isObject(route) ? route : tasks[route]) || {}

                const {
                    id: selectedRouteId
                } = selectedTask || {}

                if(routeId === selectedRouteId) return false    // selected route is shown separately, so don't double dip

                const {
                    position: loadPosition,
                    station: loadStation
                } = load || {}

                const {
                    position: unloadPosition,
                    station: unloadStation
                } = unload || {}

                /*
                * if we aren't editing a task, and it's missing load / unload don't show it.
                * If we are a task, but its not this one, and this one is missine load / unload, don't show it
                * */
                if((!(editingTask) || (editingTask && selectedRouteId !== routeId)) && (!(loadPosition || loadStation) || !(unloadPosition || unloadStation))) return false
                return true
             })
            .map((route, ind) => {
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
    }

    return (
        <>
            {handleTaskPaths()}
        </>
    )

}

export default ProcessPaths