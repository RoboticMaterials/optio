import {
  GET_SCHEDULES,
  GET_SCHEDULES_STARTED,
  GET_SCHEDULES_SUCCESS,
  GET_SCHEDULES_FAILURE,

  POST_SCHEDULE,
  POST_SCHEDULE_STARTED,
  POST_SCHEDULE_SUCCESS,
  POST_SCHEDULE_FAILURE,

  DELETE_SCHEDULE,
  DELETE_SCHEDULES,

  ADD_SCHEDULES,
  DELETE_SCHEDULE_STARTED,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAILURE,

  PUT_SCHEDULE,
  PUT_SCHEDULE_STARTED,
  PUT_SCHEDULE_SUCCESS,
  PUT_SCHEDULE_FAILURE,

  UPDATE_SCHEDULE,
  ADD_SCHEDULES_UNSAVED,
} from '../types/schedule_types';

import { clone_object } from '../../methods/utils/utils';

const defaultState = {

  schedules: {},
  error: {},
  pending: false
};

export default function schedulesReducer(state = defaultState, action) {
  var schedules = {}

  switch (action.type) {

    // get
    // ***************
    case GET_SCHEDULES_SUCCESS:
      return  Object.assign({}, state, {
        schedules: {...state.schedules, ...action.payload.schedulesObj},
        pending: false
      });

    case GET_SCHEDULES_FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case GET_SCHEDULES_STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // create
    // ***************
    case POST_SCHEDULE_SUCCESS:
      schedules = clone_object(state.schedules);
      console.log('CREATE_SCHEDULE_SUCCESS schedules before delete ', schedules)
      console.log('CREATE_SCHEDULE_SUCCESS action.payload ', action.payload)
      delete schedules[action.payload.oldScheduleId];
      console.log('CREATE_SCHEDULE_SUCCESS schedules after delete', schedules)
      //schedules[action.payload.createdSchedule._id.$oid] = action.payload.createdSchedule;
      console.log('CREATE_SCHEDULE_SUCCESS schedules after add', schedules)

      return  Object.assign({}, state, {
        schedules: {...schedules, ...action.payload.createdSchedules},
        pending: false
      });


    case POST_SCHEDULE_FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case POST_SCHEDULE_STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // delete
    // ***************
    case DELETE_SCHEDULE_SUCCESS:
      schedules = clone_object(state.schedules);
      delete schedules[action.payload.scheduleId];

      return  Object.assign({}, state, {
        schedules: {...schedules},
        pending: false
      });


    case DELETE_SCHEDULE_FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case DELETE_SCHEDULE_STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // update
    // ***************
    case PUT_SCHEDULE_SUCCESS:
      //schedules = clone_object(state.schedules);
      //schedules[action.payload.scheduleId] = action.payload.schedules;

      return  Object.assign({}, state, {
        schedules: {...state.schedules, ...action.payload.schedules},
        pending: false
      });


    case PUT_SCHEDULE_FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case PUT_SCHEDULE_STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    case ADD_SCHEDULES:
      return  Object.assign({}, state, {
        schedules: {...state.schedules, ...action.schedules}
      });

    case DELETE_SCHEDULES:
        schedules = clone_object(state.schedules)
        action.scheduleIds.forEach((scheduleId, index, scheduleIds)=> {
          delete schedules[scheduleId];
        })

        return  Object.assign({}, state, {

          schedules: {...schedules}
        });

    case UPDATE_SCHEDULE:
        schedules = clone_object(state.schedules);
        delete schedules[action.scheduleId];
        schedules[action.schedule.id] = action.schedule

        return  Object.assign({}, state, {
          schedules: {...schedules}
        });

    default:
      return state
  }
}
