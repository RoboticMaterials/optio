import axios from 'axios';

import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';

import throttle from "lodash.throttle"


const operator = 'cards'

export const getCard = throttle(async function (cardId) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + "/" + cardId,
            headers: getHeaders()
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

},100);

export const getCardsCount = throttle(async function () {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + "/count",
            headers: getHeaders()
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}, 100);

export const getCards = throttle(async function () {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + `site_maps/${currMapId}/${operator}`,
            headers: getHeaders()
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}, 1000,{leading:true,trailing:false});


export async function getProcessCards(processId) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + "processes/" + processId + "/cards",
            headers: getHeaders()
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}

export async function getStationCards(stationId) {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + "stations/" + stationId + "/cards",
            headers: getHeaders()
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }

}

export async function deleteCard(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders()
        });

        return response;


    } catch (error) {
        handleError(error);
    }
}

export async function postCard(card) {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        card.map_id = currMapId

        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: getHeaders(),
            data: card
        });
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)

        return dataJson;

    } catch (error) {
        handleError(error);
    }
}

export async function putCard(card, ID) {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        card.map_id = currMapId

        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: getHeaders(),
            data: JSON.stringify(card)
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }
}
