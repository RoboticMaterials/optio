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
    onDashboard,
    // quantity,
    ...rest
  } = props

  const history = useHistory();
  const pageName = history.location.pathname;
  const isDashboard = !!pageName.includes("/locations");
  const params = useParams();
  const { dashboardID, stationID } = params;
  const lot = !onDashboard ? useSelector(state => state.cardsReducer.cards[lotId]) : useSelector(state => state.cardsReducer.stationCards)[params.stationID][lotId];
  const stations = useSelector(state => state.stationsReducer.stations)
  const {
    bins,
    lotNum,
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

  const dashboard = useSelector(state => state.dashboardsReducer.dashboards[dashboardID]) || {}
  const processName = useMemo(() => process.name, [process]);
  const stationName = useMemo(() => station.name, [station]);
  const templateValues = useMemo(
    () => getCustomFields(lotTemplateId, lot, dashboardID),
    [lotTemplateId, lot, dashboard]
  );

  if (bins === undefined){
    return null
  }
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
                  lotNumber={lotNum}
                  processName={processName}
                  flags={flags || []}
                  enableFlagSelector={enableFlagSelector}
                  name={name}
                  count={count}
                  loopCount={lot.loopCount}
                  id={lotId}
                  isSelected={false}
                  selectable={false}
                  onClick={() => {}}
                  {...rest}
                  containerStyle={{
                      borderRadius: '.3rem',
                      width: "100%",
                      padding: !!isDashboard && '.2rem',
                      margin: ".5rem auto .5rem auto",
                      ...containerStyle,
                  }}
              />
          }
          {Object.values(partials)>0 &&
            <>
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
                            lotNumber={lotNum}
                            flags={flags || []}
                            enableFlagSelector={enableFlagSelector}
                            name={name + ` (${stations[routes[routeId]?.load]?.name})`}
                            count={quantity}
                            loopCount={lot.loopCount}
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
            ))
          }
        </>
      }
    </styled.LotFamilyContainer>
  )
};

LotContainer.propTypes = {
  lotId: PropTypes.string,
  binId: PropTypes.string,
  onDashboard: PropTypes.bool,
};

LotContainer.defaultProps = {
  onDashboard: false,
  lotId: "",
  binId: "",
  enableFlagSelector: false,
};

export default LotContainer;
