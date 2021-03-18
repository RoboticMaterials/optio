/** 
 * All of the API calls for Cards
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

export async function getDataStream() {
    try {

        // just doing this for now until we fully implement the rest of this

        let dataJson = {
            devices: [],
            status: {
                _id: {$oid: "60528738e9e8f989ea8fb0b4"},
                active_map: null,
                mir_connection: "connected",
                pause_status: false
            },
            taskQueue: []
        }

        return dataJson;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }


}
