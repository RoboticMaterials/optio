import React, { useState, useEffect } from 'react'
import * as styled from './tasks_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import Components
import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../basic/textbox_search/textbox_search'

import ContentList from '../content_list/content_list'
import EditTask from './edit_task/edit_task'

// Import actions
import * as taskActions from '../../../../redux/actions/tasks_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../redux/actions/objects_actions'
import { postTaskQueue } from '../../../../redux/actions/task_queue_actions'

import { deepCopy } from '../../../../methods/utils/utils'


export default function TaskContent(props) {

    // Connect redux reducers
    const dispatch = useDispatch()
    const onPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const sounds = useSelector(state => state.soundsReducer.sounds)
    const objects = useSelector(state => state.objectsReducer.objects)

    const stations = useSelector(state => state.locationsReducer.stations)
    const positions = useSelector(state => state.locationsReducer.positions)
    const locations = useSelector(state => state.locationsReducer.locations)

    // State definitions
    const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view
    const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)  // Current task
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

    if (editing && selectedTask !== null) { // Editing Mode
        return (
            <EditTask
                selectedTaskCopy={selectedTaskCopy}
                setSelectedTaskCopy={props => setSelectedTaskCopy(props)}
                shift={shift}
                isTransportTask={isTransportTask}
                toggleEditing={props=> toggleEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <ContentList
                title={'Routes'}
                schema={'tasks'}
                elements={Object.values(tasks)}
                onMouseEnter={(task) => dispatch(taskActions.selectTask(task._id.$oid))}
                onMouseLeave={(task) => dispatch(taskActions.deselectTask())}
                onClick={(task) => {
                    // If task button is clicked, start editing it
                    setSelectedTaskCopy(deepCopy(selectedTask))
                    toggleEditing(true)
                }}
                executeTask={() => {
                    onPostTaskQueue({ task_id: selectedTask._id.$oid })
                }}
                onPlus={() => {
                    const newTask = {
                        name: '',
                        obj: null,
                        type: 'push',
                        quantity: 1,
                        load: {
                            position: null,
                            station: null,
                            sound: null,
                            instructions: 'Load'
                        },
                        unload: {
                            position: null,
                            station: null,
                            sound: null,
                            instructions: 'Unload'
                        },
                        _id: { $oid: '__NEW_TASK' }
                    }
                    dispatch(taskActions.addTask(newTask))
                    dispatch(taskActions.setSelectedTask(newTask))
                    toggleEditing(true)
                }}
            />
        )
    }
}
