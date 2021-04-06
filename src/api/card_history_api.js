/** 
 * All of the API calls for Card Histories
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: April 5 2021
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { cardsEventsByOrgId } from '../graphql/queries'

// to get user org id
import getUserOrgId from './user_api'

export async function getCardHistory(ID) {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: cardsEventsByOrgId,
            variables:{
                organizationId: userOrgId,
                filter: {cardId: {eq: ID}}
            }
        })

        let GQLdata = []

        res.data.CardsEventsByOrgId.items.forEach(card => {
            GQLdata.push( {
                ...card,
                ...JSON.parse(card.delta),
            })
        });

        return GQLdata;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}