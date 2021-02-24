import React from "react";
import * as styled from "./interval_button.style";

import SmallButton from "../small_button/small_button";

import useIntervalPress from "../../../event_handlers/use_interval_press";

const IntervalButton = ({
  startFunc,
  intervalFunc,
  endFunc,
  interval,
  ...props
}) => {
  const wayPointPress = useIntervalPress(
    startFunc,
    intervalFunc,
    endFunc,
    interval
  );

  return <SmallButton {...props} {...wayPointPress} />;
};

SmallButton.defaultProps = {
  startFunc: () => {},
  intervalFunc: () => {},
  endFunc: () => {},
  interval: 1000,
};

export default IntervalButton;
