// import external dependencies
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// Import Actions
import { getMaps } from '../../redux/actions/map_actions'
import { getTasks } from '../../redux/actions/tasks_actions'
import { getDashboards } from '../../redux/actions/dashboards_actions'
import { getProcesses } from '../../redux/actions/processes_actions'
import { getLotTemplates } from '../../redux/actions/lot_template_actions'
import { getCards, getStationCards } from "../../redux/actions/card_actions";
import { getSettings } from '../../redux/actions/settings_actions'
import { getStations } from '../../redux/actions/stations_actions'

// Import components
import SplashScreen from "../../components/misc/splash_screen/splash_screen";


import { mapValues } from 'lodash';


const ApiContainer = (props) => {

    const localSettings = useSelector(state => state.localReducer.localSettings)

    // Dispatches
    const dispatch = useDispatch()

    const onGetMaps = async () => await dispatch(getMaps())
    const onGetStations = async () => await dispatch(getStations())
    const onGetDashboards = async () => await dispatch(getDashboards())
    const onGetTasks = async () => await dispatch(getTasks())
    const onGetLotTemplates = () => dispatch(getLotTemplates())
    const onGetCards = () => dispatch(getCards())
    const onGetStationCards = (stationId) => dispatch(getStationCards(stationId))
    const onGetProcesses = () => dispatch(getProcesses());
    const onGetSettings = () => dispatch(getSettings())

    // Selectors
    const params = useParams()

    // console.log(params)

    const [prevParams, setPrevParams] = useState(null);
    const [apiError, setApiError] = useState(false);

    const dataInterval = useRef(null);
    const cardsInterval = useRef(null); // Separate from rest of data because we dont always want all cards

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

        onGetStations()
        onGetDashboards()
        onGetProcesses()
        onGetTasks()
        onGetLotTemplates()

        props.apiLoaded()
        props.onLoad()
    }

    const loadData = () => {
        onGetStations();
        onGetDashboards();
        onGetProcesses();
        onGetTasks();
        onGetLotTemplates();
        onGetSettings();
    }

    useEffect(() => {
        dataInterval.current = setInterval(loadData, 60000) // Pull all data every 10 minutes
        loadInitialData();
        
        if (params.widgetPage === 'dashboards') {
            cardsInterval.current = setInterval(() => {
                onGetStationCards(params.stationID);
            }, 60000)
            onGetStationCards(params.stationID);
        } else {
            cardsInterval.current = setInterval(() => {
                onGetCards();
            }, 60000)
            onGetCards();
        }

        return () => {
            clearInterval(dataInterval.current);
            clearInterval(cardsInterval.current);
        }
    }, [])

    useEffect(() => {

        if (params.widgetPage !== prevParams?.widgetPage) {
            clearInterval(cardsInterval.current);
            if (params.widgetPage === 'dashboards') {
                cardsInterval.current = setInterval(() => {
                    onGetStationCards(params.stationID);
                }, 60000)
            } else {
                cardsInterval.current = setInterval(() => {
                    onGetCards();
                }, 60000)
            }

            setPrevParams(params);
        }
        

    }, [params.widgetPage])

    return (
        <SplashScreen
            isApiLoaded={props.isApiLoaded}
            apiError={apiError}
        />
    )
}

export default ApiContainer;
