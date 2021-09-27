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
  getBinQuantity,
  getCurrentRouteForLot,
  getPreviousRouteForLot,
  handleMoveLotToMergeStation,
  handleMergedLotBin,
} from "../../../../../../methods/utils/lot_utils";
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";
import {
  findProcessStartNodes,
  handleMergeExpression,
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
  const dispatch = useDispatch();

  const theme = useContext(ThemeContext);

  const { stationID, dashboardID, lotID, warehouseID } = params || {};

  const cards = useSelector((state) => state.cardsReducer.cards);
  const dashboards = useSelector((state) => state.dashboardsReducer.dashboards);
  const taskQueue = useSelector((state) => state.taskQueueReducer.taskQueue);
  const routes = useSelector((state) => state.tasksReducer.tasks);
  const processes = useSelector((state) => state.processesReducer.processes);
  const stations = useSelector((state) => state.stationsReducer.stations);

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
  const [showFinish, setShowFinish] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [lotContainsInput, setLotContainsInput] = useState(false);
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [moveQuantity, setMoveQuantity] = useState(
    currentLot.bins[loadStationID]?.count
  );
  const dispatchPutCard = async (lot, ID) => await dispatch(putCard(lot, ID));
  const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props));
  const disptachPutTaskQueue = async (item, id) =>
    await dispatch(putTaskQueue(item, id));
  const dispatchGetCards = () => dispatch(getCards());

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

  //This function determines if multiple routes are merging into a station and handles the lot quantity available to move accordingly
  //If multiple routes merge into a station the parts at the station are kept track of at that bin
  //If one type of part doesn't exist yet none of that lot can be moved along
  //Otherwise, assuming 1 to 1 ratio the type of part with lowest count limits the amount of the lot that is available to move
  const handleNextStationsLot = (destinationId, quantity) => {
    let iDs = [];
    let option = 0;
    let requirement = 0;
    let allAreOptions = true;
    let allAreRequired = true;

    const mergingRoutes = processes[currentLot.process_id].routes
      .map((routeId) => routes[routeId])
      .filter((route) => route.unload === destinationId);

    if (mergingRoutes.length > 1) {
      //If multiple routes merge into station, keep track of parts at the station

      let mergingExpression = handleMergeExpression(
        destinationId,
        processes[currentLot.process_id],
        routes
      );

      let tempBin,
        currentBin = currentLot.bins[destinationId];
      let traveledRoute = mergingRoutes.find(
        (route) => route.load === loadStationID
      );
      if (!!currentBin) {
        // The Bin for the destination already exists, update quantities

        let existingQuantity = !!currentBin[traveledRoute?._id]
          ? currentBin[traveledRoute?._id]
          : 0;
        tempBin = {
          ...currentLot.bins[destinationId],
          [traveledRoute?._id]: (existingQuantity += quantity),
        };

        currentLot.bins[destinationId] = handleMergedLotBin(
          tempBin,
          mergingExpression
        );
      } else {
        // The Bin for the destination does not exist, create is here

        tempBin = {
          [traveledRoute?._id]: quantity,
        };

        currentLot.bins[destinationId] = handleMergedLotBin(
          tempBin,
          mergingExpression
        );
      }
    } else {
      // Only one route enters station, don't worry about tracking parts at the station
      let totalQuantity = !!currentLot.bins[destinationId]?.count
        ? currentLot.bins[destinationId].count + quantity
        : quantity;
      currentLot.bins[destinationId] = {
        count: totalQuantity,
      };
    }
  };

  const handleCurrentStationLot = (quantity) => {
    const mergingRoutes = processes[currentLot.process_id].routes
      .map((routeId) => routes[routeId])
      .filter((route) => route.unload === loadStationID);

    if (mergingRoutes.length > 1) {
      //subtract quantity from both count and the parts at the station
      for (const ind in currentLot.bins[loadStationID]) {
        if (currentLot.bins[loadStationID][ind] - quantity < 1) {
          delete currentLot.bins[loadStationID][ind];
        } else currentLot.bins[loadStationID][ind] -= quantity;
      }
    } else {
      if (quantity === currentLot.bins[loadStationID].count) {
        delete currentLot.bins[loadStationID];
      } else {
        currentLot.bins[loadStationID].count -= quantity;
      }
    }
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
    if (Array.isArray(moveStations)) {
      // Split node, duplicate card and send to all stations
      for (var toStationId of moveStations) {
        handleNextStationsLot(toStationId, quantity);
      }
      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      handleCurrentStationLot(quantity);

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
      handleNextStationsLot(toStationId, quantity);

      // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
      handleCurrentStationLot(quantity);

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

  const onMergeWarehouseLot = (lotID, warehouseID) => {



  };

  const renderChildCards = useMemo(() => {

    const processRoutes = currentProcess.routes.map(routeId => routes[routeId]);
    const processStartNodes = findProcessStartNodes(processRoutes);

    //console.log(processStartNodes.map(id => stations[id]?.name), processRoutes
    //  .filter(route => processStartNodes.includes(route.load) && route.unload === stationID && stations[route.load]?.type === 'warehouse'))

    return processRoutes
      .filter(route => processStartNodes.includes(route.load) && route.unload === stationID && stations[route.load]?.type === 'warehouse')
      .map(mergeRoute => {
        if (!!currentLot.children && !!currentLot.children[mergeRoute._id]) {
          const childLot = cards[currentLot.children[mergeRoute._id]?.lotID];
          return (
            <DashboardLotFields
              currentLot={childLot}
              stationID={stationID}
              warehouse={!!warehouseID}
            />
          )
        } else {
          return (
            <styled.EmptyChildLot>
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

  const renderFinishQuantity = () => {
    const lotCount = currentLot?.bins[loadStationID]?.count;

    return (
      <QuantityModal
        validationSchema={quantityOneSchema}
        maxValue={lotCount}
        minValue={1}
        infoText={`${lotCount} items available.`}
        isOpen={true}
        title={"Select Quantity"}
        onRequestClose={() => setShowFinish(false)}
        onCloseButtonClick={() => setShowFinish(false)}
        handleOnClick2={(quantity) => {
          setShowFinish(false);
          onFinish(quantity);
        }}
        handleOnClick1={() => {
          setShowFinish(false);
        }}
        button_2_text={"Confirm"}
        button_1_text={"Cancel"}
      />
    );
  };

  const onFinish = async (quantity) => {
    let requestSuccessStatus = false;
    let message;

    // extract lot attributes
    const { name: cardName, _id: lotId } = currentLot;

    if (quantity && quantity > 0) {
      // moving lot is handled through custom task
      const custom = {
        load: {
          station: stationID,
          instructions: "",
          position: null,
          sound: null,
        },
        unload: {
          station: "FINISH",
          instructions: "",
          position: null,
          sound: null,
        },
        handoff: true,
        hil_response: null,
        quantity: 1,
      };

      // first, post task queue
      const result = await dispatchPostTaskQueue({
        hil_response: null,
        routes,
        deviceType: DEVICE_CONSTANTS.HUMAN,
        taskQueue,
        Id: CUSTOM_TASK_ID,
        custom,
      });

      // check if request was successful
      if (!(result instanceof Error)) {
        const { _id, dashboardID, dashboard, ...rest } = result || {};

        // now must update task queue item to move the lot
        setTimeout(async () => {
          await disptachPutTaskQueue(
            {
              ...rest,
              hil_response: true,
              lot_id: lotId,
              quantity,
            },
            result._id
          );
          await dispatchGetCards();
        }, 1000);

        requestSuccessStatus = true;
        message = cardName
          ? `Finished ${quantity} ${
              quantity > 1 ? "items" : "item"
            } from '${cardName}'`
          : `Finished ${quantity} ${quantity > 1 ? "items" : "item"}`;
        handleTaskAlert(
          ADD_TASK_ALERT_TYPE.FINISH_SUCCESS,
          "Lot Finished",
          message
        );
      }
    } else {
      message = "Quantity must be greater than 0";
      handleTaskAlert(
        ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
        "Lot Failed",
        message
      );
    }
  };

  return (
    <styled.LotContainer>
      {showWarehouseModal && (
        <WarehouseModal
          isOpen={showWarehouseModal}
          title={"Warehouse"}
          close={() => setShowWarehouseModal(false)}
          dashboard={{}}
          stationID={stationID}
          onCardClicked={(lotID, warehouseID) =>
            onMergeWarehouseLot(lotID, warehouseID)
          }
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
          handleFinish={() => setShowFinish(true)}
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
      {showFinish && renderFinishQuantity()}
    </styled.LotContainer>
  );
};

export default DashboardLotPage;
