import React, { useState, useEffect, useRef } from 'react';
import usePrevious from '../../../../../hooks/usePrevious';

// import external functions
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'

// Import components
import TaskAddedAlert from './task_added_alert/task_added_alert'
import DashboardsHeader from "../dashboards_header/dashboards_header";
import DashboardLotList from './dashboard_lot_list/dashboard_lot_list'
import DashboardLotPage from './dashboard_lot_page/dashboard_lot_page'
import Button from '../../../../basic/button/button';

// Import Modals
import SimpleModal from "../../../../basic/modals/simple_modal/simple_modal"
import ReportModal from "./report_modal/report_modal";
import KickOffModal from "./kick_off_modal/kick_off_modal";
import FieldSelectModal from './field_select_modal/field_select_modal'
import WarehouseModal from './warehouse_modal/warehouse_modal'
import UserCheckinModal from './user_checkin_modal/user_checkin_modal';

// constants
import { ADD_TASK_ALERT_TYPE } from "../../../../../constants/dashboard_constants";

// Import Hooks
import useWindowSize from '../../../../../hooks/useWindowSize'

// Import Actions
import {
    dashboardOpen,
    putDashboard,
    putDashboardAttributes
} from '../../../../../redux/actions/dashboards_actions'
import { putCard } from '../../../../../redux/actions/card_actions'
import { getProcesses } from "../../../../../redux/actions/processes_actions";

// Import styles
import * as style from './dashboard_screen.style'

// import logging
import log from "../../../../../logger";

// Utils
import { getNodeOutgoing } from '../../../../../methods/utils/processes_utils';
import { handleNextStationBins, handleCurrentStationBins } from '../../../../../methods/utils/lot_utils';

const logger = log.getLogger("DashboardsPage");

const widthBreakPoint = 1026;

const DashboardScreen = (props) => {

    const {
        onSetTitle,
        onSetLogoutCallback
    } = props

    const params = useParams()

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}

    const history = useHistory();
    // redux state
    // const currentDashboard = useSelector(state => { return state.dashboardsReducer.dashboards[dashboardID] })
    const dashboards = useSelector(state => { return state.dashboardsReducer.dashboards })
    const routes = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)
    const lots = useSelector(state => state.cardsReducer.cards)
    const processes = useSelector(state => state.processesReducer.processes)
    const alertDuration = useSelector(state => state.settingsReducer.settings?.moveAlertDuration || 3000);
    const trackUsers = useSelector(state => state.settingsReducer.settings?.trackUsers || false)
    const currentDashboard = dashboards[dashboardID]
    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))
    const dispatchGetProcesses = () => dispatch(getProcesses())
    const dispatchPutDashboard = async (dashboard, id) => await dispatch(putDashboard(dashboard, id))
    const dispatchPutCard = async (lot, ID) => await dispatch(putCard(lot, ID));

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [reportModal, setReportModal] = useState({
        type: null,
        id: null
    });
    const {
        type: modalType,
        id: modalButtonId
    } = reportModal
    const [dashboardStation, setDashboardStation] = useState({});
    const [showLotsList, setShowLotsList] = useState(true)
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [isDevice, setIsDevice] = useState(false)
    const [user, setUser] = useState(null)
    const [showUserCheckinModal, setShowUserCheckinModal] = useState(true)
    const [checkinCallback, setCheckinCallback] = useState([() => {}])

    const prevUser = usePrevious(user)

    const [showUndoModal, setShowUndoModal] = useState(null)
    const undoHandlers = useRef([]).current

    const size = useWindowSize()
    const windowWidth = size.width
    const isMobile = windowWidth < widthBreakPoint;

    useEffect(() => {
        if (prevUser === null && user !== null) {
            checkinCallback[0]()
        }
    }, [user])

    useEffect(() => {
        setDashboardStation(stations[stationID] || {})
    }, [stations, stationID])

    /**
     * When a dashboard screen is loaded, tell redux that its open
     * On unmount tell redux that its not loaded
     *
     * Used in app.js and widget pages to make dashboard screen full size in mobile mode
     */
    useEffect(() => {
        onDashboardOpen(true)
        dispatchGetProcesses()
        return () => {
            onDashboardOpen(false)
        }
    }, [])

    useEffect(() => {
        if (editing === 'lots') {
            setShowLotsList(false)
        }
        else {
            setShowLotsList(true)
        }
    }, [editing])

    const handleToggleLock = async () => {

        if (!!currentDashboard.locked) {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Dashboard has been successfully unlocked!",
            })
        }
        else {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Dashboard has been successfully locked!",
            })
        }

        const updatedDashboard = {
            ...currentDashboard,
            locked: !currentDashboard.locked
        }
        dispatchPutDashboard(updatedDashboard, currentDashboard._id?.$oid)

        return setTimeout(() => setAddTaskAlert(null), 2500)
    }

    const handleLotClick = (lotId) => {
        if (user !== null || !trackUsers) {
            history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotId}`)
        } else {
            setShowUserCheckinModal(true)
            // setCheckinCallback([() => history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotId}`)])
            // I think history.push works weird because if we make it just a function instead of an array it is called when the state is set
        }
    }

    /**
     * Undo's are stored as a FIFO stack, where each time the undo is called, it pops the top function from
     * the stack. This way you can go back more than once (if you merge and then move).
     * NOTE: Undos only persist at the dashboard level, exiting the dashboard will clear the undos.
     * TODO: The problem with this is that you can undo stuff that succeeding stations might have done.
     * This could be fixed if we also kept track of the time the undo function was pushed and the last edited
     * date of the card.
     * @param {Object} handler {message, function}
     */
    const handlePushUndoHandler = (handler) => {
        undoHandlers.push(handler)
    }

    const handleWarehousePull = (pullLotID, quantity) => {

        const warehouseID = selectedOperation.warehouseID;
        const pullLot = lots[pullLotID];
        const process = processes[pullLot.process_id];
        const processRoutes = process.routes.map(routeId => routes[routeId]);

        const warehouseOutgoingRoutes = getNodeOutgoing(warehouseID, processRoutes)
        let moveStations;
        if (warehouseOutgoingRoutes.length === 1 || warehouseOutgoingRoutes.some(route => route.divergeType === 'choice')) {
            moveStations = stationID
        } else {
            moveStations = warehouseOutgoingRoutes.map(route => route.unload);
        }

        if (Array.isArray(moveStations)) {
            // Split node, duplicate card and send to all stations
            for (var toStationId of moveStations) {
                pullLot.bins = handleNextStationBins(pullLot.bins, quantity, warehouseID, toStationId, process, routes, stations)
            }
            // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
            pullLot.bins = handleCurrentStationBins(pullLot.bins, quantity, warehouseID, process, routes)

            //Add dispersed key to lot for totalQuantity Util
            setAddTaskAlert({
              type: "LOT_MOVED",
              label: "Lot Moved",
              message:`Lot has been split between ${moveStations
                .map((stationId) => stations[stationId].name)
                .join(" & ")}`
              });
            setTimeout(() => setAddTaskAlert(null), alertDuration)
          } else {
            // Single-flow node, just send to the station
            const toStationId = moveStations;
            pullLot.bins = handleNextStationBins(pullLot.bins, quantity, warehouseID, toStationId, process, routes, stations)

            // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
            pullLot.bins = handleCurrentStationBins(pullLot.bins, quantity, warehouseID, process, routes)

            const stationName = stations[toStationId].name;
            setAddTaskAlert({
              type: "LOT_MOVED",
              label: "Lot Moved",
              message:`Lot has been moved to ${stationName}`
            });
            setTimeout(() => setAddTaskAlert(null), alertDuration)
          }

          dispatchPutCard(pullLot, pullLotID);
          setSelectedOperation(null);
    }

    const renderModal = () => {
        switch (selectedOperation.operation) {
            case 'report':
                return (
                    <ReportModal
                        dashboardButtonId={modalButtonId}
                        isOpen={!!true}
                        title={"Send Report"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        onSubmit={(name, success) => {

                            // set alert
                            setAddTaskAlert({
                                type: success ? ADD_TASK_ALERT_TYPE.REPORT_SEND_SUCCESS : ADD_TASK_ALERT_TYPE.REPORT_SEND_FAILURE,
                                label: success ? "Report Sent" : "Failed to Send Report",
                                message: name ? `"` + name + `"` : null
                            })

                            // clear alert
                            setTimeout(() => setAddTaskAlert(null), 1800)
                        }}
                    />
                )

            case 'kickoff':
                return (
                    <KickOffModal
                        user={user}
                        isOpen={true}
                        stationID={stationID}
                        processID={selectedOperation.processID}
                        title={"Kick Off"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        onSubmit={(name, success, quantity, message) => {
                            // set alert
                            setAddTaskAlert({
                                type: success ? ADD_TASK_ALERT_TYPE.KICK_OFF_SUCCESS : ADD_TASK_ALERT_TYPE.KICK_OFF_FAILURE,
                                label: success ? "Lot Kick Off Successful" : "Lot Kick Off Failed",
                                message: message
                            })

                            // clear alert
                            setTimeout(() => setAddTaskAlert(null), 1800)
                        }}
                    />
                )

            case 'warehouse':
                return (
                    <WarehouseModal
                        isOpen={true}
                        title={"Warehouse"}
                        close={() => setSelectedOperation(null)}
                        dashboard={currentDashboard}
                        stationID={stationID}
                        warehouseID={selectedOperation.warehouseID}
                        process={process}
                        onSubmitLabel={'Pull'}
                        onSubmit={handleWarehousePull}
                    />
                )

            case 'fieldSelect':
                return (
                    <FieldSelectModal
                        isOpen={true}
                        close={() => setSelectedOperation(null)}

                    />
                )


            default:
                return (
                    <>
                    </>
                )
        }
    }

    return (
        <style.Container>

            {
                !!selectedOperation && renderModal()
            }

            {showUndoModal &&
                <SimpleModal
                    isOpen={showUndoModal}
                    title={'Confirm Undo'}
                    onRequestClose={() => setShowUndoModal(false)}
                    onCloseButtonClick={() => setShowUndoModal(false)}
                    handleOnClick1={() => setShowUndoModal(false)}
                    handleOnClick2={() => {
                        setShowUndoModal(false)

                        const { handler } = undoHandlers.pop()
                        handler();
                    }}
                    button_1_text={'Cancel'}
                    button_2_text={'Confirm'}
                    content={undoHandlers[undoHandlers.length-1].message}
                />
            }

            {trackUsers && user === null && showUserCheckinModal &&
                <UserCheckinModal
                    dashboard={currentDashboard}
                    onCheckin={async newUser => {
                        await setUser(newUser);
                        setShowUserCheckinModal(false)
                        onSetTitle(newUser)
                    }}
                    onClose={() => setShowUserCheckinModal(false)}/>
            }

            {trackUsers && // User logout Button
                <div style={{
                    top: isMobile ? '0.4rem' : '7.3rem',
                    right: '0.5rem',
                    position: "absolute",
                    zIndex: 11,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {!isMobile &&
                        <style.Text>{user === null ? `Sign In` : `Operator: ${user}`} </style.Text>
                    }
                    <Button
                        color={"white"}
                        onClick={() => {
                            if (user === null) {
                                setShowUserCheckinModal(true)
                            } else {
                                setUser(null)
                                onSetTitle('-')
                                setShowUserCheckinModal(true)
                                setCheckinCallback([() => {}])
                            }
                        }}
                        disabled={!showLotsList}
                        // schema={user === null ? 'delete' : null}
                        style={{
                            color: "black",
                            width: "2.5rem",
                            height: "2.5rem",
                            position: 'relative'
                        }}
                    >
                        <style.Icon
                            className={user === null ? "fas fa-sign-in-alt" : "fas fa-sign-out-alt"}
                        />
                    </Button>
                </div>
            }

            {!history.location.pathname.includes('lots') &&
            <DashboardsHeader
                showTitle={false}
                showBackButton={false}
                handleToggleLock={() => handleToggleLock()}
                showEditButton={true}
                currentDashboard={currentDashboard}
                handleOperationSelected={(op) => {
                    setSelectedOperation(op)
                }}
                handleTaskAlert={() => {
                    // If a custom task then add custom task key to task q
                    setAddTaskAlert({
                        type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                        label: "Task Added to Queue",
                        message: '',
                    })

                    // clear alert after timeout
                    return setTimeout(() => setAddTaskAlert(null), 1800)
                }}

            />
          }
          {!history.location.pathname.includes('lots') &&
            <style.UndoIcon
                style = {{marginRight: '0.5rem'}}
                className="fas fa-undo"
                disabled={undoHandlers.length === 0}
                onClick={() => setShowUndoModal(true)}
                isMobile={isMobile}
                isListView={showLotsList}
            />
          }

            {showLotsList ?
                <DashboardLotList onCardClicked={handleLotClick} />
                :
                <DashboardLotPage
                    user={user}
                    pushUndoHandler={handlePushUndoHandler}
                    handleTaskAlert={(type, label, message) => {
                        setAddTaskAlert({
                            type: type,
                            label: label,
                            message: message,
                        })

                        // clear alert after timeout
                        return setTimeout(() => setAddTaskAlert(null), alertDuration)
                    }}
                />
            }

            <TaskAddedAlert
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

        </style.Container >
    )
}

export default DashboardScreen;
