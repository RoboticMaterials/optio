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
