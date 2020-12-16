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
import { getProcesses, putProcesses } from '../../redux/actions/processes_actions'

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
import {isEquivalent, deepCopy, uuidv4} from '../../methods/utils/utils'

// import logger
import logger from '../../logger.js';
import { getMap } from '../../api/map_api';
import SideBar from '../side_bar/side_bar';
import localReducer from "../../redux/reducers/local_reducer";
import {postCard} from "../../redux/actions/card_actions";
import {putJunk} from "../../redux/actions/test_actions";


var count = 0

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const TestsContainer = (props) => {

    const dispatch = useDispatch()

    const onPostCard = (card) => dispatch(postCard(card))
    const onPutJunk = () => dispatch(putJunk())

    const [dataInterval, setDataInterval] = useState(null)

    useEffect( () => {
        // clearInterval(dataInterval)
        setDataInterval(setInterval(()=>onPutJunk(),100))

    }, [])



    return (
        <div></div>
    )
}

export default TestsContainer;
