import cardsReducer from '../cards_reducer';
import touchEventsReducer from '../touch_events_reducer';

import { OPEN_TOUCH_EVENT_SUCCESS, CLOSE_TOUCH_EVENT_SUCCESS } from '../../types/touch_events_types';
import { POST, PUT, DELETE as DELETE_PREFIX } from '../../types/prefixes';
import { SUCCESS } from '../../types/suffixes';
import { CARD } from '../../types/data_types';

describe('lot lifecycle reducer regressions', () => {
  it('adds an open touch event for a station that has no existing open events', () => {
    const event = {
      _id: 'te-1',
      lot_id: 'lot-1',
      load_station_id: 'station-a',
      move_datetime: null,
      start_datetime: 1234,
    };

    const nextState = touchEventsReducer(undefined, {
      type: OPEN_TOUCH_EVENT_SUCCESS,
      payload: event,
    });

    expect(nextState.openEvents['station-a']).toEqual([event]);
  });

  it('removes a closed touch event from the station open events list', () => {
    const initialState = {
      events: [],
      lotEvents: {},
      openEvents: {
        'station-a': [
          { _id: 'te-1', lot_id: 'lot-1', load_station_id: 'station-a', move_datetime: null },
          { _id: 'te-2', lot_id: 'lot-2', load_station_id: 'station-a', move_datetime: null },
        ],
      },
    };

    const nextState = touchEventsReducer(initialState, {
      type: CLOSE_TOUCH_EVENT_SUCCESS,
      payload: { _id: 'te-1', load_station_id: 'station-a' },
    });

    expect(nextState.openEvents['station-a']).toEqual([
      { _id: 'te-2', lot_id: 'lot-2', load_station_id: 'station-a', move_datetime: null },
    ]);
  });

  it('keeps stationCards in sync when a lot moves to a different station', () => {
    const movedCard = {
      _id: 'lot-1',
      process_id: 'process-1',
      bins: {
        'station-b': { count: 3 },
      },
    };

    const initialState = {
      cards: {
        'lot-1': {
          _id: 'lot-1',
          process_id: 'process-1',
          bins: {
            'station-a': { count: 3 },
          },
        },
      },
      processCards: {
        'process-1': {
          'lot-1': {
            _id: 'lot-1',
            process_id: 'process-1',
            bins: {
              'station-a': { count: 3 },
            },
          },
        },
      },
      stationCards: {
        'station-a': {
          'lot-1': {
            _id: 'lot-1',
            process_id: 'process-1',
            bins: {
              'station-a': { count: 3 },
            },
          },
        },
        'station-b': {},
      },
      cardHistories: {},
      error: {},
      pending: false,
      showEditor: false,
      showFormEditor: false,
      showBarcodeModal: false,
    };

    const nextState = cardsReducer(initialState, {
      type: PUT + CARD + SUCCESS,
      payload: {
        card: movedCard,
        processId: 'process-1',
      },
    });

    expect(nextState.stationCards['station-a']).toEqual({});
    expect(nextState.stationCards['station-b']).toEqual({
      'lot-1': movedCard,
    });
  });

  it('removes a deleted lot from all stationCards buckets', () => {
    const initialState = {
      cards: {
        'lot-1': { _id: 'lot-1', process_id: 'process-1', bins: { 'station-a': { count: 1 } } },
      },
      processCards: {
        'process-1': {
          'lot-1': { _id: 'lot-1', process_id: 'process-1', bins: { 'station-a': { count: 1 } } },
        },
      },
      stationCards: {
        'station-a': {
          'lot-1': { _id: 'lot-1', process_id: 'process-1', bins: { 'station-a': { count: 1 } } },
        },
        'station-b': {
          'lot-1': { _id: 'lot-1', process_id: 'process-1', bins: { 'station-a': { count: 1 } } },
        },
      },
      cardHistories: {},
      error: {},
      pending: false,
      showEditor: false,
      showFormEditor: false,
      showBarcodeModal: false,
    };

    const nextState = cardsReducer(initialState, {
      type: DELETE_PREFIX + CARD + SUCCESS,
      payload: {
        cardId: 'lot-1',
        processId: 'process-1',
      },
    });

    expect(nextState.stationCards['station-a']).toEqual({});
    expect(nextState.stationCards['station-b']).toEqual({});
  });
});
