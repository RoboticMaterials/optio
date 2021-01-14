import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import * as styled from './widget_button.style'

// Import utils
import uuid from 'uuid'

// Import Actions
import { postTaskQueue } from '../../../redux/actions/task_queue_actions'
import { sideBarBack, setSelectedLocationCopy, setSelectedLocationChildrenCopy } from '../../../redux/actions/locations_actions'
import { hoverStationInfo, putStation } from '../../../redux/actions/stations_actions'
import {widgetLoaded} from '../../../redux/actions/widget_actions'
import { postDashboard, dashboardOpen } from '../../../redux/actions/dashboards_actions'

import * as sidebarActions from "../../../redux/actions/sidebar_actions"
import * as locationActions from '../../../redux/actions/locations_actions'
import * as dashboardActions from '../../../redux/actions/dashboards_actions'

import { deepCopy } from '../../../methods/utils/utils'



const WidgetButton = (props) => {

    const {
        type,
        currentPage,
        id,
        coordinateMove,
        label,
        toggle,
    } = props

    const history = useHistory()
    const params = useParams()
    const widgetPage = params.widgetPage

    const dispatch = useDispatch()
    const onPostTaskQueue = (q) => dispatch(postTaskQueue(q))
    const onWidgetLoaded = (bol) => dispatch(widgetLoaded(bol))
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))
    const onDashboardOpen = (props) => dispatch(dashboardOpen(props))
    const onPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const onPutStation = (station, ID) => dispatch(putStation(station, ID))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const showSideBar = useSelector(state => state.sidebarReducer.open)
    const stations = useSelector(state => state.locationsReducer.stations)

    const dashboardID = params.dashboardID



    const handleOnClick = () => {
        switch (props.type) {
            case 'cart':
                handleCartButtonClick()
                break;

            case 'cancel':
                handleCancelClick()
                break;

            case 'dashboards':
                handleDashboardClick()
                break;

            default:
                history.push('/locations/' + id + '/' + type)
                break;
        }
    }

    // Handles  if the widget button clicked was a cart
    const handleCartButtonClick = () => {
        // If the button is for cart, then see if its a coord move or a simple task move
        // Coord move is for right click send cart to pos
        if (!!coordinateMove) {
            onPostTaskQueue({
                _id: uuid.v4(),
                task_id: 'custom_task',
                custom_task: {
                    type: 'coordinate_move',
                    coordinate: {
                        pos_x: selectedLocation.pos_x,
                        pos_y: selectedLocation.pos_y,
                        rotation: selectedLocation.rotation,
                    },
                    device_type: 'MiR_100',
                }
            })
            onWidgetLoaded(false)
            onHoverStationInfo(null)
            onSideBarBack({ selectedLocation })
        }
        else {
            onPostTaskQueue({
                _id: uuid.v4(),
                task_id: 'custom_task',
                custom_task: {
                    type: 'position_move',
                    position: id,
                    device_type: 'MiR_100',
                },
            })
        }
    }

    // Handles if the widget button clicked was cancel
    const handleCancelClick = () => {
        onWidgetLoaded(false)
        onHoverStationInfo(null)
        onSideBarBack({ selectedLocation })
    }

    // Handles if a dashboard is clicked
    const handleDashboardClick = async () => {
        let dashboardID

        // If there's no selected station, then see if theres a station in the url, if so, use that, else do nothing
        if(!selectedLocation) {
            if(!!params.stationID) {
                dashboardID = stations[params.stationID].dashboards[0]
            } else {
                return null
            }
        } else {
            dashboardID = selectedLocation.dashboards[0]
        }

        //let dashboardID = selectedLocation ? selectedLocation.dashboards[0] : null

        // If the dashboard is undefined, that means the location must not have a dashboard yet, so add one
        if (dashboardID === undefined) {
            console.log('QQQQ No dashboard ADDING!')

            // dashboardInfo
            let defaultDashboard = {
                name: selectedLocation.name + ' Dashboard',
                buttons: [],
                station: selectedLocation._id
            }

            //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
            const postDashboardPromise = onPostDashboard(defaultDashboard)

            postDashboardPromise.then(async postedDashboard => {

                selectedLocation.dashboards = [postedDashboard._id.$oid]

                await onPutStation(selectedLocation, selectedLocation._id)

                history.push('/locations/' + id + '/' + type + '/' + dashboardID)

            })
        }
        else {
            history.push('/locations/' + id + '/' + type + '/' + dashboardID)
        }

        onDashboardOpen(true)
    }


    return (
        <styled.WidgetButtonButton
            onClick={() => {
                if (showSideBar && !widgetPage) {
                    const hamburger = document.querySelector('.hamburger')
                    hamburger.classList.toggle('is-active')
                }

                handleOnClick()

                //const hamburger = document.querySelector('.hamburger')
                //hamburger.classList.toggle(false)
            }}
            pageID={type}
            currentPage={currentPage}
        >
            {type === 'view' ?
                <styled.WidgetButtonIcon className="far fa-eye" pageID={type} currentPage={currentPage} />
                :
                type === 'cancel' ?
                    <>
                        <styled.WidgetButtonIcon className="fas fa-times" pageID={type} currentPage={currentPage} />
                        <styled.WidgetButtonText>{"Cancel"}</styled.WidgetButtonText>
                    </>
                    :
                    type === 'lots' ?
                    <>
                        <styled.WidgetButtonIcon className="far fa-clone" pageID={type} currentPage={currentPage} />
                        <styled.WidgetButtonText>{label}</styled.WidgetButtonText>
                    </>
                    :
                    <>
                        <styled.WidgetButtonIcon style={{ fontSize: type === 'cart' && '1.2rem', paddingTop: type === 'cart' && '.8rem' }} className={"icon-" + type} pageID={type} currentPage={currentPage} />
                        <styled.WidgetButtonText>{label}</styled.WidgetButtonText>
                    </>
            }
            {/* <styled.ButtonText>{props.type}</styled.ButtonText> */}

        </styled.WidgetButtonButton>
    )
}

export default WidgetButton
