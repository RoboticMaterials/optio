import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';

// actions
import { putTaskQueue, getTaskQueue } from '../../redux/actions/task_queue_actions'
import { setShowModalId } from '../../redux/actions/task_queue_actions'

// api
import { putTaskQueueItem } from '../../api/task_queue_api'

// components internal
import LotContainer from "../side_bar/content/cards/lot/lot_container";
import HilButton from "./hil_button/hil_button";
import NumberField from "../basic/form/number_field/number_field";
import ScrollContainer from "../basic/scroll_container/scroll_container";

// functions external
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {Formik} from "formik"
import { isMobile } from "react-device-detect"

// styles
import * as styled from './hil_modals.style';

// utils
import { deepCopy } from '../../methods/utils/utils'
import {getBinQuantity } from "../../methods/utils/lot_utils";
import useFormikAsyncSubmit from "../../hooks/useFormikAsyncSubmit";
import FlexibleContainer from "../basic/flexible_container/flexible_container";


export const QUANTITY_MODES = {
    QUANTITY: "QUANTITY",
    FRACTION: "FRACTION"
}

const CONTENT = {
    QUANTITY_SELECTOR: "QUANTITY_SELECTOR",
    FRACTION_SELECTOR: "FRACTION_SELECTOR",
    REVIEW: "REVIEW",
    LOT_SELECTOR: "LOT_SELECTOR"
}

const fractionOptions = ['1', '3/4', '1/2', '1/4']
const fractionDecimals = [1, 0.75, 0.5, 0.25]

const HILModals = (props) => {
    const {
        hilMessage,
        taskQueueID,
        item
    } = props

    const {
        dashboard: dashboardId,
        lot_id: lotId,
        task_id: taskId
    } = item || {}

    const params = useParams()
    const dashboardID = params.dashboardID

    const dispatch = useDispatch()
    const dispatchTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const disptachHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })
    const dispatchSetShowModalId = (id) =>  dispatch(setShowModalId(id))
    const dispatchGetTaskQueue = () => dispatch(getTaskQueue())

    const hilTimers = useSelector(state => { return state.taskQueueReducer.hilTimers })
    const cards = useSelector(state => { return state.cardsReducer.cards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards) || {}

    const [task, setTask] = useState(null)
    const {
        type: hilType
    } = task || {}

    const [trackQuantity, setTrackQuantity] = useState(null)
    const [selectedDashboard, setSelectedDashboard] = useState(null)
    const [hilLoadUnload, setHilLoadUnload] = useState('')
    const [dataLoaded, setDataLoaded] = useState(false)
    const [content, setContent] = useState(CONTENT.QUANTITY_SELECTOR)
    const [lot, setLot] = useState({})
    const [modalClosed, setModalClosed] = useState(false)
    const [maxQuantity, setMaxQuantity] = useState(0)



    const formRef = useRef(null)
    const {
        current: formikProps
    } = formRef || {}

    const {
        values = {},
        touched = {},
        errors = {},
        status = {},
        setValues = () => { },
        setErrors = () => { },
        resetForm = () => { },
        setTouched = () => { },
        setFieldValue = () => { },
        setStatus = () => { },
    } = formikProps || {}

    const {
        name: dashboardName,
        station: stationId, //"c754a665-f756-4c74-a7c5-e8c014039ba3"
    } = selectedDashboard || {}

    const currentTask = tasks[taskId]

    const {
        type,
        load,
        unload
    } = currentTask || {}

    const {
        station: unloadStationId
    } = unload || {}

    const {
        station: loadStationId
    } = load || {}

    useEffect(() => {

        console.log("itemitemitem",item)
        console.log("task",task)
        console.log("lotId",lotId)
        setLot(cards[lotId] || {})


        return () => {

        };
    }, [lotId, cards])



    useEffect(() => {
        const {
            track_quantity
        } = task || {}

        if(track_quantity && content !== CONTENT.QUANTITY_SELECTOR) {
            setContent(CONTENT.QUANTITY_SELECTOR)
        }
        else if(!track_quantity && content !== CONTENT.FRACTION_SELECTOR) {
            setContent(CONTENT.FRACTION_SELECTOR)
        }

        return () => {

        };
    }, [task]);



    // load lot data on load for selecting lot
    useEffect(() => {
        // get dashboard info from item
        const dashboard = dashboards[dashboardId]
        setSelectedDashboard(dashboard)
    }, [dashboards])

    // Use Effect for when page loads, handles wether the HIL is a load or unload
    useEffect(() => {

        const currentTask = tasks[item.task_id]
        setTask(currentTask)

        // If the task's load location of the task q item matches the item's location then its a load hil, else its unload
        if (currentTask && currentTask?.load?.station === item.hil_station_id || !!item.dashboard) {
            // load
            setHilLoadUnload('load')
        } else {
            // unload
            setHilLoadUnload('unload')
        }


        setDataLoaded(true)
        // On unmount, set the task q item to none
        return () => {
            dispatchTaskQueueItemClicked('')

            // Deletes the dashboard id from active list for the hil that has been responded too
            const activeHilCopy = deepCopy(activeHilDashboards)
            delete activeHilCopy[dashboardID]
            dispatchSetActiveHilDashboards(activeHilCopy)
        }

    }, [])

    // Posts HIL Success to API
    const onHilSuccess = async (fraction) => {

        const {
            quantity,
            // fraction
        } = values || {}

        console.log("onHilSuccess quantity",quantity)
        console.log("onHilSuccess fraction",fraction)

        dispatchTaskQueueItemClicked('')

        const { _id, dashboard, ...rest } = item || {}

        let newItem = {
            ...rest,
            hil_response: true,
        }

        console.log("newItem",newItem)

        // If its a load, then add a quantity to the response
        if (hilLoadUnload === 'load') {
            // If track quantity then add quantity, or if noLotSelected then use quantity
            if (!!task.track_quantity || trackQuantity) {
                newItem.quantity = quantity
            }

            // Else it's a fraction so tell the fraction amount
            else {
                newItem.fraction = fraction
            }
        }

        // Deletes the dashboard id from active list for the hil that has been responded too
        const activeHilCopy = deepCopy(activeHilDashboards)
        delete activeHilCopy[dashboardID]
        dispatchSetActiveHilDashboards(activeHilCopy)

        const ID = deepCopy(taskQueueID)

        // This is used to make the tap of the HIL button respond quickly
        disptachHILResponse(hilLoadUnload === 'load' ? 'load' : 'unload')
        setTimeout(() => disptachHILResponse(''), 2000)

        await disptachPutTaskQueue(newItem, ID)
        await dispatchSetShowModalId(null)
    }

    // Posts HIL Failure to API
    const onHilFailure = async () => {
        let newItem = {
            ...item,
            hil_response: false
        }
        delete newItem._id

        dispatchGetTaskQueue()
        await putTaskQueueItem(newItem, taskQueueID)
        dispatchTaskQueueItemClicked('')
    }

    useEffect(() => {
        setMaxQuantity(getBinQuantity(lot, stationId || loadStationId))
        return () => {

        };
    }, [lot, stationId, loadStationId]);


    // useMemo(() => function, input);
    const renderFractionOptions = useCallback(() => {

        return (
            <div style={{alignSelf: "stretch", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "15rem"}}>
                <styled.SubtitleContainer>
                    <styled.HilSubtitleMessage>Select Fraction</styled.HilSubtitleMessage>
                </styled.SubtitleContainer>

                <ScrollContainer>
                    {fractionOptions.map((value, ind) => {
                        const decimal = fractionDecimals[ind]
                        return (
                            <FlexibleContainer>
                                <HilButton
                                    containerCss={styled.fractionButtonCss}
                                    key={value}
                                    color={'#90eaa8'}
                                    label={`${value} (Quantity ${Math.ceil(maxQuantity * decimal)})`}
                                    filter={Math.cbrt(eval(value))}
                                    onClick={() => {
                                        onHilSuccess(decimal)
                                    }}
                                />
                            </FlexibleContainer>
                        )
                    })}
                </ScrollContainer>
            </div>
        )
    }, [maxQuantity]);

    const renderQuantitySelector = () => {
        const maxValue = getBinQuantity(lot, stationId || loadStationId)

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <styled.SubtitleContainer>
                    <styled.HilSubtitleMessage>Enter Quantity</styled.HilSubtitleMessage>
                </styled.SubtitleContainer>

                <NumberField
                    minValue={0}
                    maxValue={maxValue}
                    name={`quantity`}
                />

                {/*<styled.RowContainer style={{*/}
                {/*    marginTop: "1rem"*/}
                {/*}}>*/}
                    <styled.InfoText>{`There are ${maxValue} items available in the current lot.`}</styled.InfoText>
                {/*</styled.RowContainer>*/}
            </div>
        )
    }

    if (dataLoaded && modalClosed !== true) {
        const {
            _id: lotId,
            process_id: processId
        } = lot || {}

        return (

            <Formik
                innerRef={formRef}
                initialValues={{
                    quantity: 0,
                    fraction: null
                }}
                validateOnChange={true}
                validateOnBlur={true}
                // onSubmit={() => setFieldValue("needsSubmit", true)} // this is necessary
            >
                <styled.HilContainer
                    isOpen={true}
                    style={{
                        overlay: {
                            zIndex: 5000,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)'
                        },
                        content: {
                            zIndex: 5000,
                        }
                    }}
                >

                    <styled.Header>
                        <styled.ColumnContainer>
                            <styled.HilMessage>{hilMessage}</styled.HilMessage>
                            <styled.HilTimer
                                visible={!!hilTimers[item._id] && hilLoadUnload === 'load'}
                            >{!!hilTimers[item._id] && hilLoadUnload === 'load' ? hilTimers[item._id] : "Time"}</styled.HilTimer>
                        </styled.ColumnContainer>
                    </styled.Header>


                    <styled.Body>
                        {/*<styled.InnerHeader>*/}
                        {/*    <styled.ColumnContainer style={{flex: 1}}>*/}


                        {/*    </styled.ColumnContainer>*/}
                        {/*</styled.InnerHeader>*/}

                        <styled.InnerContentContainer>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    alignSelf: "stretch",
                                    overflow: "auto",
                                    paddingTop: "1rem",
                                    justifyContent: "space-between",
                                    flex: 1

                                    // marginBottom: "4rem",
                                    // marginTop: "2rem"
                                }}
                            >

                            {!isMobile &&
                            <styled.LotInfoContainer>


                                <styled.SubtitleContainer>
                                    <styled.HilSubtitleMessage>Current Lot</styled.HilSubtitleMessage>
                                </styled.SubtitleContainer>

                                {/*<ScaleWrapper*/}
                                {/*    scaleFactor={.8}*/}
                                {/*>*/}
                                <LotContainer
                                    lotId={lotId}
                                    binId={stationId || loadStationId}
                                    processId={processId}
                                    containerStyle={{ margin: 0, padding: 0, width: "30rem" }}
                                />
                                {/*</ScaleWrapper>*/}
                            </styled.LotInfoContainer>
                            }


                            {
                                {
                                    [CONTENT.QUANTITY_SELECTOR]:
                                        renderQuantitySelector(),
                                    [CONTENT.FRACTION_SELECTOR]:
                                        renderFractionOptions(),
                                }[content] ||
                                <div>DEFAULT HTML</div>
                            }
                                </div>
                        </styled.InnerContentContainer>

                        {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                        <styled.HilButtonContainer>

                            {content === CONTENT.QUANTITY_SELECTOR &&
                            <HilButton
                                label={"Continue"}
                                color={'#90eaa8'}
                                iconName={'fas fa-check'}
                                iconColor={'#1c933c'}
                                textColor={'#1c933c'}
                                onClick={() => {
                                    onHilSuccess()
                                }}
                            />
                            }

                            <HilButton
                                label={"Cancel"}
                                onClick={() => {
                                    onHilFailure()
                                    dispatchSetShowModalId(null)
                                    setModalClosed(true)
                                }}
                                iconName={'fas fa-times'}
                                color={'#ff9898'}
                                textColor={'#1c933c'}
                            />
                        </styled.HilButtonContainer>
                        }
                    </styled.Body>
                </styled.HilContainer>
            </Formik>

        )
    }
    else {
        return null
    }
}

HILModals.propTypes = {

};

HILModals.defaultProps = {

};

export default HILModals
