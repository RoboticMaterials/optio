import React, { useState, useEffect } from 'react'

import * as styled from './edit_process.style'
import { useSelector, useDispatch } from 'react-redux'

// Import basic components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'

// Import components
import EditTask from '../../tasks/edit_task/edit_task'
import ContentHeader from '../../content_header/content_header'

// Import actions
import { setSelectedTask, deselectTask, addTask, putTask } from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, postProcesses, putProcesses, deleteProcesses } from '../../../../../redux/actions/processes_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

// Import Utils
import { isEquivalent, deepCopy } from '../../../../../methods/utils/utils'
import uuid from 'uuid'

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
    const onPutTask = (task, ID) => dispatch(putTask(task, ID))

    const onPostProcess = async (process) => await dispatch(postProcesses(process))
    const onPutProcess = async (process) => await dispatch(putProcesses(process))
    const onDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))

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

    useEffect(() => {
        console.log('QQQQ selected process', selectedProcessCopy)
        return () => {

        }
    }, [])

    const handleExecuteProcess = () => {
        alert('Cool button eh? Well, its gonna be even cooler when we get it working!')
    }

    // Maps through the list of existing routes
    const handleExistingRoutes = () => {

        return selectedProcess.routes.map((route, ind) => {

            const routeTask = tasks[route]
            if (routeTask === undefined) {
                return
            }

            return (
                <div key={`li-${ind}`}>
                    <styled.ListItem
                        key={`li-${ind}`}
                    >
                        <styled.ListItemRect
                            onMouseEnter={() => {
                                if (!selectedTask) {
                                    onSetSelectedTask(routeTask)
                                }

                            }}
                            onMouseLeave={() => {
                                if (selectedTask !== null && !selectedTask.new) {
                                    onDeselectTask()
                                }
                            }}
                        >
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
                                handleExecuteProcess()
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
                </div>
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
                                    new: true,
                                    // Makes the task/route a part of a 
                                    process: selectedProcessCopy._id.$oid === '__NEW_PROCESS' ? true : selectedProcessCopy._id.$oid,
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
                                    _id: uuid.v4(),
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
                    <styled.TaskContainer schema={'processes'}>
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
                    </styled.TaskContainer>
                }

            </>
        )
    }

    const handleSave = async () => {

        onDeselectTask()

        // If the id is new then post 
        if (selectedProcessCopy._id.$oid === '__NEW_PROCESS') {

            // If it's a new process, need to post process and what for the new ID to come back, then add that ID to 
            // the associated tasks
            const newProcessPromise = onPostProcess(selectedProcess)

            newProcessPromise.then(postedProcess => {
                // Map through each associated route and add the process id
                postedProcess.routes.map((route) => {
                    let updatedTask = tasks[route]
                    updatedTask.process = postedProcess._id.$oid
                    const ID = deepCopy(updatedTask._id.$oid)
                    onPutTask(updatedTask, ID)

                })
            })
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

    const handleDelete = async () => {

        await onDeleteProcess(selectedProcessCopy._id.$oid)

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
                    disabled={!!selectedTask}
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
                style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}
            />
            <styled.Title schema={'processes'}>Associated Routes</styled.Title>
            <styled.SectionContainer>
                {handleExistingRoutes()}
            </styled.SectionContainer>

            {handleAddRoute()}

            <div style={{ height: "100%", paddingTop: "1rem" }} />

            {/* Delete Task Button */}
            <Button
                schema={'processes'}
                disabled={!!selectedProcess && !!selectedProcess._id && selectedProcess._id.$oid == '__NEW_PROCESS'}
                style={{ marginBottom: '0rem' }}
                secondary
                onClick={() => {
                    handleDelete()
                }}
            >
                Delete
            </Button>

        </styled.Container>

    )
}

export default EditProcess