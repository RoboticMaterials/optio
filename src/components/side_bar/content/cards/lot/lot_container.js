import React, { useEffect, useState, useMemo } from "react";

// components internal
import Lot from "./lot";
import VisibilitySensor from "react-visibility-sensor";

// functions external
import PropTypes from "prop-types";

import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
// utils
import {
  getBinQuantity,
  getCustomFields,
  safelyDeconstructBin,
  handleMergeParts,
} from "../../../../../methods/utils/lot_utils";
import * as styled from "./lot.style";

const LotContainer = (props) => {
  const {
    lotId,
    binId,
    enableFlagSelector,
    containerStyle,
    isPartial,
    onDeleteDisabledLot,
    onRightClickDeleteLot,
    // quantity,
    ...rest
  } = props;
  const history = useHistory();
  const pageName = history.location.pathname;
  const isDashboard = !!pageName.includes("/locations");
  const params = useParams();
  const { dashboardID } = params;
  const lot =
    useSelector((state) => {
      return state.cardsReducer.cards[lotId];
    }) || {};
  const {
    bins,
    lotNumber,
    lotTemplateId,
    totalQuantity,
    name,
    flags,
    process_id: processId,
  } = lot || {};
  const routes = useSelector((state) => {
    return state.tasksReducer.tasks;
  });

  const process =
    useSelector((state) => {
      return state.processesReducer.processes[processId];
    }) || {};

    const station = useSelector(state => state.stationsReducer.stations[binId]) || {}

  const processName = useMemo(() => process.name, [process]);
  const stationName = useMemo(() => station.name, [station]);

  const templateValues = useMemo(
    () => getCustomFields(lotTemplateId, lot, dashboardID),
    [lotTemplateId, lot]
  );

  if (!(binId in bins)) { return null }
  const { count=0, ...partials } = bins[binId] || {};

  return (
    <styled.LotFamilyContainer>
          {((!!count && count > 0) || (count>=0 && !isDashboard)) &&
              <Lot
                  lotDisabled={(count < 1 && !!isDashboard) || isPartial}
                  onDeleteDisabledLot = {onDeleteDisabledLot}
                  onRightClickDeleteLot = {onRightClickDeleteLot}
                  isDashboard={!!isDashboard}
                  stationName={stationName}
                  templateValues={templateValues}
                  totalQuantity={totalQuantity}
                  lotNumber={lotNumber}
                  processName={processName}
                  flags={flags || []}
                  enableFlagSelector={enableFlagSelector}
                  name={name}
                  count={count}
                  id={lotId}
                  isSelected={false}
                  selectable={false}
                  onClick={() => {}}
                  {...rest}
                  containerStyle={{
                      width: "80%",
                      margin: ".5rem auto .5rem auto",
                      ...containerStyle,
                  }}
              />
          }
          {Object.entries(partials).map(([routeId, quantity]) => (
              <>
                  {0<quantity && !!isDashboard &&
                      <Lot
                          lotDisabled={true}
                          isDashboard={!!isDashboard}
                          processName={processName}
                          stationName={stationName}
                          templateValues={templateValues}
                          totalQuantity={totalQuantity}
                          lotNumber={lotNumber}
                          flags={flags || []}
                          enableFlagSelector={enableFlagSelector}
                          name={name + ` (${routes[routeId]?.part})`}
                          count={quantity}
                          id={lotId}
                          isSelected={false}
                          selectable={false}
                          onClick={() => {}}
                          {...rest}
                          containerStyle={{
                          width: "80%",
                          margin: ".5rem auto .5rem auto",
                          ...containerStyle,
                          }}
                      />
                  }
              </>
          ))}
    </styled.LotFamilyContainer>
  )
};

LotContainer.propTypes = {
  lotId: PropTypes.string,
  binId: PropTypes.string,
};

LotContainer.defaultProps = {
  lotId: "",
  binId: "",
  enableFlagSelector: false,
};

export default LotContainer;
