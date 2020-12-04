import React, { useState, useRef, useContext, useEffect } from 'react';

// external functions
import { ThemeContext } from "styled-components";
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// import external components
import ReactList from "react-list";
import { useDrop } from 'react-dnd'

// Import Components
import Dashboard from './dashboard/dashboard'
import { ConfirmDeleteModal } from '../../../../basic/modals/modals'
import DashboardsHeader from "../dashboards_header/dashboards_header";
import BounceButton from "../../../../basic/bounce_button/bounce_button";

// Import Actions
import * as dashboardActions from '../../../../../redux/actions/dashboards_actions'
import * as stationActions from '../../../../../redux/actions/stations_actions'
import * as taskActions from '../../../../../redux/actions/tasks_actions'

// import utils
import { deepCopy } from "../../../../../methods/utils/utils";

// import constants
import { PAGES } from "../../../../../constants/dashboard_contants";

// Import Styles
import * as style from './DashboardsList.style';

// import logging
import log from "../../../../../logger";

const logger = log.getLogger("DashboardsPage");


const DashboardsList = (props) => {

    const {
        setSelectedDashboard,
        setEditingDashboard,
        showSidebar,
        setShowSidebar,
        stationID
    } = props

    // theme
    const themeContext = useContext(ThemeContext);

    // component state
    const [dashboardToDelete, setDashboardToDelete] = useState(false);

    // ref for react list
    const listRef = useRef(null);

    // dispatch
    const dispatch = useDispatch()

    const params = useParams()
    const history = useHistory()

    // Drop reference for new dashboard
    const [{ }, newDashDropRef] = useDrop({
        accept: "DashboardSidebarButton",
        drop: (item, monitor) => {
            handleNew(item)
        },
    })

    // redux state
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const stations = useSelector(state => state.locationsReducer.stations)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const devices = useSelector(state => state.devicesReducer.devices)

    const station = stations[stationID]
    const device = devices[stationID]

    const selectedDashboardType = !!station ? station : device



    // logger.log("DashboardsList dashboards", dashboards)
    // logger.log("DashboardsList dashboardsArray", dashboardsArray)

    useEffect(() => {
        if (dashboards[params.dashboardID] === undefined) {
            history.push('/locations/')
        }
        return () => {

        }
    }, [])


    // Hopefully fixes a bug when there is no dashboards for this type
    const dashboardsArray = !!selectedDashboardType ? !!selectedDashboardType.dashboards ? selectedDashboardType.dashboards.map(dashboardID => dashboards[dashboardID]) : [] : []


    // handles event of button drag-and-drop onto a dashboard
    // adds the dropped button to the dashboard target
    const handleDrop = async (button, id) => {
        // get dashboard that button was dropped in
        const targetDashboard = dashboards[id]
        logger.log("DashboardsList: handleDrop: targetDashboard", targetDashboard)

        let targetDashboardCopy = deepCopy(targetDashboard)// clone dashboard
        targetDashboardCopy.buttons.push(button) // add new button

        // dispatch action to update api and redux
        dispatch(dashboardActions.putDashboard(targetDashboardCopy, targetDashboardCopy._id.$oid))
    }

    const handleNew = (button) => {
        // This block iterates through 'i' to find 'Untitled Dashboard i' that
        // that does not exists at this station
        var i = 0
        var exists = true
        while (exists) {
            exists = false
            i++
            selectedDashboardType.dashboards.forEach(dashboardID => {
                if (dashboards[dashboardID].name == 'Untitled Dashboard ' + i) {
                    exists = true
                }
            })
        }

        // Post the new dashboard and wait for the returned ID
        let newDash = {
            name: 'Untitled Dashboard ' + i,
            station: stationID,
            buttons: [],
        }
        if (!!button) {
            newDash.buttons.push(button)
        }
        const postDashboardPromise = dispatch(dashboardActions.postDashboard(newDash))

        // Add this new dashboard to the station
        postDashboardPromise.then(async postedDashboard => {

            let stationDashboards = selectedDashboardType.dashboards
            stationDashboards.push(postedDashboard._id.$oid)
            await dispatch(stationActions.setStationAttributes(station._id, { dashboards: stationDashboards }))
            const stationID = station._id
            delete station._id
            await dispatch(stationActions.putStation(station, stationID))

            if (button == null) { // Drop not click
                // Go into the new dashboard
                setSelectedDashboard(postedDashboard._id.$oid)
            }
        })
    }

    // renders a single dashboard based on the index in the dashboards array
    const itemRenderer = (index, key) => {
        if (index >= dashboardsArray.length) {

            // Extra dashboard which will be the 'New Dashboard' dashboard
            return (
                <style.NewDashboard ref={newDashDropRef} onClick={() => handleNew(null)} key={key}>
                    <style.AddDashboardContainer>
                        <style.AddDashboardButtonText>New Dashboard</style.AddDashboardButtonText>
                        <style.PlusButton className='far fa-plus-square'></style.PlusButton>
                    </style.AddDashboardContainer>
                </style.NewDashboard>
            )
        } else {
            const currDashboard = dashboardsArray[index]
            if (currDashboard === undefined) {
                return null
            }

            // get dashboard properties
            let name = currDashboard.name
            let ID = currDashboard._id.$oid
            let buttons = currDashboard.buttons
            let deleted = false

            logger.log("rednering dashboard")
            return (
                <Dashboard
                    listRef={listRef}
                    title={name}
                    buttons={buttons}
                    key={index}
                    id={ID}
                    openDashboard={() => {
                        setSelectedDashboard(ID)
                    }}
                    onDeleteClick={() => {
                        // opens confirm delete modal
                        setDashboardToDelete(ID)
                    }}
                    editingclicked={() => {
                        setEditingDashboard(ID)
                    }}
                    deleted={deleted}
                    onDrop={handleDrop}
                />
            )
        }
    }

    return (
        <style.Container>

            <style.DashboardContainer
            >
                <ReactList
                    style={{ width: "100%" }}
                    ref={listRef}
                    minSize={10}
                    itemRenderer={itemRenderer}
                    length={dashboardsArray.length + 1}
                    type='uniform'
                    itemsRenderer={(items, ref) => {
                        return (
                            <style.DashboardList ref={ref}
                                onScroll={() => logger.log("DashboardList scroll")}
                            >
                                {items}
                            </style.DashboardList>

                        )
                    }}
                />
            </style.DashboardContainer>

            {/* Confimation modal before deleting a dashboard */}
            <ConfirmDeleteModal
                isOpen={dashboardToDelete}
                title={'Confirm Delete'}
                textMain={dashboards[dashboardToDelete] && 'Are you sure you want to delete "' + dashboards[dashboardToDelete].name + '"'}
                caption={''}
                onCancelClick={() => setDashboardToDelete(null)}
                onDeleteClick={() => {
                    dispatch(dashboardActions.deleteDashboard(dashboardToDelete)) // delete dashboard
                    setDashboardToDelete(null)// reset dashboardToDelete
                }}
            />
        </style.Container>
    )
}

export default DashboardsList
