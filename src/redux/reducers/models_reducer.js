import {

  GET_MODELS,
  GET_MODELS_STARTED,
  GET_MODELS_SUCCESS,
  GET_MODELS_FAILURE,

} from '../types/models_types';

const defaultState = {
  models: [],
  error: {},
  pending: false
};

export default function modelsReducer(state = defaultState, action) {

    switch (action.type) {
        case GET_MODELS:
            break;

        case GET_MODELS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case GET_MODELS_SUCCESS:
            return  Object.assign({}, state, {
                models: [...action.payload],
                pending: false
            });

        case GET_MODELS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        default:
            return state;
            break;

    }
}
