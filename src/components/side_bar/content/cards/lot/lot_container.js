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
  getLotTotalQuantity,
} from "../../../../../methods/utils/lot_utils";
import * as styled from "./lot.style";

const LotContainer = (props) => {
  const {
    lotId,
    binId,
    enableFlagSelector,
    containerStyle,
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
    () => getCustomFields(lotTemplateId, lot),
    [lotTemplateId, lot]
  );

  const { count, ...partials } = bins[binId];

  console.log("LOT", lot);

  if (!!partials) {
    return (
      <styled.LotFamilyContainer>
        <Lot
          lotDisabled={count < 1 && !!isDashboard}
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
        {Object.entries(partials).map(([routeId, quantity]) => (
            <>
            {count < quantity &&
                <Lot
                    lotDisabled={true}
                    isDashboard={!!isDashboard}

                    processName={processName}
                    stationName={stationName}
                    templateValues={templateValues}
                    totalQuantity={totalQuantity - count}
                    lotNumber={lotNumber}
                    flags={flags || []}
                    enableFlagSelector={enableFlagSelector}
                    name={name + ` (${routes[routeId]?.part})`}
                    count={quantity - count}
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
    );
  } else {
    return (
      <Lot
        lotDisabled={count < 1 && !!isDashboard}
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
    );
  }
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
