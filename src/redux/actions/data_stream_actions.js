import { normalize, schema } from 'normalizr';

import {
    GET_DEVICES_SUCCESS,
    GET_DEVICES_FAILURE
} from '../types/devices_types'

import {
    GET_STATUS_SUCCESS,
    GET_STATUS_FAILURE
} from '../types/status_types';

import {
    GET_TASK_QUEUE_SUCCESS,
    GET_TASK_QUEUE_FAILURE,
    INCREMENT_GET_DATA_FAILURE_COUNT
} from '../types/task_queue_types';

import * as api from '../../api/data_stream_api'
import { devicesSchema } from '../../normalizr/schema';
import { statusesSchema } from '../../normalizr/status_schema'
import { taskQueueSchema } from '../../normalizr/task_queue_schema'


export const getDataStream = () => {
    return async dispatch => {

        function handleDevicesSuccess(response) {
            dispatch({ type: GET_DEVICES_SUCCESS, payload: response });
            return response;
        }
        function handleDevicesError(error) {
            dispatch({ type: GET_DEVICES_FAILURE, payload: error });
            return error;
        }

        function handleStatusSuccess(response) {
            dispatch({ type: GET_STATUS_SUCCESS, payload: response });
            return response;
        }
        function handleStatusError(error) {
            dispatch({ type: GET_STATUS_FAILURE, payload: error });
            return error;
        }

        function handleTaskQueueSuccess(response) {
            dispatch({ type: GET_TASK_QUEUE_SUCCESS, payload: response });
            return response;
        }
        function handleTaskQueueError(error) {

            dispatch({ type: GET_TASK_QUEUE_FAILURE, payload: error });
            dispatch({ type: INCREMENT_GET_DATA_FAILURE_COUNT, payload: null })
            return error;
        }

        try {

            const dataStream = await api.getDataStream();

            // Devices
            try {
                let devices = dataStream.devices
                devices.forEach((device, ind) => {
                    if (!(device.position === undefined)) {
                        devices[ind].position.pos_x = device.position.x
                        devices[ind].position.pos_y = device.position.y
                    }
                })

                const normalizedDevices = normalize(devices, devicesSchema);
                handleDevicesSuccess(normalizedDevices.entities.devices)
            } catch (error) {
                handleDevicesError(error)
            }


            // Status
            try {
                let status = dataStream.status
                handleStatusSuccess(status);
            } catch (error) {
                handleStatusError(error)
            }


            // Task Queue
            try {
                const taskQueue = dataStream.task_queue
                const normalizedTaskQueue = normalize(taskQueue, taskQueueSchema);
                return handleTaskQueueSuccess(normalizedTaskQueue.entities.taskQueue);
            } catch (error) {
                return handleTaskQueueError(error)
            }



        } catch (error) {
        }
    }
}
