import {
  WIDGET_PAGE_LOADED,
  WIDGET_XY_COORDINATES,
  WIDGET_LOADED,
} from '../types/widget_types'


  const defaultState = {
    widgetPageLoaded: false,
    widgetXYCoordinates: {x: '', y: ''},
    widgetLoaded: false
};

const widgetReducer = (state = defaultState, action) => {


    switch (action.type) {
        case WIDGET_PAGE_LOADED:
            return {
                ...state,
                widgetPageLoaded: action.payload
            }

        case WIDGET_XY_COORDINATES:
            return {
                ...state,
                widgetXYCoordinates: action.payload
            }

          case WIDGET_LOADED:
              return {
                  ...state,
                  widgetLoaded: action.payload,
              }

        default:
            return state
    }
}

export default widgetReducer
