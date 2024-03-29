import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

// import components
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";

// Import Styles
import * as style from './dashboard_button.style';
import * as dashboard_buttons_style from '../dashboard_buttons.style';
import { ThemeContext } from "styled-components";

// import logging
import log from '../../../../../../logger'
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardButton = (props => {

    const {
        color,
        title,
        children,
        onClick,
        deviceType,
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
        svgColor,
        invert,  
    } = props

    const theme = useContext(ThemeContext);

    return (
        <style.Container
            invert={invert}
            type={"button"}
            disabled={disabled}
            width={width}
            height={height}
            background={color}
            onClick={clickable ? () => onClick(taskID, deviceType) : null}
            borderGlow={taskID === 'hil_success'}
            clickable={clickable}
            hoverable={hoverable}
            style={containerStyle}
            css={containerCss}
        >
            {/* <div style={{display: "flex", alignItems: "center", border: '1px solid red'}}> */}
            <style.ConditionText style={titleStyle}>{title}</style.ConditionText>



            {(iconColor && iconClassName) &&
                <>
                    <svg viewBox="0 0 300 67" fill={!!svgColor ? svgColor : theme.bg.primary} height='100%' width="12rem" preserveAspectRatio="none">
                        <path d="M300,8v51c0,4.4-3.6,8-8,8H8.8L63.5,0H292C296.4,0,300,3.6,300,8z" />
                    </svg>
                    <style.IconContainer>
                        <style.SchemaIcon style = {{position: 'absolute', left: '6rem'}} className={iconClassName} color={color ? color : iconColor}/>
                    </style.IconContainer>
                </>
            }

            {/* {children && children}
                <ErrorTooltip
                    visible={error}
                    text={error}
                    ContainerComponent={dashboard_buttons_style.ErrorContainerComponent}
                /> */}
            {/* </div> */}




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
    disabled: PropTypes.bool,
    invert: PropTypes.bool,
};

// Specifies the default values for props:
DashboardButton.defaultProps = {
    clickable: true,
    hoverable: true,
    title: "",
    taskID: "",
    onClick: () => { },
    disabled: false,
    invert: false,

};

export default (DashboardButton)
