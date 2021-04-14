// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";

// Import Actions
import { getMaps } from '../../redux/actions/map_actions'
import { getTaskQueue, deleteTaskQueueItem, putTaskQueue } from '../../redux/actions/task_queue_actions'
import {getObjects, removeObject, setObject} from '../../redux/actions/objects_actions'
import {getTasks, deleteTask, putTask, setTask, removeTask} from '../../redux/actions/tasks_actions'
import { getDashboards, deleteDashboard, postDashboard } from '../../redux/actions/dashboards_actions'
import { getSounds } from '../../redux/actions/sounds_actions'
import {getProcesses, putProcesses, removeProcess, setProcess} from '../../redux/actions/processes_actions'
import { getDataStream } from '../../redux/actions/data_stream_actions'

import { getSchedules } from '../../redux/actions/schedule_actions';
import { getDevices, putDevices } from '../../redux/actions/devices_actions'
import { getStatus } from '../../redux/actions/status_actions'

import { getSettings } from '../../redux/actions/settings_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'
import { postDevSettings } from '../../api/local_api'

import { getLoggers } from '../../redux/actions/local_actions';

import { getPositions, deletePosition, putPosition } from '../../redux/actions/positions_actions'
import { getStations, putStation, deleteStation } from '../../redux/actions/stations_actions'

import { postLocalSettings } from '../../redux/actions/local_actions'

// Import components
import SplashScreen from "../../components/misc/splash_screen/splash_screen";

// import utils
import { isEquivalent, deepCopy } from '../../methods/utils/utils'
import {getCards, getProcessCards, putCard, setCard} from "../../redux/actions/card_actions";

// Amplify and GQL
import { API, graphqlOperation } from 'aws-amplify';
import * as subscriptions from '../../graphql/subscriptions';
import { manageTaskQueue } from '../../graphql/mutations';
import {getSubscriptionData, getSubscriptionName, streamlinedSubscription} from "../../methods/utils/api_utils";
import {DATA_PARSERS, parseLot, parseObject, parseProcess, parseTask} from "../../methods/utils/data_utils";
import {createActionType} from "../../redux/actions/redux_utils";
import {REMOVE, SET} from "../../redux/types/prefixes";
import * as dataTypes from "../../redux/types/data_types";
import {SUCCESS} from "../../redux/types/suffixes";
import {capitalizeFirstLetter, constantToPascalCase, toPascalCase} from "../../methods/utils/string_utils";

const ApiContainer = (props) => {

    // Variables for stations and positions subs
    let stationSub, positionSub

    // Variable for what we are currently subbed to
    let currentSubscription = {}

    // Dispatches
    const dispatch = useDispatch()
    const onGetMaps = async () => await dispatch(getMaps())
    const onGetStations = async () => await dispatch(getStations())
    const onGetPositions = () => dispatch(getPositions())
    const onGetDashboards = async () => await dispatch(getDashboards())
    const onGetObjects = () => dispatch(getObjects())
    const onGetTasks = async () => await dispatch(getTasks())
    const onGetSounds = (api) => dispatch(getSounds(api))
    const onGetTaskQueue = () => dispatch(getTaskQueue())

    // const dispatchGetDataStream = () => dispatch(getDataStream())

    const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    // const dispatchGetLots = () => dispatch(getLots())
    const onGetCards = () => dispatch(getCards())
    const dispatchSetCard = (card) => dispatch(setCard(card))
    const onPutCard = (card) => dispatch(putCard(card))


    const dispatchSetTask = async (task) => await dispatch(setTask(task))
    const dispatchRemoveTask = async (id) => await dispatch(removeTask(id))

    const dispatchSetProcess = (process) => dispatch(setProcess(process))
    const dispatchRemoveProcess = (id) => dispatch(removeProcess(id))

    const dispatchSetObject = (process) => dispatch(setObject(process))
    const dispatchRemoveObject = (id) => dispatch(removeObject(id))


    const onPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))

    const onGetProcesses = () => dispatch(getProcesses());

    const onGetSchedules = () => dispatch(getSchedules())
    const onGetDevices = async () => await dispatch(getDevices())
    const onGetStatus = () => dispatch(getStatus())

    const onGetSettings = () => dispatch(getSettings())
    const onGetLocalSettings = () => dispatch(getLocalSettings())
    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    const onGetLoggers = () => dispatch(getLoggers())

    const onDeleteTask = (ID) => dispatch(deleteTask(ID))
    const onDeleteDashboard = (ID) => dispatch(deleteDashboard(ID))
    const onDeletePosition = (position, ID) => dispatch(deletePosition(position))
    const onDeleteStation = async (ID) => await dispatch(deleteStation(ID))
    const onDeleteTaskQItem = async (ID) => await dispatch(deleteTaskQueueItem(ID))

    const onPutDevice = async (device, ID) => await dispatch(putDevices(device, ID))
    const onPutPosition = (position, ID) => dispatch(putPosition(position, ID))
    const onPutProcess = (process) => dispatch(putProcesses(process))
    const onPutStation = async (station, ID) => await dispatch(putStation(station, ID))
    const dispatchPutTask = async (task, ID) => await dispatch(putTask(task, ID))

    const onPostDashoard = (dashboard) => dispatch(postDashboard(dashboard))

    // Selectors
    const devices = Object.values(useSelector(state => { return state.devicesReducer })?.devices || {})
    const localReducer = useSelector(state => state.localReducer)
    const MiRMapEnabled = localReducer?.localSettings?.MiRMapEnabled
    const stopAPICalls = useSelector(state => state.localReducer.stopAPICalls)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const localSettings = useSelector(state => state.localReducer.localSettings)


    // States
    const [currentPage, setCurrentPage] = useState('')
    const [apiError, setApiError] = useState(false)
    const [pageDataInterval, setPageDataInterval] = useState(null)
    const [criticalDataInterval, setCriticalDataInterval] = useState(null)
    const [localDataInterval, setLocalDataInterval] = useState(null)
    const [mapDataInterval, setMapDataInterval] = useState(null)

    // Subscriptions
    const [currentSubscriptions, setCurrentSubscriptions] = useState([])

    const params = useParams()
    const history = useHistory()

    useEffect(() => {
        loadInitialData()
        loadCriticalData()
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
            if ((MiRMapEnabled === undefined) || (MiRMapEnabled !== containsMirCart)) {

                const updatedLocalSettings = {
                    ...localReducer.localSettings,
                    MiRMapEnabled: containsMirCart,
                }

                onPostLocalSettings(updatedLocalSettings)
            }
        }

    }, [devices, MiRMapEnabled])

    useEffect(() => {

        if (stopAPICalls !== true) {
            updateCurrentPage();
        }

    }, [stopAPICalls, params])

    const updateCurrentPage = () => {
        const currentPageRouter = params

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

    const setDataInterval = async (pageParams) => {
        // unsub from everything
        if(currentSubscriptions.length){
            currentSubscriptions.forEach(sub => {
                if(sub._state !== 'closed'){
                    sub._cleanup()
                }
            });
        }

        let subs = []

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

        // set new interval for specific page
        switch (pageName) {

            case 'objects': {
                subs = await getObjectsPageSubscriptions()
                setCurrentSubscriptions(subs)
                break;
            }

            case 'dashboards': {
                setCurrentSubscriptions(await getDashboardsPageSubscription())
                break
            }

            case 'locations': {
                setCurrentSubscriptions(await getLocationsPageSubscriptions())
                break;
            }

            case 'tasks': {
                setCurrentSubscriptions(await getTaskPageSubscriptions())
                break
            }

            case 'settings': {
                setCurrentSubscriptions(await getSettingsSubscription())
                break
            }

            case 'lots': {
                setCurrentSubscriptions(await getLotsSubscription())
                break
            }

            case 'processes': {
                // process lots
                if (data2 === "lots") {
                    setCurrentSubscriptions(await getLotsSubscription())
                    break;
                }
                // process
                else {
                    setCurrentSubscriptions(await getProcessPageSubscription())
                    break
                }
            }

            default: {
                if(!mapViewEnabled) {
                    setCurrentSubscriptions(await getListViewSubs())
                }
                else {
                    setCurrentSubscriptions(await getMapsSubscriptions())
                }

                break;
            }
        }
    }

    const loadInitialData = async () => {
        // Local Settings must stay on top of initial data so that the correct API address is seleceted
        await onGetLocalSettings()

        // Get settings from the DB
        await onGetSettings();

        // Get devices and maps
        const devices = await onGetDevices()
        const maps = await onGetMaps()

        if (maps.length === undefined) {
            props.onLoad()
            setApiError(true)
            return
        }

        const stations = await onGetStations()
        const positions = await onGetPositions()
        const dashboards = await onGetDashboards()
        const objects = await onGetObjects()

        // Dont needs sounds right now
        // const sounds = await onGetSounds()
        
        const tasks = await onGetTasks()
        const taskQueue = await onGetTaskQueue()
        const processes = await onGetProcesses()
        const cards = onGetCards()

        const status = await onGetStatus()

        // Seems we are not using so commeneted it out
        // const getSchedules = await onGetSchedules()

        const loggers = await onGetLoggers()

        // Data Update Functions
        // const dataUpdate = await onUpdateTaskData(tasks)

        // Cleaner Functions
        if (!!mapViewEnabled) {

            await handleDeviceWithoutADashboard(devices, dashboards)
            // const funtion1 = await handleTasksWithBrokenPositions(tasks, stations, positions)
            // const funtion2 = await handlePositionsWithBrokenParents(stations, positions)
            // const funtion3 = await handleDevicesWithBrokenStations(devices, stations)
            // const funtion4 = await handleStationsWithBrokenDevices(devices, stations)
            // const funtion5 = await handleDashboardsWithBrokenStations(dashboards, stations)
            // const funtion6 = await handleStationsWithBrokenChildren(stations, positions)
            // const funtion7 = await handleTasksWithBrokenProcess(processes, tasks)
            // const funtion8 = await handleProcessesWithBrokenRoutes(processes, tasks)
        }

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

    // Handle task being created
    const handleTaskUpdate = async (taskQueueItem) => {

        // get the task 
        const tasks = await onGetTasks()

        const task = taskQueueItem ? tasks[taskQueueItem.taskId] : null

        // Unload?
        if(task && task.handoff && taskQueueItem.quantity){

            // set end time
            taskQueueItem.end_time = Math.round(Date.now() / 1000)

            // tell GQL to run the lambda function
            await API.graphql({
                query: manageTaskQueue,
                variables: { 
                    taskQueueItem: JSON.stringify(taskQueueItem)
                }
              });
        }else if(taskQueueItem && taskQueueItem.start_time === null && !task.handoff){  

            taskQueueItem.start_time = Math.round(Date.now() / 1000)

            taskQueueItem.hil_station_id = task.unload.station

            taskQueueItem.hil_message = 'Unload'

            // put a start time on th taskQueueItem
            await onPutTaskQueue(taskQueueItem, taskQueueItem.id)
        }
    }

    const loadCriticalData = async () => {

        // run get queue
        onGetTaskQueue()

        // took this out so the loop doesnt run anymore
        // dispatchGetDataStream()

        // Start subscription to status, taskQueue, devices
        // Dont need to clean this one up because we always need it

        // Subscribe to status
        // API.graphql(
        //     graphqlOperation(subscriptions.onDeltaStatus)
        // ).subscribe({
        //     next: () => { 
        //         // run get stations
        //         onGetStatus()
        // },
        //     error: error => console.warn(error)
        // });

        // Subscribe to taskQueue
        // Only need this one for now
        API.graphql(
            graphqlOperation(subscriptions.onDeltaTaskQueue)
        ).subscribe({
            next: async ({ provider, value }) => {  
                // run get queue
                const taskQ = await onGetTaskQueue()

                Object.values(taskQ).map((item) => {
                    if (
                            // when do we update the task???
                            item.taskId === value.data.onDeltaTaskQueue.taskId
                            &&
                            value.data.onDeltaTaskQueue.hil_response === true
                            &&
                            value.data.onDeltaTaskQueue.updatedAt
                        )
                        {
                            handleTaskUpdate(value.data.onDeltaTaskQueue)
                        }
                })
        },
            error: error => console.warn(error)
        });

        // Subscribe to Devices
        // Taking this out for now because sevices will be added later
        // API.graphql(
        //     graphqlOperation(subscriptions.onDeltaDevice)
        // ).subscribe({
        //     next: () => { 
        //         // run get stations
        //         onGetProcesses()
        // },
        //     error: error => console.warn(error)
        // });

    }

    /*
    * **********************************************BASIC DATA TYPE SUBS BEGIN**********************************************************
    * */

    /*
    * creates delta and delete subs for resource corresponding to resourceName
    * */
    const getResourceSubscription = async (resourceName) => {
        let subs = []
        const convertedName = toPascalCase(resourceName)

        // NOTE: need to subscribe to delete events separately in order to know to remove item from redux instead of insert / replace
        console.debug("Subscribing to resource delta: ",convertedName)
        subs.push(await streamlinedSubscription(subscriptions[`onDelta${convertedName}`], (data) => dispatch({ type: createActionType([SET, resourceName]), payload: data }), DATA_PARSERS[resourceName]))

        console.debug("Subscribing to resource delete: ",convertedName)
        subs.push(await streamlinedSubscription(subscriptions[`onDelete${convertedName}`], (data) => dispatch({ type: createActionType([REMOVE, resourceName]), payload: data }), null))

        return subs
    }

    /*
    * calls getResourceSubscription for each string in resourceNames
    * */
    const getResourceSubscriptions = async (resourceNames) => {
        let subs = []

        for(const resourceName of resourceNames) {
            subs = subs.concat(await getResourceSubscription(resourceName))
        }

        return subs
    }

    /*
    * **********************************************BASIC DATA TYPE SUBS END**********************************************************
    * */

    /*
    * **********************************************PAGE SUBS BEGIN**********************************************************
    * */

    const getObjectsPageSubscriptions = async () => {
        return await getResourceSubscriptions([dataTypes.OBJECT])
    }

    const getTaskPageSubscriptions = async () => {
        return await getResourceSubscriptions([dataTypes.PROCESS, dataTypes.TASK, dataTypes.OBJECT])
    }

    const getProcessPageSubscription = async () => {
        return await getResourceSubscriptions([dataTypes.PROCESS, dataTypes.TASK, dataTypes.OBJECT])
    }

    const getLotsSubscription = async (processId) => {
        if (processId) {
            await onGetProcessCards(processId)

        } else {
            onGetCards()
        }

        // make direct get call call to get data now
        onGetProcesses()
        onGetTasks()

        return await getResourceSubscriptions([dataTypes.LOT_TEMPLATE, dataTypes.CARD, dataTypes.PROCESS, dataTypes.STATION, dataTypes.TASK])

    }

    const getDashboardsPageSubscription = async () => {
        onGetCards()
        onGetDashboards()
        return await getResourceSubscriptions([dataTypes.CARD, dataTypes.TASK, dataTypes.DASHBOARD, dataTypes.PROCESS])
    }

    const getLocationsPageSubscriptions = async () => {
        return await getResourceSubscriptions([dataTypes.STATION, dataTypes.POSITION])
    }

    const getMapsSubscriptions = async () => {
        return await getResourceSubscriptions([dataTypes.STATION, dataTypes.POSITION])
    }

    const getListViewSubs = async () => {
        return await getResourceSubscriptions([dataTypes.STATION, dataTypes.POSITION])
    }


    /*
        Loads data pertinent to Settings page

        required data:
        settings, loggers
    */
    const getSettingsSubscription = async () => {

        const settings = await onGetSettings();
        //const localSettings = await onGetLocalSettings()
        const loggers = await onGetLoggers();

        return await getResourceSubscriptions([dataTypes.SETTINGS])
    }

    /*
    * **********************************************PAGE SUBS END**********************************************************
    * */

    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  DATA LOADERS SECTION END


    //  DATA CONVERSION
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //  API DATA CLEAN UP (Ideally these functions should not exist... but it's not an ideal world...)
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Not the best place but it should still work
     * This will either make a dashboard for the device or replace a lost dashboard
     */
    const handleDeviceWithoutADashboard = async (devices, dashboards) => {
        Object.values(devices).map(async (device) => {
            // if the device does not have a dashboard, add one
            if (!device.dashboards || device.dashboards.length === 0) {

                alert('Device does not have a dashboard')

                const newDeviceDashboard = {
                    name: `${device.device_name} Dashboard`,
                    buttons: [],
                    device: device.id,
                }

                const newDashboard = onPostDashoard(newDeviceDashboard)

                return newDashboard.then(async (dashPromise) => {
                    device.dashboards = [dashPromise.id]
                    await onPutDevice(device, device.id)
                })


            }

            device.dashboards.map((dashboard) => {
                if (!dashboards[dashboard]) {
                    alert('Devices dashboard has been deleted, recreating')

                    const newDeviceDashboard = {
                        name: `${device.device_name} Dashboard`,
                        buttons: [],
                        device: device.id,
                    }

                    const newDashboard = onPostDashoard(newDeviceDashboard)

                    return newDashboard.then(async (dashPromise) => {
                        if (dashPromise.id !== undefined){
                        // Add new dashboard
                        device.dashboards.push(dashPromise.id)

                            // Delete old dashboard
                            const index = device.dashboards.indexOf(dashboard)
                            device.dashboards.splice(index, 1)
                        }

                        await onPutDevice(device, device.id)
                    })


                }
            })
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
    const handleTasksWithBrokenPositions = async (tasks, stations, positions) => {

        if (tasks === undefined || stations === undefined || positions === undefined) return

        Object.values(tasks).map(async (task) => {

            // Deletes the task if the load/unload position/station has been deleted from the positon list
            if ((!positions[task.load.position] && !stations[task.load.position]) || (!positions[task.unload.position]) && !stations[task.unload.position]) {
                alert('Position doesnt exist in positions, DELETE TASK')
                await onDeleteTask(task.id)
                return
            }

            // Deletes the task if the load/unload position has a change_key 'deleted'. This means the back end has not deleted the position yet
            if ((!!positions[task.load.position] && !!positions[task.load.position].change_key && positions[task.load.position].change_key === 'deleted') ||
                (!!positions[task.unload.position] && !!positions[task.unload.position].change_key && positions[task.unload.position].change_key === 'deleted')) {
                alert('Position is deleted, waiting on back end, DELETE TASK')
                await onDeleteTask(task.id)
                return
            }

            // Commented out for the AMR demo
            // Deletes the task if the load/unload position has a parent, but that parent does not exist in stations (parent has been deleted)
            // Also should delete the position as well
            // if ((!!positions[task.load.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent)) ||
            //     (!!positions[task.unload.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent))) {
            //    
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
    const handlePositionsWithBrokenParents = async (stations, positions) => {

        if (stations === undefined || positions === undefined) return

        Object.values(positions).map(async (position) => {

            if (!!position.parent && !Object.keys(stations).includes(position.parent && position.change_key !== 'deleted')) {
                alert('This position should be deleted')
                onDeletePosition(position)
            }

        })
    }

    /**
     * 1) This finds positions that have become disassociated with their parent stations and reassociates them
     * 2) Also finds stations that have children positions that have been deleted. Deletes those positions from the stations
     * This happens because it happens... I have no idea why this happens....
     * @param {*} locations
     */
    const handleStationsWithBrokenChildren = (stations, positions) => {

        if (stations === undefined || positions === undefined) return

        Object.values(stations).map((station) => {

            // if(station.children === undefined) onDeleteStation(station._id)

            station.children.map(async (position, ind) => {
                if (!!positions[position] && positions[position].parent === null) {

                    const brokenPosition = positions[position]
                    alert('Stations with broken position')

                    brokenPosition.parent = station.id

                    onPutPosition(brokenPosition, brokenPosition.id)

                }

                else if (!positions[position]) {
                    let brokenStation = deepCopy(station)
                    alert('Stations with deleted position')

                    brokenStation.children.splice(ind, 1)
                    await onPutStation(brokenStation, brokenStation.id)
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
    const handleDevicesWithBrokenStations = async (devices, stations) => {

        if (devices === undefined || stations === undefined) return

        Object.values(devices).map(async (device) => {
            if (!!device.stationId && !Object.keys(stations).includes(device.stationId)) {
                alert('Device has a station ID that needs to be deleted')
                delete device.stationId
                onPutDevice(device, device.id)
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
    const handleStationsWithBrokenDevices = (devices, stations) => {

        if (devices === undefined || stations === undefined) return

        Object.values(stations).map((station) => {

            // Delete station
            if (!!station.deviceId && devices[station.deviceId] === undefined) {
                alert('Station has a device that is deleted')

                onDeleteStation(station.id)
            }

            // Add station to device
            else if (!!station.deviceId && !devices[station.deviceId].stationId) {
                alert('Station has a broken device')

                const device = devices[station.deviceId]
                device.stationId = station.id
                onPutDevice(device, device.id)

            }
        })

    }

    /**
     * This deletes dashboards that belong to stations that don't exist
     * @param {*} dashboards
     * @param {*} locations
     */
    const handleDashboardsWithBrokenStations = (dashboards, stations) => {

        if (dashboards === undefined || stations === undefined) return

        Object.values(dashboards).map((dashboard) => {
            if (!!dashboard.location && !dashboard.device && !stations[dashboard.location]) {
                alert('Dashboard belongs to a station that does not exist')
                onDeleteDashboard(dashboard.id)
            }
        })


    }

    /**
     * This handles broken Processes
     * 1) A broken process would happen if a route/task that has been deleted but the process has not been updated
     * 2) Also, a route could have been added to a process, but the process was never added to the route
     * @param {*} processes
     * @param {*} tasks
     */
    const handleProcessesWithBrokenRoutes = async (processes, tasks) => {
        if (processes === undefined || tasks === undefined) return

        Object.values(processes).map((process) => {

            // Object.keys(process.routes).map(async (station) => {

            process.routes.map(async (route) => {

                // If the route does not exist anymore in tasks then delete the route from the process
                if (!tasks[route]) {
                    // Removes the task from the array of routes
                    let processRoutes = deepCopy(process.routes)
                    const index = processRoutes.indexOf(route)
                    processRoutes.splice(index, 1)
                    const updatedProcess = {
                        ...process,
                        routes: [...processRoutes]
                    }
                    alert('Route does not exist in anymore, delete from process')

                    await onPutProcess(updatedProcess)
                }

                // Else the task does exist, see if the task contains the process
                // else {
                //     if (!tasks[route].processes.includes(process._id)) {
                //         
                //         alert('Process containes a route, but the route does not contain the process, adding process to route')
                //
                //         let taskCopy = deepCopy(tasks[route])
                //         taskCopy.processes.push(process._id)
                //         dispatchPutTask(taskCopy, taskCopy._id)
                //
                //     }
                // }
            })
        })

        // })
    }

    /**
     * This handles tasks that belong to broken process
     * 1) the process has been deleted and the task have not
     * 2) The task was created but the process was never saved
     * 3) The task has a new tag
     * @param {*} processes
     * @param {*} tasks
     */
    const handleTasksWithBrokenProcess = async (processes, tasks) => {
        if (processes === undefined || tasks === undefined) return

        Object.values(tasks).map(async (task) => {

            if (!!task.new) {
                alert('Task still has a new tag, deleting task')
                onDeleteTask(task.id)
            }

            if (task.processes.length > 0) {
                task.processes.map((process) => {

                    // If processes does no contain the process, then the process was deleted so remove it from the task
                    if (!processes[process]) {
                        const index = task.processes.indexOf(process)
                        task.processes.splice(index, 1)

                        alert('Process does not exist anymore, removing from task')
                        dispatchPutTask(task, task.id)

                    }

                    else if (!processes[process].routes.includes(task.id)) {
                        alert('Task is associated with a process that is not associated with the task anymore, adding back to process')

                        const index = task.processes.indexOf(process)
                        task.processes.splice(index, 1)
                        dispatchPutTask(task, task.id)

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
            if (tasks[Q.taskId] === undefined) {
                alert('TaskQ associated task has been deleted')
                await onDeleteTaskQItem(Q.id, Q)
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
