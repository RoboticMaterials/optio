import React, { useState } from "react";
import PropTypes from "prop-types";

// import components
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";
import { SchemaIcon } from "../../dashboard_editor/button_fields/button_fields.style";

// Import Styles
import * as style from "./dashboard_split_button.style";
import * as dashboard_buttons_style from "../dashboard_buttons.style";

// import logging
import log from "../../../../../../logger";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardSplitButton = (props) => {
  const {
    color,
    title,
    children,
    onClick,
    taskID,
    disabled,
    width,
    height,
    clickable,
    hoverable,
    containerStyle,
    containerCss,
    error,
    iconColor,
  } = props;

  return (
    <style.Container
      type={"button"}
      disabled={disabled}
      width={width}
      height={height}
      background={color}
      borderGlow={taskID === "hil_success"}
      style={containerStyle}
      css={containerCss}
    >
      <style.RobotButton
        background={color}
        clickable={clickable}
        onClick={
          clickable ? () => onClick(taskID, DEVICE_CONSTANTS.MIR_100) : null
        }
      >
        <style.ConditionText style={null}>{title}</style.ConditionText>

        <SchemaIcon
          className={"icon-cart"}
          style={{ fontSize: "1rem" }}
          color={iconColor}
        ></SchemaIcon>
      </style.RobotButton>

      <style.HumanButton
        clickable={clickable}
        background={color}
        onClick={
          clickable ? () => onClick(taskID, DEVICE_CONSTANTS.HUMAN) : null
        }
      >
        <SchemaIcon className={"fas fa-user"} color={iconColor}></SchemaIcon>
      </style.HumanButton>

      {children && children}
      <ErrorTooltip
        visible={error}
        text={error}
        ContainerComponent={dashboard_buttons_style.ErrorContainerComponent}
      />
    </style.Container>
  );
};

// Specifies propTypes
DashboardSplitButton.propTypes = {
  clickable: PropTypes.bool,
  hoverable: PropTypes.bool,
  title: PropTypes.string,
  taskID: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

// Specifies the default values for props:
DashboardSplitButton.defaultProps = {
  clickable: true,
  hoverable: true,
  title: "",
  taskID: "",
  onClick: () => {},
  disabled: false,
};

export default DashboardSplitButton;
