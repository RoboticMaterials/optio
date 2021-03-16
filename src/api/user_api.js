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
import { API, Auth } from 'aws-amplify'

import { usersbyId } from '../graphql/queries'
 
 export default async function getUserOrgId() {
    
    try {
        // get current signed in user
        const user = await Auth.currentAuthenticatedUser();

        // get user from the database
        const data = await API.graphql({
            query: usersbyId,
            variables: { id: user.attributes.sub }
        })

        return data.data.UsersbyId.items[0].organizationId

    } catch (error) {
        console.log(error)
    }
 }