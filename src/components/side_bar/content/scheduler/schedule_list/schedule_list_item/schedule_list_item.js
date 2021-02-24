import React, {
  Component,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

// external components
import Switch from "react-ios-switch";

// external functions
import { useSelector } from "react-redux";
import { ThemeContext } from "styled-components";

// components
import ButtonGroup from "../../../../../basic/button_group/button_group";
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";

// styles
import * as style from "./schedule_list_item.style";
import { getMessageFromError } from "../../../../../../methods/utils/form_utils";

const widthBreakPoint = 525;

const ScheduleListItem = (props) => {
  const {
    name,
    taskName,
    disabled,
    selected,
    id,
    schedule_on,
    onSwitchPress,
    onClick,
    error,
    days_on,
    time_interval,
    interval_on,
    stop_time,
    start_time,
    next_time,
  } = props;

  const themeContext = useContext(ThemeContext);

  const width = useSelector((state) => state.sidebarReducer.width);
  const isSmall = width < widthBreakPoint;
  const hasError = Object.keys(error).length > 0;
  const errorMessage = getMessageFromError(error);

  return (
    <style.Container
      onClick={() => onClick(id)}
      isSmall={isSmall}
      hasError={hasError}
    >
      <style.TopContainer>
        <div />

        <ErrorTooltip
          visible={hasError}
          text={errorMessage}
          ContainerComponent={style.ErrorContainer}
        />
      </style.TopContainer>

      <style.ContentContainer isSmall={isSmall}>
        <style.LeftContentContainer isSmall={isSmall}>
          <style.Title isSmall={isSmall}>{name}</style.Title>
          <style.SubTitle hasError={!taskName} isSmall={isSmall}>
            {taskName ? taskName : "Task not found"}
          </style.SubTitle>
        </style.LeftContentContainer>

        {!isSmall && (
          <style.TimeContainerlarge isSmall={isSmall} hasError={hasError}>
            <style.TimeContainer isSmall={isSmall}>
              <style.TimeTitle isSmall={isSmall}>Start Time</style.TimeTitle>
              <style.TimeValue isSmall={isSmall}>{start_time}</style.TimeValue>
            </style.TimeContainer>

            {interval_on ? (
              <>
                <style.TimeContainer isSmall={isSmall}>
                  <style.TimeTitle isSmall={isSmall}>Stop Time</style.TimeTitle>
                  <style.TimeValue isSmall={isSmall}>
                    {stop_time}
                  </style.TimeValue>
                </style.TimeContainer>

                <style.TimeContainer isSmall={isSmall}>
                  <style.TimeTitle isSmall={isSmall}>Interval</style.TimeTitle>
                  <style.TimeValue isSmall={isSmall}>
                    {time_interval}
                  </style.TimeValue>
                </style.TimeContainer>
              </>
            ) : (
              <style.TimeContainer isSmall={isSmall}>
                <style.TimeTitle isSmall={isSmall}>Interval</style.TimeTitle>
                <style.TimeValue isSmall={isSmall}>off</style.TimeValue>
              </style.TimeContainer>
            )}
          </style.TimeContainerlarge>
        )}

        <style.SwitchContainer
          // this container is used so click events anywhere on the switch will trigger the onClick event
          // otherwise if a click isn't directly over the handle, it will register the click on the outer Container
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSwitchPress(id);
          }}
          isSmall={isSmall}
        >
          <Switch
            checked={schedule_on}
            onChange={() => onSwitchPress(id)}
            disabled={disabled || hasError}
            onColor={themeContext.schema.scheduler.solid}
            // style={{zIndex: 5}}
          />
        </style.SwitchContainer>
      </style.ContentContainer>

      <style.DaysContainer isSmall={isSmall} hasError={hasError}>
        <ButtonGroup
          buttonViewCss={style.buttonViewCss}
          buttons={["M", "T", "W", "T", "F", "S"]}
          selectMultiple
          selectedIndexes={days_on}
          containerCss={style.buttonGroupContainerCss}
          buttonViewSelectedCss={style.buttonViewSelectedCss}
          buttonCss={style.buttonCss}
        />
      </style.DaysContainer>
    </style.Container>
  );
};

// Specifies the default values for props:
ScheduleListItem.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

ScheduleListItem.defaultProps = {
  title: "",
  disabled: false,
};

export default ScheduleListItem;
