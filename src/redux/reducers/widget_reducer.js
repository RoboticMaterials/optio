const defaultState = {
    widgetPageLoaded: false,
    widgetXYCoordinates: {x: '', y: ''},
}

const widgetReducer = (state = defaultState, action) => {


    switch (action.type) {
        case 'WIDGET_PAGE_LOADED':
            return {
                ...state,
                widgetPageLoaded: action.payload
            }

        case 'WIDGET_XY_COORDINATES':
            return {
                ...state,
                widgetXYCoordinates: action.payload
            }
    
        default:
            return state
    }
}

export default widgetReducer