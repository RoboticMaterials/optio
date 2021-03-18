import {
    GET_CART_STATUS,
    GET_CART_STATUS_STARTED,
    GET_CART_STATUS_SUCCESS,
    GET_CART_STATUS_FAILURE,

} from '../types/cart_status_types';

import * as api from '../../api/cart_status_api'


// get
// ******************************
export const getCartStatus = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_CART_STATUS_STARTED });
        }
        function onSuccess(cartStatus) {
            dispatch({ type: GET_CART_STATUS_SUCCESS, payload: cartStatus });
            console.log(cartStatus)
            return cartStatus;
        }
        function onError(error) {
            dispatch({ type: GET_CART_STATUS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const cartStatus = await api.getCartStatus();
            return onSuccess(cartStatus);
        } catch (error) {
            return onError(error);
        }
    };
};
