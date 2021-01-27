import React, {useState, useEffect, useRef} from 'react'

// external functions
import uuid from 'uuid'
import { useSelector, useDispatch } from 'react-redux'

// internal components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'
import TaskField from '../../tasks/task_field/route_field'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import TextField from "../../../../basic/form/text_field/text_field";
import ListItemField from "../../../../basic/form/list_item_field/list_item_field";

// Import actions
import {
    deleteRouteClean,
    postRouteClean,
    putRouteClean,
    setSelectedTask,
} from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import {handlePostTaskQueue, postTaskQueue} from '../../../../../redux/actions/task_queue_actions'

// Import Utils
import {
    generateDefaultRoute, getLoadStationDashboard,
    getRouteProcesses,
    isHumanTask,
    isMiRTask
} from "../../../../../methods/utils/route_utils";
import {isBrokenProcess, willRouteAdditionFixProcess, willRouteDeleteBreakProcess} from "../../../../../methods/utils/processes_utils";
import {isEmpty, isObject} from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

// styles
import * as styled from './process_field.style'
import {DEVICE_CONSTANTS} from "../../../../../constants/device_constants";
import {throttle} from "../../../../../methods/utils/function_utils";

export const ProcessField = (props) => {
    const {
        formikProps,
        onDelete,
        onSave,
        onBack,
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
    const dispatchSetSelectedTask = async (task) => await dispatch(setSelectedTask(task))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const onHandlePostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))
    const dispatchSetFixingProcess = async (bool) => await dispatch(setFixingProcess(bool))
    const dispatchDeleteRouteClean = async (routeId) => await dispatch(deleteRouteClean(routeId))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)

    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    // State definitions
    const [shift, ] = useState(false) // Is shift key pressed ?
    const [isTransportTask, ] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [editingTask, setEditingTask] = useState(false) // Used to tell if a task is being edited
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [showExistingTaskWarning, setShowExistingTaskWarning] = useState(false);

    const valuesRef = useRef(values);

    // throttled func
    const [dispatchSetSelectedProcess_Throttled, ] = useState(()=>throttle(
        ()=> {
            if(valuesRef.current) dispatchSetSelectedProcess({
                ...valuesRef.current,
            })
        }, 500));

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    useEffect(() => {

        // update selectedProcess (throttled to reduce lag from updating constantly
        dispatchSetSelectedProcess_Throttled()

        return () => {}

    }, [values]);

    useEffect(() => {

        // when editing task is toggled off, reset newRoute
        if(!editingTask) {
            setFieldTouched("newRoute", {})
            setFieldError("newRoute", {})
            setFieldValue("newRoute", null)
        }

    }, [editingTask])

    const handleAddTask = async () => {

        // contains new route
        if(values.newRoute) {
            // extract newRoute values
            const {
                needsSubmit,    // remove from route
                new: isNew,     // remove from route
                temp,
                ...remainingRoute
            } = values.newRoute || {}

            const {
                insertIndex
            } = temp || {}

            // add unsaved key if route being added doesn't already exist - used to determine if a route has been saved or not
            var newRoute
            if(tasks[remainingRoute._id]) {
                // task exists
                newRoute = {...remainingRoute}
            }
            else {
                // task doesn't exist, add unsaved key
                newRoute = {...remainingRoute, new: isNew}
            }

            // make copy of routes
            let updatedRoutes = [...values.routes]

            // add route to values at broken index
            updatedRoutes.splice(insertIndex, 0, newRoute)

            // if not a new process, go ahead and save new route
            if(!values.new) {
                await onSave({
                    ...values,
                    routes:  updatedRoutes
                }, false)
            }

            // update values
            setFieldValue("routes", updatedRoutes)
            setFieldValue("broken", isBrokenProcess(updatedRoutes))
            setEditingTask(false)
        }

        // not a new route
        else {
            // get data for route being edited
            const fieldMeta = getFieldMeta(editingTask)
            const {
                value: currRouteValue,
            } = fieldMeta

            const routeProcesses = getRouteProcesses(currRouteValue._id) // get routes processes
            const belongsToAnotherProcess = routeProcesses.findIndex((currProcess) => currProcess._id !== values._id) // does route belong to another process?

            // if route belongs to more than one process, give option to make a copy of the route so other processes won't be affected
            if(belongsToAnotherProcess !== -1) {
                setShowExistingTaskWarning(true)
            }

            // if it only belongs to one process, go ahead and update it
            else {
                updateExistingRoute()
            }

        }

        // clear newRoute and selectedTask
        setFieldValue("newRoute", null)
        dispatchSetSelectedTask(null)

        validateForm() // run validation so errors will show up right away
    }

    // clear selectedTask and add new route to values.routes
    const updateExistingRoute = () => {
        // if this is an existing process, go ahead and save the changes
        if(!values.new) {

            const fieldMeta = getFieldMeta(editingTask)
            const {
                initialValue,
                value: currRouteValue,
            } = fieldMeta

            // dispatchPutRouteClean(currRouteValue, currRouteValue._id)

            onSave(values, false)
        }

        // if not new route, only thing to check is if any changes broke the process
        setFieldValue("broken", isBrokenProcess(values.routes, tasks))
        setEditingTask(false)
    }

    const cloneRoute = async () => {
        // get current route's meta data
        const fieldMeta = getFieldMeta(editingTask)
        const {
            initialValue,
            value: currRouteValue,
        } = fieldMeta


        const {
            changed,
            needsSubmit,
            ...remainingValues
        } = currRouteValue || {}


        const newId = uuid.v4()
        const routeClone = {...remainingValues, _id: newId, new: true} // copy all attributes, but make new id

        // Not a new process, so save changes now
        if(!values.new) {

            // await dispatchPostRouteClean(routeClone)

            const index = editingTask.match(/\d+/)[0] // "3"
            const updatedRoutes = [...values.routes]
            updatedRoutes.splice(index, 1, routeClone) // replace existing route with new clone

            setFieldValue("routes", updatedRoutes)

            // save
            onSave({
                ...values,
                routes: updatedRoutes     // overwrite routes with the updated routes
            }, false)
        }

        else {
            // if process doesn't exist yet, just add to field
            setFieldValue(editingTask, {...routeClone, new: true})
        }

        // if not new route, only thing to check is if any changes broke the process
        setFieldValue("broken", isBrokenProcess(values.routes, tasks))
        setEditingTask(false)
    }

    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemoveRoute = (routeId) => {

        // clear editing values
        setEditingTask(false)
        setFieldValue("newRoute", null)
        dispatchSetSelectedTask(null)

        // update broken
        const willBreak = willRouteDeleteBreakProcess(values.routes, routeId)
        setFieldValue("broken", willBreak)

        // Remove the route from the process
        const index = values.routes.findIndex((currRoute) => currRoute._id === routeId)
        let updatedRoutes = [...values.routes]
        updatedRoutes.splice(index, 1)

        // update routes
        setFieldValue("routes", updatedRoutes)
    }

    const handleTaskBack = async () => {
        // clear newRoute and selectedTask
        setFieldValue("newRoute", null)
        await dispatchSetSelectedTask(null)
        setEditingTask(false)

        // run validation
        validateForm()
    }

    const handleDeleteRoute = async (routeId) => {
        setEditingTask(false)
        dispatchSetSelectedTask(null)

        const willBreak = willRouteDeleteBreakProcess(values.routes, routeId)
        if (!!willBreak) {
            setFieldValue("broken", willBreak)
        }

        await dispatchDeleteRouteClean(routeId)

        setFieldValue("routes", values.routes.filter(((currRoute) => currRoute._id !== routeId)))
    }

    const handleExecuteProcessTask = async (routeId) => {
        const task = tasks[routeId] || null
        console.log("handleExecuteProcessTask task",task)
        if(!isObject(task)) return

        const routeName = task.name

        let deviceType
        if(isMiRTask(task)) {
            // if MiR is available, default to MiR
            deviceType = DEVICE_CONSTANTS.MIR_100
        }
        else if(isHumanTask(task)){
            // otherwise if human is available, submit human
            deviceType = DEVICE_CONSTANTS.HUMAN
        }

        const dashboardID = getLoadStationDashboard(selectedTask)

        onHandlePostTaskQueue({dashboardID, tasks, deviceType, taskQueue, Id: routeId, name: routeName, custom: false, fromSideBar: true})
    }

    // Maps through the list of existing routes
    const renderRoutes = (routes) => {

        return routes.filter((currRoute, currIndex) => {

            if (currRoute === undefined) {
                return false
            }
            return true

        }).map((currRoute, currIndex) => {

            const {
                _id: currRouteId = "",
            } = currRoute || {}

            const isLast = currIndex === routes.length - 1
            const fieldName = `routes[${currIndex}]`

            return (
                <div key={`li-${currIndex}`}>
                    <ListItemField
                        containerStyle={{marginBottom: isLast ? 0 : "1rem"}}
                        name={fieldName}
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
                            setEditingTask(fieldName)
                            dispatchSetSelectedTask(currRoute)
                        }}
                        onTitleClick={() => {
                            setEditingTask(fieldName)
                            dispatchSetSelectedTask(currRoute)
                        }}
                        key={`li-${currIndex}`}
                    />



                    {/* If the process is broken and it's at the broken index, then show a button there to fix it */}
                    {(!!values.broken && currIndex === values.broken - 1) &&

                    <Button
                        schema={'devices'}
                        // disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                        style={{margin: 0, marginBottom: '1rem', width: "100%", textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
                        secondary
                        disabled={selectedTask?.new}
                        onClick={() => {
                            let prevObj
                            if(values.routes.length > 0) {
                                prevObj = values.routes[values.routes.length - 1].obj
                            }

                            const newTask = {...generateDefaultRoute(prevObj), temp: {insertIndex: values.broken}}

                            dispatchSetSelectedTask(newTask)
                            setFieldValue("newRoute", newTask)

                            // Tells the map that the new task is supposed to be fixing the process
                            // This means instead of only allowing to to pick a location that belongs to the last route
                            // Now you must pick a location that is connected to the location before the broken route occurs
                            dispatchSetFixingProcess(true)
                            setEditingTask("newRoute")
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
                    disabled={editingTask}
                    onClick={() => {

                        let prevObj
                        if(values.routes.length > 0) {
                            prevObj = values.routes[values.routes.length - 1].obj
                        }

                        const newTask = {...generateDefaultRoute(prevObj), temp: {insertIndex: values.routes.length}}
                        setFieldValue("newRoute", newTask)
                        dispatchSetSelectedTask(newTask)
                        setEditingTask("newRoute")
                    }}
                >
                    Add Route
                </Button>

            </>
        )
    }

    const handleAddBeginningRoute = () => {

        return (
            <>
                <Button
                    schema={'processes'}
                    // disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                    secondary
                    disabled={editingTask}
                    onClick={() => {

                        let prevObj
                        if(values.routes.length > 0) {
                            prevObj = values.routes[values.routes.length - 1].obj
                        }

                        const newTask = {...generateDefaultRoute(prevObj), temp: {insertIndex: 0}}

                        setFieldValue("newRoute", newTask)
                        dispatchSetSelectedTask(newTask)
                        setEditingTask("newRoute")
                    }}
                >
                    Add Route To Beginning
                </Button>

            </>
        )
    }

    const getChildren = () => {
        const fieldMeta = getFieldMeta(editingTask)
        const {
            value: currRouteValue,
        } = fieldMeta
        const routeProcesses = getRouteProcesses(currRouteValue._id)

        return(
            <div>
                {routeProcesses.map((currProcess) => {
                    const {
                        name: currProcessName
                    } = currProcess

                    return <div>{currProcessName} aaaa</div>
                })}
            </div>

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
                    onDelete(false)
                    setConfirmDeleteModal(null)
                }}
                handleOnClick2={() => {
                    onDelete(true)
                    setConfirmDeleteModal(null)
                }}
            />

            {showExistingTaskWarning &&
            <ConfirmDeleteModal
                isOpen={!!showExistingTaskWarning}
                title={"Changing an existing route will affect other processes that use this route. Would you like to make a copy, or change the existing route?"}
                button_1_text={"Make a Copy"}
                button_2_text={"Change the Existing Route"}
                handleClose={() => setShowExistingTaskWarning(false)}
                children={getChildren()}
                handleOnClick1={() => {
                    cloneRoute()
                    setShowExistingTaskWarning(false)
                }}
                handleOnClick2={() => {
                    updateExistingRoute()
                    setShowExistingTaskWarning(false)

                }}
            />
            }

            <styled.Container>
                <div style={{ marginBottom: '1rem' }}>
                    <ContentHeader
                        content={'processes'}
                        mode={'create'}
                        disabled={(!!selectedTask && !!editingTask) || submitDisabled}
                        onClickSave={() => {
                            onSave(values, true)
                        }}

                        onClickBack={() => {
                            onBack()
                        }}

                    />
                </div>

                <div style={{marginBottom: "1rem"}}>
                    <TextField
                        focus={!values.name}
                        placeholder='Process Name'
                        defaultValue={values.name}
                        schema={'processes'}
                        name={`name`}
                        InputComponent={Textbox}
                        style={{ fontSize: '1.2rem', fontWeight: '600'}}
                        textboxContainerStyle={{border: "none"}}
                    />
                </div>

                {editingTask && selectedTask ?
                <styled.TaskContainer schema={'processes'}>
                    <TaskField
                        {...formikProps}
                        onRemove={handleRemoveRoute}
                        onDelete={handleDeleteRoute}
                        onBackClick={handleTaskBack}
                        onSave={handleAddTask}
                        fieldParent={editingTask}
                        shift={shift}
                        isTransportTask={isTransportTask}
                        isProcessTask={true}
                        toggleEditing={(props) => {
                            setEditingTask(props)
                        }}
                    />
                </styled.TaskContainer>
                    :
                    <>
                        <styled.Title schema={'processes'}>Associated Routes</styled.Title>

                        {values.routes.length > 0 && handleAddBeginningRoute()}

                        <styled.SectionContainer
                            showTopBorder={values.routes.length > 0}
                        >
                            {values.routes.length > 0 ?
                                renderRoutes(values.routes)
                                :
                                <styled.InfoText></styled.InfoText>

                            }
                        </styled.SectionContainer>

                        {handleAddRoute()}

                        {/*<div style={{ height: "100%", paddingTop: "1rem" }} />*/}

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
                    </>
                }



            </styled.Container>
        </>

    )
}

export default ProcessField
