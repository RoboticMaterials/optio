// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import { getMaps } from '../../redux/actions/map_actions'
import { getTaskQueue } from '../../redux/actions/task_queue_actions'
import { getLocations } from '../../redux/actions/locations_actions'
import { getObjects } from '../../redux/actions/objects_actions'
import { getTasks } from '../../redux/actions/tasks_actions'
import { getDashboards } from '../../redux/actions/dashboards_actions'
import { getSounds } from '../../redux/actions/sounds_actions'

import { getSchedules } from '../../redux/actions/schedule_actions';
import { getDevices } from '../../redux/actions/devices_actions'
import { getStatus } from '../../redux/actions/status_actions'

import { getSettings } from '../../redux/actions/settings_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'
import { getLoggers } from '../../redux/actions/local_actions';
import { getRefreshToken } from '../../redux/actions/authentication_actions'

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
    const onGetMaps = () => dispatch(getMaps())
    const onGetLocations = () => dispatch(getLocations())
    const onGetDashboards = () => dispatch(getDashboards())
    const onGetObjects = () => dispatch(getObjects())
    const onGetTasks = () => dispatch(getTasks())
    const onGetSounds = (api) => dispatch(getSounds(api))
    const onGetTaskQueue = () => dispatch(getTaskQueue())

    const onGetSchedules = () => dispatch(getSchedules())
    const onGetDevices = () => dispatch(getDevices())
    const onGetStatus = () => dispatch(getStatus())

    const onGetSettings = () => dispatch(getSettings())
    const onGetLocalSettings = () => dispatch(getLocalSettings())
    const onGetLoggers = () => dispatch(getLoggers())
    const onGetRefreshToken = () => dispatch(getRefreshToken())

    // Selectors
    const schedulerReducer = useSelector(state => state.schedulerReducer)

    // States
    const [currentPage, setCurrentPage] = useState('')

    const params = useParams()

    useEffect(() => {
        loadInitialData() // initial call to load data when app opens

        // this interval is always on
        // loads essential info used on every page such as status and taskQueue
        const criticalDataInterval = setInterval(() => loadCriticalData(), 500);
        return () => {
            // clear intervals
            clearInterval(pageDataInterval);
            clearInterval(criticalDataInterval);
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
        const locations = await onGetLocations()
        const dashboards = await onGetDashboards()
        const objects = await onGetObjects()
        const sounds = await onGetSounds()
        const tasks = await onGetTasks()
        const taskQueue = await onGetTaskQueue()

        const devices = await onGetDevices()
        const status = await onGetStatus()
        const getSchedules = await onGetSchedules()

        const settings = await onGetSettings()
        const loggers = await onGetLoggers()
        const maps = await onGetMaps()

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


    return (
        <>
        </>
    )
}

export default ApiContainer;
