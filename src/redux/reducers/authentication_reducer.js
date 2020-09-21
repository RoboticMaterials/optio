import {
    GET_REFRESH_TOKEN,
    GET_REFRESH_TOKEN_STARTED,
    GET_REFRESH_TOKEN_SUCCESS,
    GET_REFRESH_TOKEN_FAILURE,


    POST_REFRESH_TOKEN,
    POST_REFRESH_TOKEN_STARTED,
    POST_REFRESH_TOKEN_SUCCESS,
    POST_REFRESH_TOKEN_FAILURE,

} from '../types/authentication_types'

const defaultState = {

    refreshToken: '',
    cognitoUserSession: null,

    error: {},
    pending: false,

};

export default function authenticationReducer(state = defaultState, action) {

    switch (action.type) {

        case 'POST_COGNITO_USER_SESSION':
            return{
                ...state,
                cognitoUserSession: action.payload
            }

        // ======================================== //
        //                                          //
        //              Get Refresh Token           //
        //                                          //
        // ======================================== //
        case GET_REFRESH_TOKEN:
            break;

        case GET_REFRESH_TOKEN_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                refreshToken: action.payload,
                pending: false
            }

        case GET_REFRESH_TOKEN_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //             Post Refresh Token           //
        //                                          //
        // ======================================== //

        case POST_REFRESH_TOKEN:
            break;

        case POST_REFRESH_TOKEN_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_REFRESH_TOKEN_SUCCESS:

            return {
                ...state,
                refreshToken: action.payload,
                pending: false,

            }

        case POST_REFRESH_TOKEN_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });


        default:
            return state;

    }
}