import React from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import * as styled from './widget_button.style'

// Import Actions
import { postTaskQueue } from '../../../redux/actions/task_queue_actions'



const WidgetButton = (props) => {

    const {
        type,
        currentPage,
        id,
    } = props

    const history = useHistory()
    const dispatch = useDispatch()
    const onPostTaskQueue = (q) => dispatch(postTaskQueue(q))

    return (
        <styled.WidgetButtonButton
            onClick={() => {
                // If the button is for cart, then submit simple move task to task q
                if (props.type === 'cart') {
                    console.log('QQQQ Cart Pushed')
                    onPostTaskQueue({
                        task_id: 'custom_task',
                        custom_task: {
                            type: 'simple_move',
                            position: id,
                        }
                    })
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
                <styled.WidgetButtonIcon style={{ fontSize: type === 'cart' && '.9rem' }} className={"icon-" + type} pageID={type} currentPage={currentPage} />
            }
            {/* <styled.ButtonText>{props.type}</styled.ButtonText> */}
        </styled.WidgetButtonButton>
    )
}

export default WidgetButton