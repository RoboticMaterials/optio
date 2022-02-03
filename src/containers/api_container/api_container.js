// import external dependencies
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";

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
import { getCards, getProcessCards, getStationCards } from "../../redux/actions/card_actions";
import { mapValues } from 'lodash';
import { getOpenStationTouchEvents } from '../../redux/actions/touch_events_actions';

const ApiContainer = (props) => {

    // Dispatches
    const dispatch = useDispatch()
    const history = useHistory()
    const onGetMaps = async () => await dispatch(getMaps())
    const onGetStations = async () => await dispatch(getStations())
    const onGetDashboards = async () => await dispatch(getDashboards())
    const onGetTasks = async () => await dispatch(getTasks())
    const onGetLotTemplates = () => dispatch(getLotTemplates())
    const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const onGetCards = () => dispatch(getCards())
    const onGetStationCards = (stationId) => dispatch(getStationCards(stationId))
    const onGetOpenStationTouchEvents = (stationId) => dispatch(getOpenStationTouchEvents(stationId))
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
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)
    const stations = useSelector(state => state.stationsReducer.stations)
    const serverSettings = useSelector(state => state.settingsReducer.settings) || {}
    const localSettings = localReducer.localSettings
    const maps = useSelector(state => state.mapReducer.maps)

    // States
    const [currentPage, setCurrentPage] = useState('')
    const [apiError, setApiError] = useState(false)

    const [pageDataIntervals, setPageDataIntervals] = useState([])
    const [criticalDataInterval, setCriticalDataInterval] = useState(null)
    const [localParams, setLocalParams] = useState(params)
    const [localPath, setLocalPath] = useState(history?.location?.pathname)
    const params = useParams()

    useEffect(() => {
        loadInitialData() // initial call to load data when app opens

        return () => {
            // clear intervals
            pageDataIntervals.forEach(interval => clearInterval(interval))
            clearInterval(criticalDataInterval);
        }
    }, [])


    useEffect(() => {
        if (stopAPICalls === true) {
            clearInterval(criticalDataInterval);
            pageDataIntervals.forEach(interval => clearInterval(interval))
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
      if(JSON.stringify(params) !==JSON.stringify(localParams) || JSON.stringify(localPath) !== JSON.stringify(history.location.pathname)) {
        setLocalPath(history.location.pathname)
        setLocalParams(params)
        pageDataIntervals.forEach(interval => clearInterval(interval));
        setPageDataIntervals([])
          if (stopAPICalls !== true) {
              updateCurrentPage();
          }
        }
    },[params])

    // If the currentMap changes, fetch the new resources
    useEffect(() => {
        onGetStations()
        onGetDashboards()
        onGetProcesses()
        onGetTasks()
        onGetCards()
        onGetLotTemplates()
    }, [localSettings.currentMapId])

    const updateCurrentPage = () => {

        // let pathname = this.props.location.pathname;

        const currentPageRouter = params
        // const currentPageRouter = getPageNameFromPath(pathname);
        // this.logger.debug("api_container currentPage", currentPage);
        // this.logger.debug("api_container currentPageRouter", currentPageRouter);

        // If the current page state and actual current page are different, then the page has changed so the data interval should change
            // page changed

            //if (!getIsEquivalent(currentPageRouter, currentPage)) {

                setCurrentPage(currentPageRouter)

                // update data interval to get data for new currentPage
                setDataInterval(currentPageRouter);
            //}
    }


    /**
     * Handles data interval based on page
     */

    const setDataInterval = async (pageParams) => {
        let pageName = ''
        const {
            data1,
            data2
        } = pageParams
        if (Object.keys(pageParams)[0] === 'sidebar') {
            pageName = pageParams.sidebar
        } else if (Object.keys(pageParams)[0] === 'stationID') {
            if (pageParams.widgetPage === undefined) {
                pageName = 'locations'
            } else {
                pageName = pageParams.widgetPage
            }
        }

        // clear current interval
        await pageDataIntervals.forEach(interval => clearInterval(interval));
        setPageDataIntervals([])
        // set new interval for specific page
        switch (pageName) {

            case 'dashboards':
                setDashboardPageIntervals()
                break;

            case 'locations':
              if(!mapViewEnabled) setLocationListViewIntervals()
              else setLocationPageIntervals()
                break

            case 'settings':
                setSettingsPageIntervals()
                break;

            case 'lots':
                setKanbanIntervals()
                break

            case 'processes':
                setProcessPageIntervals()
                break

            default:
                if(!mapViewEnabled) {
                    if(!pageName) setLocationListViewIntervals()
                    else setDashboardPageIntervals()
                }
                break;
        }
    }

    const loadInitialData = async () => {
        // Local Settings must stay on top of initial data so that the correct API address is seleceted
        const settingsPromise = onGetSettings();
        const mapsPromise = onGetMaps();

        // If there is no map yet, set it to the first map
        Promise.all([mapsPromise, settingsPromise]).then(([maps, serverSettings]) => {
            if (!localSettings.currentMapId && !!maps) {
                console.log(serverSettings)
                onPostLocalSettings({
                    ...localSettings,
                    currentMapId: serverSettings.defaultMapId || maps[0]?._id || null
                })
            }
        })




        if (mapValues === undefined) {
            props.onLoad()
            setApiError(true)
            return
        }

        await onGetStations()
        await onGetDashboards()
        await onGetProcesses()
        await onGetTasks()
        await onGetCards()
        await onGetLotTemplates()

        await onGetLoggers()

        props.apiLoaded()
        props.onLoad()
    }

    //  DATA LOADERS SECTION BEGIN
    //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const setDashboardPageIntervals = () => {
      if(history.location.pathname.includes('lots')){
        setPageDataIntervals([
            setInterval(async () => {
                await onGetStations()
                await onGetSettings();
                await onGetTasks()
                await onGetStationCards(params.stationID)
                await onGetProcesses()
                await onGetTasks();
                await onGetOpenStationTouchEvents(params.stationID)
                await onGetDashboards() // must go last
            }, 5000)
        ])
      }
      else{
        setPageDataIntervals([
            setInterval(async () => {
                await onGetStations()
                await onGetStationCards(params.stationID)
                await onGetOpenStationTouchEvents(params.stationID)
                await onGetDashboards() // must go last
            }, 1000)
        ])
      }
    }

    const setLocationListViewIntervals = () => {
        setPageDataIntervals([
            setInterval(async () => {
                await onGetStations()
                await onGetSettings()
            }, 10000)
        ])
    }


    const setLocationPageIntervals = () => {
        // On these pages, the map is shown. therefore we also have to load stuff to render on the map
        setPageDataIntervals([
            setInterval(() => {
                onGetStations();
                onGetProcesses();
                onGetTasks();
            }, 5000),
        ])
    }

    const setKanbanIntervals = () => {
      if(!!params && params.data1 && params.data1 === 'summary'){
        setPageDataIntervals([
            setInterval(async() => {
                await onGetProcesses();
            }, 20000),
            setInterval(async() => {
                await onGetCards();
                await onGetSettings();
            }, 1000)
        ])
      }
      else{
        setPageDataIntervals([
            setInterval(async() => {
                await onGetProcesses();
            }, 20000),
            setInterval(async() => {
                await onGetProcessCards(params.data1);
                await onGetSettings();
            }, 1000)
        ])
      }

    }

    const setSettingsPageIntervals = () => {

    }

    const setProcessPageIntervals = () => {
        // On these pages, the map is shown. therefore we also have to load stuff to render on the map
        setPageDataIntervals([
            setInterval(() => {
                onGetStations();
                onGetProcesses();
                onGetTasks();
            }, 5000),
            setInterval(() => {
                onGetCards();
            }, 20000)
        ])
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
