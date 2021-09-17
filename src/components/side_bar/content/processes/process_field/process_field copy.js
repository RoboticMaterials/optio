import React, { useState, useEffect, useRef, useMemo } from 'react'

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

import Switch from 'react-ios-switch'


// Import actions
import {
    deleteRouteClean,
    postRouteClean,
    putRouteClean,
    setSelectedTask,
    setSelectedHoveringTask,
} from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { handlePostTaskQueue, postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions"
import { autoAddRoute } from '../../../../../redux/actions/tasks_actions'


// Import Utils
import {
    getLoadStationDashboard, autoGenerateRoute,
    getRouteProcesses,
    generateDefaultRoute
} from "../../../../../methods/utils/route_utils";
import { isBrokenProcess, willRouteAdditionFixProcess, willRouteDeleteBreakProcess } from "../../../../../methods/utils/processes_utils";
import { isEmpty, isObject } from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

// Constants
import { defaultRoute, defaultTask } from '../../../../../constants/route_constants'

// styles
import * as styled from './process_field.style'
import theme from '../../../../../theme'
import { DEVICE_CONSTANTS } from "../../../../../constants/device_constants";
import { throttle } from "../../../../../methods/utils/function_utils";
import { ADD_TASK_ALERT_TYPE } from "../../../../../constants/dashboard_constants";
import TaskAddedAlert
    from "../../../../widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
import { getSidebarDeviceType, isRouteInQueue } from "../../../../../methods/utils/task_queue_utils";
import { isDeviceConnected } from "../../../../../methods/utils/device_utils";
import AddRouteButtonPath from '../../../../../graphics/svg/add_route_button_path'

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
        if (!isEmpty(currError)) errorCount++
    }) // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting || !values.changed) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = async (task) => await dispatch(setSelectedTask(task))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const onHandlePostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))
    const dispatchSetFixingProcess = async (bool) => await dispatch(setFixingProcess(bool))
    const dispatchDeleteRouteClean = async (routeId) => await dispatch(deleteRouteClean(routeId))
    const dispatchSetSelectedHoveringTask = (task) => dispatch(setSelectedHoveringTask(task))
    const dispatchAutoAddRoute = (bool) => dispatch(autoAddRoute(bool))


    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const fixingProcess = useSelector(state => state.processesReducer.fixingProcess)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const autoAddRoutes = useSelector(state => state.tasksReducer.autoAddRoute)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const routeConfirmationLocation = useSelector(state => state.tasksReducer.routeConfirmationLocation)
    // State definitions
    const [shift,] = useState(false) // Is shift key pressed ?
    const [isTransportTask,] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [showExistingTaskWarning, setShowExistingTaskWarning] = useState(false);
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [processRoutes, setProcessRoutes] = useState(null);
    const valuesRef = useRef(values);
    // throttled func
    const [dispatchSetSelectedProcess_Throttled,] = useState(() => throttle(
        () => {
            if (valuesRef.current) dispatchSetSelectedProcess({
                ...valuesRef.current,
            })
        }, 500));

    // currRoute is the formik equivilant of the selected route.
    // This allows us to edit the formik properties and sync them to selection events on the map
    // useEffect(() => {
    //     setFieldValue("currRoute", selectedTask)
    // }, [selectedTask])
    // useEffect(() => {
    //     dispatchSetSelectedTask(values.currRoute)
    // }, [values.currRoute])

    const editingRoute = useMemo(() => {
        if (!!selectedTask) {
            return 'currRoute';
        } else {
            return null;
        }
    }, [selectedTask])

    useEffect(() => {
        valuesRef.current = values;
    }, [values]);

    useEffect(() => {
        handleAutoAddRoute()

        return () => {

        }
    }, [autoAddRoutes])

    useEffect(() => {

        // update selectedProcess (throttled to reduce lag from updating constantly
        dispatchSetSelectedProcess_Throttled()


        return () => { }

    }, [values]);

    useEffect(() => {

        setProcessRoutes(values.routes)

    }, [values.routes]);

    useEffect(() => {
        if (!selectedTask) {
            dispatchSetSelectedHoveringTask(null)
        }
    })

    const handleSaveRoute = async (route) => {

        let routesCopy = [...values.routes]
        if (route._id) { // If the route already exists
            // make copy of routes and insert new route

            let insertIndex = routesCopy.findIndex(currRoute => currRoute._id === route._id)
            routesCopy.splice(insertIndex, 0, route)
        } else {
            delete route.new;
            routesCopy.push(route)
        }

        // update values
        setFieldValue("routes", routesCopy)
        setFieldValue("broken", isBrokenProcess(routesCopy))

        // clear selectedTask
        dispatchSetSelectedTask(null)

        validateForm() // run validation so errors will show up right away
    }



    /**
     * Removes the route from the array of routes for a process
     */
    const handleRemoveRoute = (routeId) => {

        // clear editing values
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

        var newRoute = true;

        Object.values(selectedProcess.routes).map((route) => {
            if (route._id === selectedTask._id) {
                newRoute = false;
            }
        })

        if (newRoute === false) {
            const index = values.routes.findIndex((currRoute) => currRoute._id === selectedTask._id)
            let updatedRoutes = [...values.routes]
            updatedRoutes.splice(index, 1)
            updatedRoutes.splice(index, 0, selectedTask)

            setFieldValue("routes", updatedRoutes)
        }

        // clear selectedTask

        await dispatchSetSelectedTask(null)

        // run validation
        validateForm()
    }

    const handleDeleteRoute = async (routeId) => {
        dispatchSetSelectedTask(null)

        const willBreak = willRouteDeleteBreakProcess(values.routes, routeId)
        setFieldValue("broken", willBreak)

        await dispatchDeleteRouteClean(routeId)

        setFieldValue("routes", values.routes.filter(((currRoute) => currRoute._id !== routeId)))
    }

    const handleIsRouteInProcess = () => {
        var inProcess = false;

        Object.values(selectedProcess?.routes).map((route) => {
            if (route._id === selectedTask?._id) {
                inProcess = true;
            }
        })

        return inProcess

    }

    const handleExecuteProcessTask = async (routeId) => {
        const task = tasks[routeId] || null
        if (!isObject(task)) return

        const routeName = task.name
        const deviceType = getSidebarDeviceType(task)

        const inQueue = isRouteInQueue(routeId, deviceType)

        const connectedDeviceExists = isDeviceConnected()

        if (!connectedDeviceExists && deviceType !== DEVICE_CONSTANTS.HUMAN) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! No device is currently connected to run this route",
                message: `'${routeName}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        // add alert to notify task has been added
        // If in Q, then tell them it's already there
        if (inQueue) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! Task Already in Queue",
                message: `'${routeName}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        // Else see what type of task it is and add accordingly
        else {
            const dashboardID = getLoadStationDashboard(selectedTask)



            // Handle Add
            if (deviceType !== 'human') {
                setAddTaskAlert({
                    type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: routeName
                })

                // clear alert after timeout
                setTimeout(() => setAddTaskAlert(null), 1800)
            }
            onHandlePostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, Id: routeId, name: routeName, custom: false, fromSideBar: true })
        }
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

            const deviceType = getSidebarDeviceType(currRoute)
            const inQueue = isRouteInQueue(currRouteId, deviceType)

            return (
                <div key={`li-${currIndex}`}>
                    <ListItemField
                        playDisabled={inQueue || addTaskAlert}
                        showPlay={inQueue || addTaskAlert}
                        containerStyle={{ margin: '0.5rem' }}
                        name={fieldName}
                        onMouseEnter={() => {
                            if (!selectedTask) {
                                dispatchSetSelectedTask(currRoute)
                            }

                        }}
                        onMouseLeave={() => {
                            if (selectedTask !== null) {
                                dispatchSetSelectedTask(null)
                            }
                        }}
                        onIconClick={() => {
                            handleExecuteProcessTask(currRouteId)
                        }}
                        onEditClick={() => {
                            dispatchSetSelectedTask(currRoute)
                        }}
                        onTitleClick={() => {
                            dispatchSetSelectedTask(currRoute)
                        }}
                        key={`li-${currIndex}`}
                    />

                    {/* If the process is broken and it's at the broken index, then show a button there to fix it */}
                    {(!!values.broken && currIndex === values.broken - 1) &&

                        <Button
                            schema={'devices'}
                            // disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                            style={{ margin: '0 0.5rem', width: 'calc(100% - 1rem)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                            disabled={selectedTask?.new}
                            tertiary
                            onClick={() => {
                                let prevObj
                                if (values.routes.length > 0) {
                                    prevObj = values.routes[values.routes.length - 1].obj
                                }

                                dispatchSetSelectedTask(generateDefaultRoute(selectedProcess._id))

                                // Tells the map that the new task is supposed to be fixing the process
                                // This means instead of only allowing to to pick a location that belongs to the last route
                                // Now you must pick a location that is connected to the location before the broken route occurs
                                dispatchSetFixingProcess(true)
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

        dispatchSetSelectedTask(generateDefaultRoute(selectedProcess._id))

    }


    const handleAutoAddRoute = () => {
        handleAddRoute()

        let prevObj
        if (values.routes.length > 0) {
            prevObj = values.routes[values.routes.length - 1].obj
        }

        var ind = values.routes.length + 1

        const newTask = { ...autoGenerateRoute(prevObj), temp: { insertIndex: ind } }
        dispatchSetSelectedTask(newTask)
        dispatchAutoAddRoute(false)
    }

    const handleAddBeginningRoute = () => {

        const onAddToBeginningClick = () => {

            let prevObj
            if (values.routes.length > 0) {
                prevObj = values.routes[values.routes.length - 1].obj
            }

            dispatchSetSelectedTask(generateDefaultRoute(selectedProcess._id))
        }

        if (values.routes.length > 0) {
            return (
                <svg height="3.8rem" style={{ margin: '0.5rem 2rem 0.5rem 2rem', transformOrigin: 'center', cursor: 'pointer' }} onClick={onAddToBeginningClick}>
                    <svg style={{ overflow: 'visible' }} viewBox="0 0 300 68.5" preserveAspectRatio="none"  >
                        <path fill="url(#processGrad)" d={AddRouteButtonPath} />
                    </svg>
                    <g fill={theme.main.bg.octonary} viewBox="0 0 300 68.5" height="3.5rem" width="100%" style={{ border: '1px solid blue', transformOrigin: 'center' }} transform="translate(-60, 10)">
                        {/* <styled.SVGText x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">Add new route to Start</styled.SVGText> */}
                        <foreignObject x="50%" y="5%" height="8rem" width="8rem">
                            <p style={{ textAlign: 'center' }} xmlns="http://www.w3.org/1999/xhtml">Add new <br /> route to start</p>
                        </foreignObject>
                    </g>
                </svg>
            )
        }
        else return null
    }

    return (
        <>
            <TaskAddedAlert
                containerStyle={{
                    'position': 'absolute'
                }}
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

            <ConfirmDeleteModal
                isOpen={!!confirmExitModal}
                title={"Are you sure you want to go back? Any progress will not be saved"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => setConfirmExitModal(null)}
                handleOnClick1={() => {
                    onBack()
                }}
                handleOnClick2={() => {
                    setConfirmExitModal(null)
                }}
            />

            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={"Are you sure you want to delete this process?"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => setConfirmDeleteModal(null)}
                handleOnClick1={() => {
                    onDelete(true)
                    setConfirmDeleteModal(null)
                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                }}
            />

            {/* {showExistingTaskWarning &&
                <ConfirmDeleteModal
                    isOpen={!!showExistingTaskWarning}
                    title={"Changing an existing route will affect other processes that use this route. Would you like to make a copy, or change the existing route?"}
                    button_1_text={"Make a Copy"}
                    button_2_text={"Change the Existing Route"}
                    handleClose={() => setShowExistingTaskWarning(false)}
                    children={getChildren()}
                />
            } */}

            <styled.Container>

                <div style={{ marginBottom: '1rem' }}>

                    <ContentHeader
                        content={'processes'}
                        mode={'create'}
                        disabled={!!selectedTask || submitDisabled}
                        onClickSave={() => {
                            onSave(values, true)
                        }}

                        onClickBack={() => {
                            pageInfoChanged ? setConfirmExitModal(true) : onBack()
                        }}

                    />
                </div>

                <div >
                    <styled.Title schema={'default'}>Process Name</styled.Title>
                    <TextField
                        focus={!values.name}
                        placeholder='Process Name'
                        defaultValue={values.name}
                        schema={'processes'}
                        name={`name`}
                        InputComponent={Textbox}
                        style={{ fontSize: '1.2rem', fontWeight: '100' }}
                        textboxContainerStyle={{ border: "none" }}
                    />
                </div>

                <styled.RowContainer style={{ justifyContent: 'space-between', borderBottom: "solid #b8b9bf 0.1rem", paddingBottom: "0.5rem", marginTop: "2.5rem", marginBottom: ".7rem" }}>
                    <styled.Title style={{ fontSize: "1rem", paddingTop: "0.4rem" }}>Show in Summary View</styled.Title>

                    <Switch
                        onColor='#FF4B4B'
                        checked={values.disperseKickoff}
                        onChange={() => {
                            setFieldValue("disperseKickoff", !values.disperseKickoff)
                        }}
                    />

                </styled.RowContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between', borderBottom: "solid #b8b9bf 0.1rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
                    <styled.Title style={{ fontSize: "1rem", paddingTop: "0.4rem" }}>Show Statistics</styled.Title>

                    <Switch
                        onColor='#FF4B4B'
                        checked={values.showStatistics}
                        onChange={() => {
                            setFieldValue("showStatistics", !values.showStatistics)
                        }}
                    />

                </styled.RowContainer>
                <styled.Title schema={'processes'} style={{ marginTop: "1rem", marginBottom: "1rem" }}>Associated Routes</styled.Title>

                {selectedTask ?
                    <TaskField
                        {...formikProps}
                        isNew={selectedTask.new}
                        onRemove={handleRemoveRoute}
                        onDelete={handleDeleteRoute}
                        onBackClick={handleTaskBack}
                        onSave={handleSaveRoute}
                        fieldParent={editingRoute}
                        shift={shift}
                        isTransportTask={isTransportTask}
                        isProcessTask={true}
                        isTaskInProcess={handleIsRouteInProcess()}
                        toggleEditing={(props) => {
                        }}
                    />
                    :
                    <>

                        <styled.ContentContainer>
                            <styled.AddRoutesContainer style={{ height: "auto" }}>
                                <>
                                    {handleAddBeginningRoute()}

                                    {values.routes.length > 0 ?
                                        renderRoutes(values.routes)
                                        :
                                        <styled.InfoText></styled.InfoText>

                                    }

                                    {handleAddRoute()}

                                </>
                            </styled.AddRoutesContainer>


                            {/* Delete Task Button */}
                            <styled.ColumnContainer>
                                <Button
                                    schema={'processes'}
                                    disabled={!!selectedTask || submitDisabled}
                                    onClick={() => {
                                        onSave(values, true)
                                    }}
                                >
                                    Save Process
                                </Button>

                                {/* Delete Task Button */}
                                <Button
                                    schema={'error'}
                                    disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                                    secondary
                                    onClick={() => {
                                        setConfirmDeleteModal(true)
                                    }}
                                >
                                    Delete Process
                                </Button>
                            </styled.ColumnContainer>
                        </styled.ContentContainer>
                    </>
                }

            </styled.Container>
        </>

    )
}

export default ProcessField
