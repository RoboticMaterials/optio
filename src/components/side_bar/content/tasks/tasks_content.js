import React, { useState, useEffect } from 'react'
import * as styled from './tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'
import {useParams} from 'react-router-dom'

// Import Components
import ContentList from '../content_list/content_list'

// Import actions
import * as taskActions from '../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../redux/actions/objects_actions'
import * as taskQueueActions from '../../../../redux/actions/task_queue_actions'

import { postTaskQueue } from '../../../../redux/actions/task_queue_actions'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { tasksSortedAlphabetically } from '../../../../methods/utils/task_utils'
import RouteTask from './tasks_templates/route_task'
import uuid from 'uuid'
import TaskForm from "./task_form/route_form";
import {generateDefaultRoute, isHumanTask, isMiRTask} from "../../../../methods/utils/route_utils";
import {willRouteDeleteBreakProcess} from "../../../../methods/utils/processes_utils";
import {deleteRouteClean} from "../../../../redux/actions/tasks_actions";
import {isObject} from "../../../../methods/utils/object_utils";
import {DEVICE_CONSTANTS} from "../../../../constants/device_constants";

export default function TaskContent(props) {

    // Connect redux reducers
    const dispatch = useDispatch()
    const onHandlePostTaskQueue = (props) => dispatch(taskQueueActions.handlePostTaskQueue(props))
    const onEditing = async (props) => await dispatch(taskActions.editingTask(props))
    const dispatchSetSelectedTask = async (task) => await dispatch(taskActions.setSelectedTask(task))
    const dispatchAddTask = async (task) => await dispatch(taskActions.addTask(task))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    const stations = useSelector(state => state.locationsReducer.stations)
    const editing = useSelector(state => state.tasksReducer.editingTask) //Moved to redux so the variable can be accesed in the sideBar files for confirmation modal
    const objects = useSelector(state => state.objectsReducer.objects)

    /**
    * @param {*} Id
    */

    // State definitions
    const [shift, setShift] = useState(false) // Is shift key pressed ?

    // To be able to remove the listeners, the function needs to be stored in state

    //Parameters to pass into handlePostTaskQueue dispatch
    const dashboardID = selectedTask ? stations[selectedTask?.load?.station].dashboards[0] : {}
    const Id = selectedTask ? selectedTask._id : {}
    const deviceTypes = selectedTask ? (selectedTask.device_types || []) : []
    const name = selectedTask ? selectedTask.name : {}
    const custom = false
    const fromSideBar = true

    const [shiftCallback] = useState(() => e => {
        setShift(e.shiftKey)
    })

    // Creates listeners for if the shift key is pressed
    useEffect(() => {

        window.addEventListener('keydown', shiftCallback)
        window.addEventListener('keyup', shiftCallback)

        // When component unmounts, clean up by removing listeners
        return function cleanup() {
            window.removeEventListener('keydown', shiftCallback)
            window.removeEventListener('keyup', shiftCallback)
        }
    })

    const handleDefaultObj = (objId, prevObj) => {

        if(isObject(objects[objId])) {
            return objects[objId]
        }
        else if (prevObj) {
            return prevObj
        }
        else {
            return null
        }
    }

    if (editing && selectedTask !== null) { // Editing Mode
        return (
            <TaskForm
                initialValues={{
                    ...selectedTask,
                    obj: handleDefaultObj(selectedTask.obj)
                }}
                shift={shift}
                toggleEditing={props => onEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <ContentList
                title={'Routes'}
                schema={'tasks'}
                elements={

                    tasksSortedAlphabetically(Object.values(tasks))
                        // Filters outs any tasks that don't belong to the current map
                        .filter(task => task.map_id === currentMap._id)
                }
                onMouseEnter={(task) => {
                    dispatchSetSelectedTask(task)
                }}
                onMouseLeave={(task) => dispatchSetSelectedTask(null)}
                onClick={(task) => {
                    // If task button is clicked, start editing it
                    dispatchSetSelectedTask(task)
                    onEditing(true)
                }}

                executeTask={()=> {
                    let deviceType
                    if(isMiRTask(selectedTask)) {
                        deviceType = DEVICE_CONSTANTS.MIR_100
                    }
                    else if(isHumanTask(selectedTask)){
                        deviceType = DEVICE_CONSTANTS.HUMAN
                    }
                    onHandlePostTaskQueue({dashboardID, tasks, deviceType, taskQueue, Id, name, custom, fromSideBar})
                }}

                onPlus={() => {
                    const newTask = generateDefaultRoute()
                    dispatchAddTask(newTask)
                    dispatchSetSelectedTask(newTask)
                    onEditing(true)
                }}
            />
        )
    }
}
