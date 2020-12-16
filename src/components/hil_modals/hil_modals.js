import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './hil_modals.style';

// Import Components
import Textbox from '../basic/textbox/textbox'

// Import Actions
import { postTaskQueue, putTaskQueue } from '../../redux/actions/task_queue_actions'
import { postEvents } from '../../redux/actions/events_actions'

// Import API
import { putTaskQueueItem } from '../../api/task_queue_api'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'
import DropDownSearch from "../basic/drop_down_search_v2/drop_down_search";
import {getCards} from "../../redux/actions/card_actions";
import DropDownSearchField from "../basic/form/drop_down_search_field/drop_down_search_field";


/**
 * Handles what type of HIL to display depending on the status
 */
const HILModals = (props) => {

    const {
        hilMessage,
        hilType,
        taskQuantity,
        taskQueueID,
        item
    } = props

    const {
        dashboard: dashboardId
    } = item || {}

    const dispatch = useDispatch()
    const onPostTaskQueue = (response) => dispatch(postTaskQueue(response))
    const dispatchGetCards = () => dispatch(getCards())
    const onTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const onHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const onPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const onSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })
    const onPostEvents = (event) => dispatch(postEvents)
    const onLocalHumanTask = (bol) => dispatch({type: 'LOCAL_HUMAN_TASK', payload: bol})



    const hilTimers = useSelector(state => { return state.taskQueueReducer.hilTimers })
    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)
    const taskQueueItemClicked = useSelector(state=> state.taskQueueReducer.taskQueueItemClicked)
    const dashboardOpen = useSelector(state=> state.dashboardsReducer.dashboardOpen)
    const dashboards = useSelector(state=> state.dashboardsReducer.dashboards)
    const objects = useSelector(state=> state.objectsReducer.objects)
    const cards = useSelector(state=> state.cardsReducer.cards)
    const [quantity, setQuantity] = useState(taskQuantity)
    const [selectedCard, setSelectedCard] = useState(null)
    const [hilLoadUnload, setHilLoadUnload] = useState('')

    // get dashboard info from item
    const selectedDashboard = dashboards[dashboardId]
    const {
        name: dashboardName,
        station: stationId, //"c754a665-f756-4c74-a7c5-e8c014039ba3"
    } = selectedDashboard || {}

    /*
    * Get dropdownsearch options for cards
    *
    * Filter out cards that don't belong to the same station
    * Each option only needs to contain the card's id and a label to display, the extaneous information can be left out
    *
    * */
    const stationCards = Object.values(cards).filter((currCard) => currCard.station_id === stationId).map((currCard) => {
        const {
            _id,
            object_id
        } = currCard
        const objectName = objects[object_id] ? objects[object_id].name : null

        return {
            _id,
            label: objectName ? currCard.name + " - " + objectName : currCard.name
        }
    })


    // If the qty goes below 0, then set to 0. You can never send negative parts
    if (quantity < 0) {
        setQuantity(0)
    }

    // load card data on load for selecting lot
    useEffect(() => {
        dispatchGetCards()
    }, [])

    // Use Effect for when page loads, handles wether the HIL is a load or unload
    useEffect(() => {
        // If the task's load location of the task q item matches the item's location then its a load hil, else its unload
        if (tasks[item.task_id].load.station === item.hil_station_id || !!item.dashboard) {
            // load
            setHilLoadUnload('load')
        } else {
            // unload
            setHilLoadUnload('unload')
        }

        if (!!item.quantity) {
            setQuantity(item.quantity)
        } else {
            setQuantity(0)
        }

        // On unmount, set the task q item to none
        return () => {
            onTaskQueueItemClicked('')
            onLocalHumanTask(false)
        }

    }, [])

    // Posts HIL Success to API
    const handleHilSuccess = async () => {


        onTaskQueueItemClicked('')

        let newItem = {
            ...item,
            hil_response: true,
            quantity: quantity,
            card_id: selectedCard
        }

        // Deletes the dashboard id from active list for the hil that has been responded too
        onSetActiveHilDashboards(delete (activeHilDashboards[item.hil_station_id]))

        const ID = deepCopy(taskQueueID)

        delete newItem._id
        delete newItem.dashboard

        // This is used to make the tap of the HIL button respond quickly
        onHILResponse('success')
        setTimeout(() => onHILResponse(''), 2000)

        await onPutTaskQueue(newItem, ID)

        // handleLogHumanEvent()
    }

    // Posts HIL Postpone to API
    // HIL Postpone will place the current task after the next task in the queue. (Delays task by 1 task)
    const handleHilPostpone = () => {
        onTaskQueueItemClicked('')
    }

    // Posts HIL Failure to API
    const handleHilFailure = async () => {

        let newItem = {
            ...item,
            hil_response: false
        }
        delete newItem._id
        await putTaskQueueItem(newItem, taskQueueID)

        onTaskQueueItemClicked('')
    }

    // Posts event to back end for stats and tracking
    const handleLogHumanEvent = () => {

        let event = {
            object: null,
            outgoing: false,
            quantity: 0,
            station: null,
            time: null,
        }

        //Get the time
        const time = Date.now() / 1000
        const object = tasks[item.task_id].obj
        const station = item.hil_station_id

        let eventQuantity = 0
        if(!!item.quantity){
            eventQuantity = item.quantity
        } else {
            eventQuantity = quantity
        }

        let outgoing = null
        if (hilLoadUnload === 'load') {
            outgoing = true
        } else if (hilLoadUnload === 'unload') {
            outgoing = false
        } else (
            outgoing = 'Unknown'
        )

        event.time = time
        event.object = object
        event.station = station
        event.quantity = eventQuantity
        event.outgoing = outgoing

        // onPostEvents(event)
    }

    /**
     * Conditioinally renders HIL Modal based on type.
     *
     * Type 1: HIL Load Pull
     * This type requires a quantity input, success, postpone, and cancel
     * Requires a postpone becauses if someone requests (pulls) a object without
     * the person loading being ready, they should be able to postopen until they are ready
     *
     * Type 2: HIL Load Push
     * This type requires a quantity input, success and cancel
     * No postpone because you're pushing objects to the next location.
     * Meaning that your objects should be ready since you said they were
     *
     * Type 3: HIL Unload
     * This type requires just a success button
     * No Cancel, postpone or quantity button.
     * Quantity is already taken care of in the load section, no objects should be lost in transportation.
     * No postpone becasue your objects are already on the cart and ready to be taken off, plus the cart cant be used while objects are on it
     * No cancel becasue the cart cant be used with objects on it
     *
     * Type 4: HIL Check
     * This type requires a Yes of postpone button
     * The purpose of a HIL check is to make sure the operator is ready to deliver parts.
     * HIL Check will only show on a pull request
     */

    return (
        <styled.HilContainer >
          {dashboardOpen ?
              <></>
              :
              <styled.HilExitModal
                  className='fas fa-times'
                  onClick={()=>onTaskQueueItemClicked('')}
              />
            }
            <styled.HilBorderContainer >



                <styled.HilMessage>{!!item.dashboard ? 'Enter Quantity' : hilMessage}</styled.HilMessage>
                {/* Only Showing timers on load at the moment, will probably change in the future */}
                {!!hilTimers[item._id.$oid] && hilLoadUnload === 'load' &&
                    <styled.HilTimer>{hilTimers[item._id.$oid]}</styled.HilTimer>
                }

                {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                    <styled.HilInputContainer>

                        <styled.HilInputIcon
                            className='fas fa-minus-circle'
                            styled={{ color: '#ff1818' }}
                            onClick={() => setQuantity(quantity - 1)}
                        />

                        <styled.HilInput
                            type="number"
                            onChange={(e) => {
                                setQuantity(e.target.value)
                            }}
                            value={quantity}
                        />

                        <styled.HilInputIcon
                            className='fas fa-plus-circle'
                            styled={{ color: '#1c933c' }}
                            onClick={() => setQuantity(quantity + 1)}
                        />


                    </styled.HilInputContainer>

                }

                {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                    <styled.LotDropdownContainer>
                        <styled.LotTitle>Select Lot</styled.LotTitle>
                        <DropDownSearch
                            theme={{}}
                            // style={{flex: 1, width: "100%"}}
                            // containerStyle={{flex: 1, width: "100%"}}
                            options={stationCards}
                            pattern={null}
                            labelField={'label'}
                            valueField={"_id"}
                            onChange={(values) => {
                                if(values && Array.isArray(values)) setSelectedCard(values[0]._id)
                            }}
                        />
                    </styled.LotDropdownContainer>
                }


                <styled.HilButtonContainer>

                    <styled.HilButton color={'#90eaa8'}
                        onClick={() => {
                            handleHilSuccess()
                        }}
                    >
                        <styled.HilIcon
                            // onClick={() => {
                            //     handleHilSuccess()
                            // }}
                            className='fas fa-check'
                            color={'#1c933c'}
                        />
                        <styled.HilButtonText color={'#1c933c'}>Confirm</styled.HilButtonText>
                    </styled.HilButton>

                    {((hilType === 'pull' && hilLoadUnload === 'load') || hilType === 'check') &&
                        <styled.HilButton color={'#f7cd89'} onClick={handleHilPostpone}>
                            <styled.HilIcon
                                // onClick={handleHilPostpone}
                                className='icon-postpone'
                                color={'#ff7700'}
                                styled={{ marginTop: '.5rem' }}
                            />
                            <styled.HilButtonText color={'#ff7700'}>Postpone</styled.HilButtonText>
                        </styled.HilButton>
                    }

                    {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&

                        <styled.HilButton color={'#ff9898'} onClick={handleHilFailure}>
                            <styled.HilIcon
                                // onClick={handleHilFailure}
                                className='fas fa-times'
                                color={'#ff1818'}
                            />
                            <styled.HilButtonText color={'#ff1818'}>Cancel</styled.HilButtonText>
                        </styled.HilButton>
                    }

                </styled.HilButtonContainer>

            </styled.HilBorderContainer>
        </styled.HilContainer>
    )
}

export default HILModals
