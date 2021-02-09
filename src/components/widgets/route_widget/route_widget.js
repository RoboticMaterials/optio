import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// import components

// Import Actions
import { setSelectedStation, setEditingStation } from '../../../redux/actions/stations_actions'
import { setSelectedPosition, setSelectedStationChildrenCopy, setEditingPosition } from '../../../redux/actions/positions_actions'
import { widgetLoaded, hoverRouteInfo } from '../../../redux/actions/widget_actions'


// Import Utils

import * as styled from './route_widget.style'

const RouteWidgets = (props) => {

    let params = useParams()
    const history = useHistory()

    // Grabs what widget page is in the URL
    const widgetPage = params.widgetPage
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)

    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)

    const locations = {
        ...stations,
        ...positions
    }
    console.log(locations)
    // Info passed from workstations/device_locations via redux
    const hoveringInfo = useSelector(state => state.widgetReducer.hoverRouteInfo)

    const dispatch = useDispatch()
    const dispatchHoverRouteInfo = (info) => dispatch(hoverRouteInfo(info))
    const dispatchWidgetLoaded = (bool) => dispatch(widgetLoaded(bool))

    // Location ID passed down through workstations via redux
    const routeID = hoveringInfo? hoveringInfo.id : {}

    const [x1, setX1] = useState(null)
    const [x2, setX2] = useState(null)
    const [y1, setY1] = useState(null)
    const [y2, setY2] = useState(null)


    // This tells redux that the widget has mounted. Used in map view to handle if widget is still open but shoulnt be
    // This happens when moving the mouse too fast over a location causing a widget to load, but not fast enough for the onmouselave to execute
    useEffect(() => {

        // setTimeout(() => dispatchWidgetLoaded(true), 100)
        dispatchWidgetLoaded(true)
        return () => {
            onWidgetClose()
        }
    }, [])


    /**
     * Closes the widget
     * If editing, then dont set the selected location to null
     * @param {*} edit
     */
    const onWidgetClose = (edit) => {
        dispatchHoverRouteInfo(null)
        dispatchWidgetLoaded(false)
    }


    const element = document.getElementById(hoveringInfo.id)

    const handleWidgetPosition = (coord) => {

      const elementHeight = element.getBoundingClientRect().height
      const elementWidth = element.getBoundingClientRect().width

      if(!!selectedTask){
        if(coord === 'x'){
          setX1(locations[selectedTask.load.position].pos_x)
          console.log(x1)
        }











      }




      }


        // When first hovering over, the widget has not mounted so the element is null, but once its mounted, you can use the bounding box






        let widgetPosition = {}

        // Handles the x, use location x if right click menu so it can also move
        if (!!selectedPosition && selectedPosition.schema === 'temporary_position') {
            widgetPosition.x = selectedPosition.x - elementWidth / 2 + 30 + 'px'
        }
        else {
            widgetPosition.x = hoveringInfo.xPosition - elementWidth / 2 + 'px'
        }

        // Handles the y, use location y if right click menu so it can also move
        if (!!selectedPosition && selectedPosition.schema === 'temporary_position') {
            widgetPosition.y = selectedPosition.y + elementHeight / 2 + 20 + 'px'
        }
        else {
            widgetPosition.y = hoveringInfo.yPosition + elementHeight / 2 + 'px'
        }

        if (coord === 'x') {
            return widgetPosition.x

        } else {

            return widgetPosition.y
        }
  //  }

    /**
     * This handles the x and y position of the widget.
     * It centers the x and y position to the middle of the widget by using the element height and width
     * This takes care issue with widgets that are different sizes
     * @param {} coord
     */
    // Left outside of function so that otherplaces can access it

    return (
      <>
        {selectedTask &&
          <styled.WidgetLocationContainer
            xPosition = {()=> handleWidgetPosition('x')}
            yPosition = '300px'
          >
            <styled.WidgetContainer>
              <styled.WidgetStationName>{""}</styled.WidgetStationName>
            </styled.WidgetContainer>

          </styled.WidgetLocationContainer>
        }
      </>
      )
    }

export default RouteWidgets
