// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// Import Actions
import { getMaps } from '../../redux/actions/map_actions'
import { getTaskQueue } from '../../redux/actions/task_queue_actions'
import { getLocations } from '../../redux/actions/locations_actions'
import { getObjects } from '../../redux/actions/objects_actions'
import { getTasks, deleteTask } from '../../redux/actions/tasks_actions'
import { getDashboards, deleteDashboard } from '../../redux/actions/dashboards_actions'
import { getSounds } from '../../redux/actions/sounds_actions'

import { getSchedules } from '../../redux/actions/schedule_actions';
import { getDevices, putDevices } from '../../redux/actions/devices_actions'
import { getStatus } from '../../redux/actions/status_actions'

import { getSettings } from '../../redux/actions/settings_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'
import { getLoggers } from '../../redux/actions/local_actions';
import { getRefreshToken } from '../../redux/actions/authentication_actions'

import { deletePosition } from '../../redux/actions/positions_actions'

import { postLocalSettings } from '../../redux/actions/local_actions'

// Import components
import Textbox from '../../components/basic/textbox/textbox'
import Button from '../../components/basic/button/button'

// import utils
import { getPageNameFromPath } from "../../methods/utils/router_utils";
import { isEquivalent } from '../../methods/utils/utils'

// import logger
import logger from '../../logger.js';
import { getMap } from '../../api/map_api';
import SideBar from '../side_bar/side_bar';

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

    const onGetSchedules = () => dispatch(getSchedules())
    const onGetDevices = async () => await dispatch(getDevices())
    const onGetStatus = () => dispatch(getStatus())

    const onGetSettings = () => dispatch(getSettings())
    const onGetLocalSettings = () => dispatch(getLocalSettings())
    const onGetLoggers = () => dispatch(getLoggers())
    const onGetRefreshToken = () => dispatch(getRefreshToken())

    const onDeleteTask = (ID) => dispatch(deleteTask(ID))
    const onDeleteDashboard = (ID) => dispatch(deleteDashboard(ID))
    const onDeletePosition = (position, ID) => dispatch(deletePosition(position, ID))
    const onPutDevice = (device, ID) => dispatch(putDevices(device, ID))

    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    // Selectors
    const schedulerReducer = useSelector(state => state.schedulerReducer)

    // States
    const [currentPage, setCurrentPage] = useState('')
    const [apiIpAddress, setApiIpAddress] = useState('')
    const [apiError, setApiError] = useState(false)

    const params = useParams()

    useEffect(() => {
        loadInitialData() // initial call to load data when app opens

        // this interval is always on
        // loads essential info used on every page such as status and taskQueue
        const criticalDataInterval = setInterval(() => loadCriticalData(), 500);
        // const mapDataInterval = setInterval(() => loadMapData(), 5000)
        return () => {
            // clear intervals
            clearInterval(pageDataInterval);
            clearInterval(criticalDataInterval);
            // clearInterval(mapDataInterval)
        }
    }, [])

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
            // this.setState({ currentPage: currentPageRouter });
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

        if (Object.keys(pageParams)[0] === 'sidebar') {
            pageName = pageParams.sidebar

        } else if (Object.keys(pageParams)[0] === 'locationID') {

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
                pageDataInterval = setInterval(() => loadObjectsData(), 1000);
                break;

            case 'scheduler':
                pageDataInterval = setInterval(() => loadSchedulerData(), 100000);
                break;

            case 'dashboards':
                pageDataInterval = setInterval(() => loadDashboardsData(), 10000);
                break;

            case 'tasks':
                pageDataInterval = setInterval(() => loadTasksData(), 1000);
                break;

            case 'settings':
                pageDataInterval = setInterval(() => loadSettingsData(), 1000);
                break;

            case 'more':
                pageDataInterval = setInterval(() => loadMoreData(), 1000);
                break;

            default:
                break;
        }

    }

    const loadInitialData = async () => {
        // Local Settings must stay on top of initial data so that the correct API address is seleceted
        const localSettings = await onGetLocalSettings()

        const refreshToken = await onGetRefreshToken()
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

        const status = await onGetStatus()
        const getSchedules = await onGetSchedules()

        const loggers = await onGetLoggers()


        handleTasksWithBrokenPositions(tasks, locations)
        handlePositionsWithBrokenParents(locations)
        handleDevicesWithBrokenStations(devices, locations)
        handleStationsWithBrokenDevices(devices, locations)
        handleDashboardsWithBrokenStations(dashboards, locations)

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

    }

    /*
      Loads data pertinent to Objects page

      required data:
      tasks, skills, objects, locations, dashboards, sounds
    */
    const loadMapData = async () => {
        const maps = await onGetMaps()
        const tasks = await onGetTasks();
        // const skills = await getSkills(this.skillsApi);
        const objects = await onGetObjects();
        const locations = await onGetLocations();
        const dashboards = await onGetDashboards();
        const sounds = await onGetSounds();
        // const skillTemplates = this.props.getSkillTemplates(this.skillTemplatesApi);

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
        Loads data pertinent to More page
    */
    const loadMoreData = async () => {

    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  DATA LOADERS SECTION END


    //  API DATA CLEAN UP (Ideally these functions should not exist... but it's not an ideal world...)
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * This deletes tasks that have broken positions
     * A broken position can be:
     * a deleted position
     * a position thats parent station has been deleted
     *  */
    const handleTasksWithBrokenPositions = async (tasks, locations) => {

        const stations = locations.stations
        const positions = locations.positions

        Object.values(tasks).map(async (task) => {

            // console.log('QQQQ Task', positions[task.load.position], positions[task.unload.position])

            // Deletes the task if the load/unload position has been deleted from the positon list
            if (!positions[task.load.position] || !positions[task.unload.position]) {
                console.log('QQQQ Position doesnt exist in positions, DELETE TASK', task._id.$oid)
                await onDeleteTask(task._id.$oid)
                return
            }

            // Deletes the task if the load/unload position has a change_key 'deleted'. This means the back end has not deleted the position yet
            if ((!!positions[task.load.position].change_key && positions[task.load.position].change_key === 'deleted') ||
                (!!positions[task.unload.position].change_key && positions[task.unload.position].change_key === 'deleted')) {
                console.log('QQQQ Position is deleted, waiting on back end, DELETE TASK')
                await onDeleteTask(task._id.$oid)
                return
            }


            // Deletes the task if the load/unload position has a parent, but that parent does not exist in stations (parent has been deleted)
            // Also should delete the position as well
            if ((!!positions[task.load.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent)) ||
                (!!positions[task.unload.position].parent && !Object.keys(stations).includes(positions[task.load.position].parent))) {
                console.log('QQQQ Position parent has been deleted, DELETE TASK AND POSITION')
                await onDeleteTask(task._id.$oid)
                return
            }
        })
    }

    /**
     * This deletes positions that have parents that are broken
     * A broken parent is a parent that has been deleted
     * @param {*} locations 
     */
    const handlePositionsWithBrokenParents = async (locations) => {

        const stations = locations.stations
        const positions = locations.positions

        Object.values(positions).map(async (position) => {

            if (!!position.parent && !Object.keys(stations).includes(position.parent)) {
                console.log('QQQQ This position should be deleted', position)
                onDeletePosition(position, position._id)
            }

        })
    }

    /**
     * This deletes device station if the station is broken
     * A broken station would happen when a station has been deleted
     * @param {*} devices 
     * @param {*} locations 
     */
    const handleDevicesWithBrokenStations = async (devices, locations) => {

        const stations = locations.stations

        Object.values(devices).map(async (device) => {
            if (!!device.station_id && !Object.keys(stations).includes(device.station_id)) {
                console.log('QQQQ Device has a station ID that needs to be deleted', device)
                delete device.station_id
                onPutDevice(device, device._id)
            }
        })

    }

    /**
     * This adds station to device if the station has a device ID and the device does not have a station ID
     * Why this happens is unkown atm, but this fixes when a device comes back without a station ID but should have one
     * @param {*} devices 
     * @param {*} locations 
     */
    const handleStationsWithBrokenDevices = (devices, locations) => {
        const stations = locations.stations

        Object.values(stations).map((station) => {

            if (!!station.device_id && !devices[station.device_id].station_id) {

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
        const stations = locations.stations

        Object.values(dashboards).map((dashboard) => {
            if(!!dashboard.location && !stations[dashboard.location]){
                console.log('QQQQ dashboard belongs to a station that does not exist', dashboard)
                onDeleteDashboard(dashboard._id.$oid)
            }
        })

        
    }

    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  API DATA CLEAN UP


    //  API LOGIN
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Submit API address to local storage
     */
    const handleSubmitApiIpAddress = async () => {
        await onPostLocalSettings({ non_local_api: true, non_local_api_ip: apiIpAddress })
        window.location.reload(false);
    }


    return (
        <>
            {/* When loading show an RM logo, if no api info, then show input to enter */}
            {!props.isApiLoaded ? apiError ?
                <div style={{ width: '100%', height: '100%', paddingTop: '15%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <i className={'icon-rmLogo'} style={{ fontSize: '10rem', marginBottom: '5rem', color: '#FF4B4B' }} />

                    <div style={{ width: '50%', minWidth: '20rem', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        < p > Please Enter API IP</p>
                        <Textbox
                            placeholder="API IP Address"
                            onChange={(event) => {
                                setApiIpAddress(event.target.value)
                            }}
                            style={{ width: '100%' }}
                        // type = 'number'
                        />
                        <Button schema={'scheduler'} onClick={handleSubmitApiIpAddress} style={{ color: 'red', border: '0.1rem solid red' }}>Submit</Button>
                    </div>
                </div>

                :
                <div style={{ width: '100%', height: '100%', paddingTop: '30%', display: 'flex', justifyContent: 'center' }}>
                    <i className={'icon-rmLogo'} style={{ fontSize: '10rem', color: '#FF4B4B' }} />
                </div>
                :
                <>
                </>
            }
        </>
    )
}

export default ApiContainer;
