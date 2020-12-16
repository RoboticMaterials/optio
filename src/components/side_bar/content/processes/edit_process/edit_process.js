import React, { useState, useEffect } from 'react'

import * as styled from './edit_process.style'
import { useSelector, useDispatch } from 'react-redux'

// Import basic components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'

// Import components
import EditTask from '../../tasks/edit_task/edit_task'
import ContentHeader from '../../content_header/content_header'
import ErrorModal from '../../../../basic/modals/error_modal/error_modal'


// Import actions
import { setSelectedTask, deselectTask, addTask, putTask, deleteTask } from '../../../../../redux/actions/tasks_actions'
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
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchAddTask = (task) => dispatch(addTask(task))
    const dispatchDeselectTask = () => dispatch(deselectTask())
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchPutTask = (task, ID) => dispatch(putTask(task, ID))
    const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))
    const dispatchPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))

    const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))
    const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))
    const dispatchDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    // State definitions
    const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)  // Current task
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [editingTask, setEditingTask] = useState(false) // Used to tell if a task is being edited
    const [newRoute, setNewRoute] = useState(null)
    const [reportModal, setReportModal] = useState(false);


    useEffect(() => {
        console.log('QQQQ selected process', selectedProcessCopy)
        return () => {

        }
    }, [])

    const handleExecuteProcessTask = (route) => {
        dispatchPostTaskQueue({ task_id: route })

    }

    // Maps through the list of existing routes
    const handleExistingRoutes = () => {

        return selectedProcess.children.map((child, ind) => {

            const routeID = child.route

            const routeTask = tasks[routeID]

            if (routeTask === undefined) {
                console.log('QQQQ undefined')
                return
            }

            return (
                <div key={`li-${ind}`}>
                    <styled.ListItem
                        key={`li-${ind}`}
                    >
                        <styled.ListItemRect
                            onMouseEnter={() => {
                                if (!selectedTask && !editingTask) {
                                    dispatchSetSelectedTask(routeTask)
                                }

                            }}
                            onMouseLeave={() => {
                                if (selectedTask !== null && !editingTask) {
                                    dispatchDeselectTask()
                                }
                            }}
                        >
                            {/* <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle> */}
                            <styled.ListItemTitle
                                schema={'processes'}
                                onClick={() => {
                                    setEditingTask(true)
                                    dispatchSetSelectedTask(routeTask)
                                }}
                            >
                                {routeTask.name}
                            </styled.ListItemTitle>
                        </styled.ListItemRect>

                        <styled.ListItemIcon
                            className='fas fa-play'
                            onClick={() => {
                                handleExecuteProcessTask(routeID)
                            }}
                        />

                    </styled.ListItem>
                    {editingTask && selectedTask._id === routeID &&
                        <styled.TaskContainer schema={'processes'}>

                            <EditTask
                                selectedTaskCopy={selectedTaskCopy}
                                setSelectedTaskCopy={props => setSelectedTaskCopy(props)}
                                shift={shift}
                                isTransportTask={isTransportTask}
                                isProcessTask={true}
                                toggleEditing={(props) => {
                                    setEditingTask(props)
                                }}
                            />
                        </styled.TaskContainer>
                    }
                </div>
            )
        })
    }

    const handleAddRoute = () => {

        return (
            <>
                <styled.ListItem
                // onMouseEnter={() => dispatchSetSelectedTask(routeTask)}
                // onMouseLeave={() => dispatchDeselectTask()}
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
                                    // device_type: 'human',
                                    device_type: 'MiR_100',
                                    map_id: currentMap._id,
                                    idle_location: null,
                                    // Makes the task/route a part of a process
                                    process: selectedProcessCopy._id,
                                    load: {
                                        position: null,
                                        station: null,
                                        sound: null,
                                        instructions: 'Load',
                                        timeout: '01:00'
                                    },
                                    unload: {
                                        position: null,
                                        station: null,
                                        sound: null,
                                        instructions: 'Unload'
                                    },
                                    _id: uuid.v4(),
                                }
                                dispatchAddTask(newTask)
                                setNewRoute(newTask)
                                dispatchSetSelectedTask(newTask)
                                setEditingTask(true)
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
                            isProcessTask={true}
                            toggleEditing={(props) => {
                                setEditingTask(props)
                            }}

                        />
                    </styled.TaskContainer>
                }

            </>
        )
    }

    const handleSave = async () => {

        dispatchDeselectTask()

        // If the id is new then post
        if (selectedProcessCopy.new) {

            await dispatchPostProcess(selectedProcess)

        }

        // Else put
        else {
            await dispatchPutProcess(selectedProcess)
        }

        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    const handleBack = () => {
        dispatchDeselectTask()
        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)

    }

    const handleDeleteWithRoutes = async () => {

        // If there's routes in this process, delete the routes
        if (selectedProcess.routes.length > 0) {
            selectedProcess.routes.forEach(route => dispatchDeleteTask(route))
        }

        await dispatchDeleteProcess(selectedProcessCopy._id)

        dispatchDeselectTask()
        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    const handleDeleteWithoutRoutes = async () => {

        await dispatchDeleteProcess(selectedProcessCopy._id)

        dispatchDeselectTask()
        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    return (
      <>
        <ErrorModal
          isOpen = {!!reportModal}
          title={"Are you sure you want to delete this process?"}
          handleClose={() => setReportModal(null)}
          handleDeleteWithRoutes = {() => {
              handleDeleteWithRoutes()
              setReportModal(null)
          }}
          handleDeleteWithoutRoutes = {() => {
              handleDeleteWithoutRoutes()
              setReportModal(null)
          }}
        />
        <styled.Container>
            <div style={{ marginBottom: '1rem' }}>

                <ContentHeader
                    content={'processes'}
                    mode={'create'}
                    disabled={!!selectedTask && !!editingTask}
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
                    dispatchSetSelectedProcess({
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
                disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                style={{ marginBottom: '0rem' }}
                secondary
                onClick={() => {
                    setReportModal(true)
                }}
            >
                Delete
            </Button>

        </styled.Container>
        </>

    )
}

export default EditProcess
