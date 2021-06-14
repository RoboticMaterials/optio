import {getProcessStations} from "./processes_utils";
import {FIELD_COMPONENT_NAMES} from "../../constants/lot_contants";

export const iterateWorkInstructionFields = async (workInstructions, callback) => {
    await iterateWorkInstructions(workInstructions, async (instructionObjects, processId, stationId) => {
        const {fields} = instructionObjects

        let index = 0
        for(const field of fields) {
            await callback(field, processId, stationId, index)
            index = index + 1
        }
    })
}

export const iterateWorkInstructionsSync = (workInstructions, callback) => {
    for(const processEntry of Object.entries(workInstructions || {})) {
        const [processId, stationObjs] = processEntry

        for(const stationEntry of Object.entries(stationObjs|| {})) {
            const [stationId, instructionObjects] = stationEntry

            callback(instructionObjects, processId, stationId)
        }
    }
}

export const iterateWorkInstructions = async (workInstructions, callback) => {
    for(const processEntry of Object.entries(workInstructions || {})) {
        const [processId, stationObjs] = processEntry

        for(const stationEntry of Object.entries(stationObjs)) {
            const [stationId, instructionObjects] = stationEntry

            await callback(instructionObjects, processId, stationId)
        }
    }
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
