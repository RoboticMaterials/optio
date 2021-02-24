import React, { useEffect, useState } from "react";

// external components
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {
  getCards,
  getProcessCards,
  putCard,
} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from "./kick_off_modal.style";
import { useTheme } from "styled-components";
import { getProcesses } from "../../../../../../redux/actions/processes_actions";
import FadeLoader from "react-spinners/FadeLoader";
import CardEditor from "../../../../../side_bar/content/cards/card_editor/card_editor";
import Textbox from "../../../../../basic/textbox/textbox";
import { SORT_MODES } from "../../../../../../constants/common_contants";
import { sortBy } from "../../../../../../methods/utils/card_utils";
import Card from "../../../../../side_bar/content/cards/card/card";

Modal.setAppElement("body");

const KickOffModal = (props) => {
  const { isOpen, title, close, dashboard, onSubmit } = props;

  // get current buttons, default to empty array
  const dashboardId = dashboard?._id?.$oid;

  const theme = useTheme();

  const dispatch = useDispatch();
  // const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
  const dispatchGetCards = () => dispatch(getCards());
  const dispatchGetProcesses = () => dispatch(getProcesses());
  const onPutCard = async (card, ID) => await dispatch(putCard(card, ID));

  const kickOffEnabledInfo = useSelector((state) => {
    return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId];
  });
  const processCards = useSelector((state) => {
    return state.cardsReducer.processCards;
  });
  const processes =
    useSelector((state) => {
      return state.processesReducer.processes;
    }) || {};
  const routes =
    useSelector((state) => {
      return state.tasksReducer.tasks;
    }) || {};

  const [lotFilterValue, setLotFilterValue] = useState("");
  const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLotEditor, setShowLotEditor] = useState(false);
  const [didLoadData, setDidLoadData] = useState(false);
  const [availableKickOffCards, setAvailableKickOffCards] = useState([]);
  const [sortMode, setSortMode] = useState(SORT_MODES.END_DESCENDING);
  const isButtons = availableKickOffCards.length > 0;
  const stationId = dashboard.station;

  /*
   * handles the logic for when a kick-off button is pressed
   *
   * When a kick-off button is pressed, the card is to be moved from the queue of the current process it resides in
   * to the first station in the process
   *
   * This is done by updating the cards station_id and route_id to those of the first station in the first route
   * */
  const onButtonClick = async (card) => {
    // extract card attributes
    const { bins, name: cardName, process_id, _id: cardId } = card;

    // get process of card
    const cardProcess = processes[process_id];

    // get routes of process
    const processRoutes = cardProcess.routes;

    // get id of first route
    var firstRouteId = null;
    if (processRoutes && Array.isArray(processRoutes))
      firstRouteId = processRoutes[0];

    // get first route
    const firstRoute = routes[firstRouteId];

    // extract route attributes
    const {
      load: { station: loadStation },
    } = firstRoute || {};

    // update card
    if (firstRouteId && firstRoute && loadStation) {
      // extract first station's bin and queue bin from bins
      const {
        [loadStation]: firstStationBin,
        ["QUEUE"]: queueBin,
        ...unalteredBins
      } = bins || {};

      const queueBinCount = queueBin?.count ? queueBin.count : 0;
      const firstStationCount = firstStationBin?.count
        ? firstStationBin.count
        : 0;

      // udpated card will maintain all of the cards previous attributes with the station_id and route_id updated
      const updatedCard = {
        ...card, // spread unaltered attributes
        bins: {
          ...unalteredBins, // spread unaltered bins
          [loadStation]: {
            ...firstStationBin, // spread unaltered attributes of station bin if it exists
            count: parseInt(queueBinCount) + parseInt(firstStationCount), // increment first station's count by the count of the queue
          },
        },
      };

      // send update action
      const result = await onPutCard(updatedCard, cardId);

      var requestSuccessStatus = false;

      // check if request was successful
      if (!(result instanceof Error)) {
        requestSuccessStatus = true;
      }

      onSubmit(cardName, requestSuccessStatus);
      setSubmitting(false);
      close();
    }
  };

  /*
   * renders an array of buttons for each kick off lot
   * */
  const renderKickOffButtons = () => {
    return availableKickOffCards
      .filter((currLot) => {
        const { name: currLotName } = currLot || {};

        if (currLotName.toLowerCase().includes(lotFilterValue.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      })
      .map((currCard, cardIndex) => {
        const { _id: lotId, name, start_date, end_date, bins = {} } = currCard;

        const count = bins["QUEUE"]?.count || 0;

        return (
          <Card
            name={name}
            start_date={start_date}
            end_date={end_date}
            // objectName={objectName}
            count={count}
            id={lotId}
            index={cardIndex}
            onClick={() => {
              onButtonClick(currCard);
            }}
            containerStyle={{
              marginBottom: "0.5rem",
              width: "80%",
              margin: ".5rem auto .5rem auto",
            }}
          />
        );
      });
  };

  const loadData = async () => {
    const cardsResult = await dispatchGetCards();
    const processesResult = await dispatchGetProcesses();

    if (
      !(cardsResult instanceof Error) &&
      !(processesResult instanceof Error)
    ) {
      setDidLoadData(true);
    }
  };

  /**
   * When modal is opened, get all cards associated with the processes
   *
   *
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Get the cards actually available for kick off
   *
   * For a card to be available for kick off, it must have at least 1 item in the 'queue' bin
   *
   * This function creates a temporary array for storing kick off cards as it checks each card of each process associated with the station
   *
   * This function loops through every card belonging to a process that the current station is the first station of
   * Each card's bins attribute is checked to see if it contains any items in the "QUEUE" bin
   *
   * if a card is found to have items in the "QUEUE" bin, it is added to the list of kick off cards
   *
   * finally, local state variable availableKickOffCards is set to the list of kick off cards for later use
   *
   */
  useEffect(() => {
    var tempAvailableCards = [];

    if (kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo))
      kickOffEnabledInfo.forEach((currProcessId) => {
        const currProcessCards = processCards[currProcessId];

        var filteredCards = [];
        if (currProcessCards)
          filteredCards = Object.values(currProcessCards).filter((currCard) => {
            // currCard.station_id === "QUEUE"
            if (currCard.bins && currCard.bins["QUEUE"]) return true;
          });
        tempAvailableCards = tempAvailableCards.concat(filteredCards);
      });

    if (sortMode) {
      sortBy(tempAvailableCards, sortMode);
    }
    setAvailableKickOffCards(tempAvailableCards);
  }, [processCards]);

  // if number of available lots >= 5, auto focus lot filter text box
  useEffect(() => {
    if (availableKickOffCards.length >= 5) {
      setShouldFocusLotFilter(true);
    }
  }, [availableKickOffCards.length]);

  return (
    <styled.Container
      isOpen={isOpen}
      contentLabel="Kick Off Modal"
      onRequestClose={close}
      style={{
        overlay: {
          zIndex: 500,
        },
        content: {},
      }}
    >
      {showLotEditor && (
        <CardEditor
          isOpen={true}
          onAfterOpen={null}
          processOptions={kickOffEnabledInfo}
          showProcessSelector={true}
          cardId={null}
          processId={null}
          // binId={null}
          close={() => {
            setShowLotEditor(false);
            // setSelectedCard(null)
          }}
        />
      )}
      <styled.Header>
        <styled.HeaderMainContentContainer>
          <styled.Title>{title}</styled.Title>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40rem",
              minWidth: "10rem",
              maxWidth: "50%",
            }}
          >
            <Textbox
              focus={shouldFocusLotFilter}
              placeholder="Filter lots..."
              onChange={(e) => {
                setLotFilterValue(e.target.value);
              }}
              style={{ background: theme.bg.quaternary }}
              textboxContainerStyle={{ flex: 1 }}
            />
          </div>
        </styled.HeaderMainContentContainer>

        <Button onClick={close} schema={"dashboards"}>
          <i className="fa fa-times" aria-hidden="true" />
        </Button>
      </styled.Header>

      <styled.BodyContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <styled.ContentContainer>
            <styled.ReportButtonsContainer isButtons={isButtons}>
              {isButtons ? (
                renderKickOffButtons()
              ) : didLoadData ? (
                <styled.NoButtonsText>
                  There are currently no lots in the queue available for kick
                  off.
                </styled.NoButtonsText>
              ) : (
                <FadeLoader
                  css={styled.FadeLoaderCSS}
                  height={5}
                  width={3}
                  loading={true}
                />
              )}
            </styled.ReportButtonsContainer>
          </styled.ContentContainer>

          <styled.ButtonsContainer>
            <Button
              tertiary
              schema={"dashboards"}
              onClick={close}
              label={"Close"}
              type="button"
            />
            <Button
              // tertiary
              // secondary
              schema={"dashboards"}
              // onClick={close}
              onClick={() => setShowLotEditor(true)}
              label={"Add Lot"}
              type="button"
            />
          </styled.ButtonsContainer>
        </div>
      </styled.BodyContainer>
    </styled.Container>
  );
};

export default KickOffModal;
