// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// Import Actions
import { getMaps } from '../../redux/actions/map_actions'
import { getTaskQueue, deleteTaskQueueItem } from '../../redux/actions/task_queue_actions'
import { getLocations } from '../../redux/actions/locations_actions'
import { getObjects } from '../../redux/actions/objects_actions'
import { getTasks, deleteTask, putTask } from '../../redux/actions/tasks_actions'
import { getDashboards, deleteDashboard, postDashboard } from '../../redux/actions/dashboards_actions'
import { getSounds } from '../../redux/actions/sounds_actions'
import { getProcesses, putProcesses } from '../../redux/actions/processes_actions'
import { getTasksAnalysis } from '../../redux/actions/task_analysis_actions'

import { getSchedules } from '../../redux/actions/schedule_actions';
import { getDevices, putDevices } from '../../redux/actions/devices_actions'
import { getStatus } from '../../redux/actions/status_actions'

import { getSettings } from '../../redux/actions/settings_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'
import { getLoggers } from '../../redux/actions/local_actions';
import { getRefreshToken } from '../../redux/actions/authentication_actions'

import { deletePosition, putPosition } from '../../redux/actions/positions_actions'
import { putStation, deleteStation } from '../../redux/actions/stations_actions'

import { postLocalSettings } from '../../redux/actions/local_actions'

// Import components
import Textbox from '../../components/basic/textbox/textbox'
import Button from '../../components/basic/button/button'
import Switch from 'react-ios-switch'
import SplashScreen from "../../components/misc/splash_screen/splash_screen";

// import utils
import { getPageNameFromPath } from "../../methods/utils/router_utils";
import { isEquivalent, deepCopy } from '../../methods/utils/utils'

// import logger
import logger from '../../logger.js';
import { getMap } from '../../api/map_api';
import SideBar from '../side_bar/side_bar';
import localReducer from "../../redux/reducers/local_reducer";
import { getCards, getProcessCards } from "../../redux/actions/card_actions";
import apiReducer from "../../redux/reducers/api_reducer";
import { getReportEvents } from "../../redux/actions/report_event_actions";
import { getLots } from "../../redux/actions/lot_actions";

const ApiContainer = (props) => {

    // Dispatches
    const dispatch = useDispatch()
    const onGetMaps = async () => await dispatch(getMaps())
    const onGetLocations = () => dispatch(getLocations())
    const onGetDashboards = () => dispatch(getDashboards())
    const onGetObjects = () => dispatch(getObjects())
    const onGetTasks = () => dispatch(getTasks())
    const onGetSounds = (api) => dispatch(getSounds(api))
    const onGetTaskQueue = () => dispatch(getTaskQueue())
    const onGetTasksAnalysis = () => dispatch(getTasksAnalysis())

    const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    // const dispatchGetLots = () => dispatch(getLots())
    const onGetCards = () => dispatch(getCards())

    const onGetProcesses = () => dispatch(getProcesses());
    const onGetReportEvents = () => dispatch(getReportEvents());

    const onGetSchedules = () => dispatch(getSchedules())
    const onGetDevices = async () => await dispatch(getDevices())
    const onGetStatus = () => dispatch(getStatus())

    const onGetSettings = () => dispatch(getSettings())
    const onGetLocalSettings = () => dispatch(getLocalSettings())
    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    const onGetLoggers = () => dispatch(getLoggers())
    const onGetRefreshToken = () => dispatch(getRefreshToken())

    const onDeleteTask = (ID) => dispatch(deleteTask(ID))
    const onDeleteDashboard = (ID) => dispatch(deleteDashboard(ID))
    const onDeletePosition = (position, ID) => dispatch(deletePosition(position, ID))
    const onDeleteStation = async (ID) => await dispatch(deleteStation(ID))
    const onDeleteTaskQItem = async (ID) => await dispatch(deleteTaskQueueItem(ID))

    const onPutDevice = async (device, ID) => await dispatch(putDevices(device, ID))
    const onPutPosition = (position, ID) => dispatch(putPosition(position, ID))
    const onPutProcess = (process) => dispatch(putProcesses(process))
    const onPutStation = async (station, ID) => await dispatch(putStation(station, ID))
    const dispatchPutTask = async (task, ID) => await dispatch(putTask(task, ID))

    const onPostDashoard = (dashboard) => dispatch(postDashboard(dashboard))


    // Selectors
    const schedulerReducer = useSelector(state => state.schedulerReducer)
    const devices = Object.values(useSelector(state => { return state.devicesReducer })?.devices || {})
    const localReducer = useSelector(state => state.localReducer)
    const MiRMapEnabled = localReducer?.localSettings?.MiRMapEnabled
    const apiPage = useSelector(state => state.apiReducer.page)

    // States
    const [currentPage, setCurrentPage] = useState('')
    const [apiIpAddress, setApiIpAddress] = useState('')
    const [apiError, setApiError] = useState(false)

    const params = useParams()

    useEffect(async () => {
        await loadInitialData() // initial call to load data when app opens

        // this interval is always on
        // loads essential info used on every page such as status and taskQueue

        const criticalDataInterval = setInterval(() => loadCriticalData(), 500);
        const mapDataInterval = setInterval(() => loadMapData(), 50000)
        return () => {
            // clear intervals
            clearInterval(pageDataInterval);
            clearInterval(criticalDataInterval);
            // clearInterval(mapDataInterval)
        }
    }, [])

    useEffect(() => {


        // once MiR map is enabled, it's always enabled, so only need to do check if it isn't enabled
        if (!MiRMapEnabled) {
            let containsMirCart = false

            // check each device
            // in order for MiR mode to be enabled, there must be at least one device of MiR type
            Object.values(devices).forEach((currDevice, index) => {
                const device_model = currDevice?.device_model ? currDevice?.device_model : ""
                // const x = currDevice?.position?.x
                // const y = currDevice?.position?.y
                if (
                    device_model === "MiR100"
                ) containsMirCart = true
            })

            // only update if MiRMapEnabled isn't currently set or MiRMapEnabled needs to be updated because it isn't equal to containsMirCart
            if ((MiRMapEnabled === undefined) || (MiRMapEnabled !== containsMirCart)) onPostLocalSettings({
                ...localReducer.localSettings,
                MiRMapEnabled: containsMirCart,
            })
        }

    }, [devices, MiRMapEnabled])

    useEffect(() => {

        updateCurrentPage();

    })

    const updateCurrentPage = () => {

        // let pathname = this.props.location.pathname;

        const currentPageRouter = params
        // const currentPageRouter = getPageNameFromPath(pathname);
        // this.logger.debug("api_container currentPage", currentPage);
        // this.logger.debug("api_container currentPageRouter", currentPageRouter);


        // If the current page state and actual current page are different, then the page has changed so the data interval should change
        if (!isEquivalent(currentPageRouter, currentPage)) {
            // page changed

            // update state
            setCurrentPage(currentPageRouter)

            // update data interval to get data for new currentPage
            setDataInterval(currentPageRouter);
        }


    }


    /**
     * Handles data interval based on page
     */
    let pageDataInterval = null
    const setDataInterval = (pageParams) => {
        let pageName = ''
        const {
            data1,
            data2
        } = pageParams

        if (Object.keys(pageParams)[0] === 'sidebar') {
            pageName = pageParams.sidebar


        } else if (Object.keys(pageParams)[0] === 'stationID') {

            // Not the best way to do this, but if the params have a locationId and it's undefined
            // then it's url is just locations and not a widget page
            // This happens in app.js file in the route path.
            if (pageParams.widgetPage === undefined) {
                pageName = 'locations'

            } else {
                pageName = pageParams.widgetPage

            }

        }

        // clear current interval
        clearInterval(pageDataInterval);

        // set new interval for specific page
        switch (pageName) {

            case 'objects':
                pageDataInterval = setInterval(() => loadObjectsData(), 10000);
                break;

            case 'scheduler':
                pageDataInterval = setInterval(() => loadSchedulerData(), 100000);
                break;

            case 'dashboards':
                pageDataInterval = setInterval(() => loadDashboardsData(), 100000);
                // pageDataInterval = setInterval(() => loadTasksData(), 10000);
                break;

            case 'tasks':
                pageDataInterval = setInterval(() => loadTasksData(), 10000);
                break;

            case 'settings':
                pageDataInterval = setInterval(() => loadSettingsData(), 10000);
                break;

            case 'lots':
                pageDataInterval = setInterval(() => loadCardsData(), 1000)
                break

            case 'processes':
                if (data2 === "lots") {
                    loadCardsData(data1) // initial call
                    pageDataInterval = setInterval(() => loadCardsData(data1), 1000) // set interval
                }
                else if (data1 === "timeline") {
                    loadCardsData() // initial call
                    pageDataInterval = setInterval(() => loadCardsData(), 10000)
                }
                else if (data1 === "summary") {
                    loadCardsData() // initial call
                    pageDataInterval = setInterval(() => loadCardsData(), 10000)
                }
                else {
                    pageDataInterval = setInterval(() => loadTasksData(), 10000);
                }

                break

            case 'more':
                pageDataInterval = setInterval(() => loadMoreData(), 10000);
                break;

            default:
                break;
        }

    }

    const loadInitialData = async () => {
        // Local Settings must stay on top of initial data so that the correct API address is seleceted
        const localSettings = await onGetLocalSettings()
        const settings = await onGetSettings();

        // const refreshToken = await onGetRefreshToken()
        const devices = await onGetDevices()
        const maps = await onGetMaps()

        if (maps.length === undefined) {
            props.onLoad()
            setApiError(true)
            return
        }

        const locations = await onGetLocations()
        const dashboards = await onGetDashboards()
        const objects = await onGetObjects()
        const sounds = await onGetSounds()
        const tasks = await onGetTasks()
        const taskQueue = await onGetTaskQueue()
        const processes = await onGetProcesses()
        const cards = onGetCards()

        const tasksAnalysis = await onGetTasksAnalysis()

        const status = await onGetStatus()
        const getSchedules = await onGetSchedules()

        const loggers = await onGetLoggers()

        const funtion = await handleDeviceWithoutADashboard(devices, dashboards)
        const funtion1 = await handleTasksWithBrokenPositions(tasks, locations)
        const funtion2 = await handlePositionsWithBrokenParents(locations)
        const funtion3 = await handleDevicesWithBrokenStations(devices, locations)
        const funtion4 = await handleStationsWithBrokenDevices(devices, locations)
        const funtion5 = await handleDashboardsWithBrokenStations(dashboards, locations)
        const funtion6 = await handleStationsWithBrokenChildren(locations)
        const funtion7 = await handleTasksWithBrokenProcess(processes, tasks)
        const funtion8 = await handleProcessesWithBrokenRoutes(processes, tasks)

        // Commented out for now. Was causing an issue when sending a cart to a location using simple move. Since its just a one off task, the task is never added to the backend so if the page was refreshed, the task q item would be deleted 
        // const funtion9 = await handleTaskQueueWithBrokenTasks(taskQueue, tasks)

        props.apiLoaded()
        props.onLoad()

    }

    //  DATA LOADERS SECTION BEGIN
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /*
        Loads critical data used on every page

        required data:
        status, taskQueue, devices
    */
    const loadCriticalData = async () => {
        const status = await onGetStatus();
        const taskQueue = await onGetTaskQueue()
        const devices = await onGetDevices()
    }

    /*
        Loads data pertinent to Objects page

        required data:
        objects, poses, models
    */
    const loadObjectsData = async () => {
        const objects = await onGetObjects();
        // const poses = await this.props.getPoses();
        // const models = await this.props.getModels();
    }

    /*
        Loads data pertinent to Tasks page

        required data:
        tasks
    */
    const loadTasksData = async () => {
        // const tasks = await onGetTasks()
        // const processes = await onGetProcesses()
    }

    /*
        Loads data pertinent to Scheduler page

        required data:
        schedules, tasks
    */
    const loadSchedulerData = async () => {
        const schedules = await onGetSchedules();
        const tasks = await onGetTasks();

    }

    /*
        Loads data pertinent to Dashboards page

        required data:
        dashboards
    */
    const loadDashboardsData = async () => {
        const dashboards = await onGetDashboards();
        await onGetReportEvents()

    }

    /*
      Loads data pertinent to Objects page

      required data:
      tasks, skills, objects, locations, dashboards, sounds
    */
    const loadMapData = async () => {
        const locations = await onGetLocations();
        const tasksAnalysis = await onGetTasksAnalysis()
    }

    /*
        Loads data pertinent to Settings page

        required data:
        settings, loggers
    */
    const loadSettingsData = async () => {
        const settings = await onGetSettings();
        const localSettings = await onGetLocalSettings()
        const loggers = await onGetLoggers();

    }

    /*
        Loads data pertinent to process card view

        required data:
        cards
    */
    const loadCardsData = async (processId) => {
        if (processId) {
            await onGetProcessCards(processId)
        } else {
            onGetCards()
        }
        // dispatchGetLots()

    }

    /*
        Loads data pertinent to More page
    */
    const loadMoreData = async () => {

    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  DATA LOADERS SECTION END


    //  API DATA CLEAN UP (Ideally these functions should not exist... but it's not an ideal world...)
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    /**
     * Not the best place but it should still work
     * This will either make a dashboard for the device or replace a lost dashboard
     */
    const handleDeviceWithoutADashboard = async (devices, dashboards) => {
        Object.values(devices).map(async (device) => {
            // if the device does not have a dashboard, add one
            if (!device.dashboards) {

                console.log('QQQQ Device does not have a dashboard', deepCopy(device))
                alert('Device does not have a dashboard')

                const newDeviceDashboard = {
                    name: `${device.device_name} Dashboard`,
                    buttons: [],
                    device: device._id,
                }

                const newDashboard = onPostDashoard(newDeviceDashboard)

                return newDashboard.then(async (dashPromise) => {
                    device.dashboards = [dashPromise._id.$oid]
                    await onPutDevice(device, device._id)
                })


            }

            // If the device does have a dashboard, but that dashboard has been lost for some reason, make a new dashboard
            else if (!dashboards[device.dashboard]) {

            }
        })
    }

    /**
     * The dashboard is tied to a device that does not exist anymore, so delete the dashboard
     * @param {*} devices
     * @param {*} dashboards
     */
    const handleDashboardsWithBrokenDevice = (devices, dashboards) => {

    }


    /**
     * This deletes tasks that have broken positions/stations
     * A broken position/station can be:
     * a deleted position/station
     * a position thats parent station has been deleted
     *  */
    const handleTasksWithBrokenPositions = async (tasks, locations) => {

        if (tasks === undefined || locations === undefined) return

        const stations = locations.stations
        const positions = locations.positions

        Object.values(tasks).map(async (task) => {
            // console.log('QQQQ Task', positions[task.load.position], positions[task.unload.position])

            // Deletes the task if the load/unload position/station has been deleted from the positon list
            if ((!positions[task.load.position] && !stations[task.load.position]) || (!positions[task.unload.position]) && !stations[task.unload.position]) {
                console.log('QQQQ Position doesnt exist in positions, DELETE TASK', task._id)
                alert('Position doesnt exist in positions, DELETE TASK')
                await onDeleteTask(task._id)
                return
            }

            // Deletes the task if the load/unload position has a change_key 'deleted'. This means the back end has not deleted the position yet
            if ((!!positions[task.load.position] && !!positions[task.load.position].change_key && positions[task.load.position].change_key === 'deleted') ||
                (!!positions[task.unload.position] && !!positions[task.unload.position].change_key && positions[task.unload.position].change_key === 'deleted')) {
                console.log('QQQQ Position is deleted, waiting on back end, DELETE TASK')
                alert('Position is deleted, waiting on back end, DELETE TASK')
                await onDeleteTask(task._id)
                return
            }

            // Commented out for the AMR demo
            // Deletes the task if the load/unload position has a parent, but that parent does not exist in stations (parent has been deleted)
            // Also should delete the position as well
            // if ((!!positions[task.load.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent)) ||
            //     (!!positions[task.unload.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent))) {
            //     console.log('QQQQ Position parent has been deleted, DELETE TASK AND POSITION')
            //     await onDeleteTask(task._id)
            //     return
            // }
        })
    }

    /**
     * This deletes positions that have parents that are broken
     * A broken parent is a parent that has been deleted
     * @param {*} locations
     */
    const handlePositionsWithBrokenParents = async (locations) => {

        if (locations === undefined) return

        const stations = locations.stations
        const positions = locations.positions

        Object.values(positions).map(async (position) => {

            if (!!position.parent && !Object.keys(stations).includes(position.parent)) {
                console.log('QQQQ This position should be deleted', position)
                alert('This position should be deleted')
                onDeletePosition(position, position._id)
            }

        })
    }

    /**
     * 1) This finds positions that have become disassociated with their parent stations and reassociates them
     * 2) Also finds stations that have children positions that have been deleted. Deletes those positions from the stations
     * This happens because it happens... I have no idea why this happens....
     * @param {*} locations
     */
    const handleStationsWithBrokenChildren = (locations) => {

        if (locations === undefined) return

        const stations = locations.stations
        const positions = locations.positions

        Object.values(stations).map((station) => {

            // if(station.children === undefined) onDeleteStation(station._id)

            station.children.map(async (position, ind) => {
                if (!!positions[position] && positions[position].parent === null) {

                    const brokenPosition = positions[position]
                    console.log('QQQQ Stations with broken position', brokenPosition)
                    alert('Stations with broken position')

                    brokenPosition.parent = station._id

                    onPutPosition(brokenPosition, brokenPosition._id)

                }

                else if (!positions[position]) {
                    let brokenStation = deepCopy(station)
                    console.log('QQQQ Stations with deleted position', deepCopy(brokenStation), deepCopy(positions))
                    alert('Stations with deleted position')

                    brokenStation.children.splice(ind, 1)
                    await onPutStation(brokenStation, brokenStation._id)
                }
            })
        })

    }

    /**
     * This deletes device station if the station is broken
     * A broken station would happen when a station has been deleted
     * @param {*} devices
     * @param {*} locations
     */
    const handleDevicesWithBrokenStations = async (devices, locations) => {

        if (devices === undefined || locations === undefined) return

        const stations = locations.stations

        Object.values(devices).map(async (device) => {
            if (!!device.station_id && !Object.keys(stations).includes(device.station_id)) {
                console.log('QQQQ Device has a station ID that needs to be deleted', device)
                alert('Device has a station ID that needs to be deleted')
                delete device.station_id
                onPutDevice(device, device._id)
            }
        })

    }

    /**
     * This adds station to device if the station has a device ID and the device does not have a station ID
     * Why this happens is unkown atm, but this fixes when a device comes back without a station ID but should have one
     *
     * It also deletes stations that should be associated with a device, but the device either does not exist or ID has changed
     *
     * @param {*} devices
     * @param {*} locations
     */
    const handleStationsWithBrokenDevices = (devices, locations) => {

        if (devices === undefined || locations === undefined) return

        const stations = locations.stations

        Object.values(stations).map((station) => {

            // Delete station
            if (!!station.device_id && devices[station.device_id] === undefined) {
                console.log('QQQQ Station has a device that is deleted')
                alert('Station has a device that is deleted')

                onDeleteStation(station._id)
            }

            // Add station to device
            else if (!!station.device_id && !devices[station.device_id].station_id) {
                console.log('QQQQ Station has a broken device')
                alert('Station has a broken device')

                const device = devices[station.device_id]
                device.station_id = station._id
                onPutDevice(device, device._id)

            }
        })

    }

    /**
     * This deletes dashboards that belong to stations that don't exist
     * @param {*} dashboards
     * @param {*} locations
     */
    const handleDashboardsWithBrokenStations = (dashboards, locations) => {

        if (dashboards === undefined || locations === undefined) return

        const stations = locations.stations

        Object.values(dashboards).map((dashboard) => {
            if (!!dashboard.location && !dashboard.device && !stations[dashboard.location]) {
                console.log('QQQQ dashboard belongs to a station that does not exist', dashboard)
                alert('Dashboard belongs to a station that does not exist')
                onDeleteDashboard(dashboard._id.$oid)
            }
        })


    }

    /**
     * This handles broken Processes
     * A broken process would happen if a route/task that has been deleted but the process has not been updated
     * @param {*} processes
     * @param {*} tasks
     */
    const handleProcessesWithBrokenRoutes = async (processes, tasks) => {

        Object.values(processes).map((process) => {

            // Object.keys(process.routes).map(async (station) => {

            process.routes.map(async (route) => {

                if (!tasks[route]) {
                    // Removes the task from the array of routes
                    let processRoutes = deepCopy(process.routes)
                    const index = processRoutes.indexOf(route)
                    processRoutes.splice(index, 1)
                    const updatedProcess = {
                        ...process,
                        routes: [...processRoutes]
                    }
                    console.log('QQQQ route does not exist in anymore, delete from process', deepCopy(updatedProcess))
                    alert('Route does not exist in anymore, delete from process')

                    await onPutProcess(updatedProcess)
                }
            })
        })

        // })
    }

    /**
     * This handles tasks that belong to broken process
     * This would happen because either the process has been deleted and the task have not
     * or The task was created but the process was never saved
     * @param {*} processes
     * @param {*} tasks
     */
    const handleTasksWithBrokenProcess = async (processes, tasks) => {

        Object.values(tasks).map(async (task) => {

            if (task.processes.length > 0) {
                task.processes.map((process) => {

                    // If processes does no contain the process, then the process was deleted so remove it from the task
                    if (!processes[process]) {
                        const index = task.processes.indexOf(process)
                        task.processes.splice(index, 1)

                        console.log('QQQQ Process does not exist anymore, removing from task', task)
                        alert('Process does not exist anymore, removing from task')
                        dispatchPutTask(task, task._id)

                    }

                    else if(!processes[process].routes.includes(task._id)) {
                        console.log('QQQQ Task is associated with a process that is not associated with the task anymore', task, process)
                        alert('Task is associated with a process that is not associated with the task anymore')

                        const index = task.processes.indexOf(process)
                        task.processes.splice(index, 1)
                        dispatchPutTask(task, task._id)

                    }

                })
            }

        })

    }

    /**
     * This handles task queue items that belong to a broken task
     * A task would be broken because it has been deleted
     * @param {*} taskQueue
     * @param {*} tasks
     */
    const handleTaskQueueWithBrokenTasks = async (taskQueue, tasks) => {
        if (taskQueue === undefined) return

        Object.values(taskQueue).map(async (Q, i) => {
            if (tasks[Q.task_id] === undefined) {
                console.log('QQQQ TaskQ associated task has been deleted')
                alert('TaskQ associated task has been deleted')
                await onDeleteTaskQItem(Q._id.$oid)
            }

        })
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  API DATA CLEAN UP


    //  API LOGIN
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    return (
        <SplashScreen
            isApiLoaded={props.isApiLoaded}
            apiError={apiError}
        />
    )
}

export default ApiContainer;
