import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'

// external functions
import { useSelector, useDispatch } from 'react-redux'
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Container } from 'react-smooth-dnd'
import { withRouter } from "react-router-dom";

// Import Components
import DashboardScreen from './dashboard_screen/dashboard_screen'

// Import Constants
import { OPERATION_TYPES } from '../../../../constants/dashboard_constants'

import { PAGES } from "../../../../constants/dashboard_constants";

import {
    getDashboards,
    setDashboardKickOffProcesses,
    setDashboardFinishProcesses,
    putDashboardAttributes
} from '../../../../redux/actions/dashboards_actions'
import { getTasks } from '../../../../redux/actions/tasks_actions'

// Import Styles
import * as style from './dashboards_page.style'

// logging
import log from "../../../../logger";
import {
    getContainsFinishButton,
    getContainsKickoffButton,
    getOperationButton
} from "../../../../methods/utils/dashboards_utils";

import {
    findProcessStartNodes,
    findProcessEndNodes
} from "../../../../methods/utils/processes_utils";

const logger = log.getLogger("DashboardsPage");

const DashboardsPage = (props) => {

    const params = useParams()

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}

    // redux state
    const dispatch = useDispatch()
    const dispatchSetDashboardKickOffProcesses = async (dashboardId, kickOffEnabled) => await dispatch(setDashboardKickOffProcesses(dashboardId, kickOffEnabled))
    const dispatchSetDashboardFinishProcesses = async (dashboardId, finishEnabled) => await dispatch(setDashboardFinishProcesses(dashboardId, finishEnabled))
    const dispatchPutDashboardAttributes = async (attributes, id) => await dispatch(putDashboardAttributes(attributes, id))

    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const processes = useSelector(state => { return state.processesReducer.processes })
    const routes = useSelector(state => { return state.tasksReducer.tasks })
    const stations = useSelector(state => state.stationsReducer.stations);
    const history = useHistory()
    const dashboard = dashboards[dashboardID]
    if (dashboard === undefined) {
        history.push('/locations')
        window.location.reload()
    }

    useEffect(() => {
    }, [])


    /**
     * This useEffect checks whether the current dashboard is kick off enabled
     *
     * In order to be kick off enabled, the dashboard's station must be the first station in a process
     *
     * To check if the dashboard's station is the first station in a process,
     * it checks the load station of the first route in each process.
     * For any process where the first station's id matches the current dashboard's station id, the process id is added to list.
     * This list is then dispatched to redux with the key being the dashboard's ID and value is the list
     *
     * This information is used for determining whether or not to enable the KICK OFF button for a given dashboard
     */
    useEffect(() => {
        onUpdateKickoffFinishInfo()

    }, [processes])


    const onUpdateKickoffFinishInfo = async () => {
        // list of all processes that the station is the first station of the process
        let firstStationProcesses = []
        let lastStationProcesses = []

        // loop through processes and check if the load station of the first route of any process matches the current dashboards station
        Object.values(processes).forEach((currProcess) => {
            if (currProcess && currProcess.routes && Array.isArray(currProcess.routes)) {

                const processRoutes = currProcess.routes.map(routeId => routes[routeId])

                let processStartNodes = findProcessStartNodes(processRoutes, stations);
                let processEndNodes = findProcessEndNodes(processRoutes);

                // if the loadStationId matches the current dashboard's stationId, add the process's id to the list
                if (processStartNodes.includes(stationID) && stationID !== undefined) firstStationProcesses.push(currProcess._id)

                // if the unloadStationId matches the current dashboard's stationId, add the process's id to the list of last stations
                if (processEndNodes.includes(stationID) && stationID !== undefined) lastStationProcesses.push(currProcess._id)

            }
        })

        const dashboard = dashboards[dashboardID]
        const {
            buttons = []
        } = dashboard || {}

        await dispatchSetDashboardKickOffProcesses(dashboardID, firstStationProcesses)
        if (firstStationProcesses.length > 0) {

            // check if kickoff button needs to be added
            const containsKickoffButton = getContainsKickoffButton({ buttons })

            // if dashboard doesn't already contain kickoff button, add it
            if (!containsKickoffButton) {
                const kickOffButton = {
                    ...getOperationButton(OPERATION_TYPES.KICK_OFF.key),
                    name: ""
                }

                await dispatchPutDashboardAttributes({
                    buttons: [...buttons, kickOffButton]
                }, dashboardID)
            }
        }

        await dispatchSetDashboardFinishProcesses(dashboardID, lastStationProcesses)
        if (lastStationProcesses.length > 0) {


            // check if finish button needs to be added
            const containsFinishButton = getContainsFinishButton({ buttons })

            // add finish button
            if (!containsFinishButton) {
                const finishButton = {
                    ...getOperationButton(OPERATION_TYPES.FINISH.key),
                    name: ""
                }

                await dispatchPutDashboardAttributes({
                    buttons: [...buttons, finishButton]
                }, dashboardID)
            }
        }
    }

    return (
        <style.PageContainer >
            <DndProvider backend={HTML5Backend}>
                <style.Container style={{ flexGrow: '1' }}>
                    <DashboardScreen {...props}/>
                </style.Container>
            </DndProvider>
        </style.PageContainer >

    )
}

export default withRouter(DashboardsPage)
