import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import * as styled from './widget_button.style'

// Import utils
import {v4 as uuid} from "uuid"

// Import Actions
import { putStation, setSelectedStationChildrenCopy } from '../../../redux/actions/stations_actions'
import { removePosition, setSelectedPosition } from '../../../redux/actions/positions_actions'
import { widgetLoaded, hoverStationInfo } from '../../../redux/actions/widget_actions'
import { postDashboard, dashboardOpen } from '../../../redux/actions/dashboards_actions'

import { deepCopy } from '../../../methods/utils/utils'
import * as sidebarActions from "../../../redux/actions/sidebar_actions";



const WidgetButton = (props) => {

    const {
        type,
        currentPage,
        id,
        coordinateMove,
        label,
        switcher,
        toggle,
    } = props

    const history = useHistory()
    const params = useParams()
    const widgetPage = params.widgetPage

    const dispatch = useDispatch()
    const dispatchWidgetLoaded = (bol) => dispatch(widgetLoaded(bol))
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchDashboardOpen = (props) => dispatch(dashboardOpen(props))
    const dispatchPostDashboard = (dashboard) => dispatch(postDashboard(dashboard))
    const dispatchPutStation = (station, ID) => dispatch(putStation(station, ID))
    const dispatchRemovePosition = (id) => dispatch(removePosition(id))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchSetConfirmDelete = (show, callback) => dispatch(sidebarActions.setConfirmDelete(show, callback))

    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const showSideBar = useSelector(state => state.sidebarReducer.open)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const stations = useSelector(state => state.stationsReducer.stations)
    const dashboardID = params.dashboardID

    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition

    const handleOnClick = () => {
        switch (props.type) {

            case 'cancel':
                onCancelClick()
                break;

            case 'dashboards':
                if(pageInfoChanged) {
                    dispatchSetConfirmDelete(true, onDashboardClick)
                }
                else {
                    onDashboardClick()
                }
                break;

            default:
                if(pageInfoChanged) {
                    dispatchSetConfirmDelete(true, onDefaultClick)
                }
                else {
                    onDefaultClick()
                }

                break;
        }
    }

    const onDefaultClick = () => {
        history.push('/locations/' + id + '/' + type)
    }

    // Handles if the widget button clicked was cancel
    const onCancelClick = () => {
        dispatchWidgetLoaded(false)
        dispatchHoverStationInfo(null)
        dispatchRemovePosition(selectedPosition._id)
        dispatchSetSelectedPosition(null)
    }

    // Handles if a dashboard is clicked
    const onDashboardClick = async () => {
        let dashboardID

        // If there's no selected station, then see if theres a station in the url, if so, use that, else do nothing
        if (!selectedLocation) {
            if (!!params.stationID) {
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
                locked: false,
                buttons: [],
                station: selectedLocation._id
            }

            //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
            const postDashboardPromise = dispatchPostDashboard(defaultDashboard)

            postDashboardPromise.then(async postedDashboard => {

                selectedLocation.dashboards = [postedDashboard._id.$oid]

                await dispatchPutStation(selectedLocation, selectedLocation._id)

                history.push('/locations/' + id + '/' + type + '/' + dashboardID)

            })
        }
        else {
            history.push('/locations/' + id + '/' + type + '/' + dashboardID)
        }

        dispatchDashboardOpen(true)
    }

    return (
        <styled.WidgetButtonButton
            onClick={() => {

                handleOnClick()

            }}
            switcher={switcher}
            pageID={type}
            currentPage={currentPage}
            active={type === currentPage}
        >
            {type === 'view' ?
                <styled.WidgetButtonIcon className="far fa-eye" pageID={type} currentPage={currentPage} />
                :
                type === 'cancel' ?
                    <>
                    <styled.WidgetButtonIcon className="fas fa-times" pageID={type} currentPage={currentPage} active={type === currentPage} />
                    <styled.WidgetButtonText pageID={type} currentPage={currentPage}>{"Cancel"} active={type === currentPage}</styled.WidgetButtonText>
                    </>
                    :
                    type === 'lots' ?
                        <>
                        <styled.WidgetButtonIcon className="far fa-clone" pageID={type} currentPage={currentPage} active={type === currentPage} />
                        <styled.WidgetButtonText pageID={type} currentPage={currentPage} active={type === currentPage}>{label}</styled.WidgetButtonText>
                        </>
                        :
                        <>
                        <styled.WidgetButtonIcon style={{ fontSize: type === 'cart' && '1.2rem', paddingTop: type === 'cart' && '.8rem' }} className={"icon-" + type} pageID={type} currentPage={currentPage} active={type === currentPage} />
                        <styled.WidgetButtonText pageID={type} currentPage={currentPage} active={type === currentPage}>{label}</styled.WidgetButtonText>
                        </>
            }
            {/* <styled.ButtonText>{props.type}</styled.ButtonText> */}

        </styled.WidgetButtonButton>
    )
}

export default WidgetButton
