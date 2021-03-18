import React, { useStat, useContext } from 'react';
import useWindowSize from '../../../../../../hooks/useWindowSize';
import PropTypes from 'prop-types';

// import components
import ErrorTooltip from "../../../../../basic/form/error_tooltip/error_tooltip";
import {SchemaIcon} from "../../dashboard_editor/button_fields/button_fields.style";

// Import Styles
import * as style from './dashboard_split_button.style'
import { ThemeContext } from 'styled-components'
import * as dashboard_buttons_style from '../dashboard_buttons.style'

// import logging
import log from '../../../../../../logger'
import {DEVICE_CONSTANTS} from "../../../../../../constants/device_constants";

const logger = log.getLogger("Dashboards", "EditDashboard");

const widthBreakPoint = 1000;

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
        containerStyle,
        containerCss,
        error,
        iconColor,
        type
    } = props

    const theme = useContext(ThemeContext);

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    return (
        <div style={{display: 'flex', position: 'relative', flexDirection: 'row', minWidth: '80%', width: '100%'}}>
            <style.Container
                type={"button"}
                disabled={disabled}
                height={height}
                background={color}
                borderGlow={taskID === 'hil_success'}
                style={{...containerStyle, maxWidth: '20%', alignText: 'center', marginRight: '0.5rem'}}
                css={containerCss}
                onClick={clickable ? () => onClick(taskID, DEVICE_CONSTANTS.HUMAN) : null}
            >
                <div style={{flexGrow: '1', alignItems: 'center', alignContent: 'center', justifyContent: 'center', height: '100%'}}>
                    <SchemaIcon className={"fas fa-user"} color={theme.bg.octonary} style={{margin: '0'}}></SchemaIcon>
                    {!mobileMode &&
                        <style.ConditionText style={{flexGrow: '0', marginLeft: '0.5rem'}}>Run as human</style.ConditionText>
                    }
                </div>
            </style.Container>

            <style.Container
                type={"button"}
                disabled={disabled}
                width={width}
                height={height}
                background={color}
                borderGlow={taskID === 'hil_success'}
                style={containerStyle}
                css={containerCss}
            >

                <style.ConditionText style={null}>{title}</style.ConditionText>

                <>
                    <svg viewBox="0 0 300 67" fill={theme.bg.primary} height='100%' width="12rem" preserveAspectRatio="none" style={{minWidth: '12rem'}}>
                        <path d="M300,8v51c0,4.4-3.6,8-8,8H8.8L63.5,0H292C296.4,0,300,3.6,300,8z"/>
                    </svg>
                    <style.IconContainer>
                        <SchemaIcon className={"icon-cart"} style={{fontSize: "1rem"}} color={color}></SchemaIcon>
                    </style.IconContainer>
                </>
                {/* <style.RobotButton
                    background={color}
                    clickable={clickable}
                    onClick={clickable ? () => onClick(taskID, DEVICE_CONSTANTS.MIR_100) : null}

                >
                    
                    
                </style.RobotButton> */}

                

                {/* {children && children}
                <ErrorTooltip
                    visible={error}
                    text={error}
                    ContainerComponent={dashboard_buttons_style.ErrorContainerComponent}
                /> */}
            </style.Container>
        </div>
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
