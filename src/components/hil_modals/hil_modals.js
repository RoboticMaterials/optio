import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// actions
import { putTaskQueue, getTaskQueue } from '../../redux/actions/task_queue_actions'
import { setShowModalId } from '../../redux/actions/task_queue_actions'
import { getStations } from "../../redux/actions/stations_actions";

// api
import { putTaskQueueItem } from '../../api/task_queue_api'

// components internal
import LotContainer from "../side_bar/content/cards/lot/lot_container";
import HilButton from "./hil_button/hil_button";
import NumberField from "../basic/form/number_field/number_field";
import ScrollContainer from "../basic/scroll_container/scroll_container";

// functions external
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Formik } from "formik"
import { isMobile } from "react-device-detect"

// styles
import * as styled from './hil_modals.style';

// utils
import { deepCopy } from '../../methods/utils/utils'
import { getBinQuantity } from "../../methods/utils/lot_utils";
import FlexibleContainer from "../basic/flexible_container/flexible_container";
import ScaleWrapper from "../basic/scale_wrapper/scale_wrapper";
import { getPreviousWarehouseStation } from '../../methods/utils/processes_utils'
import { getStationName } from "../../methods/utils/stations_utils";
import { hilModalSchema } from "../../methods/utils/form_schemas";


export const QUANTITY_MODES = {
    QUANTITY: "QUANTITY",
    FRACTION: "FRACTION"
}

const CONTENT = {
    QUANTITY_SELECTOR: "QUANTITY_SELECTOR",
    FRACTION_SELECTOR: "FRACTION_SELECTOR",
    REVIEW: "REVIEW",
    LOT_SELECTOR: "LOT_SELECTOR",
    UNLOAD: "UNLOAD",
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
    const history = useHistory()

    const {
        stationID,
        dashboardID,
        subPage,
        lotID,
        warehouse,
    } = params || {}

    const dispatch = useDispatch()
    const dispatchTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const disptachHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })
    const dispatchSetShowModalId = (id) => dispatch(setShowModalId(id))
    const dispatchGetTaskQueue = () => dispatch(getTaskQueue())
    const dispatchGetStations = async () => await dispatch(getStations())

    const hilTimers = useSelector(state => { return state.taskQueueReducer.hilTimers })
    const cards = useSelector(state => { return state.cardsReducer.cards })
    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards) || {}
    const stations = useSelector(state => state.stationsReducer.stations) || {}

    const [task, setTask] = useState(null)
    const {
        type: hilType,
        load,
        unload
    } = task || {}
    const {
        station: unloadStationId
    } = unload || {}
    const {
        station: loadStationId
    } = load || {}

    const [trackQuantity, setTrackQuantity] = useState(null)
    const [selectedDashboard, setSelectedDashboard] = useState(null)
    const {
        station: stationId
    } = selectedDashboard || {}

    const [hilLoadUnload, setHilLoadUnload] = useState('')
    const [dataLoaded, setDataLoaded] = useState(false)
    const [content, setContent] = useState(CONTENT.QUANTITY_SELECTOR)
    const [lot, setLot] = useState({})
    const [modalClosed, setModalClosed] = useState(false)
    const [maxQuantity, setMaxQuantity] = useState(!!warehouse ? getBinQuantity(lot, getPreviousWarehouseStation(lot.process_id, stationID)._id) : getBinQuantity(cards[lotId], stationId || loadStationId))
    const [loadStationName, setLoadStationName] = useState("")
    const [unloadStationName, setUnloadStationName] = useState("")

    const formRef = useRef(null)
    const {
        current: formikProps
    } = formRef || {}
    const {
        values = {},
        setFieldValue = () => { }
    } = formikProps || {}

    useEffect(() => {
        setLot(cards[lotId] || {})
        return () => {

        };
    }, [lotId, cards])

    /* default quantity to max when max changes */
    useEffect(() => {
        setFieldValue('quantity', maxQuantity)
        // return () => {};
    }, [maxQuantity]);


    useEffect(() => {
        const {
            track_quantity
        } = task || {}

        if (hilLoadUnload === 'load') {
            if (track_quantity && content !== CONTENT.QUANTITY_SELECTOR) {
                setContent(CONTENT.QUANTITY_SELECTOR)
            }
            else if (!track_quantity && content !== CONTENT.FRACTION_SELECTOR) {
                setContent(CONTENT.FRACTION_SELECTOR)
            }
        }
        else {
            setContent(CONTENT.UNLOAD)
        }


        return () => {

        };
    }, [task, hilLoadUnload]);



    // load lot data on load for selecting lot
    useEffect(() => {
        // get dashboard info from item
        const dashboard = dashboards[dashboardId]
        setSelectedDashboard(dashboard)
    }, [dashboards])

    // Use Effect for when page loads, handles wether the HIL is a load or unload
    useEffect(() => {
        dispatchGetStations()

        const currentTask = tasks[item.task_id]
        setTask(currentTask)

        // If the task's load location of the task q item matches the item's location then its a load hil, else its unload



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

    useEffect(() => {
        if (task?.load?.station === item.hil_station_id || !!item.dashboard) {
            // load
            setHilLoadUnload('load')
        } else {
            // unload
            setHilLoadUnload('unload')
        }

        return () => { };
    }, [item, task]);


    // Posts HIL Success to API
    const onHilSuccess = async (fraction) => {

        const {
            quantity,
        } = values || {}

        dispatchTaskQueueItemClicked('')

        const { _id, dashboard, ...rest } = item || {}

        let newItem = {
            ...rest,
            hil_response: true,
        }

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

        // This is used to make the tap of the HIL button respond quickly
        disptachHILResponse(hilLoadUnload === 'load' ? 'load' : 'unload')
        setTimeout(() => disptachHILResponse(''), 2000)
        // If its a warehouse then go back 
        if (!!warehouse) {
            history.push(`/locations/${stationID}/dashboards/${dashboardID}`)
        }
        await disptachPutTaskQueue(newItem, taskQueueID)
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

    // updates max quantity
    useEffect(() => {
        let newMax

        // If its a warehouse, use the prev station
        if (!!warehouse) {
            newMax = getBinQuantity(lot, getPreviousWarehouseStation(lot.process_id, stationID)._id)
        }
        else {
            newMax = getBinQuantity(lot, stationId || loadStationId)
        }

        if (parseInt(maxQuantity) !== parseInt(newMax)) setMaxQuantity(newMax)
    }, [lot, stationId, loadStationId, maxQuantity]);

    useEffect(() => {
        setUnloadStationName(getStationName(unloadStationId))
    }, [unloadStationId, stations])

    useEffect(() => {
        setLoadStationName(getStationName(loadStationId))
    }, [loadStationId, stations])


    const renderUnloadContent = useCallback(() => {
        const {
            quantity,
            fraction
        } = item || {}

        const {
            track_quantity: trackQuantity
        } = task || {}

        const unloadQuantity = trackQuantity ? quantity : Math.ceil(maxQuantity * fraction)

        return (
            <div style={{ alignSelf: "center", display: "flex", flexDirection: "row", minHeight: "15rem", alignItems: "center" }}>
                <styled.InfoText>{`Unload `}</styled.InfoText>
                <styled.InfoText emphasize={true}>{` ${unloadQuantity} `}</styled.InfoText>
                <styled.InfoText>{` item${unloadQuantity > 1 ? 's' : ''} from `}</styled.InfoText>
                <styled.InfoText emphasize={true}>{` ${loadStationName} `}</styled.InfoText>
                <styled.InfoText>{` to `}</styled.InfoText>
                <styled.InfoText emphasize={true}>{` ${unloadStationName}`}</styled.InfoText>
            </div>
        )
    }, [item, loadStationName, unloadStationName, task])

    const renderFractionOptions = useCallback(() => {
        return (
            <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "15rem" }}>
                <styled.SubtitleContainer>
                    <styled.HilSubtitleMessage>Select Fraction</styled.HilSubtitleMessage>
                </styled.SubtitleContainer>

                <ScrollContainer>
                    {fractionOptions.map((value, ind) => {
                        const decimal = fractionDecimals[ind]
                        return (
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
                        )
                    })}
                </ScrollContainer>
            </div>
        )
    }, [maxQuantity]);

    const renderQuantitySelector = useCallback(() => {

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
                    minValue={1}
                    maxValue={maxQuantity}
                    name={`quantity`}
                />

                <FlexibleContainer>
                    <styled.InfoText style={{ marginBottom: "1rem" }}>{`There are ${maxQuantity} items available in the current lot.`}</styled.InfoText>
                </FlexibleContainer>
            </div>
        )
    }, [maxQuantity])

    if (dataLoaded && modalClosed !== true) {
        const {
            _id: lotId,
            process_id: processId
        } = lot || {}

        const {
            quantity,
            fraction
        } = item || {}

        const {
            track_quantity: trackQuantity
        } = task || {}

        const unloadQuantity = trackQuantity ? quantity : Math.ceil(maxQuantity * fraction)

        return (
            <Formik
                validationSchema={hilModalSchema}
                innerRef={formRef}
                initialValues={{
                    quantity: maxQuantity,
                    fraction: null
                }}
                validateOnChange={true}
                validateOnBlur={true}
            >
                <styled.ModalContainer
                    isOpen={true}
                    style={{
                        overlay: {
                            zIndex: 5000,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(5px)',
                            transition: 'backdrop-filter 3s ease',
                        },
                        content: {
                            zIndex: 5000,
                        },
                    }}
                >

                    <styled.Header>
                        <styled.ColumnContainer>
                            <styled.HilMessage>{hilMessage}</styled.HilMessage>
                            <styled.HilTimer
                                visible={!!hilTimers[item._id] && hilLoadUnload === 'load'}
                            >{!!hilTimers[item._id] && hilLoadUnload === 'load' ? hilTimers[item._id] : ""}</styled.HilTimer>
                        </styled.ColumnContainer>
                    </styled.Header>


                    <styled.Body>
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
                                }}
                            >

                                <styled.LotInfoContainer>
                                    <styled.SubtitleContainer>
                                        <styled.HilSubtitleMessage>Current Lot</styled.HilSubtitleMessage>
                                    </styled.SubtitleContainer>

                                    <ScaleWrapper
                                        scaleFactor={isMobile ? 0.75 : 1}
                                    >
                                        <LotContainer
                                            showCustomFields={false}
                                            lotId={lotId}
                                            quantity={hilLoadUnload === 'unload' ? unloadQuantity : null}
                                            binId={
                                                // If its a warehouse, the bin is going to be the previous station
                                                !!warehouse ?
                                                    getPreviousWarehouseStation(processId, stationID)._id
                                                    :
                                                    hilLoadUnload === 'load' ?
                                                        stationId || loadStationId
                                                        :
                                                        unloadStationId

                                            }
                                            processId={processId}
                                            containerStyle={{ margin: 0, padding: 0, width: "30rem" }}
                                        />
                                    </ScaleWrapper>
                                </styled.LotInfoContainer>

                                {
                                    {
                                        [CONTENT.QUANTITY_SELECTOR]: renderQuantitySelector(),
                                        [CONTENT.FRACTION_SELECTOR]: renderFractionOptions(),
                                        [CONTENT.UNLOAD]: renderUnloadContent(),
                                    }[content] ||
                                    null
                                }
                            </div>
                        </styled.InnerContentContainer>

                        <styled.HilButtonContainer>
                            {
                                {
                                    [CONTENT.QUANTITY_SELECTOR]:
                                        <>
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
                                        </>,
                                    [CONTENT.FRACTION_SELECTOR]:
                                        <>
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
                                        </>,
                                    [CONTENT.UNLOAD]:
                                        <>
                                            <FlexibleContainer>
                                                <HilButton
                                                    containerCss={styled.unloadButtonCss}
                                                    iconName='fas fa-check'
                                                    color={'#90eaa8'}
                                                    onClick={() => {
                                                        onHilSuccess()
                                                        dispatchSetShowModalId(null)
                                                    }}
                                                />
                                            </FlexibleContainer>
                                        </>,
                                }[content] ||
                                null
                            }
                        </styled.HilButtonContainer>
                    </styled.Body>
                </styled.ModalContainer>
            </Formik >
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
