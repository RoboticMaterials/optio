import { combineReducers } from 'redux'

import stationsReducer from './stations_reducer';
import positionsReducer from './positions_reducer'
import dashboardsReducer from './dashboards_reducer'
import tasksReducer from './tasks_reducer';
import settingsReducer from './settings_reducer';
import localReducer from './local_reducer';
import mapReducer from './map_reducer'
import lotTemplatesReducer from './lot_templates_reducer'
import sidebarReducer from './sidebar_reducer'
import widgetReducer from './widget_reducer'
import notificationsReducer from './notifications_reducer'
import touchEventsReducer from './touch_events_reducer'
import processesReducer from './processes_reducer'
import reportEventsReducer from './report_events_reducer'
import cardsReducer from './cards_reducer'
import cardPageReducer from "./card_page_reducer"

// TEST

export default combineReducers({
    // Local side Reducers
    cardPageReducer,
    sidebarReducer,
    localReducer,
    widgetReducer,

    // API Reducers
    lotTemplatesReducer,
    reportEventsReducer,
    cardsReducer,
    stationsReducer,
    dashboardsReducer,
    tasksReducer,
    settingsReducer,
    touchEventsReducer,
    mapReducer,
    processesReducer,

    // Not implemented reducers (will be reintroduced)
    positionsReducer,
    notificationsReducer,
    
    
})
