import React, { useState, useEffect } from 'react'
import * as styled from './tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'

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
import TaskForm from "./task_form/task_form";
import {generateDefaultRoute} from "../../../../methods/utils/route_utils";

export default function TaskContent(props) {

    // Connect redux reducers
    const dispatch = useDispatch()
    const onPostTaskQueue = async (ID) => await dispatch(postTaskQueue(ID))
    const onTaskQueueItemClicked = async (id) => await dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const onEditing = async (props) => await dispatch(taskActions.editingTask(props))
    const dispatchSelectTask = async (taskId) => await dispatch(taskActions.selectTask(taskId))
    const dispatchDeselectTask = async () => await dispatch(taskActions.deselectTask())
    const dispatchSetSelectedTask = async (task) => await dispatch(taskActions.setSelectedTask(task))
    const dispatchAddTask = async (task) => await dispatch(taskActions.addTask(task))
    const dispatchRemoveTask = async (taskId) => await dispatch(taskActions.removeTask(taskId))
    const dispatchPostTask = async (task) => await dispatch(taskActions.postTask(task))
    const dispatchPutTask = async (task, taskId) => await dispatch(taskActions.putTask(task, taskId))



    let tasks = useSelector(state => state.tasksReducer.tasks)
    let taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const stations = useSelector(state => state.locationsReducer.stations)
    const editing = useSelector(state => state.tasksReducer.editingTask) //Moved to redux so the variable can be accesed in the sideBar files for confirmation modal

    // State definitions
    //const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view

    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    // To be able to remove the listeners, the function needs to be stored in state

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

    useEffect(() => {
        if (!selectedTask) { return }
        if (selectedTask.load.position === null) {
            // No load position has been defined - ask user to define load (start) position
            setIsTransportTask(true)
        } else if (selectedTask.load.station === null) {
            // Load position is not tied to a station - task is no longer a transport task
            setIsTransportTask(false)
        } else {
            // Load position has been defined and is a station - now handle unload position
            if (selectedTask.unload.position === null) {
                // No unload position has been defined - ask user to define load (end) position
                setIsTransportTask(true)
            } else if (selectedTask.unload.station === null) {
                // Unload position is not a station - task is no longer a transport task
                setIsTransportTask(false)
            } else {
                // Load AND Unload positions have been defined. Display load/unload parameter fields
                setIsTransportTask(true)
            }
        }
    }, [selectedTask])


    const handleHumanHil = async () => {
        if (selectedTask != null) {

            if (selectedTask.device_type === 'human') {
                const dashboardId = stations[selectedTask.load.station].dashboards[0]

                const postToQueue = dispatch(postTaskQueue({ task_id: selectedTask._id, 'task_id': selectedTask._id, dashboard: dashboardId, hil_response: null, _id: uuid.v4(), }))
                postToQueue.then(item => {
                    const id = item?._id
                    onTaskQueueItemClicked(id)
                })
            }
            else {
                onPostTaskQueue({ task_id: selectedTask._id, _id: uuid.v4(), })
            }
        }
    }

    const handleInQueue = (task) => {
      if(!!task){
        Object.values(taskQueue).forEach((taskQueueItem, index) => {
            if(taskQueueItem.task_id === task._id){
            }
        })

      }
      //return inQueue
    }

    const handleSubmit = (values) => {

        const {
            new: isNew,
            changed
        } = values

        // create new route
        if(isNew) {
            dispatchPostTask(values)
        }

        // update existing route
        else {
            dispatchPutTask(values, values._id)
        }

        dispatchSetSelectedTask(null)
        onEditing(false)
    }

    const handleBackClick = (routeId) => {
        dispatchDeselectTask()
        if(tasks[routeId] && tasks[routeId].new) {
            dispatchRemoveTask(routeId)
        }
        onEditing(false)
    }




    if (editing && selectedTask !== null) { // Editing Mode
        return (
            <TaskForm
                initialValues={{
                    ...selectedTask
                }}
                handleSubmit={handleSubmit}
                handleBackClick={handleBackClick}
                shift={shift}
                isTransportTask={isTransportTask}
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

                executeTask={() => handleHumanHil()}
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
