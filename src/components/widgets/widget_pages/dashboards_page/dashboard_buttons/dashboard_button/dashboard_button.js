import React, { useState } from 'react';
import PropTypes from 'prop-types';

// import components
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";
import {SchemaIcon} from "../../dashboard_editor/button_fields/button_fields.style";

// Import Styles
import * as style from './dashboard_button.style';
import * as dashboard_buttons_style from '../dashboard_buttons.style';
import { theme } from "../../../../../../theme"

// import logging
import log from '../../../../../../logger'

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardButton = (props => {

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
        titleStyle,
        containerStyle,
        containerCss,
        error,
        type = "",
        iconColor,
        iconClassName
    } = props


    return (
        <style.Container
            type={"button"}
            disabled={disabled}
            width={width}
            height={height}
            background={color}
            onClick={clickable ? ()=>onClick(taskID) : null}
            borderGlow={taskID === 'hil_success'}
            clickable={clickable}
            hoverable={hoverable}
            style={containerStyle}
            css={containerCss}
        >
            <div style={{display: "flex", alignItems: "center"}}>
                <style.ConditionText style={titleStyle}>{title}</style.ConditionText>
                {(iconColor && iconClassName) &&
                <style.IconContainer>
                    <SchemaIcon className={iconClassName} color={color ? color : iconColor}></SchemaIcon>
                </style.IconContainer>

                }
            </div>

            {children && children}
            <ErrorTooltip
                visible={error}
                text={error}
                ContainerComponent={dashboard_buttons_style.ErrorContainerComponent}
            />


        </style.Container>
    )

})

// Specifies propTypes
DashboardButton.propTypes = {
    clickable: PropTypes.bool,
    hoverable: PropTypes.bool,
    title: PropTypes.string,
    taskID: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

// Specifies the default values for props:
DashboardButton.defaultProps = {
    clickable: true,
    hoverable: true,
    title: "",
    taskID: "",
    onClick: () => { },
    disabled: false

};

export default (DashboardButton)
