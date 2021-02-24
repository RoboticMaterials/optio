import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as styled from "./notifications.style";

import Notification from "./notification/notification";

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notificationsReducer.notifications
  );

  const handleNotifications = () => {
    return (
      <>
        {notifications
          .sort((a, b) => b.dateTime - a.dateTime)
          .map((notification, ind) => (
            <Notification
              key={`notification-${ind}`}
              ind={ind}
              notification={notification}
            />
          ))}
      </>
    );
  };

  return <>{handleNotifications()}</>;
};

export default Notifications;
