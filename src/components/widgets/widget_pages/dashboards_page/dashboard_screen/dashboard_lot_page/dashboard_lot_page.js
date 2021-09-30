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
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import WarehouseModal from "../warehouse_modal/warehouse_modal";
import LotFlags from "../../../../../side_bar/content/cards/lot/lot_flags/lot_flags";
import DashboardLotInputBox from "./dashboard_lot_input_box/dashboard_lot_input_box";
import ContentListItem from "../../../../../side_bar/content/content_list/content_list_item/content_list_item";
import Button from "../../../../../../components/basic/button/button";

// constants
import {
  ADD_TASK_ALERT_TYPE,
  PAGES,
} from "../../../../../../constants/dashboard_constants";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";
import { FIELD_COMPONENT_NAMES } from "../../../../../../constants/lot_contants";
import { CUSTOM_TASK_ID } from "../../../../../../constants/route_constants";

// Import Utils
import {
  handleNextStationBins,
  handleCurrentStationBins,
  handleMoveLotToMergeStation
} from "../../../../../../methods/utils/lot_utils";
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";
import {
  findProcessStartNodes,
} from "../../../../../../methods/utils/processes_utils";
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";
import { deepCopy } from "../../../../../../methods/utils/utils";
// Import Actions
import {
  handlePostTaskQueue,
  putTaskQueue,
} from "../../../../../../redux/actions/task_queue_actions";
import { isObject } from "../../../../../../methods/utils/object_utils";
import {
  putCard,
  getCards,
} from "../../../../../../redux/actions/card_actions";

const DashboardLotPage = (props) => {
  const {
    handleTaskAlert,
    pushUndoHandler
  } = props;

  const params = useParams();
  const history = useHistory();

  const theme = useContext(ThemeContext);

  const { stationID, dashboardID, lotID, warehouseID } = params || {};

  const cards = useSelector((state) => state.cardsReducer.cards);
  const dashboards = useSelector((state) => state.dashboardsReducer.dashboards);
  const taskQueue = useSelector((state) => state.taskQueueReducer.taskQueue);
  const routes = useSelector((state) => state.tasksReducer.tasks);
  const processes = useSelector((state) => state.processesReducer.processes);
  const stations = useSelector((state) => state.stationsReducer.stations);

  const dispatch = useDispatch();
  const dispatchPutCard = async (lot, ID) => await dispatch(putCard(lot, ID));

  const availableFinishProcesses = useSelector((state) => {
    return state.dashboardsReducer.finishEnabledDashboards[dashboardID];
  });

  const loadStationID = useMemo(() => {
    return !!warehouseID ? warehouseID : stationID;
  }, [warehouseID, stationID]);

  // Have to use Sate for current lot because when the history is pushed, the current lot goes to undefined
  // but dashboard lot page is still mounted
  let currentLot = useRef(cards[lotID]).current
  const currentProcess = useRef(processes[currentLot?.process_id]).current
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

  const [openWarehouse, setOpenWarehouse] = useState(null);
  const [lotContainsInput, setLotContainsInput] = useState(false);
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [moveQuantity, setMoveQuantity] = useState(
    currentLot?.bins[loadStationID]?.count
  );
  const [localLotChildren, setLocalLotChildren] = useState([])


  // Used to show dashboard input
  useEffect(() => {
    let containsInput = false;
    currentLot.fields.forEach((field) => {
      field.forEach((subField) => {
        if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {
          containsInput = true;
        }
      });
    });

    setLotContainsInput(containsInput);
  }, [currentLot]);


  const onBack = () => {
    history.push(`/locations/${stationID}/dashboards/${dashboardID}`);
  };

  const onMoveClicked = () => {
    // Depending on if its a finish column, a single flow, or a split/choice
    if (routeOptions.length === 0) {
      onMove("FINISH", moveQuantity);
    } else if (routeOptions.length === 1) {
      onMove(routeOptions[0].unload, moveQuantity);
    } else if (routeOptions.some((route) => route.divergeType === "split")) {
      onMove(
        routeOptions.map((route) => route.unload),
        moveQuantity
      );
    } else {
      setShowRouteSelector(true);
    }
  };

  // Handles moving lot to next station
  const onMove = (moveStations, quantity) => {

    const currentLotCopy = deepCopy(currentLot);
    pushUndoHandler({
      message: `Are you sure you want to undo the move of ${currentLotCopy?.name} from ${stations[loadStationID]?.name}?`,
      handler: () => {
        dispatchPutCard(currentLotCopy, currentLotCopy._id);
      }
    })
    currentLot.children = [...currentLot?.children || [], ...localLotChildren];

    const process = processes[currentLot.process_id];
    const processRoutes = process.routes.map(routeId => routes[routeId])

    if (Array.isArray(moveStations)) {
      // Split node, duplicate card and send to all stations

      for (var toStationId of moveStations) {
        currentLot.bins = handleNextStationBins(currentLot.bins, quantity, loadStationID, toStationId, process, routes, stations)
      }
      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      currentLot.bins = handleCurrentStationBins(currentLot.bins, quantity, loadStationID, process, routes)

      //add count if only some of the parts exist but not count. Not having count breaking lot summary page
      if(!!currentLot.bins[loadStationID] && !currentLot.bins[loadStationID]['count']){
        currentLot.bins[loadStationID] = {
          ...currentLot.bins[loadStationID],
          count: 0
        }
      }

      //Bin exists but nothing in it. Delete the bin as this messes various things up.
      if(!!currentLot.bins[loadStationID] && currentLot.bins[loadStationID]['count'] === 0 && Object.values(currentLot.bins[loadStationID]).length === 1){
        delete currentLot.bins[loadStationID]
      }



      //Add dispersed key to lot for totalQuantity Util
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `${quantity} parts from ${currentLot.name}
          have been split between ${moveStations
            .map((stationId) => stations[stationId].name)
            .join(" & ")}`
      );
    } else {
      // Single-flow node, just send to the station
      const toStationId = moveStations;
      currentLot.bins = handleNextStationBins(currentLot.bins, quantity, loadStationID, toStationId, process, routes, stations)

      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      currentLot.bins = handleCurrentStationBins(currentLot.bins, quantity, loadStationID, process, routes)

      if(!!currentLot.bins[loadStationID] && !currentLot.bins[loadStationID]['count']){
        currentLot.bins[loadStationID] = {
          ...currentLot.bins[loadStationID],
          count: 0
        }
      }

      //Bin exists but nothing in it. Delete the bin as this messes various things up.
      if(!!currentLot.bins[loadStationID] && currentLot.bins[loadStationID]['count'] === 0 && Object.values(currentLot.bins[loadStationID]).length === 1){
        delete currentLot.bins[loadStationID]
      }

      const stationName =
        toStationId === "FINISH" ? "Finish" : stations[toStationId].name;
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `${quantity} parts from ${currentLot.name} have been moved to ${stationName}`
      );
    }
    dispatchPutCard(currentLot, lotID);
    onBack();
  };

  const handleMergeWarehouseLot = (mergeLotID, quantity) => {

    const mergeLot = cards[mergeLotID]

    const localLotChildrenCopy = deepCopy(localLotChildren);
    const mergeLotCopy = deepCopy(mergeLot);
    pushUndoHandler({
      message: `Are you sure you want to unmerge ${mergeLot?.name} from ${currentLot?.name}?`,
      handler: () => {
        dispatchPutCard(mergeLotCopy, mergeLotCopy._id)
        setLocalLotChildren(localLotChildrenCopy)
      }
    })

    const localLotChildrenCopy2 = deepCopy(localLotChildren);
    localLotChildrenCopy2.push({
      lotID: mergeLotID,
      fromStationID: openWarehouse,
      mergeStationID: stationID,
      mergedQuantity: quantity
    })
    setLocalLotChildren(localLotChildrenCopy2)

    // Remove the quantity from the original merge lot

    if (mergeLot.bins[openWarehouse].count - quantity < 1) {
      delete mergeLot.bins[openWarehouse];
    } else {
      mergeLot.bins[openWarehouse].count -= quantity;
    }
    dispatchPutCard(mergeLot, mergeLotID);
    setOpenWarehouse(null)

  };

  const handleTypedQty = (e) => {
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

  const renderChildCards = useMemo(() => {

    const processRoutes = currentProcess.routes.map(routeId => routes[routeId]);
    const processStartNodes = findProcessStartNodes(processRoutes);

    return processRoutes
      .filter(route => processStartNodes.includes(route.load) && route.unload === stationID && stations[route.load]?.type === 'warehouse')
      .map(mergeRoute => {
        const child = localLotChildren.find(child => child.fromStationID === mergeRoute.load) || null

        if (!!child) {
          return (
            <ChildLotFields
              child={child}
            />
          )
        } else {
          return (
            <styled.EmptyChildLot
              onClick={() => setOpenWarehouse(mergeRoute.load)}
            >
              <styled.PlusSymbol className='far fa-plus-square' />
              {stations[mergeRoute.load]?.name}
            </styled.EmptyChildLot>
          )
        }
      })

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
                  onMove(route.unload, moveQuantity);
                  setShowRouteSelector(false);
                }}
              />
            ))}
          </>
        </styled.BodyContainer>
      </styled.ModalContainer>
    );
  }, [routeOptions, showRouteSelector]);

  return (
    <styled.LotContainer>
      {!!openWarehouse && (
        <WarehouseModal
          isOpen={!!openWarehouse}
          title={"Warehouse"}
          close={() => setOpenWarehouse(null)}
          dashboard={{}}
          warehouseID={openWarehouse}
          stationID={stationID}
          initialQuantity={currentLot.bins[stationID]?.count}
          onSubmit={handleMergeWarehouseLot}
        />
      )}
      {renderRouteSelectorModal}
      <styled.LotBodyContainer>
        <styled.LotHeader>
          <styled.LotTitle>{currentLot?.name}</styled.LotTitle>
        </styled.LotHeader>
        <LotFlags
          flags={currentLot?.flags}
          containerStyle={{ alignSelf: "center" }}
        />

        <DashboardLotFields
          currentLot={currentLot}
          stationID={stationID}
          warehouse={!!warehouseID}
        />
        {!!lotContainsInput && <DashboardLotInputBox currentLot={currentLot} />}
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
      <styled.LotButtonContainer>
        <DashboardLotButtons
          handleMoveClicked={() => onMoveClicked()}
          handleCancel={() => onBack()}
          isFinish={routeOptions.length === 0}
          quantity={moveQuantity}
          onInputChange = {(e) =>{
            handleTypedQty(e)
          }}
          setQuantity={setMoveQuantity}
          maxQuantity={currentLot.bins[stationID]?.count}
          minQuantity={1}
          //route={currentTask}
          disabled={!moveQuantity || moveQuantity<1 || moveQuantity > currentLot.bins[stationID]?.count}
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
