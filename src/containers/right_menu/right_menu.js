import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as styled from "./right_menu.style";

// Import Components
import TaskQueue from "../../components/task_queue/task_queue";
import Notifications from "../../components/notifications/notifications";
import Notification from "../../components/notifications/notification/notification";

// Import actions
import { deleteTaskQueueAll } from "../../redux/actions/task_queue_actions";
import { toggleNotificationTaskQueue } from "../../redux/actions/notifications_actions";

import useWindowSize from "../../hooks/useWindowSize";

import {
  deepCopy,
  upperCaseFirstLetterInString,
} from "../../methods/utils/utils";

const RightMenu = (props) => {
  // This values are defined in Status Header
  const { showRightMenu, newNotification, overlapStatus } = props;

  const size = useWindowSize();

  const dispatch = useDispatch();
  const onHideNotifications = (displayType) =>
    dispatch({ type: "HIDDEN_NOTIFICATIONS", payload: displayType });
  const onDeleteTaskQueueAll = () => dispatch(deleteTaskQueueAll());
  const setToggle = (toggle) => dispatch(toggleNotificationTaskQueue(toggle));

  const displayType = useSelector(
    (state) => state.notificationsReducer.hiddenNotifications
  );
  const toggle = useSelector(
    (state) => state.notificationsReducer.toggleNotificationTaskQueue
  );

  const [types, setTypes] = useState({});

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

  /**
   * This handles clearing of either the task q or notifications
   */
  const handleClear = () => {
    if (toggle === "taskQueue") {
      onDeleteTaskQueueAll();
    } else if (toggle === "notifications") {
      console.log("Clearing Notifications");
    }
  };

  return (
    <>
      {showRightMenu && (
        <styled.NotificationsContainer
          windowHeight={size.height + "px"}
          overlaping={overlapStatus}
        >
          {/* Commented out for the time being. As of Aug 31 2020 notifications have not been impleneted */}
          {/* <styled.ToggleContainer>
                        <styled.ToggleButton selected={toggle} type={'notifications'} onClick={() => setToggle('notifications')} style={{ borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem' }}>Notifications</styled.ToggleButton>
                        <styled.ToggleButton selected={toggle} type={'taskQueue'} onClick={() => setToggle('taskQueue')} style={{ borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem' }}>Task Queue</styled.ToggleButton>
                    </styled.ToggleContainer> */}

          <styled.Title>Task Queue</styled.Title>

          <styled.ClearText
            onClick={() => {
              handleClear();
            }}
          >
            Clear All
          </styled.ClearText>
          {toggle === "notifications" && <Notifications />}

          {toggle === "taskQueue" && <TaskQueue />}
        </styled.NotificationsContainer>
      )}

      {newNotification && handleNewNotification()}
    </>
  );
};

export default RightMenu;
