import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import * as styled from "./right_menu.style";

// Import Components
import Notifications from "../../components/notifications/notifications";
import Notification from "../../components/notifications/notification/notification";

// Import actions

import useWindowSize from "../../hooks/useWindowSize";


import {
    deepCopy,
    upperCaseFirstLetterInString,
} from "../../methods/utils/utils";

const RightMenu = (props) => {

    // This values are defined in Status Header
    const { showRightMenu, newNotification, overlapStatus } = props;

    const size = useWindowSize();

    const dispatch = useDispatch()
    const onHideNotifications = (displayType) => dispatch({ type: 'HIDDEN_NOTIFICATIONS', payload: displayType })

    const toggle = useSelector(state => state.notificationsReducer.toggleNotificationTaskQueue)

    /**
     * When a new notification comes in, overlay on the map
     */
    const handleNewNotification = () => {
        const notification = {
            message: "Station 69 takt time is 420s slower then normal",
            type: "station_alert",
            id: "1234",
        };

        return (
            <styled.NewNotificationContainer>
                <Notification
                    message={notification.message}
                    type={notification.type}
                    id={notification.id}
                    onClick={() => {
                        console.log("QQQQ Clicked ID");
                    }}
                />
            </styled.NewNotificationContainer>
        );
    };

    return (
        <>
            {showRightMenu && (

                <styled.NotificationsContainer
                    windowHeight={size.height + "px"}
                    overlaping = {overlapStatus}
                >

                    <styled.Title>Notifications</styled.Title>

                    <Notifications />
                </styled.NotificationsContainer>
            )}

            {newNotification && handleNewNotification()}
        </>
    );
};

export default RightMenu;
