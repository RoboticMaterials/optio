import {
    GET_INTEGRATIONS,
    DISABLE_INTEGRATION,
    GET_INTEGRATION_CARDS,
    AUTH_INTEGRATION,
    SHOPIFY_INTEGRATION_TOKEN,

    STARTED,
    SUCCESS,
    FAILURE
  } from '../types/integrations_types';


import { deepCopy } from '../../methods/utils/utils';

  const defaultState = {
      integrationEndpoints: [],
      integrationCards: {},
  
      error: {},
      pending: false
  };

  export default function integrationsReducer(state = defaultState, action) {
    let integrationCardsCopy = {}

    switch (action.type) {

        case GET_INTEGRATIONS:
            break;

        case GET_INTEGRATIONS + STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_INTEGRATIONS + SUCCESS:
            return {
                ...state,
                integrationEndpoints: action.payload,
                pending: false
            }

        case GET_INTEGRATIONS + FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
            
        
            case DISABLE_INTEGRATION:
                break;
    
            case DISABLE_INTEGRATION + STARTED:
                return Object.assign({}, state, {
                    pending: true
                });
    
            case DISABLE_INTEGRATION + SUCCESS:
                return {
                    ...state,
                    integrationEndpoints: action.payload,
                    pending: false
                }
    
            case DISABLE_INTEGRATION + FAILURE:
                return Object.assign({}, state, {
                    error: action.payload,
                    pending: false
                });


        case GET_INTEGRATION_CARDS:
            break;

        case GET_INTEGRATION_CARDS + STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_INTEGRATION_CARDS + SUCCESS:
            integrationCardsCopy = deepCopy(state.integrationCards)
            integrationCardsCopy[action.payload.endpoint] = action.payload.cards
            return {
                ...state,
                integrationCards: integrationCardsCopy,
                pending: false
            }

        case GET_INTEGRATION_CARDS + FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        
        case AUTH_INTEGRATION:
            break;

        case AUTH_INTEGRATION + STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case AUTH_INTEGRATION + SUCCESS:
            return {
                ...state,
                integrationEndpoints: action.payload,
                pending: false
            }

        case AUTH_INTEGRATION + FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });


        case SHOPIFY_INTEGRATION_TOKEN:
            break;

        case SHOPIFY_INTEGRATION_TOKEN + STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case SHOPIFY_INTEGRATION_TOKEN + SUCCESS:
            return {
                ...state,
                integrationEndpoints: action.payload,
                pending: false
            }

        case SHOPIFY_INTEGRATION_TOKEN + FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        default:
            return state;
    }
}
