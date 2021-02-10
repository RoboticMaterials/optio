import {
  WIDGET_PAGE_LOADED,
  WIDGET_XY_COORDINATES,
  WIDGET_LOADED,
  HOVER_STATION_INFO,
  HOVER_ROUTE_INFO,

} from '../types/widget_types'

export const widgetPageLoaded = (state) => {
    return { type: WIDGET_PAGE_LOADED, payload: state}
}

export const widgetXYCoordinates = (state) => {
    return { type: WIDGET_XY_COORDINATES, payload: state}
}

export const widgetLoaded = (state) => {
    return { type: WIDGET_LOADED, payload: state}
}

export const hoverStationInfo = (info) => {
    return { type: HOVER_STATION_INFO, payload: { info } }
}

export const hoverRouteInfo = (info) => {
    return { type: HOVER_ROUTE_INFO, payload: { info } }
}
