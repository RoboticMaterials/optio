import React, { useState} from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import * as styled from './widget_button.style'


// Import Actions
import { postTaskQueue } from '../../../redux/actions/task_queue_actions'
import { widgetLoaded, sideBarBack, setSelectedLocationCopy, setSelectedLocationChildrenCopy } from '../../../redux/actions/locations_actions'
import { hoverStationInfo } from '../../../redux/actions/stations_actions'

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
    const dispatch = useDispatch()
    const params = useParams()
    const onPostTaskQueue = (q) => dispatch(postTaskQueue(q))
    const onWidgetLoaded = (bol) => dispatch(widgetLoaded(bol))
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))
    const onDashboardOpen = (props) => dispatch(dashboardActions.dashboardOpen(props))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const positions = useSelector(state => state.locationsReducer.positions)

    const dashboardID = params.dashboardID




    return (
        <styled.WidgetButtonButton
            onClick={() => {
                // If the button is for cart, then see if its a coord move or a simple task move
                // Coord move is for right click send cart to pos
                if (props.type === 'cart') {

                    if (!!coordinateMove) {
                        onPostTaskQueue({
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
                            task_id: 'custom_task',
                            custom_task: {
                                type: 'position_move',
                                position: id,
                                device_type: 'MiR_100',
                            },
                        })
                    }
                }

                else if (props.type === 'cancel') {
                    onWidgetLoaded(false)
                    onHoverStationInfo(null)
                    onSideBarBack({ selectedLocation })

                }

                else {
                  if(type=='dashboards'){
                    const dashboardID = selectedLocation ? selectedLocation.dashboards[0] : null
                    history.push('/locations/' + id + '/' +type + '/' + dashboardID)
                    onDashboardOpen(true)
                  }
                  else {history.push('/locations/' + id + '/' +type)}

                  //const hamburger = document.querySelector('.hamburger')
                  //hamburger.classList.toggle(false)
                }
            }}
            pageID={type}
            currentPage={currentPage}
        >
            {type === 'view' ?
                <styled.WidgetButtonIcon className="far fa-eye" pageID={type} currentPage={currentPage}/>
                :
                type === 'cancel' ?
                    <>
                      <styled.WidgetButtonIcon className="fas fa-times" pageID={type} currentPage={currentPage} />
                      <styled.WidgetButtonText>{"Cancel"}</styled.WidgetButtonText>
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
