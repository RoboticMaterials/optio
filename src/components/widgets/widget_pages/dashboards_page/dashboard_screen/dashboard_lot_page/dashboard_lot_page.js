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
  handleCurrentStationBins
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
  const { handleTaskAlert } = props;

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
  const currentLot = useRef(cards[lotID]).current;
  const currentProcess = useRef(processes[currentLot.process_id]).current;

  const routeOptions = useRef(
    Object.values(routes)
      // This filter basically says that the route needs to be part of the process, or (assuming loadStationId is a warehouse) the unload station needs to be the current station
      .filter(
        (route) =>
          route.load === loadStationID &&
          (route.processId === currentLot.process_id ||
            route.unload === stationID)
      )
      .filter(
        (route, idx, routeOptions) =>
          routeOptions.findIndex((option) => option.unload === route.unload) === idx
      )
  ).current;

  const [openWarehouse, setOpenWarehouse] = useState(null);
  const [lotContainsInput, setLotContainsInput] = useState(false);
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [moveQuantity, setMoveQuantity] = useState(
    currentLot.bins[loadStationID]?.count
  );

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

    const process = processes[currentLot.process_id];
    const processRoutes = process.routes.map(routeId => routes[routeId])

    if (Array.isArray(moveStations)) {
      // Split node, duplicate card and send to all stations
      
      for (var toStationId of moveStations) {
        currentLot.bins = handleNextStationBins(currentLot.bins, quantity, loadStationID, toStationId, process, routes, stations)
      }
      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      currentLot.bins = handleCurrentStationBins(currentLot.bins, quantity, loadStationID, process, routes)

      //Add dispersed key to lot for totalQuantity Util
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `Lot has been split between ${moveStations
          .map((stationId) => stations[stationId].name)
          .join(" & ")}`
      );
    } else {
      // Single-flow node, just send to the station
      const toStationId = moveStations;
      currentLot.bins = handleNextStationBins(currentLot.bins, quantity, loadStationID, toStationId, process, routes, stations)

      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      currentLot.bins = handleCurrentStationBins(currentLot.bins, quantity, loadStationID, process, routes)

      const stationName =
        toStationId === "FINISH" ? "Finish" : stations[toStationId].name;
      handleTaskAlert(
        "LOT_MOVED",
        "Lot Moved",
        `Lot has been moved to ${stationName}`
      );
    }
    dispatchPutCard(currentLot, lotID);
    onBack();
  };

  const handleMergeWarehouseLot = (mergeLotID, quantity) => {

    // Add this lot to the card children
    let lotChildren = currentLot?.children || [];
    lotChildren.push({
      lotID: mergeLotID,
      fromStationID: openWarehouse,
      mergeStationID: stationID,
      mergedQuantity: quantity
    })
    currentLot.children = lotChildren;
    dispatchPutCard(currentLot, lotID);


    // Remove the quantity from the original merge lot
    const mergeLot = cards[mergeLotID]
    if (mergeLot.bins[openWarehouse].count - quantity < 1) {
      delete mergeLot.bins[openWarehouse];
    } else {
      mergeLot.bins[openWarehouse].count -= quantity;
    }
    dispatchPutCard(mergeLot, mergeLotID);

  };

  const renderChildCards = useMemo(() => {

    const processRoutes = currentProcess.routes.map(routeId => routes[routeId]);
    const processStartNodes = findProcessStartNodes(processRoutes);

    return processRoutes
      .filter(route => processStartNodes.includes(route.load) && route.unload === stationID && stations[route.load]?.type === 'warehouse')
      .map(mergeRoute => {
        const child = !!currentLot.children && currentLot.children.find(child => child.fromStationID === mergeRoute.load) || null

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

  }, [currentProcess, routes]);

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
          setQuantity={setMoveQuantity}
          maxQuantity={currentLot.bins[stationID]?.count}
          minQuantity={1}
          //route={currentTask}
          disabled={!processes[cards[lotID]?.process_id]?.showFinish}
        />
      </styled.LotButtonContainer>
    </styled.LotContainer>
  );
};

export default DashboardLotPage;
