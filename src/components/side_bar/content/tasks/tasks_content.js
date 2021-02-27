import React, { useState, useEffect } from 'react'
import * as styled from './tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

// Import Components
import ContentList from '../content_list/content_list'
import TaskAddedAlert from '../../../widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert'

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
import {
    generateDefaultRoute,
    getLoadStationDashboard,
    getLoadStationId,
    isHumanTask,
    isMiRTask
} from "../../../../methods/utils/route_utils";
import { willRouteDeleteBreakProcess } from "../../../../methods/utils/processes_utils";
import { deleteRouteClean } from "../../../../redux/actions/tasks_actions";
import { isObject } from "../../../../methods/utils/object_utils";
import { DEVICE_CONSTANTS } from "../../../../constants/device_constants";
import { ADD_TASK_ALERT_TYPE } from '../../../../constants/dashboard_contants'
import {getSidebarDeviceType, isRouteInQueue} from "../../../../methods/utils/task_queue_utils";

export default function TaskContent(props) {

    // Connect redux reducers
    const dispatch = useDispatch()
    const params = useParams()
    const onTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const onHandlePostTaskQueue = (props) => dispatch(taskQueueActions.handlePostTaskQueue(props))
    const onEditing = async (props) => await dispatch(taskActions.editingTask(props))
    const dispatchSetSelectedTask = async (task) => await dispatch(taskActions.setSelectedTask(task))
    const dispatchAddTask = async (task) => await dispatch(taskActions.addTask(task))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const stations = useSelector(state => state.stationsReducer.stations)
    const editing = useSelector(state => state.tasksReducer.editingTask) //Moved to redux so the variable can be accesed in the sideBar files for confirmation modal
    const objects = useSelector(state => state.objectsReducer.objects)
    const selectedObject = useSelector(state => state.objectsReducer.selectedObject)
    const routeObject = useSelector(state => state.objectsReducer.routeObject)

    /**
    * @param {*} Id
    */

    // State definitions
    //const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view
    const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)  // Current task
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isNew, setIsNew] = useState(false) // Is shift key pressed ?
    const [addTaskAlert, setAddTaskAlert] = useState(null);


    // To be able to remove the listeners, the function needs to be stored in state

    //Parameters to pass into handlePostTaskQueue dispatch
    const dashboardID = getLoadStationDashboard(selectedTask)
    const Id = selectedTask ? selectedTask._id : {}
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

        if (isObject(objects[objId])) {
            return objects[objId]
        }
        else if (prevObj) {
            return prevObj
        }
        else {
            return null
        }
    }



    const onExecuteTask = () => {
        const deviceType = getSidebarDeviceType(selectedTask)

        const inQueue = isRouteInQueue(Id, deviceType)

        // add alert to notify task has been added
        // If in Q, then tell them it's already there
        if (inQueue) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! Task Already in Queue",
                message: `'${name}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        // Else see what type of task it is and add accordingly
        else {



            // Handle Add
            if (deviceType !== 'human') {
                setAddTaskAlert({
                    type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: name
                })

                // clear alert after timeout
                setTimeout(() => setAddTaskAlert(null), 1800)
            }
            onHandlePostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, Id, name, custom, fromSideBar })

        }


    }

    if (editing && selectedTask !== null) { // Editing Mode
        return (
            <TaskForm
                isNew={isNew}
                initialValues={{
                    ...selectedTask,
                    obj: selectedObject,
                }}
                shift={shift}
                toggleEditing={props => onEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <>
                <TaskAddedAlert
                    containerStyle={{
                        'position': 'absolute'
                    }}
                    {...addTaskAlert}
                    visible={!!addTaskAlert}
                />
                <ContentList
                    title={'Routes'}
                    schema={'tasks'}
                    elements={

                        tasksSortedAlphabetically(Object.values(tasks))
                            // Filters outs any tasks that don't belong to the current map
                            .filter(task => task.map_id === currentMap._id)
                            // Filter out empty tasks that are somehow created when choosing an existing task to add to a process in the process tab
                            // These are deleted by the cleaner function on page refresh but in the meantime dont show in the list view
                            .filter(task => task.load.position !== null)

                    }
                    onMouseEnter={(task) => {
                        dispatchSetSelectedTask(task)
                    }}
                    onMouseLeave={() => {
                      dispatchSetSelectedTask(null)

                    }}
                    onClick={(task) => {
                        setIsNew(false)
                        // If task button is clicked, start editing it
                        dispatchSetSelectedTask(task)
                        onEditing(true)
                    }}

                    executeTask={() => {
                        onExecuteTask()
                    }}

                    onPlus={() => {
                        const newTask = generateDefaultRoute()
                        setIsNew(true)
                        dispatchAddTask(newTask)
                        dispatchSetSelectedTask(newTask)
                        onEditing(true)
                    }}
                />
            </>
        )
    }
}
