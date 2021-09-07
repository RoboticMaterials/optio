import React, { useState, useEffect, useRef, useMemo, useContext } from 'react'

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
    postTask, 
    putTask, 
    deleteTask, 
    setSelectedTask,
    setSelectedHoveringTask,
} from '../../../../../redux/actions/tasks_actions'
import { setSelectedProcess, setProcessAttributes } from '../../../../../redux/actions/processes_actions'
import { handlePostTaskQueue, postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { pageDataChanged } from "../../../../../redux/actions/sidebar_actions"
import { autoAddRoute } from '../../../../../redux/actions/tasks_actions'


// Import Utils
import {
    getLoadStationDashboard, autoGenerateRoute,
    getRouteProcesses
} from "../../../../../methods/utils/route_utils";
import { isBrokenProcess, willRouteAdditionFixProcess, willRouteDeleteBreakProcess } from "../../../../../methods/utils/processes_utils";
import { isEmpty, isObject } from "../../../../../methods/utils/object_utils";
import useChange from "../../../../basic/form/useChange";

// Constants
import { defaultRoute, defaultTask } from '../../../../../constants/route_constants'

// styles
import * as styled from './process_field.style'
import {ThemeContext} from "styled-components";
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

    const themeContext = useContext(ThemeContext)

    useChange() // adds changed key to values - true if the field has changed
    let errorCount = 0
    Object.values(errors).forEach((currError) => {
        if (!isEmpty(currError)) errorCount++
    }) // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting || !values.changed) //&& (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = async (task) => await dispatch(setSelectedTask(task))
    const dispatchSetSelectedHoveringTask = (task) => dispatch(setSelectedHoveringTask(task))

    const dispatchPostRoute = async (route) => await dispatch(postTask(route))
    const dispatchPutRoute = async (route) => await dispatch(putTask(route, route._id))
    const dispatchDeleteRoute = async (routeId) => await dispatch(deleteTask(routeId))

    const dispatchSetProcessAttributes = async (id, attr) => await dispatch(setProcessAttributes(id, attr))

    const { tasks, selectedTask } = useSelector(state => state.tasksReducer)
    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)

    // State definitions
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [confirmExitModal, setConfirmExitModal] = useState(false);
    const [routeCopy, setRouteCopy] = useState(null);

    // Handles a new route being drawn on the map
    useEffect(() => {
        if (selectedTask == null) {return}
        const formikSelectedTask = values.routes.find(route => route._id === selectedTask._id);
        if (!!selectedTask.unload && formikSelectedTask === undefined) {
            let processRoutesCopy = values.routes;

            // Set the new route's partname to be that of the preceeding route.
            const selectedTaskCopy = selectedTask
            if (selectedTaskCopy.part === null) {
                const preceedingRoutes = processRoutesCopy.filter(route => route._id !== selectedTask._id && route.unload === selectedTask.load)
                for (var preceedingRoute of preceedingRoutes) {
                    if (!!preceedingRoute.part) {
                        selectedTaskCopy.part = preceedingRoute.part;
                        break;
                    }
                }
            }
            
            processRoutesCopy.push(selectedTaskCopy);
            setFieldValue('routes', processRoutesCopy)
            dispatchSetProcessAttributes(selectedTask._id, {...selectedTaskCopy})
        }
    }, [selectedTask])

    const handleSaveRoute = (routeId) => {
        const savingRoute = values.routes.find(route => route._id === routeId)
        if (savingRoute.isNew) {
            dispatchPostRoute(savingRoute);
        } else {
            dispatchPutRoute(savingRoute);
        }
        dispatchSetSelectedTask(null);
        dispatchSetProcessAttributes(selectedProcess._id, {routes: values.routes})
    }

    const handleRemoveRoute = (routeId) => {
        const processRoutes = values.routes;
        const deleteIdx = processRoutes.findIndex(route => route._id === routeId);
        processRoutes.splice(deleteIdx, 1);
        setFieldValue("routes", processRoutes);

        dispatchDeleteRoute(routeId);
        dispatchSetSelectedTask(null);
        dispatchSetProcessAttributes(selectedProcess._id, {routes: processRoutes})
    }

    const handleRouteBack = async (routeId) => {
        const processRoutes = values.routes;
        const editedIdx = processRoutes.findIndex(route => route._id === routeId);
        if (tasks[routeId] === undefined) {
            processRoutes.splice(editedIdx, 1);
        } else {
            processRoutes[editedIdx] = routeCopy;
            setRouteCopy(null)
        }
        setFieldValue("routes", processRoutes);
        dispatchSetSelectedTask(null);
        dispatchSetProcessAttributes(selectedProcess._id, {routes: processRoutes})
    }


    // Maps through the list of existing routes
    const renderRoutes = (routes) => {
        return routes.map((currRoute, currIndex) => {

            const {
                _id: currRouteId = "",
            } = currRoute || {}

            const fieldName = `routes[${currIndex}]`

            return (
                <ListItemField
                    containerStyle={{ margin: '0.5rem' }}
                    name={fieldName}
                    onMouseEnter={() => {
                        dispatchSetSelectedHoveringTask(currRoute)
                    }}
                    onMouseLeave={() => {
                        dispatchSetSelectedHoveringTask(null)
                    }}
                    onEditClick={() => {
                        setRouteCopy(currRoute)
                        dispatchSetSelectedTask(currRoute)
                        dispatchSetSelectedHoveringTask(null)
                    }}
                    key={`li-${currIndex}`}
                />
            )
        })
    }


    return (
        <>

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
                        onColor={themeContext.fg.primary}
                        checked={values.showSummary}
                        onChange={() => {
                            setFieldValue("showSummary", !values.showSummary)
                        }}
                    />

                </styled.RowContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between', borderBottom: "solid #b8b9bf 0.1rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
                    <styled.Title style={{ fontSize: "1rem", paddingTop: "0.4rem" }}>Show Statistics</styled.Title>

                    <Switch
                        onColor={themeContext.fg.primary}
                        checked={values.showStatistics}
                        onChange={() => {
                            setFieldValue("showStatistics", !values.showStatistics)
                        }}
                    />

                </styled.RowContainer>
                <styled.Title schema={'processes'} style={{ marginTop: "1rem", marginBottom: "1rem" }}>Routes</styled.Title>
                

                {selectedTask === null &&
                    <>
                        <styled.HelpText>Click a station on the map to start a route</styled.HelpText>
                        {renderRoutes(values.routes)}
                        {typeof errors.routes === 'string' &&
                            <styled.ErrorText>{errors.routes}</styled.ErrorText>
                        }
                    </>
                }

                {!!selectedTask && values.routes.find(route => route._id === selectedTask._id) !== undefined ?
                    <TaskField
                        {...formikProps}
                        onSave={handleSaveRoute}
                        onRemove={handleRemoveRoute}
                        onBack={handleRouteBack}
                    />
                    :
                    <styled.ContentContainer>

                        {/* Save/Delete Buttons */}
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
                }

            </styled.Container>
        </>

    )
}

export default ProcessField
