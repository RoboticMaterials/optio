import { combineReducers } from 'redux'
import schedulesReducer from './schedules_reducer_v2';
import skillsReducer from './skills_reducer';
import stationsReducer from './stations_reducer';
import positionsReducer from './positions_reducer'
import objectsReducer from './objects_reducer';
import apiReducer from './api_reducer';
import dashboardsReducer from './dashboards_reducer'
import errorReducer from './error_reducer';
import statusReducer from './status_reducer';
import taskQueueReducer from './task_queue_reducer';
import keyboardReducer from './keyboard_reducer';
import tasksReducer from './tasks_reducer';
import soundsReducer from './sounds_reducer';
import settingsReducer from './settings_reducer';
import localReducer from './local_reducer';
import modelsReducer from './models_reducer'
import skillTemplatesReducer from './skill_templates_reducer'
import posesReducer from './poses_reducer';
import requestStatusReducer from './request_status_reducer';
import taskAnalysisReducer from './task_analysis_reducer'
import mapReducer from './map_reducer'
import lotTemplatesReducer from './lot_templates_reducer'
import sidebarReducer from './sidebar_reducer'
import widgetReducer from './widget_reducer'
import devicesReducer from './devices_reducer'
import notificationsReducer from './notifications_reducer'
import eventsReducer from './events_reducer'
import authenticationReducer from './authentication_reducer'
import processesReducer from './processes_reducer'
import reportEventsReducer from './report_events_reducer'
import cardsReducer from './cards_reducer'
import lotsReducer from './lots_reducer'
import testReducer from './test_reducer'
import cardPageReducer from "./card_page_reducer"
// TEST

export default combineReducers({
    cardPageReducer,
    lotTemplatesReducer,
    apiReducer,
    reportEventsReducer,
    cardsReducer,
    lotsReducer,
    schedulesReducer,
    skillsReducer,
    positionsReducer,
    stationsReducer,
    objectsReducer,
    dashboardsReducer,
    errorReducer,
    statusReducer,
    taskQueueReducer,
    keyboardReducer,
    soundsReducer,
    tasksReducer,
    settingsReducer,
    localReducer,
    modelsReducer,
    skillTemplatesReducer,
    posesReducer,
    requestStatusReducer,
    taskAnalysisReducer,
    mapReducer,
    sidebarReducer,
    widgetReducer,
    devicesReducer,
    notificationsReducer,
    eventsReducer,
    authenticationReducer,
    processesReducer,
})
