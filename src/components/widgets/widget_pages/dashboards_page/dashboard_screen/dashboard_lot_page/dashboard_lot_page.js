import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

// Import styles
import { ThemeContext } from "styled-components";
import * as styled from "./dashboard_lot_page.style";

// Import Basic Components
import { uuidv4 } from "../../../../../../methods/utils/utils";

// Import Components
import DashboardLotFields from "./dashboard_lot_fields/dashboard_lot_fields";
import DashboardLotButtons from "./dashboard_lot_buttons/dashboard_lot_buttons";
import ChildLotFields from './child_lot_fields/child_lot_fields';
import WarehouseModal from "../warehouse_modal/warehouse_modal";
import LotFlags from "../../../../../side_bar/content/cards/lot/lot_flags/lot_flags";
import DashboardLotInputBox from "./dashboard_lot_input_box/dashboard_lot_input_box";
import ContentListItem from "../../../../../side_bar/content/content_list/content_list_item/content_list_item";
import Button from '../../../../../basic/button/button'
import WorkInstructionsViewer from '../work_instructions_viewer/work_instructions_viewer'

// constants
import { FIELD_COMPONENT_NAMES } from "../../../../../../constants/lot_contants";

// Import Utils
import {
  handleNextStationBins,
  handleCurrentStationBins,
} from "../../../../../../methods/utils/lot_utils";

import {
  findProcessStartNodes,
  getNodeIncoming,
  isLoopingRoute,
  handleMergeExpression
} from "../../../../../../methods/utils/processes_utils";
import { getIsCardAtBin } from '../../../../../../methods/utils/lot_utils';
import { deepCopy } from "../../../../../../methods/utils/utils";
import { secondsToReadable, workingSecondsBetweenDates } from '../../../../../../methods/utils/time_utils'

// Import Actions
import {
  postCard,
  putCard,
  deleteCard,
  getCards
} from "../../../../../../redux/actions/card_actions";
import { postTouchEvent, postOpenTouchEvent, postCloseTouchEvent } from '../../../../../../redux/actions/touch_events_actions'
import { getStation, getStations } from "../../../../../../redux/actions/stations_actions";

const recursiveFindAndRoutes = (exp, andNodes) => {
  for (var i=1; i<exp.length; i++) {
    if (typeof exp[i] === 'string') {
      if (exp[0] === 'AND') {
        andNodes.push(exp[i]);
      }
    } else {
      andNodes = [...andNodes, ...recursiveFindAndRoutes(exp[i], deepCopy(andNodes))];
    }
  }
  return andNodes
}

const DashboardLotPage = (props) => {
  const {
    user,
    handleTaskAlert,
    pushUndoHandler
  } = props;

  const params = useParams();
  const history = useHistory();

  const theme = useContext(ThemeContext);

  const { stationID, dashboardID, lotID, warehouseID } = params || {};

  const cards = useSelector((state) => state.cardsReducer.cards);
  const stationCards = useSelector(state => state.cardsReducer.stationCards)[params.stationID] || {};
  const processCards = useSelector(state => state.cardsReducer.processCards)
  const routes = useSelector((state) => state.tasksReducer.tasks);
  const processes = useSelector((state) => state.processesReducer.processes);
  const stations = useSelector((state) => state.stationsReducer.stations);
  const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
  const fractionMove = useSelector(state => state.settingsReducer.settings.fractionMove)
  const stationBasedLots = useSelector(state => state.settingsReducer.settings.stationBasedLots)
  const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates)
  const serverSettings = useSelector(state => state.settingsReducer.settings) || {}
  const openEvents = useSelector(state => state.touchEventsReducer.openEvents[stationID] || [])

  const dispatch = useDispatch();
  const dispatchPostCard = (lot) => dispatch(postCard(lot))
  const dispatchPutCard = (lot, ID) => dispatch(putCard(lot, ID));
  const dispatchDeleteCard = (id) => dispatch(deleteCard(id))
  const dispatchGetCards = () => dispatch(getCards())
  const dispatchGetStation = (id) => dispatch(getStation(id))
  const dispatchGetStations = () => dispatch(getStations())

  const dispatchOpenTouchEvent = (touch_event) => dispatch(postOpenTouchEvent(touch_event))
  const dispatchCloseTouchEvent = (touch_event) => dispatch(postCloseTouchEvent(touch_event))
  const dispatchPostTouchEvent = (touch_event) => dispatch(postTouchEvent(touch_event))

  let [currentLot, setCurrentLot] = useState(stationCards[lotID])
  const currentProcess = useRef(processes[currentLot?.process_id]).current
  const currentStation = useRef(stations[stationID]).current

  // Initial Load
  useEffect(() => {
    dispatchGetCards();
    dispatchGetStations();
  }, [])

  const loadStationID = useMemo(() => {
    return !!warehouseID ? warehouseID : stationID;
  }, [warehouseID, stationID]);

  const nodeIncomingRoutes = useMemo(() => {
    const processRoutes = Object.values(routes).filter(route => route.processId === currentLot?.process_id);
    return getNodeIncoming(stationID, processRoutes)
  }, [stationID, routes, currentLot])

  const incomingWarehouseStartRoutes = useMemo(() => {

    // Case 1: Merge in a lot from a warehouse that is the output of another process
    const processRoutes = Object.values(routes).filter(route => route.processId === currentLot?.process_id)
    const processStartNodes = findProcessStartNodes(processRoutes);
    return nodeIncomingRoutes.filter(route => processStartNodes.includes(route.load) && stations[route.load]?.type === 'warehouse')
  }, [])

  const incomingSplitMergeRoutes = useMemo(() => {
      // Case 2: A split process merges at this node, consider every node downstream of the AND expression
      const mergeExpression = handleMergeExpression(stationID, currentProcess, routes, stations)
      if (!mergeExpression) return []
      const andRoutes = recursiveFindAndRoutes(mergeExpression, []).map(routeId => routes[routeId])
      return andRoutes.filter(route => route.load in currentLot.bins && currentLot.bins[route.load]?.count > 0)
  }, [currentLot?.bins[stationID]])


  const routeOptions = useMemo(() => {
    return Object.values(routes)
      // This filter basically says that the route needs to be part of the process, or (assuming loadStationId is a warehouse) the unload station needs to be the current station
      .filter(
        (route) =>
          route.load === loadStationID &&
          (route.processId === currentLot?.process_id ||
            route.unload === stationID)
      )
      .filter(
        (route, idx, routeOptions) =>
          routeOptions.findIndex((option) => option.unload === route.unload) === idx
      )
    }, [routes, loadStationID, currentLot, stationID])

  const openTouchEvent = useMemo(() => openEvents.find(e => e.lot_id === currentLot._id))

  const [openWarehouse, setOpenWarehouse] = useState(null);
  const [lotContainsInput, setLotContainsInput] = useState(false);
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [showWorkInstructionsViewer, setShowWorkInstructionsViewer] = useState(false)
  const [instructionsKey, setInstructionsKey] = useState(null)
  const [selectedFraction, setSelectedFraction] = useState('1')
  const [moveQuantity, setMoveQuantity] = useState(currentLot?.bins[loadStationID]?.count);
  const [localLotChildren, setLocalLotChildren] = useState([]) // The lot Children are only relevant to the current session, so dont apply changes to the card in the backend until the move button is pressed.
  const [mergedLotsRevertStates, setMergedLotsRevertStates] = useState({}) // When we merge a card from a warehouse, we remove the qty from that lot. If the user hits 'Go Back' we need to revert those cards to the original quantitites
  const [timerValue, setTimerValue] = useState(null)
  const [warehouseMergeDisabled, setWarehouseMergeDisabled] = useState(false)

  const handleBack = () => {
    Object.values(mergedLotsRevertStates).forEach(mergedLotRevertState => dispatchPutCard(mergedLotRevertState, mergedLotRevertState._id))
    onBack();
  }

  // Catch leaving the page
  useEffect(() => {
    window.addEventListener("beforeunload", handleBack);

    return () => {
      handleBack();
      window.removeEventListener("beforeunload", handleBack);
    };
  }, []);

  useEffect(() => {
    const processRoutes = currentProcess.routes.map(routeId => routes[routeId])
    for(const i in processRoutes){
      if(processRoutes[i].unload ===stationID && stations[processRoutes[i].load]?.type === 'warehouse'){
        const unloadAtWarehouse = processRoutes.find(route => route.unload === processRoutes[i].load)
        if(!unloadAtWarehouse && processRoutes[i].requirePull === true) setWarehouseMergeDisabled(true)
      }
    }
  }, [currentLot]);
  
  const compareTimerValue = useMemo(() => {
    const CTObj = currentStation.cycle_times[currentLot.lotTemplateId]
    if (!!CTObj) {
      switch (CTObj.mode) {
        case 'auto':
            return CTObj.historical * moveQuantity;
        case 'manual':
            return CTObj.manual * moveQuantity;
        case 'takt':
            return lotTemplates[currentLot.lotTemplateId]?.taktTime * moveQuantity;
      }
    }
  }, [currentStation.cycle_times, moveQuantity])

  // Used to show dashboard input
  useEffect(() => {
    let containsInput = false;
    if(!stationBasedLots){
      currentLot.fields.forEach((field) => {
        field.forEach((subField) => {
          if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {
            containsInput = true;
          }
        });
      });
    }
    else{
      if(dashboards[dashboardID].fields && !!dashboards[dashboardID]?.fields[currentLot.lotTemplateId]){
        let fields = dashboards[dashboardID]?.fields[currentLot.lotTemplateId]
        for(const i in fields){
          if(fields[i].component === 'INPUT_BOX') containsInput = true
        }
      }
    }
    setLotContainsInput(containsInput);
  }, [currentLot]);


  const onBack = () => {
    history.push(`/locations/${stationID}/dashboards/${dashboardID}`);
  };

  const onMoveClicked = () => {
    // Depending on if its a finish column, a single flow, or a split/choice
    if (routeOptions.length === 0) {
      onMove([{load: loadStationID, unload: "FINISH"}], moveQuantity);
    } else if (routeOptions.length === 1) {
      onMove(routeOptions, moveQuantity);
    } else if (routeOptions.some((route) => route.divergeType === "split")) {
      onMove(
        routeOptions,
        moveQuantity
      );
    } else {
      setShowRouteSelector(true);
    }
  };

  const handleGetCards = async() => {
    await dispatchGetCards()
  }
  // Handles moving lot to next station
  const onMove = async (moveRoutes, quantity, exitOnFinish=true) => {

    const process = processes[currentLot.process_id];

    // Merge merged children with the lots current children
    let lotCopy = deepCopy(currentLot);
    if (currentLot.children) {
      localLotChildren.forEach(localChild => {
        const childExistIdx = currentLot.children.findIndex(child => child.lotID === localChild.lotID && child.fromStationID === localChild.fromStationID && child.mergeStationID === localChild.mergeStationID)
        if (childExistIdx !== -1) {
          lotCopy.children[childExistIdx].mergedQuantity += localChild.mergedQuantity
        } else  {
          lotCopy.children.push(localChild)
        }
      })
    } else {
      lotCopy.children = localLotChildren;
    }

    // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
    lotCopy.bins = handleCurrentStationBins(lotCopy.bins, quantity, moveRoutes[0].load, process, routes)

    const processRoutes = process.routes.map(routeId => routes[routeId])
    let unloadStationId, isLoop, loopLotCopy, saveLoopLotPromise, newLoopLots = [];
    for (var moveRoute of moveRoutes) {
      unloadStationId = moveRoute.unload

      // If the route is a loop, we want to duplicate the card and post it as new (but with all the same attributes) so that it will not
      // merge with the existing lot if they reach the same station
      isLoop = isLoopingRoute(moveRoute._id, processRoutes)
      if (isLoop) {

        // If there is already a lot with this lot number and the same loop parameters, merge instead of creating more
        loopLotCopy = Object.values(cards).find(currLot => (
          lotCopy.lotNum === currLot.lotNum &&
          currLot.loopRouteId === moveRoute._id &&
          (lotCopy.loopCount === undefined || currLot.loopCount - 1 === lotCopy.loopCount)
        )) || {...deepCopy(lotCopy), bins: {}}

        // Start with blank bins because this particular lot is not at any other stations
        loopLotCopy.bins = handleNextStationBins(loopLotCopy.bins, quantity, moveRoute.load, unloadStationId, process, routes, stations);


        // Post the loop lot, and save the ID to be used for the undo function
        if (loopLotCopy._id === currentLot._id) {
          delete loopLotCopy._id
          loopLotCopy.loopRouteId = moveRoute._id
          loopLotCopy.loopCount = !!loopLotCopy.loopCount ? loopLotCopy.loopCount + 1 : 1
          saveLoopLotPromise = dispatchPostCard(loopLotCopy)
        } else {
          let loopLotId = loopLotCopy._id
          delete loopLotCopy._id
          saveLoopLotPromise = dispatchPutCard(loopLotCopy, loopLotId)
        }

        saveLoopLotPromise.then(postedLoopLot => newLoopLots.push(postedLoopLot._id))

      } else {
        lotCopy.bins = handleNextStationBins(lotCopy.bins, quantity, moveRoute.load, unloadStationId, process, routes, stations);
      }
    }

    //do this as current lot doesnt update in time if dashboard text field is filled out and the entered note wont be saved
    if(processCards[lotCopy.process_id] && processCards[lotCopy.process_id][lotCopy._id]){
      lotCopy.fields = processCards[lotCopy.process_id][lotCopy._id].fields
    }

    // Push a new Undo function for moving this lot
    const revertLot = await deepCopy(currentLot)
    await pushUndoHandler({
      message: `Are you sure you want to undo the move of ${lotCopy?.name} from ${stations[loadStationID]?.name}?`,
      handler: () => {
        dispatchPutCard(revertLot, revertLot._id);
        // If there was any looping involved, we have to also delete all those cards
        newLoopLots.forEach(loopLotId => dispatchDeleteCard(loopLotId))
      }
    })

    await dispatchPutCard(lotCopy, lotID);
    setCurrentLot(lotCopy)

    // Create new touch Events
    for (var moveRoute of moveRoutes) {

      const fromStation = stations[moveRoute.load]
      const toStation = stations[moveRoute.unload]

      // Track the WIP (by product group) that are currently at the station
      let WIP = {}
      Object.values(cards)
        .filter(card => getIsCardAtBin(card, fromStation?._id))
        .forEach(card => {
            const {
                bins = {},
            } = card || {}

            const quantity = bins[stationID]?.count
            if (card.lotTemplateId in WIP) {
              WIP[card.lotTemplateId] += quantity
            } else {
              WIP[card.lotTemplateId] = quantity
            }
        })

      if (fromStation.type === 'warehouse') {
        const fullTouchEvent = {
          start_datetime: new Date().getTime(),
          move_datetime: new Date().getTime(),
          pauses: [],
          lot_id: currentLot._id,
          lot_number: currentLot.lotNum,
          product_group_id: currentLot.lotTemplateId,
          map_id: currentLot.map_id,
          pgs_cycle_time: null, // SET IN BACKEND (Calculation includes this event)
          process_id: currentLot.process_id,
          sku: 'default',
          quantity,
          type: 'move',
          load_station_id: fromStation._id,
          current_wip: WIP,
          unload_station_id: toStation._id,
          dashboard_id: dashboardID,
          operator: user,
          route_id: moveRoute._id,
        }
        dispatchPostTouchEvent(fullTouchEvent)
      } else {
        const closingTouchEvent = {
          move_datetime: new Date().getTime(),
          lot_id: currentLot._id,
          route_id: moveRoute.unload === 'FINISH' ? 'FINISH' : moveRoute._id,
          current_wip: WIP,
          load_station_id: fromStation._id,
          unload_station_id: moveRoute.unload === 'FINISH' ? 'FINISH' : toStation._id,
          quantity,
          operator: user,
          type: moveRoute.unload === 'FINISH' ? 'finish' : 'move',
          merged_children: localLotChildren
        }
        dispatchCloseTouchEvent(closingTouchEvent)
        dispatchGetStation(fromStation._id)
      }


    }

    // Move Alert (based on whether lot was split or not)
    if (moveRoutes.length > 1) {
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `${quantity} parts from ${lotCopy.name}
          have been split between ${moveRoutes
            .map((route) => stations[route.unload].name)
            .join(" & ")}`
      );
    } else {
      const stationName =
        moveRoutes[0].unload === "FINISH" ? "Finish" : stations[moveRoutes[0].unload].name;
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `${quantity} parts from ${lotCopy.name} have been moved to ${stationName}`
      );
    }

    // Exit page
    if (exitOnFinish) {
      await setMergedLotsRevertStates({})
      onBack();
    }
    dispatchGetStations()
    return lotCopy

  };

  const handlePullWarehouseLot = async (mergeLotID, quantity) => {
    const mergeLot = cards[mergeLotID]

    if (mergeLot._id === currentLot._id) {
      let moveRoute = nodeIncomingRoutes.find(route => route.load === openWarehouse && route.unload === stationID)
      setOpenWarehouse(null)
      const lotAfterMove = await onMove([moveRoute], quantity, false)
      setMoveQuantity(lotAfterMove?.bins[loadStationID]?.count)
    } else {
      handleMergeWarehouseLot(mergeLot, quantity)
    }
  }

  const handleMergeWarehouseLot = (mergeLot, quantity) => {

    const mergeLotCopy = deepCopy(mergeLot);
    const localLotChildrenCopy = deepCopy(localLotChildren)

    const existingChildIdx = localLotChildrenCopy.findIndex(child => child.lotID === mergeLot._id && child.fromStationID === openWarehouse && child.mergeStationID === stationID)
    if (existingChildIdx !== -1) {
      localLotChildrenCopy[existingChildIdx].mergedQuantity += quantity
    } else {
      localLotChildrenCopy.push({
        lotID: mergeLot._id,
        fromStationID: openWarehouse,
        mergeStationID: stationID,
        mergedQuantity: quantity,
      })
    }


    pushUndoHandler({
      message: `Are you sure you want to unmerge ${mergeLotCopy?.name} from ${currentLot?.name}?`,
      handler: () => {
        dispatchPutCard(mergeLot, mergeLot._id)
        dispatchPutCard(currentLot, currentLot._id)
        setLocalLotChildren(currentLot.children || [])
      }
    })

    // If the user hits go back, we have to revert all changes we made to the lot
    const mergedLotsRevertStatesCopy = deepCopy(mergedLotsRevertStates)
    if (!(mergeLot._id in mergedLotsRevertStates)) {
      mergedLotsRevertStatesCopy[mergeLot._id] = deepCopy(mergeLot)
    }

    // Remove the quantity from the original merge lot
    if (mergeLotCopy.bins[openWarehouse].count - quantity < 1) {
      delete mergeLotCopy.bins[openWarehouse];
    } else {
      mergeLotCopy.bins[openWarehouse].count -= quantity;
    }
    dispatchPutCard(mergeLotCopy, mergeLot._id);

    setMergedLotsRevertStates(mergedLotsRevertStatesCopy)
    setLocalLotChildren(localLotChildrenCopy)
    setOpenWarehouse(null)


  };

  const handleTypedQty = (e) => {

    if (e === null) {
      setMoveQuantity('')
      return
    }

    let arr = Array.from(String(moveQuantity), Number)
    if(!!arr[0]){
      if(e.nativeEvent.inputType === 'deleteContentBackward') arr.splice(-1)
      else arr.push(e.nativeEvent.data)
      setMoveQuantity(parseInt(arr.join('')))
    }
    else{
      if(e.nativeEvent.inputType !== 'deleteContentBackward'){
        arr = []
        arr.push(e.nativeEvent.data)
        setMoveQuantity(parseInt(arr.join('')))
      }
    }
  }

  const handleShowWorkInstructions = (key) => {
    setInstructionsKey(key)
    setShowWorkInstructionsViewer(true)
  }

  const renderWorkInstructionsViewer = () => {
      return (
        <WorkInstructionsViewer
          isOpen = {showWorkInstructionsViewer}
          close = {()=>setShowWorkInstructionsViewer(false)}
          setShowWorkInstructionsViewer = {setShowWorkInstructionsViewer}
          showWorkInstructionsViewer = {showWorkInstructionsViewer}
          stationID = {stationID}
          lotTemplateId = {currentLot.lotTemplateId}
        />
      )
  }

  const renderChildCards = useMemo(() => {

    return (
      <>
        {incomingSplitMergeRoutes.map(mergeRoute => {

        return (
            <>
              <styled.EmptySplitMergeLot
                onClick={() => setOpenWarehouse(mergeRoute.load)}
              >
                <styled.PlusSymbol className='far fa-plus-square' style={{color: '#84a8e3'}}/>
                {stations[mergeRoute.load]?.name}
              </styled.EmptySplitMergeLot>
            </>
          )
        })}

        {incomingWarehouseStartRoutes.map(mergeRoute => {
          const children = localLotChildren.filter(child => child.fromStationID === mergeRoute.load) || []

          return (
              <>
                {children.map(child => <ChildLotFields child={child} />)}
                <styled.EmptyChildLot
                  onClick={() => setOpenWarehouse(mergeRoute.load)}
                >
                  <styled.PlusSymbol className='far fa-plus-square' />
                  {stations[mergeRoute.load]?.name}
                </styled.EmptyChildLot>
              </>
            )
        })}
      </>
    )

  }, [currentProcess, routes, currentLot]);

  const renderRouteSelectorModal = useMemo(() => {
    return (
      <styled.ModalContainer
        isOpen={showRouteSelector}
        contentLabel="Kick Off Modal"
        onRequestClose={() => setShowRouteSelector(false)}
        style={{
          overlay: {
            zIndex: 500,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <styled.BodyContainer>
          <>
            <styled.Title>Select the station to move this lot to</styled.Title>
            {routeOptions.map((route, ind) => (
              <ContentListItem
                ind={ind}
                element={stations[route.unload]}
                schema="locations"
                showEdit={false}
                style={{
                  cursor: "pointer",
                  background: "white",
                  height: "5rem",
                }}
                onClick={() => {
                  onMove([route], moveQuantity);
                  setShowRouteSelector(false);
                }}
              />
            ))}
          </>
        </styled.BodyContainer>
      </styled.ModalContainer>
    );
  }, [routeOptions, showRouteSelector]);

  const onFractionClick = (fraction) => {
    setSelectedFraction(fraction)

    let maxQty = currentLot.bins[stationID]?.count

    switch(fraction) {
      case '1/4': setMoveQuantity(Math.round(maxQty/4))
      break

      case '1/2': setMoveQuantity(Math.round(maxQty/2))
      break

      case '3/4': setMoveQuantity(Math.round(3*maxQty/4))
      break

      case '1': setMoveQuantity(maxQty)
      break
    }
  }

  const getWorkingTime = () => {
    let startTime = new Date(openTouchEvent.start_datetime.$date);
    startTime = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000);

    // return (new Date().getTime() - startTime.getTime() - startTime.getTimezoneOffset() * 60000)/1000;
    return workingSecondsBetweenDates(startTime, new Date(), serverSettings.shiftDetails)
  }

  return (
    <styled.LotContainer>
      {!!openWarehouse && (
        <WarehouseModal
          isOpen={!!openWarehouse}
          title={"Warehouse"}
          close={() => setOpenWarehouse(null)}
          dashboard={{}}
          warehouseID={openWarehouse}
          disableFilter={(lot) => incomingSplitMergeRoutes.map(route => route.load).includes(openWarehouse) && currentLot._id !== lot._id} // If you're merging from a split branch, only allow merging of the same lot id
          sortFunction={(lot, nextLot) => incomingSplitMergeRoutes.map(route => route.load).includes(openWarehouse) && currentLot._id !== lot._id ? 1 : -1}
          stationID={stationID}
          initialQuantity={currentLot.bins[stationID]?.count}
          onSubmitLabel={"Merge"}
          onSubmit={handlePullWarehouseLot}
        />
      )}
      {renderWorkInstructionsViewer()}
      {renderRouteSelectorModal}
      <div style={{width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.3rem', justifyContent: 'center', flexWrap: 'wrap'}}>
        <styled.TimerBlock>
          <styled.TimerValue style={{color: getWorkingTime() <= compareTimerValue ? '#6ab076' : '#ff6363'}}>{!!openTouchEvent ? secondsToReadable(getWorkingTime()) : 'None'}</styled.TimerValue>
          <styled.TimerDescription>Active Working Time</styled.TimerDescription>
        </styled.TimerBlock>
        <styled.TimerBlock>
          <styled.TimerValue>{secondsToReadable(compareTimerValue)}</styled.TimerValue>
          <styled.TimerDescription>Expected Cycle Time</styled.TimerDescription>
        </styled.TimerBlock>
        {/* <styled.TimerBlock>
          <styled.TimerValue>{secondsToReadable(compareTimerValue)}</styled.TimerValue>
          <styled.TimerDescription>Since last move of this product</styled.TimerDescription>
        </styled.TimerBlock> */}
      </div>

      <styled.LotBodyContainer>
        <styled.LotHeader style = {{minHeight: '1rem'}}>
        </styled.LotHeader>
        <DashboardLotFields
          currentLot={currentLot}
          stationID={stationID}
          warehouse={!!warehouseID}
        />
        {!!lotContainsInput && <DashboardLotInputBox currentLot={currentLot} onGetCards = {handleGetCards} />}
        <div
          style={{
            width: "95%",
            maxWidth: "50rem",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          {renderChildCards}
        </div>
      </styled.LotBodyContainer>
      {!!lotTemplates[currentLot.lotTemplateId].workInstructions && !!lotTemplates[currentLot.lotTemplateId].workInstructions[stationID] &&
      <Button
        schema = {'locations'}
        label = 'View Work Instructions'
        style = {{width: '35rem', alignSelf: 'center',
                  minHeight: '4rem', borderRadius: '.5rem',
                  marginBottom: '2rem', boxShadow: '2px 3px 2px 1px rgba(0,0,0,0.2)'}}
        onClick = {handleShowWorkInstructions}
      />
    }
      <styled.LotButtonContainer>
        <DashboardLotButtons
          hasStarted={!!openTouchEvent || currentStation.type === 'warehouse'}
          handleStartClicked={() => {
            const newTouchEvent = {
              start_datetime: new Date().getTime(),
              move_datetime: null,
              pauses: [],
              lot_id: currentLot._id,
              lot_number: currentLot.lotNum,
              product_group_id: currentLot.lotTemplateId,
              map_id: currentLot.map_id,
              pgs_cycle_time: null, // SET IN BACKEND (Calculation includes this event)
              process_id: currentLot.process_id,
              sku: 'default',
              quantity: 0,
              load_station_id: stationID,
              current_wip: null,
              unload_station_id: null,
              dashboard_id: dashboardID,
              start_operator: user,
              route_id: null
            }

            dispatchOpenTouchEvent(newTouchEvent);
          }}
          handleMoveClicked={() => onMoveClicked()}
          fractionMove = {fractionMove}
          onFractionClick = {(fraction) => onFractionClick(fraction)}
          selectedFraction = {selectedFraction}
          handleCancel={handleBack}
          isFinish={routeOptions.length === 0}
          quantity={moveQuantity}
          onInputChange = {(e) =>{
            handleTypedQty(e)
          }}
          setQuantity={setMoveQuantity}
          maxQuantity={currentLot.bins[stationID]?.count}
          minQuantity={1}
          disabled={moveQuantity<1 || moveQuantity<1 || moveQuantity > currentLot.bins[stationID]?.count || (warehouseMergeDisabled && localLotChildren.length<1)}
          warehouseDisabled = {stations[stationID].type === 'warehouse'}
          onBlur = {()=> {
            if(!moveQuantity || moveQuantity<1) setMoveQuantity(1)
            if(moveQuantity>currentLot.bins[stationID]?.count) setMoveQuantity(currentLot.bins[stationID].count)
          }}
        />
      </styled.LotButtonContainer>
    </styled.LotContainer>
  );
};

export default DashboardLotPage;
