import uuid from 'uuid'
import {DEVICE_CONSTANTS} from "../../constants/device_constants";

/**
 * Creates an associated task
 * @param {object} task The task to generate an associated task from
 * @param {string} deviceType - string representing device type of generated task
 */
export const generateAssociatedTask = (task, deviceType) => {

    const associatedTask = {
        ...task,
        device_type: deviceType,
        _id: uuid.v4(),
        associated_task: task._id,
        processes: []
    }

    return associatedTask

}