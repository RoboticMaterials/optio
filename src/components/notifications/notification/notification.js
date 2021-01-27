import React, { useState, useMemo, useRef, useEffect } from "react";

import { useHistory } from 'react-router-dom'

import * as styled from "./notification.style";
import { timeFormat } from 'd3-time-format'
import { timeDay } from 'd3-time'

const Notification = (props) => {
    // const { message, type, ind, id } = props;

    const history = useHistory()

    const dayDelta = timeDay.count(props.notification.dateTime, new Date)
    let dateTimeFormatter
    if (dayDelta < 1) {
        dateTimeFormatter = timeFormat("%I:%M %p")
    } else if (dayDelta < 7) {
        dateTimeFormatter = timeFormat("%A %I:%M %p")
    } else {
        dateTimeFormatter = timeFormat("%b %d")
    }

    // const handleNotificationClicked = () => {
    //     // history.push('/locations/' + id )
    // }

    const { notification, ind } = props

    const handleType = () => {
        switch (notification.type) {
            case "station_alert":
                return "STATION"
            case "device_alert":
                return "DEVICE"
        }
    }

    return (
        <styled.NotificationContainer key={ind}>
            <styled.NotificationHeader>
                <styled.NotificationTypeText>{handleType()}</styled.NotificationTypeText>
                <styled.NotificationDateTime>{dateTimeFormatter(props.notification.dateTime)}</styled.NotificationDateTime>
            </styled.NotificationHeader>
            
            <styled.NotificationBody>
                <styled.NotificationLabel>{notification.label}</styled.NotificationLabel>
                <styled.NotificationMessage>{notification.message}</styled.NotificationMessage>
            </styled.NotificationBody>
        </styled.NotificationContainer>
    );
};

export default Notification;
