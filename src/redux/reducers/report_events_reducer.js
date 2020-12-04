// import types
import {
  GET,
  POST,
  DELETE,
  PUT
} from '../types/prefixes';

import {
  REPORT_EVENTS,
  REPORT_EVENT
} from '../types/data_types';

import {
  STARTED,
  SUCCESS,
  FAILURE
} from '../types/suffixes';

import { clone_object } from '../../methods/utils/utils';

const defaultState = {
  reportEvents: {},
  error: {},
  pending: false
};

export default function reportEventsReducer(state = defaultState, action) {

  switch (action.type) {

    // get
    // ***************
    case GET + REPORT_EVENTS + SUCCESS:
      return  Object.assign({}, state, {
        reportEvents: {...state.reportEvents, ...action.payload.reportEventsObj},
        pending: false
      });

    case GET + REPORT_EVENTS + FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case GET + REPORT_EVENTS + STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // create
    // ***************
    case POST + REPORT_EVENT + SUCCESS:
      const created = action.payload.createdReportEvent

      return  Object.assign({}, state, {
        reportEvents: {...state.reportEvents, [created._id]: created},
        pending: false
      });


    case POST + REPORT_EVENT + FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case POST + REPORT_EVENT + STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // delete
    // ***************
    case DELETE + REPORT_EVENT + SUCCESS:

      const {
        [action.payload.id]: old,
          ...rest
      } = state.reportEvents

      return  Object.assign({}, state, {
        reportEvents: {...rest},
        pending: false
      });


    case  DELETE + REPORT_EVENT + FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case  DELETE + REPORT_EVENT + STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    // update
    // ***************
    case  PUT + REPORT_EVENT + SUCCESS:

      return  Object.assign({}, state, {
        reportEvents: {...state.reportEvents, [action.payload.updatedReportEvent._id]: action.payload.updatedReportEvent},
        pending: false
      });


    case PUT + REPORT_EVENT + FAILURE:
      return  Object.assign({}, state, {
        error: action.payload,
        pending: false
      });

    case PUT + REPORT_EVENT + STARTED:
      return  Object.assign({}, state, {
        pending: true
      });
    // ~~~~~~~~~~~~~~~

    default:
      return state
  }
}
