import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import { theme } from "../../../../../theme"

// import components
import ErrorTooltip from "../../../../basic/form/error_tooltip/error_tooltip";

// Import Styles
import * as style from './dashboard_button.style';

// import logging
import log from '../../../../../logger'

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardButton = (props => {
    logger.log("DashboardButton props", props)


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
        error
    } = props



    return (
        <>
            <style.Container
                disabled={disabled}
                width={width}
                height={height}
                background={color}
                onClick={clickable ? onClick : null}
                borderGlow={taskID === 'hil_success'}
                clickable={clickable}
                hoverable={hoverable}
                style={containerStyle}
                css={containerCss}
            >
                <style.ConditionText style={titleStyle}>{title}</style.ConditionText>
                {children && children}
                <ErrorTooltip
                    visible={error}
                    text={error}
                    ContainerComponent={style.ErrorContainerComponent}
                />
            </style.Container>
        </>
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
