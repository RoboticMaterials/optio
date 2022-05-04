import axios from 'axios';
import { apiIPAddress } from '../settings/settings'
import store from '../redux/store'
import { getHeaders, handleError } from './helpers';


const operator = 'tasks'

export async function getTasks() {
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + `site_maps/${currMapId}/${operator}`,
            headers: getHeaders()
        });

        // Success 🎉
        // log.debug('getTasks :res:',response);
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        // log.debug('getTasks: dataJson: ', dataJson)
        return dataJson;

    } catch (error) {
        handleError(error);
    }


};

export async function getTask(id) {
    // log.debug('getTask: id: ', id)
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator + '/' + id,
            headers: getHeaders(),
        });
        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        handleError(error);
    }


};

export async function postTask(task) {
    // log.debug('postTask task:',task, JSON.stringify(task));
    try {
        const currMapId = store.getState().localReducer.localSettings.currentMapId
        task.map_id = currMapId

        const response = await axios({
            method: 'post',
            headers: getHeaders(),
            url: apiIPAddress() + operator,
            data: JSON.stringify(task)
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;

    } catch (error) {
        handleError(error);
    }


};

export async function deleteTask(id) {

    try {
        const response = await axios({
            method: 'delete',
            headers: getHeaders(),
            url: apiIPAddress() + operator + '/' + id
        });

        // Success 🎉
        return response;

    } catch (error) {
        handleError(error);
    }


};

export async function putTask(task, id) {
    try {
        const response = await axios({
            method: 'put',
            headers: getHeaders(),
            url: apiIPAddress() + operator + '/' + id,
            data: JSON.stringify(task)
        });

        // Success 🎉
        const dataJson = response.data;
        //const dataJson = JSON.parse(data)
        return dataJson;

    } catch (error) {
        handleError(error);
    }

}
