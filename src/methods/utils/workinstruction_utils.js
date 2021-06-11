import {getProcessStations} from "./processes_utils";
import {FIELD_COMPONENT_NAMES} from "../../constants/lot_contants";

export const iterateWorkInstructions = (workInstructions, callback) => {
    Object.entries(workInstructions).forEach(processEntry => {
        const [processId, stationObjs] = processEntry

        Object.entries(stationObjs).forEach(stationEntry => {
            const [stationId, instructionObjects] = stationEntry
            const {
                fields
            } = instructionObjects

            fields.forEach((field, index) => {
                callback(field, processId, stationId, index)
            })
        })
    })
}

export const getDefaultWorkInstructions = (processes, tasks) => {
    let workInstructions = {}

    Object.values(processes).forEach(process => {
        const {
            _id: processId
        } = process

        workInstructions[processId] = {}

        const stationIds = getProcessStations(process, tasks)
        Object.keys(stationIds).forEach(stationId => {
            // workInstructions[processId]
            workInstructions[processId][stationId] = {
                stationId,
                fields: [
                    {
                        label: 'Cycle Time',
                        value: null,
                        component: FIELD_COMPONENT_NAMES.TIME_SELECTOR,
                    },
                    {
                        label: 'Work Instructions',
                        value: null,
                        component: FIELD_COMPONENT_NAMES.PDF_SELECTOR,
                    }
                ]
            }
        })
    })

    return workInstructions
}
