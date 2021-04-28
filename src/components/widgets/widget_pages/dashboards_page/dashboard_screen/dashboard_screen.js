import React, { Component, useState, useEffect } from 'react';

// import external functions
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'

// Import components
import TaskAddedAlert from './task_added_alert/task_added_alert'
import DashboardsHeader from "../dashboards_header/dashboards_header";
import DashboardLotList from './dashboard_lot_list/dashboard_lot_list'
import DashboardLotPage from './dashboard_lot_page/dashboard_lot_page'

// Import Modals
import ReportModal from "./report_modal/report_modal";
import KickOffModal from "./kick_off_modal/kick_off_modal";
import FinishModal from "./finish_modal/finish_modal";
import TaskQueueModal from './task_queue_modal/task_queue_modal'

// constants
import { ADD_TASK_ALERT_TYPE, PAGES, OPERATION_TYPES } from "../../../../../constants/dashboard_constants";

// Import Utils
import { deepCopy } from '../../../../../methods/utils/utils'

// Import Hooks
import useWindowSize from '../../../../../hooks/useWindowSize'

// Import Actions
import { handlePostTaskQueue, postTaskQueue, putTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import {
    dashboardOpen,
    setDashboardKickOffProcesses,
    putDashboard,
    putDashboardAttributes
} from '../../../../../redux/actions/dashboards_actions'
import * as localActions from '../../../../../redux/actions/local_actions'
import { getProcesses } from "../../../../../redux/actions/processes_actions";
import { getTasks } from '../../../../../redux/actions/tasks_actions'

// Import styles
import * as pageStyle from '../dashboards_header/dashboards_header.style'
import * as style from './dashboard_screen.style'

// import logging
import log from "../../../../../logger";
import { isEmpty, isObject } from "../../../../../methods/utils/object_utils";
import { isDeviceConnected } from "../../../../../methods/utils/device_utils";
import { immutableDelete, isArray, isNonEmptyArray } from "../../../../../methods/utils/array_utils";



const logger = log.getLogger("DashboardsPage");

const widthBreakPoint = 1026;

const DashboardScreen = (props) => {

    const params = useParams()

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}

    // redux state
    // const currentDashboard = useSelector(state => { return state.dashboardsReducer.dashboards[dashboardID] })
    const dashboards = useSelector(state => { return state.dashboardsReducer.dashboards })
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const hilResponse = useSelector(state => state.taskQueueReducer.hilResponse)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const availableKickOffProcesses = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardID] })
    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardID] })
    const stations = useSelector(state => state.stationsReducer.stations)


    const currentDashboard = dashboards[dashboardID]

    //actions
    const dispatchGetProcesses = () => dispatch(getProcesses())
    const dispatchPutDashboard = async (dashboard, id) => await dispatch(putDashboard(dashboard, id))
    const dispatchPutDashboardAttributes = async (attributes, id) => await dispatch(putDashboardAttributes(attributes, id))
    const dispatchGetTasks = async () => await dispatch(getTasks())

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [reportModal, setReportModal] = useState({
        type: null,
        id: null
    });
    const {
        type: modalType,
        id: modalButtonId
    } = reportModal
    const [dashboardStation, setDashboardStation] = useState({});
    const {
        name: stationName
    } = dashboardStation || {}
    const [showLotsList, setShowLotsList] = useState(true)
    const [selectedOperation, setSelectedOperation] = useState(null)

    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))
    const onHandlePostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))
    const onHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const onLocalHumanTask = (bol) => dispatch({ type: 'LOCAL_HUMAN_TASK', payload: bol })
    const onPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchStopAPICalls = (bool) => dispatch(localActions.stopAPICalls(bool))

    const history = useHistory()
    const {
        name: dashboardName
    } = currentDashboard || {}

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    useEffect(() => {
        setDashboardStation(stations[stationID] || {})
    }, [stations, stationID])

    /**
     * When a dashboard screen is loaded, tell redux that its open
     * On unmount tell redux that its not loaded
     *
     * Used in app.js and widget pages to make dashboard screen full size in mobile mode
     */
    useEffect(() => {
        onDashboardOpen(true)
        dispatchGetProcesses()
        return () => {
            onDashboardOpen(false)
        }
    }, [])

    useEffect(() => {
        if (editing === 'lots') {
            setShowLotsList(false)
        }
        else {
            setShowLotsList(true)
        }
    }, [editing])

    // // if the task q contains a human task that is unloading, show an unload button
    // if (Object.values(taskQueue).length > 0) {

    //     // Map through each item and see if it's showing a station, station Id is matching the current station and a human task
    //     Object.values(taskQueue).forEach((item, ind) => {
    //         // If it is matching, add a button the the dashboard for unloading
    //         if (!!item.hil_station_id && item.hil_station_id === stationID && hilResponse !== item._id && item?.device_type === 'human') {
    //             filteredButtons = [
    //                 ...filteredButtons,
    //                 {
    //                     'name': item.hil_message,
    //                     'color': '#90eaa8',
    //                     'task_id': 'hil_success',
    //                     'custom_task': {
    //                         ...item
    //                     },
    //                     'id': `custom_task_charge_${ind}`
    //                 }
    //             ]
    //         }
    //     })
    // }


    // Posts HIL Success to API
    const handleHilSuccess = async (item) => {

        let newItem = {
            ...item,
            hil_response: true,
            // quantity: quantity,
        }

        const ID = deepCopy(item._id)

        delete newItem._id
        delete newItem.dashboard

        // This is used to make the tap of the HIL button respond quickly
        // TODO: This may not be necessary here
        onHILResponse(ID)
        setTimeout(() => onHILResponse(''), 2000)

        await onPutTaskQueue(newItem, ID)

    }

    const renderModal = () => {
        switch (selectedOperation) {
            case 'report':
                return (
                    <ReportModal
                        dashboardButtonId={modalButtonId}
                        isOpen={!!true}
                        title={"Send Report"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        onSubmit={(name, success) => {

                            // set alert
                            setAddTaskAlert({
                                type: success ? ADD_TASK_ALERT_TYPE.REPORT_SEND_SUCCESS : ADD_TASK_ALERT_TYPE.REPORT_SEND_FAILURE,
                                label: success ? "Report Sent" : "Failed to Send Report",
                                message: name ? `"` + name + `"` : null
                            })

                            // clear alert
                            setTimeout(() => setAddTaskAlert(null), 1800)
                        }}
                    />
                )
            case 'kickOff':
                return (
                    <KickOffModal
                        isOpen={true}
                        stationId={stationID}
                        title={"Kick Off"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        onSubmit={(name, success, quantity, message) => {
                            // set alert
                            setAddTaskAlert({
                                type: success ? ADD_TASK_ALERT_TYPE.KICK_OFF_SUCCESS : ADD_TASK_ALERT_TYPE.KICK_OFF_FAILURE,
                                label: success ? "Lot Kick Off Successful" : "Lot Kick Off Failed",
                                message: message
                            })

                            // clear alert
                            setTimeout(() => setAddTaskAlert(null), 1800)
                        }}
                    />
                )

            case 'finish':
                return (
                    <FinishModal
                        isOpen={true}
                        stationId={stationID}
                        title={"Finish"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        onSubmit={(name, success, quantity, message) => {
                            // set alert
                            setAddTaskAlert({
                                type: success ? ADD_TASK_ALERT_TYPE.FINISH_SUCCESS : ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
                                label: success ? "Finish Successful" : "Finish Failed",
                                message: message
                            })

                            // clear alert
                            setTimeout(() => setAddTaskAlert(null), 1800)
                        }}
                    />
                )

            case 'taskQueue':
                return (
                    <TaskQueueModal
                        isOpen={true}
                        close={() => setSelectedOperation(null)}

                    />
                )


            default:
                return (
                    <>
                    </>
                )
        }
    }

    return (
        <style.Container>

            {
                !!selectedOperation && renderModal()
            }

            <DashboardsHeader
                showTitle={false}
                showBackButton={false}
                showEditButton={true}
                currentDashboard={currentDashboard}
                handleOperationSelected={(op) => {
                    setSelectedOperation(op)
                }}
            />

            {
                showLotsList ?
                    <DashboardLotList />
                    :
                    <DashboardLotPage />
            }

            <TaskAddedAlert
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />



        </style.Container >
    )
}

export default DashboardScreen;
