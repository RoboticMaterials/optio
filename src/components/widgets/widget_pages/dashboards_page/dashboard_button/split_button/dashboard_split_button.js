import React, { useState } from 'react';
import PropTypes from 'prop-types';

// import components
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";
import {SchemaIcon} from "../../dashboard_editor/button_fields/button_fields.style";

// Import Styles
import * as style from './dashboard_split_button.style';
// import { theme } from "../../../../../theme"

// import logging
import log from '../../../../../../logger'

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardSplitButton = (props => {

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
        iconClassName,
        associatedTaskId
    } = props

    return (
        <style.Container
            type={"button"}
            disabled={disabled}
            width={width}
            height={height}
            background={color}
            borderGlow={taskID === 'hil_success'}
            style={containerStyle}
            css={containerCss}
            onClick={clickable ? () => onClick(taskID) : null}
        >
            <style.SubButton
                background={color}
                clickable={clickable}

            >
                <style.ConditionText style={null}>{title}</style.ConditionText>

                <SchemaIcon className={"icon-cart"} style={{fontSize: "1rem"}} color={iconColor}></SchemaIcon>
            </style.SubButton>

            <style.SubButton2
                clickable={clickable}
                background={color}
                onClick={clickable ? () => onClick(associatedTaskId) : null}
            >
                <SchemaIcon className={"fas fa-user"} color={iconColor}></SchemaIcon>
            </style.SubButton2>

            {children && children}
            <ErrorTooltip
                visible={error}
                text={error}
                ContainerComponent={style.ErrorContainerComponent}
            />
        </style.Container>
    )

})

// Specifies propTypes
DashboardSplitButton.propTypes = {
    clickable: PropTypes.bool,
    hoverable: PropTypes.bool,
    title: PropTypes.string,
    taskID: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

// Specifies the default values for props:
DashboardSplitButton.defaultProps = {
    clickable: true,
    hoverable: true,
    title: "",
    taskID: "",
    onClick: () => { },
    disabled: false

};

export default (DashboardSplitButton)
