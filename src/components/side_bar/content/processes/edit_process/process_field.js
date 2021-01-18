import React, {useState, useEffect, useRef} from 'react'

// external functions
import uuid from 'uuid'
import { useSelector, useDispatch } from 'react-redux'

// internal components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import TaskField from '../../tasks/task_field/task_field'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import TextField from "../../../../basic/form/text_field/text_field";
import ListItemField from "../../../../basic/form/list_item_field/list_item_field";

// Import actions
import { setSelectedTask, addTask, putTask, deleteTask, setTasks, removeTask, removeTasks, getTasks, deleteRouteClean } from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, postProcesses, putProcesses, deleteProcesses, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

// Import Utils
import { convertArrayToObject} from '../../../../../methods/utils/utils'
import {generateDefaultRoute} from "../../../../../methods/utils/route_utils";
import {isBrokenProcess, willRouteAdditionFixProcess, willRouteDeleteBreakProcess} from "../../../../../methods/utils/processes_utils";
import {isEmpty} from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

// styles
import * as styled from './process_field.style'

export const ProcessField = (props) => {
    const {
        formikProps,
        toggleEditingProcess,
    } = props

    // extract formik props
    const {
        errors,
        values,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        getFieldMeta,
        validateForm
    } = formikProps

    useChange() // adds changed key to values - true if the field has changed

    let errorCount = 0
    Object.values(errors).forEach((currError) => {
        if(!isEmpty(currError)) errorCount++
    }) // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting ||!values.changed) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchAddTask = (task) => dispatch(addTask(task))
    const dispatchSetTasks = (tasks) => dispatch(setTasks(tasks))
    const dispatchGetTasks = () => dispatch(getTasks())
    const dispatchRemoveTask = (taskId) => dispatch(removeTask(taskId))
    const dispatchRemoveTasks = (taskIds) => dispatch(removeTasks(taskIds))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const onTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const dispatchSetFixingProcess = async (bool) => await dispatch(setFixingProcess(bool))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.locationsReducer.stations)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)

    // State definitions
    const [shift, ] = useState(false) // Is shift key pressed ?
    const [isTransportTask, ] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [editingTask, setEditingTask] = useState(false) // Used to tell if a task is being edited
    const [newRoute, setNewRoute] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const valuesRef = useRef(values) // needed for handling cleanup - unsaved tasks have to be removed, and useEffect will only have access to initialValues

    useEffect(() => {
        valuesRef.current = values // update valuesRef

        // map process values to selectedProcess
        dispatchSetSelectedProcess({
            ...values,
            routes: values.routes.map((currRoute) => currRoute._id) // processes in redux only store the route keys
        })

        // dispatch values.routes to redux state
        if(values.routes.length > 0) {
            const mappedR = convertArrayToObject(values.routes, "_id")
            dispatchSetTasks(mappedR)
        }

        return () => {}

    }, [values]);

    useEffect(() => {

        if(!editingTask) {
            setFieldTouched("newRoute", {})
            setFieldError("newRoute", {})
            setFieldValue("newRoute", null)
        }

    }, [editingTask])

    // component mount / dismount
    useEffect(() => {
        // mount logic

        // dismount logic
        return () => {
            if(valuesRef.current) {

                // get id of all new (unsaved) routes
                const removeRouteIds = valuesRef.current.routes
                    .filter((currRoute) => {
                        return currRoute.new
                    })
                    .map((currRouteId) => currRouteId._id)

                // remove unsaved from redux
                dispatchRemoveTasks(removeRouteIds) // remove routes
                dispatchGetTasks() // cleans up unsaved changed routes
            }
        }
    }, [])

    // clear selectedTask and add new route to values.routes
    const handleAddTask = () => {

        if(newRoute) {

            const {
                needsSubmit, // remove from route
                ...remainingRoute
            } = values.newRoute || {}

            if(values.broken) {
                // check if new route will fix process
                let updatedRoute = [...values.routes]
                let willFix = willRouteAdditionFixProcess(selectedProcess, remainingRoute, tasks)

                // add route to values
                updatedRoute.splice(values.broken, 0, {...remainingRoute, })

                // update values
                setFieldValue("routes", updatedRoute)
                setFieldValue("broken", willFix)
            }

            else {
                // add route to values
                setFieldValue("routes", [...values.routes, {...remainingRoute}])
            }
        }

        // if not new route, only thing to check is if any changes broke the process
        else {
            setFieldValue("broken", isBrokenProcess(selectedProcess, tasks))
        }

        setNewRoute(null)   // clear new route
        setFieldValue("newRoute", null)
        dispatchSetSelectedTask(null)

        validateForm() // run validation so errors will show up right away
    }

    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemoveTask = (routeId) => {
        setEditingTask(false)
        setFieldValue("newRoute", null)
        dispatchSetSelectedTask(null) // Deselect
        setNewRoute(null)

        let updatedProcess = {...selectedProcess}

        const willBreak = willRouteDeleteBreakProcess(updatedProcess, routeId, tasks)

        // If the route removal breaks the process then update the process
        if (!!willBreak) {
            setFieldValue("broken", willBreak)
            // updatedProcess.broken = willBreak
        }

        // Remove the route from the process
        const index = values.routes.findIndex((currRoute) => currRoute._id === routeId)
        let updatedRoutes = [...values.routes]
        updatedRoutes.splice(index, 1)

        setFieldValue("routes", updatedRoutes)
    }

    const handleTaskBack = async () => {

        // if unsaved should should immediately disappear use this block
        if(selectedTask.new) {
            dispatchRemoveTask(selectedTask._id)
        }
        // if unsaved route should appear in process, use this block
        // if(newRoute) {
        //     setFieldValue("routes", [...values.routes, {...values.newRoute}])
        // }


        setNewRoute(null)
        setFieldValue("newRoute", null)
        await dispatchSetSelectedTask(null)

        validateForm()
    }

    const handleDeleteRoute = async (routeId) => {

        const willBreak = willRouteDeleteBreakProcess(selectedProcess, routeId, tasks)
        if (!!willBreak) {
            setFieldValue("broken", willBreak)
        }

        await dispatch(deleteRouteClean(routeId))

        setFieldValue("routes", values.routes.filter(((currRoute) => currRoute._id !== routeId)))

        setEditingTask(false)
        dispatchSetSelectedTask(null)
    }

    const handleExecuteProcessTask = async (route) => {
        if (tasks[route] != null) {
            if (tasks[route].device_type === 'human') {
                const dashboardId = stations[tasks[route].load.station].dashboards[0]

                const postToQueue = dispatch(postTaskQueue({ task_id: route, dashboard: dashboardId, hil_response: null, _id: uuid.v4(), }))
                postToQueue.then(item => {
                    const id = item?._id
                    onTaskQueueItemClicked(id)
                })
            }
            else {
                dispatchPostTaskQueue({ task_id: route, _id: uuid.v4(), })
            }
        }
    }

    // Maps through the list of existing routes
    const handleExistingRoutes = (routes) => {

        return routes.map((currRoute, currIndex) => {

            // const hasError = (errors.routes && Array.isArray(errors.routes)) ? errors.routes[currIndex] : false

            const fieldMeta = getFieldMeta(`routes[${currIndex}]`)
            const {
                touched,
            } = fieldMeta

            const {
                _id: currRouteId = "",
            } = currRoute || {}

            if (currRoute === undefined) {
                return
            }

            return (
                <div key={`li-${currIndex}`}>
                    <ListItemField
                        name={`routes[${currIndex}]`}
                        onMouseEnter={() => {
                            if (!selectedTask && !editingTask) {
                                dispatchSetSelectedTask(currRoute)
                            }

                        }}
                        onMouseLeave={() => {
                            if (selectedTask !== null && !editingTask) {
                                dispatchSetSelectedTask(null)
                            }
                        }}
                        onIconClick={() => {
                            handleExecuteProcessTask(currRouteId)
                        }}
                        onEditClick={() => {
                            setEditingTask(true)
                            dispatchSetSelectedTask(currRoute)
                        }}
                        onTitleClick={() => {
                            setEditingTask(true)
                            dispatchSetSelectedTask(currRoute)
                        }}
                        key={`li-${currIndex}`}
                    />

                    {editingTask && selectedTask && selectedTask._id === currRouteId &&
                    <styled.TaskContainer schema={'processes'}>

                        <TaskField
                            {...formikProps}
                            onRemove={handleRemoveTask}
                            onDelete={handleDeleteRoute}
                            onBackClick={handleTaskBack}
                            onSave={handleAddTask}
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldError={setFieldError}
                            setFieldTouched={setFieldTouched}
                            fieldParent={`routes[${currIndex}]`}
                            // selectedTaskCopy={selectedTaskCopy}
                            // setSelectedTaskCopy={props => setSelectedTaskCopy(props)}
                            shift={shift}
                            isTransportTask={isTransportTask}
                            isProcessTask={true}
                            toggleEditing={(props) => {
                                setEditingTask(props)
                            }}
                        />
                    </styled.TaskContainer>
                    }

                    {/* If the process is broken and it's at the broken index, then show a button there to fix it */}
                    {(!!selectedProcess.broken && currIndex === selectedProcess.broken - 1) &&

                    <Button
                        schema={'devices'}
                        // disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                        style={{marginBottom: '1rem', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
                        secondary
                        disabled={selectedTask?.new}
                        onClick={() => {
                            const newTask = generateDefaultRoute()
                            dispatchAddTask(newTask)
                            dispatchSetSelectedTask(newTask)
                            setNewRoute(newTask)
                            setFieldValue("newRoute", newTask)

                            // Tells the map that the new task is supposed to be fixing the process
                            // This means instead of only allowing to to pick a location that belongs to the last route
                            // Now you must pick a location that is connected to the location before the broken route occurs
                            dispatchSetFixingProcess(true)
                            setEditingTask(true)
                        }}
                    >
                        Add Route To Fix Process
                    </Button>

                    }
                </div>
            )
        })
    }

    const handleAddRoute = () => {

        return (
            <>

                <Button
                    schema={'processes'}
                    // disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                    secondary
                    disabled={selectedTask?.new}
                    onClick={() => {
                        const newTask = generateDefaultRoute()
                        console.log("edit_process newTask",newTask)
                        dispatchAddTask(newTask)
                        setNewRoute(newTask)
                        setFieldValue("newRoute", newTask)
                        dispatchSetSelectedTask(newTask)
                        setEditingTask(true)
                    }}
                >
                    Add Route
                </Button>

                {!!newRoute &&
                <styled.TaskContainer schema={'processes'}>
                    <TaskField
                        onSave={handleAddTask}
                        onDelete={handleDeleteRoute}
                        onRemove={handleRemoveTask}
                        onBackClick={handleTaskBack}
                        {...formikProps}
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        fieldParent={'newRoute'}
                        // selectedTaskCopy={newRoute}
                        // setSelectedTaskCopy={props => {
                        //     setSelectedTaskCopy(props)
                        //     setNewRoute(props)
                        // }}
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
    return(
        <>
            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={"Are you sure you want to delete this process?"}
                button_1_text={"Delete process and KEEP associated routes"}
                button_2_text={"Delete process and DELETE associated routes"}
                handleClose={() => setConfirmDeleteModal(null)}
                handleOnClick1={() => {
                    handleDeleteWithoutRoutes()
                    setConfirmDeleteModal(null)
                }}
                handleOnClick2={() => {
                    handleDeleteWithRoutes()
                    setConfirmDeleteModal(null)
                }}
            />
            <styled.Container>
                <div style={{ marginBottom: '1rem' }}>

                    <ContentHeader
                        content={'processes'}
                        mode={'create'}
                        disabled={(!!selectedTask && !!editingTask) || submitDisabled}
                        onClickSave={() => {
                            handleSave()
                        }}

                        onClickBack={() => {
                            handleBack()
                        }}

                    />

                </div>

                <div style={{marginBottom: "1rem"}}>
                    <TextField
                        focus={!values.name}
                        placeholder='Process Name'
                        defaultValue={selectedProcess.name}
                        schema={'processes'}
                        name={`name`}
                        InputComponent={Textbox}
                        style={{ fontSize: '1.2rem', fontWeight: '600'}}
                        textboxContainerStyle={{border: "none"}}
                        // IconContainerComponent={styled.QuantityErrorContainerComponent}
                    />
                </div>

                <styled.Title schema={'processes'}>Associated Routes</styled.Title>
                <styled.SectionContainer>
                    {handleExistingRoutes(values.routes)}

                </styled.SectionContainer>

                {handleAddRoute()}

                <div style={{ height: "100%", paddingTop: "1rem" }} />

                {/* Delete Task Button */}
                <Button
                    schema={'processes'}
                    disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                    style={{ marginBottom: '0rem', borderColor: 'red' }}
                    secondary
                    onClick={() => {
                        setConfirmDeleteModal(true)
                    }}
                >
                    Delete
                </Button>

            </styled.Container>
        </>

    )
}

export default ProcessField
