import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_STARTED,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAILURE,
  GET_NOTIFICATION,
  GET_NOTIFICATION_STARTED,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAILURE,
  POST_NOTIFICATION,
  POST_NOTIFICATION_STARTED,
  POST_NOTIFICATION_SUCCESS,
  POST_NOTIFICATION_FAILURE,
  PUT_NOTIFICATION,
  PUT_NOTIFICATION_STARTED,
  PUT_NOTIFICATION_SUCCESS,
  PUT_NOTIFICATION_FAILURE,
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATION_STARTED,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_FAILURE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATIONS,
  TOGGLE_NOTIFICATION_TASK_QUEUE,
  REMOVE_NOTIFICATION,
  SET_NOTIFICATION_ATTRIBUTES,
  VALIDATE_NOTIFICATION,
  SELECT_NOTIFICATION,
  SET_SELECTED_NOTIFICATION,
  DESELECT_NOTIFICATION,
} from "../types/notifications_types";

const defaultState = {
  hiddenNotifications: {},
  notifications: [
    {
      type: "station_alert",
      label: "Workstation 3",
      message: "Takt time is 10s slower than normal",
      priority: "warning",
      dateTime: new Date(2020, 7, 25, 11, 34),
    },
    {
      type: "device_alert",
      label: "MiR 3",
      message: "Battery low",
      priority: "critical",
      dateTime: new Date(2020, 7, 24, 15, 12),
    },
    {
      type: "station_alert",
      label: "Shipping",
      message:
        "Station has denyed task request 'Finished Cartridges to Shipping'",
      priority: "alert",
      dateTime: new Date(2020, 7, 22, 15, 54),
    },
    {
      type: "station_alert",
      label: "Workstation 4",
      message: "Takt time is 8s faster than normal",
      priority: "alert",
      dateTime: new Date(2020, 7, 10, 16, 32),
    },
  ],

  toggleNotificationTaskQueue: "taskQueue",
};

const notificationsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "HIDDEN_NOTIFICATIONS":
      // Need to assign to new object because React doesn't see the object change as a state change.
      // This makes react think a state change is happening so the component rerenders
      const newPayload = { ...action.payload };

      return {
        ...state,
        hiddenNotifications: newPayload,
      };

    case TOGGLE_NOTIFICATION_TASK_QUEUE:
      return {
        ...state,
        toggleNotificationTaskQueue: action.payload,
      };

    default:
      return state;
  }
};

export default notificationsReducer;
