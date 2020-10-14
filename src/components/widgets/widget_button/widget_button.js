import React from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import * as styled from './widget_button.style'

// Import Actions
import { postTaskQueue } from '../../../redux/actions/task_queue_actions'
import { addLocation, setSelectedLocation, deselectLocation, widgetLoaded} from '../../../redux/actions/locations_actions'
import { hoverStationInfo } from '../../../redux/actions/stations_actions'




const WidgetButton = (props) => {

    const {
        type,
        currentPage,
        id,
        coordinateMove,
    } = props

    const history = useHistory()
    const dispatch = useDispatch()
    const onPostTaskQueue = (q) => dispatch(postTaskQueue(q))
    const onDeselectLocation = () => dispatch(deselectLocation())
    const onWidgetLoaded = (bol) => dispatch(widgetLoaded(bol))
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)


    return (
        <styled.WidgetButtonButton
            onClick={() => {
                // If the button is for cart, then see if its a coord move or a simple task move
                // Coord move is for right click send cart to pos
                if (props.type === 'cart') {

                    if (!!coordinateMove) {
                        console.log('QQQQ coord move', selectedLocation)
                        onPostTaskQueue({
                            task_id: 'custom_task',
                            custom_task: {
                                type: 'coordinate_move',
                                coordinate: {
                                    pos_x: selectedLocation.pos_x,
                                    pos_y: selectedLocation.pos_y,
                                    rotation: selectedLocation.rotation,
                                },
                            }
                        })
                    }
                    else {
                        onPostTaskQueue({
                            task_id: 'custom_task',
                            custom_task: {
                                type: 'position_move',
                                position: id,
                            }
                        })
                    }
                }

                else if (props.type === 'cancel') {
                    console.log('QQQQ Cancel')
                    onWidgetLoaded(false)
                    onHoverStationInfo(null)
                    onDeselectLocation()
                }

                else {
                    history.push('/locations/' + id + '/' + type)
                }
            }}
            pageID={type}
            currentPage={currentPage}
        >
            {type === 'view' ?
                <styled.WidgetButtonIcon className="far fa-eye" pageID={type} currentPage={currentPage} />
                :
                type === 'cancel' ?
                    <styled.WidgetButtonIcon className="fas fa-times" pageID={type} currentPage={currentPage} />

                    :
                    <styled.WidgetButtonIcon style={{ fontSize: type === 'cart' && '.9rem' }} className={"icon-" + type} pageID={type} currentPage={currentPage} />
            }
            {/* <styled.ButtonText>{props.type}</styled.ButtonText> */}
        </styled.WidgetButtonButton>
    )
}

export default WidgetButton