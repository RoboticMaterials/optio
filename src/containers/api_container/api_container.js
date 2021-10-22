// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// Import Actions
import { getMaps } from '../../redux/actions/map_actions'
import { getTasks, deleteTask, putTask } from '../../redux/actions/tasks_actions'
import { getDashboards, deleteDashboard, postDashboard } from '../../redux/actions/dashboards_actions'
import { getProcesses, putProcesses } from '../../redux/actions/processes_actions'
import { getLotTemplates } from '../../redux/actions/lot_template_actions'

import { getSettings } from '../../redux/actions/settings_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'
import { postDevSettings } from '../../api/local_api'

import { getLoggers } from '../../redux/actions/local_actions';


import { getStations, putStation, deleteStation } from '../../redux/actions/stations_actions'

import { postLocalSettings } from '../../redux/actions/local_actions'
import * as localActions from '../../redux/actions/local_actions'

// Import components
import SplashScreen from "../../components/misc/splash_screen/splash_screen";

// import utils
import { getIsEquivalent, deepCopy } from '../../methods/utils/utils'

// import logger
import logger from '../../logger.js';
import { getMap } from '../../api/map_api';
import localReducer from "../../redux/reducers/local_reducer";
import { getCards, getProcessCards } from "../../redux/actions/card_actions";
import { getReportEvents } from "../../redux/actions/report_event_actions";
import { mapValues } from 'lodash';

const ApiContainer = (props) => {

    // Dispatches
    const dispatch = useDispatch()
    const onGetMaps = async () => await dispatch(getMaps())
    const onGetStations = async () => await dispatch(getStations())
    const onGetDashboards = async () => await dispatch(getDashboards())
    const onGetTasks = async () => await dispatch(getTasks())
    const onGetLotTemplates = () => dispatch(getLotTemplates())

    const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    // const dispatchGetLots = () => dispatch(getLots())
    const onGetCards = () => dispatch(getCards())

    const onGetProcesses = () => dispatch(getProcesses());

    const onGetSettings = () => dispatch(getSettings())
    const onGetLocalSettings = () => dispatch(getLocalSettings())
    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    const onGetLoggers = () => dispatch(getLoggers())

    // Selectors
    const localReducer = useSelector(state => state.localReducer)
    const MiRMapEnabled = localReducer?.localSettings?.MiRMapEnabled
    const stopAPICalls = useSelector(state => state.localReducer.stopAPICalls)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)


    // States
    const [currentPage, setCurrentPage] = useState('')
    const [apiError, setApiError] = useState(false)
    const [pageDataInterval, setPageDataInterval] = useState(null)
    const [criticalDataInterval, setCriticalDataInterval] = useState(null)
    const [mapDataInterval, setMapDataInterval] = useState(null)

    const params = useParams()

    useEffect(() => {
        loadInitialData() // initial call to load data when app opens

        // this interval is always on
        // loads essential info used on every page such as status and taskQueue
        setCriticalDataInterval(setInterval(() => loadCriticalData(), 500));


        if (!!mapViewEnabled) {
            setMapDataInterval(setInterval(() => loadMapData(), 10000));
        }


        return () => {
            // clear intervals
            clearInterval(pageDataInterval);
            clearInterval(criticalDataInterval);
            //clearInterval(mapDataInterval)
        }
    }, [])


    useEffect(() => {
        if (stopAPICalls === true) {
            clearInterval(criticalDataInterval);
            clearInterval(pageDataInterval);
            clearInterval(mapDataInterval);
            //dispatchStopAPICalls(false)
        }
    }, [stopAPICalls])


    useEffect(() => {


        // once MiR map is enabled, it's always enabled, so only need to do check if it isn't enabled
        if (!MiRMapEnabled) {
            let containsMirCart = false
            // check each device
            // in order for MiR mode to be enabled, there must be at least one device of MiR type

            // only update if MiRMapEnabled isn't currently set or MiRMapEnabled needs to be updated because it isn't equal to containsMirCart
            if ((MiRMapEnabled === undefined) || (MiRMapEnabled !== containsMirCart)) {

                const updatedLocalSettings = {
                    ...localReducer.localSettings,
                    MiRMapEnabled: containsMirCart,
                }

                onPostLocalSettings(updatedLocalSettings)
            }
        }

    }, [MiRMapEnabled])

    useEffect(() => {

        if (stopAPICalls !== true) {
            updateCurrentPage();
        }

    })

    const updateCurrentPage = () => {

        // let pathname = this.props.location.pathname;

        const currentPageRouter = params
        // const currentPageRouter = getPageNameFromPath(pathname);
        // this.logger.debug("api_container currentPage", currentPage);
        // this.logger.debug("api_container currentPageRouter", currentPageRouter);


        // If the current page state and actual current page are different, then the page has changed so the data interval should change
        if (!getIsEquivalent(currentPageRouter, currentPage)) {
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

            case 'dashboards':
                setPageDataInterval(setInterval(() => loadDashboardsData(), 3000))
                break;

            case 'locations':
                setPageDataInterval(setInterval(() => loadLocationsData(), 5000))
                break

            case 'tasks':
                setPageDataInterval(setInterval(() => loadTasksData(), 10000))
                break;

            case 'settings':
                setPageDataInterval(setInterval(() => loadSettingsData(), 10000))
                break;

            case 'lots':
                setPageDataInterval(setInterval(() => loadCardsData(), 10000))
                break

            case 'processes':
                if (data2 === "lots") {
                    loadCardsData(data1) // initial call
                    setPageDataInterval(setInterval(() => loadCardsData(data1), 10000))
                }
                else if (data1 === "timeline") {
                    loadCardsData() // initial call
                    setPageDataInterval(setInterval(() => loadCardsData(), 10000))
                }
                else if (data1 === "summary") {
                    loadCardsData() // initial call
                    setPageDataInterval(setInterval(() => loadCardsData(), 10000))
                }
                else {
                    setPageDataInterval(setInterval(() => loadTasksData(), 10000))
                }

                break

            case 'more':
                setPageDataInterval(setInterval(() => loadMoreData(), 10000))
                // pageDataInterval = ;
                break;

            default:
                if(!mapViewEnabled) {
                    setPageDataInterval(setInterval(() => loadListViewData(), 5000))
                }
                break;
        }

    }

    const loadInitialData = async () => {
        // Local Settings must stay on top of initial data so that the correct API address is seleceted
        //const localSettings = await onGetLocalSettings()
        const settings = await onGetSettings();
        //await postSettings(settings)
        // const refreshToken = await onGetRefreshToken()
        const maps = await onGetMaps()

        if (mapValues === undefined) {
            props.onLoad()
            setApiError(true)
            return
        }

        const stations = await onGetStations()
        const dashboards = await onGetDashboards()
        const tasks = await onGetTasks()
        const processes = await onGetProcesses()
        const cards = onGetCards()
        const lotTemplates = onGetLotTemplates()

        const loggers = await onGetLoggers()

        props.apiLoaded()
        props.onLoad()

    }

    //  DATA LOADERS SECTION BEGIN
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const loadCriticalData = async () => {
    }

    const loadLocalData = async () => {
        const localSettings = await onGetLocalSettings()
    }

    /*
        Loads data pertinent to Tasks page

        required data:
        tasks
    */
    const loadTasksData = async () => {
        const tasks = await onGetTasks()
        const processes = await onGetProcesses()
    }

    const loadLocationsData = async () => {
        await onGetStations()
        await onGetTasks()
        await onGetDashboards()

    }

    const loadListViewData = () => {
        onGetStations()
        onGetDashboards()
    }

    /*
        Loads data pertinent to Dashboards page

        required data:
        dashboards
    */
    const loadDashboardsData = async () => {
        await onGetStations()
        await onGetTasks()
        await onGetDashboards();
        await onGetCards()
        await onGetProcesses()
        await onGetTasks();

        /*
        * For now, this MUST come last.
        *
        * If this is made first, the dashboards page will do updates without the other data updated first,
        * which may include incorrectly removing buttons.
        * */
        await onGetDashboards()

    }

    const loadMapData = async () => {
        onGetStations();
        onGetTasks()
        onGetProcesses()
    }

    /*
        Loads data pertinent to Settings page

        required data:
        settings, loggers
    */
    const loadSettingsData = async () => {
        const settings = await onGetSettings();
        //const localSettings = await onGetLocalSettings()
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

        onGetProcesses()
        onGetTasks()
    }

    /*
        Loads data pertinent to More page
    */
    const loadMoreData = async () => {

    }

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
