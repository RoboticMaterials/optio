import React, { useState, useEffect } from 'react'

import * as styled from './edit_process.style'
import { useSelector, useDispatch } from 'react-redux'

// Import basic components
import Textbox from '../../../../basic/textbox/textbox.js'

// Import components
import EditTask from '../../tasks/edit_task/edit_task'
import ContentHeader from '../../content_header/content_header'


// Import actions
import { setSelectedTask, deselectTask, addTask } from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, postProcesses, putProcesses } from '../../../../../redux/actions/processes_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

// Import Utils
import { isEquivalent } from '../../../../../methods/utils/utils'

const EditProcess = (props) => {

    const {
        selectedProcessCopy,
        setSelectedProcessCopy,
        toggleEditingProcess,

    } = props

    const dispatch = useDispatch()
    const onSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const onAddTask = (task) => dispatch(addTask(task))
    const onDeselectTask = () => dispatch(deselectTask())
    const onSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))

    const onPostProcess = async (process) => await dispatch(postProcesses(process))
    const onPutProcess = async (process) => await dispatch(putProcesses(process))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)

    // State definitions
    const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view
    const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)  // Current task
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [editingTask, setEditingTask] = useState(false)
    const [newRoute, setNewRoute] = useState(null)

    // Maps through the list of existing routes
    const handleExistingRoutes = () => {

        return selectedProcessCopy.routes.map((route, ind) => {

            const routeTask = tasks[route]

            return (
                <>
                    <styled.ListItem
                        key={`li-${ind}`}
                        onMouseEnter={() => onSetSelectedTask(routeTask)}
                    // onMouseLeave={() => onDeselectTask()}
                    >
                        <styled.ListItemRect>
                            {/* <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle> */}
                            <styled.ListItemTitle
                                schema={'processes'}
                                onClick={() => {
                                    setEditingTask(true)
                                    onSetSelectedTask(routeTask)
                                }}
                            >
                                {routeTask.name}
                            </styled.ListItemTitle>
                        </styled.ListItemRect>

                        <styled.ListItemIcon
                            className='fas fa-play'
                            onClick={() => {
                                // executeTask()
                            }}
                        />

                    </styled.ListItem>
                    {editingTask && isEquivalent(routeTask, selectedTask) &&
                        <EditTask
                            selectedTaskCopy={selectedTaskCopy}
                            setSelectedTaskCopy={props => setSelectedTaskCopy(props)}
                            shift={shift}
                            isTransportTask={isTransportTask}
                            toggleEditing={props => toggleEditing(props)}
                            isProcessTask={true}
                        />
                    }
                </>
            )
        })
    }

    const handleAddRoute = () => {

        return (
            <>
                <styled.ListItem
                // onMouseEnter={() => onSetSelectedTask(routeTask)}
                // onMouseLeave={() => onDeselectTask()}
                >
                    <styled.ListItemRect>
                        <styled.ListItemTitle
                            schema={'processes'}
                            onClick={() => {
                                const newTask = {
                                    name: '',
                                    obj: null,
                                    type: 'push',
                                    quantity: 1,
                                    process: true,
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
                                onAddTask(newTask)
                                setNewRoute(newTask)
                                onSetSelectedTask(newTask)
                            }}
                        >
                            Add Route
                    </styled.ListItemTitle>
                    </styled.ListItemRect>

                </styled.ListItem>

                {!!newRoute &&
                    <EditTask
                        selectedTaskCopy={newRoute}
                        setSelectedTaskCopy={props => {
                            setSelectedTaskCopy(props)
                            setNewRoute(props)
                        }}
                        shift={shift}
                        isTransportTask={isTransportTask}
                        toggleEditing={props => toggleEditing(props)}
                        isProcessTask={true}
                    />
                }

            </>
        )
    }

    const handleSave = async () => {

        onDeselectTask()

        // If the id is new then post 
        if (selectedProcessCopy._id.$oid === '__NEW_PROCESS') {
            console.log('QQQQ should be posting this process', selectedProcess)
            await onPostProcess(selectedProcess)
        }

        // Else put
        else {
            await onPutProcess(selectedProcess)
        }

        onSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    const handleBack = () => {
        onDeselectTask()
        onSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)

    }

    return (
        <styled.Container>
            <div style={{ marginBottom: '1rem' }}>

                <ContentHeader
                    content={'processes'}
                    mode={'create'}
                    onClickSave={() => {
                        handleSave()
                    }}

                    onClickBack={() => {
                        handleBack()
                    }}

                />

            </div>
            <Textbox
                placeholder='Process Name'
                defaultValue={selectedProcessCopy.name}
                schema={'processes'}
                onChange={(e) => { 
                    onSetSelectedProcess({
                        ...selectedProcess,
                        name: e.target.value,
                    }) 
                }}
            />
            <styled.Title schema={'processes'}>Associated Routes</styled.Title>
            <styled.SectionContainer>
                {handleExistingRoutes()}
            </styled.SectionContainer>

            {handleAddRoute()}

        </styled.Container>

    )
}

export default EditProcess