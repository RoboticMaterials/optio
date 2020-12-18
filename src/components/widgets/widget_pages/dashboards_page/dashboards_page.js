import React, { useEffect, useState } from 'react';

// external functions
import { useSelector, useDispatch } from 'react-redux'
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Container } from 'react-smooth-dnd'
import { withRouter } from "react-router-dom";

// Import Components
import DashboardsList from './dashboard_list/DashboardsList'
import DashboardScreen from './dashboard_screen/dashboard_screen'
import DashboardEditor from './dashboard_editor/dashboard_editor'
import DashboardsSidebar from "./dashboards_sidebar/dashboards_sidebar.jsx"

import { PAGES } from "../../../../constants/dashboard_contants";

import {getDashboards, setSelectedValueAttr} from '../../../../redux/actions/dashboards_actions'

// Import Styles
import * as style from './dashboards_page.style'

// logging
import log from "../../../../logger";

const logger = log.getLogger("DashboardsPage");

const DashboardsPage = (props) => {

    // redux state
    const dispatch = useDispatch()
    const dispatchSetSelectedValueAttr = async (dashboardId, kickOffEnabled) => await dispatch(setSelectedValueAttr(dashboardId, kickOffEnabled))

    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const stations = useSelector(state => state.locationsReducer.stations)
    const devices = useSelector(state => state.devicesReducer.devices)
    const processes = useSelector(state => { return state.processesReducer.processes })
    const routes = useSelector(state => { return state.tasksReducer.tasks })

    // self contained state
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [editingDashboard, setEditingDashboard] = useState(null);

    const [showSidebar, setShowSidebar] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth < 2000 ? 400 : 700)

    // extract url params
    const { stationID, dashboardID, editing } = props.match.params

    /**
     * Whenever processes updates, check if this dashboard's station is the first station in any process
     *
     * Used for determining whether or not to enable the KICK OFF button
     */
    useEffect(() => {

        var firstStationProcesses = []
        // loop through processes and check if the load station of the first route of any process matches the current dashboards station
        Object.values(processes).forEach((currProcess) => {

            // get first routes id, default to null
            const firstRouteId = (currProcess && currProcess.routes && Array.isArray(currProcess.routes))  ? currProcess.routes[0] : null

            // get route from route id, default to null
            const currRoute = firstRouteId ? routes[firstRouteId] : null

            // get station id from load key of route
            const loadStationId = currRoute?.load?.station

            // if the loadStationId matches the current dashboard's stationId, then allow kick off
            if(loadStationId === stationID) firstStationProcesses.push(currProcess._id)

        })

        dispatchSetSelectedValueAttr(dashboardID, firstStationProcesses)

    }, [processes])

    // On page load, load the first and only dashboard with this station
    // Leaving the rest of the code in for adding dashboards and dashboard list view because we may need it in the future
    useEffect(() => {
        const dashboardType = !!stations[stationID] ? stations[stationID] : devices[stationID]
        const dashID = dashboardType.dashboards[0]
        props.history.push(`/locations/${stationID}/dashboards/${dashID}`)
        return () => {

        }
    }, [])

    // checks url params and updates editingDashboard / selectedDashboard accordingly
    useEffect(() => {

        // COMMENT OUT FOR NOW: All station should just have one dashboard. Currently no need to add dashboards.
        // // if dashboard id is 'new', go to dashboard editor with new dashboard template
        // if(dashboardID === "new") {
        //     const dashboardTemplate  = {
        //         name: "",
        //         buttons: [],
        //         station: stationID
        //     }

        //     setSelectedDashboard(null)   // only selected OR editing should be set
        //     setEditingDashboard(dashboardTemplate)   // set editing to empty template
        // }

        // else {
        // get dashboard from dashboardID url param


        const dashboard = dashboards[dashboardID]

        // if a dashboard was found, then update either selected or editing
        if (dashboard) {


            // if url does not contain editing param, set selected dashboard
            if (!editing) {
                setSelectedDashboard(dashboardID)   // set selected
                setEditingDashboard(null)   // only selected OR editing should be set
                logger.log("useEffect dashboards[dashboardID]", dashboards[dashboardID])
            }
            // url contains editing param, so set dashboard to editing
            else {
                setEditingDashboard(dashboard)  // set editing
                setSelectedDashboard(null)  // only selected OR editing should be set
            }
        }

        // if no matching dashboard was found, set editing and selected to null
        else {
            setEditingDashboard(null)
            setSelectedDashboard(null)
        }
        // }
    }, [dashboardID, dashboards, editing])


    // sets url to main dashboards page for current station - used in other pages to go back
    function goToMainPage() {
        props.history.push(`/locations/${stationID}/dashboards`);
    }

    // returns string of current page name based on current state
    const getPage = () => {
        let page = ""

        // if neither a dashboard is selected nor being edited, show main page
        if (!(selectedDashboard || editingDashboard)) {
            page = PAGES.DASHBOARDS
        }
        // if editing, show editing page
        else if (editingDashboard) {
            page = PAGES.EDITING
        }
        // only other option is dashboard is selected
        else {
            page = PAGES.DASHBOARD
        }
        return page
    }
    const page = getPage()

    // sets showSidebar to false if on dashboard page, effectively hiding the sidebar
    // sidebar is never used in a dashboard
    useEffect(() => {
        if (page === PAGES.DASHBOARD) setShowSidebar(false)
        else if (page === PAGES.EDITING || page === PAGES.DASHBOARDS) setShowSidebar(true)
    }, [page])


    return (
        <style.PageContainer>
            <DndProvider backend={HTML5Backend}>

                <div style={{ width: showSidebar && window.innerWidth > 1000 ? sidebarWidth : 0 }}>
                    <DashboardsSidebar
                        dashboardId={dashboardID}
                        stationID={stationID}
                        width={showSidebar ? sidebarWidth : 0}
                        setWidth={setSidebarWidth}
                        minWidth={300}

                        clickable={page === PAGES.DASHBOARDS}
                    />
                </div>

                <style.Container style={{ flexGrow: '1' }}>
                    {/* If the length of ID is not 0, then a dashboard must have been clicked */}
                    {page === PAGES.DASHBOARDS ?
                        <DashboardsList
                            stationID={stationID}
                            setSelectedDashboard={(dashID) => {
                                props.history.push(`/locations/${stationID}/dashboards/${dashID}`)
                            }}
                            setEditingDashboard={(dashID) => {
                                props.history.push(`/locations/${stationID}/dashboards/${dashID}/editing`)
                            }}
                            setShowSidebar={setShowSidebar}
                            showSidebar={showSidebar}
                        />
                        :
                        (page === PAGES.EDITING) ?
                            <DashboardEditor
                                dashboard={editingDashboard}
                                onCancelClicked={goToMainPage}
                                setShowSidebar={setShowSidebar}
                                showSidebar={showSidebar}
                            />
                            :
                            <DashboardScreen
                                dashboardId={selectedDashboard}
                                setSelectedDashboard={setSelectedDashboard}
                                goBack={() => setSelectedDashboard(null)}
                                setShowSidebar={setShowSidebar}
                                showSidebar={showSidebar}
                                setEditingDashboard={(dashID) => {
                                    props.history.push(`/locations/${stationID}/dashboards/${dashID}/editing`)
                                }}
                            />
                    }
                </style.Container>
            </DndProvider>
        </style.PageContainer>
    )
}

export default withRouter(DashboardsPage)
