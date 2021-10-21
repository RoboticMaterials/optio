
import {
    EDITING_LOCATION,
} from '../types/locations_types'

export const editing = (bool) => {
    return { type: EDITING_LOCATION, payload: bool }
}