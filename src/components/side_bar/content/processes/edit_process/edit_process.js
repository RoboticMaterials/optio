import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import * as styled from './edit_process.style'
import { useSelector, useDispatch } from 'react-redux'
import {Formik, useField} from "formik";
import {Form} from "formik";

// Import basic components
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'

// Import components
import EditTask from '../../tasks/edit_task/edit_task'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'


// Import actions
import {
    setSelectedTask,
    deselectTask,
    addTask,
    putTask,
    deleteTask,
    setTasks, removeTask
} from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, postProcesses, putProcesses, deleteProcesses, setFixingProcess } from '../../../../../redux/actions/processes_actions'
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

// Import Utils
import {isEquivalent, deepCopy, convertArrayToObject} from '../../../../../methods/utils/utils'
import uuid from 'uuid'
import {DEVICE_CONSTANTS} from "../../../../../constants/device_constants";
import {generateDefaultRoute} from "../../../../../methods/utils/route_utils";
import {CARD_SCHEMA_MODES, getCardSchema, processSchema} from "../../../../../methods/utils/form_schemas";
import TextField from "../../../../basic/form/text_field/text_field";
import * as taskActions from "../../../../../redux/actions/tasks_actions";
import {getMessageFromError} from "../../../../../methods/utils/form_utils";
import ErrorTooltip from "../../../../basic/form/error_tooltip/error_tooltip";


export const ProcessForm = (props) => {
    const {
        formikProps,
        setSelectedProcessCopy,
        toggleEditingProcess,
        selectedProcessCopy
    } = props

    // extract formik props
    const {
        errors,
        values,
        touched,
        isSubmitting,
        submitCount,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        submitForm
    } = formikProps




    const errorCount = Object.keys(errors).length // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    const history = useHistory()
    const dispatch = useDispatch()
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchAddTask = (task) => dispatch(addTask(task))
    const dispatchSetTasks = (tasks) => dispatch(setTasks(tasks))
    const dispatchRemoveTask = (taskId) => dispatch(removeTask(taskId))
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchPutTask = (task, ID) => dispatch(putTask(task, ID))
    const dispatchDeleteTask = (ID) => dispatch(deleteTask(ID))
    const dispatchPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const onTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })

    const dispatchPostProcess = async (process) => await dispatch(postProcesses(process))
    const dispatchPostRoute = async (route) => await dispatch(taskActions.postTask(route))
    const dispatchPutProcess = async (process) => await dispatch(putProcesses(process))
    const dispatchDeleteProcess = async (ID) => await dispatch(deleteProcesses(ID))
    const dispatchSetFixingProcess = async (bool) => await dispatch(setFixingProcess(bool))

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.locationsReducer.stations)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    // State definitions
    // const [selectedTaskCopy, setSelectedTaskCopy] = useState(null)  // Current task
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true) // Is this task a transport task (otherwise it may be a 'go to idle' type task)
    const [editingTask, setEditingTask] = useState(false) // Used to tell if a task is being edited
    const [newRoute, setNewRoute] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    console.log("formikProps",formikProps)

    // clear selectedTask and add new route to values.routes
    const handleAddTask = () => {

        setNewRoute(null)   // clear new route
        setFieldValue("new", null)

        dispatchSetSelectedTask(null)

        if(newRoute) {
            setFieldValue("routes", [...values.routes, {...values.new}])
        }
    }

    const handleTaskBack = async () => {
        console.log("handleTaskBack before selectedTask", selectedTask)

        // if unsaved should should immidiately disappear use this block
        // if(selectedTask.new) {
        //     dispatchRemoveTask(selectedTask._id)
        // }

        // if unsaved route should appear in process, use this block
        if(newRoute) {
            setFieldValue("routes", [...values.routes, {...values.new}])
        }


        setNewRoute(null)
        setFieldValue("new", null)
        await dispatchSetSelectedTask(null)
        console.log("handleTaskBack after selectedTask", selectedTask)
    }

    useEffect(() => {
        console.log('QQQQ selected process', selectedProcessCopy)
        return () => {

        }
    }, [])

    // automatically maps formik values to redux state for map view support
    useEffect(() => {

        // map process values to selectedProcess
        dispatchSetSelectedProcess({
            ...values,
            routes: values.routes.map((currRoute) => currRoute._id) // processes in redux only store the route keys
        })

        const valRoutes = values.routes
        console.log("valRoutes",valRoutes)

        // map values.routes to redux state
        if(valRoutes.length > 0) {
            const mappedR = convertArrayToObject(values.routes, "_id")
            console.log("mappedR",mappedR)
            dispatchSetTasks(mappedR)
        }

        return () => {

        }
    }, [values])


    useEffect(() => {
        if(!editingTask) {
            setFieldTouched("new", {})
            setFieldError("new", {})
            setFieldValue("new", null)
        }

    }, [editingTask])



    const handleExecuteProcessTask = async (route) => {
        if (tasks[route] != null) {
            if (tasks[route].device_type == 'human') {
                const dashboardId = stations[tasks[route].load.station].dashboards[0]

                const postToQueue = dispatch(postTaskQueue({ task_id: route, 'task_id': route, dashboard: dashboardId, hil_response: null, _id: uuid.v4(), }))
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

    const goToCardPage = () => {
        const currentPath = history.location.pathname
        history.push(currentPath + '/' + selectedProcessCopy._id + "/card")
    }





    const handleSave = async () => {

        dispatchSetSelectedTask(null)

        // If the id is new then post
        if (selectedProcessCopy.new) {

            await dispatchPostProcess(selectedProcess)

            values.routes.forEach(async (currRoute) => {
                dispatchPostRoute(currRoute)
            })

        }

        // Else put
        else {
            await dispatchPutProcess(selectedProcess)
        }

        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    const handleBack = async () => {

        await dispatchSetSelectedTask(null)
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

        dispatchSetSelectedTask(null)
        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    const handleDeleteWithoutRoutes = async () => {

        await dispatchDeleteProcess(selectedProcessCopy._id)

        dispatchSetSelectedTask(null)
        dispatchSetSelectedProcess(null)
        setSelectedProcessCopy(null)
        toggleEditingProcess(false)
    }

    console.log("edit_process values",values)
    console.log("edit_process errors",errors)
    console.log("edit_process touched",touched)

    // Maps through the list of existing routes
    const handleExistingRoutes = (routes) => {
        console.log("handleExistingRoutes", routes)

        return routes.map((currRoute, currIndex) => {

            // const hasError = (errors.routes && Array.isArray(errors.routes)) ? errors.routes[currIndex] : false

            const fieldMeta = formikProps.getFieldMeta(`routes[${currIndex}]`)
            const {
                error,
                touched,
            } = fieldMeta
            const hasError = error
            const errorMessage = getMessageFromError(error);

            const {
                name: currRouteName = "",
                _id: currRouteId = "",
                new: isNew
            } = currRoute || {}

            if (currRoute === undefined) {
                console.log('QQQQ undefined')
                return
            }

            return (
                <div key={`li-${currIndex}`}>
                    <styled.ListItem
                        error={hasError}
                        isNew={isNew}
                        key={`li-${currIndex}`}
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
                    >
                        <styled.ListItemIconContainer style={{ width: '15%' }}>
                            <styled.ListItemIcon
                                className='fas fa-play'
                                onClick={() => {
                                    handleExecuteProcessTask(currRouteId)
                                }}
                            />
                        </styled.ListItemIconContainer>

                        {/* <styled.ListItemTitle schema={props.schema} onClick={() => props.onClick(element)}>{element.name}</styled.ListItemTitle> */}
                        <styled.ListItemTitle
                            schema={'processes'}
                            onClick={() => {
                                setEditingTask(true)
                                dispatchSetSelectedTask(currRoute)
                            }}
                        >
                            {currRouteName}
                        </styled.ListItemTitle>

                        <styled.ListItemIconContainer>

                            <styled.ListItemIcon
                                className='fas fa-edit'
                                onClick={() => {
                                    setEditingTask(true)
                                    dispatchSetSelectedTask(currRoute)
                                }}
                                style={{ color: '#c6ccd3' }}
                            />

                            {isNew &&
                                <ErrorTooltip
                                    visible={isNew}
                                    text={"This route is not saved. Leaving the editor will remove the route."}
                                    className={"fas fa-exclamation-circle"}
                                    color={"yellow"}

                                    // ContainerComponent={IconContainerComponent}
                                />
                            }



                        </styled.ListItemIconContainer>

                    </styled.ListItem>
                    {editingTask && selectedTask && selectedTask._id === currRouteId &&
                    <styled.TaskContainer schema={'processes'}>

                        <EditTask
                            {...formikProps}
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
                        disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                        style={{marginBottom: '1rem', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
                        secondary
                        disabled={selectedTask?.new}
                        onClick={() => {
                            const newTask = generateDefaultRoute()
                            dispatchAddTask(newTask)
                            dispatchSetSelectedTask(newTask)
                            setNewRoute(newTask)
                            setFieldValue("new", newTask)

                            // var routesCopy = [...values.routes]
                            // routesCopy.splice(currIndex + 1, 0, newTask)
                            //
                            // setFieldValue("routes",
                            //     routesCopy
                            // )

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
        // })

    }

    const handleAddRoute = () => {

        return (
            <>

                <Button
                    schema={'processes'}
                    disabled={!!selectedProcess && !!selectedProcess._id && !!selectedProcess.new}
                    secondary
                    disabled={selectedTask?.new}
                    onClick={() => {
                        const newTask = generateDefaultRoute()
                        console.log("edit_process newTask",newTask)
                        dispatchAddTask(newTask)
                        setNewRoute(newTask)
                        setFieldValue("new", newTask)

                        // var routesCopy = [...values.routes]
                        // routesCopy.splice(values.routes.length, 0, newTask)
                        //
                        // setFieldValue("routes",
                        //     routesCopy
                        // )



                        dispatchSetSelectedTask(newTask)
                        setEditingTask(true)
                    }}
                >
                    Add Route
                </Button>

                {!!newRoute &&
                <styled.TaskContainer schema={'processes'}>
                    <EditTask
                        onSave={handleAddTask}
                        onBackClick={handleTaskBack}
                        {...formikProps}
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        fieldParent={`new`}
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
                        defaultValue={selectedProcessCopy.name}
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
const EditProcess = (props) => {

    const {
        selectedProcessCopy,
        setSelectedProcessCopy,
        toggleEditingProcess,

    } = props

    const tasks = useSelector(state => state.tasksReducer.tasks)



    return (
        <Formik
            initialValues={{
                name: selectedProcessCopy ? selectedProcessCopy.name : "",
                routes: (selectedProcessCopy && selectedProcessCopy.routes && Array.isArray(selectedProcessCopy.routes)) ? selectedProcessCopy.routes.map((currRouteId) => tasks[currRouteId])  : [],
                broken: selectedProcessCopy ? selectedProcessCopy.broken : false,
                new: null,
                _id: selectedProcessCopy ? selectedProcessCopy._id : uuid.v4()
            }}

            // validation control
            validationSchema={processSchema}
            validateOnChange={true}
            validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
            validateOnBlur={true}

            // enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
            onSubmit={async (values, formikHelpers) => {

                const {
                    setSubmitting,
                    setTouched,
                    resetForm
                } = formikHelpers

                // set submitting to true, handle submit, then set submitting to false
                // the submitting property is useful for eg. displaying a loading indicator
                const {
                    buttonType
                } = values

                setSubmitting(true)
                // await handleSubmit(values, formMode)
                setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
                setSubmitting(false)

            }}
        >
            {formikProps => {



                return(
                    <ProcessForm
                        formikProps={formikProps}
                        setSelectedProcessCopy={setSelectedProcessCopy}
                        toggleEditingProcess={toggleEditingProcess}
                        selectedProcessCopy={selectedProcessCopy}
                    />
                )

            }}

        </Formik>

    )
}


export default EditProcess
