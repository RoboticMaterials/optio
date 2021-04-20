/**
 * All of the API calls for Stations
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 */

// import the API category from Amplify library
import { API } from 'aws-amplify'

import { orgsById } from '../graphql/queries'
 
export const getOrg = async (id) => {
    
    try {
        // get user from the database
        const data = await API.graphql({
            query: orgsById,
            variables: { organizationId: id}
        })

        return data.data.OrgsById.items[0]

    } catch (error) {
        console.log(error)
    }
 }
