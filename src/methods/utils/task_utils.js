// Import utils
import { deepCopy } from './utils'

export const tasksSortedAlphabetically = (tasks) => {
    const tasksCopy = deepCopy(tasks)

    tasksCopy.sort((a,b) => {
        const aName = a.name
        const bName = b.name

        if(aName < bName) return -1
        if(aName > bName) return 1
        return 0
    })

    return tasksCopy
}