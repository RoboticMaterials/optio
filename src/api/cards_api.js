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

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { cardsByOrgId } from '../graphql/queries'
import { createCard, updateCard } from '../graphql/mutations'
import { getCardById } from '../graphql/queries'
import { deleteCard as deleteCardByID } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

export async function getCards() {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: cardsByOrgId,
            variables: { organizationId: userOrgId }
          })

        let GQLdata = []

        res.data.CardsByOrgId.items.forEach(card => {
            GQLdata.push( {
                ...card,
                bins: JSON.parse(card.bins),
                dates: JSON.parse(card.dates),
                flags: JSON.parse(card.flags)
            })
        });
        
        return GQLdata;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function getCard(cardId) {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: cardsByOrgId,
            variables:{
                organizationId: userOrgId,
                filter: {_id: {eq: cardId}}
            }
        })

        if(res.data.CardsByOrgId.items[0]){
            return {
                ...res.data.CardsByOrgId.items[0],
                bins: JSON.parse(res.data.CardsByOrgId.items[0].bins),
                dates: JSON.parse(res.data.CardsByOrgId.items[0].dates),
                flags: JSON.parse(res.data.CardsByOrgId.items[0].flags)
            };
        }else{
            return null
        }

        // This query doesnt want to work for some reason
        // const dataJson = await API.graphql({
        //     query: getCardById,
        //     variables: { id: cardId }
        // })
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postCard(card) {
    try {

        const fakeID = uuidv4();

        const userOrgId = await getUserOrgId()

        const input = {
            ...card,
            bins: JSON.stringify(card.bins),
            dates: JSON.stringify(card.dates),
            flags: JSON.stringify(card.flags),
            _id: fakeID,
            id: fakeID,
            organizationId: userOrgId
        }
        
        const dataJson = await API.graphql({
            query: createCard,
            variables: { input: input }
        })

        return dataJson.data.createCard;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function getCardsCount() {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: cardsByOrgId,
            variables: { organizationId: userOrgId }
          })

        return res.data.CardsByOrgId.items.length

    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}


export async function getProcessCards(processId) {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: cardsByOrgId,
            variables: { 
                organizationId: userOrgId,
                filter: {processId: {eq: processId}}
             }
          })

        let GQLdata = []

        res.data.CardsByOrgId.items.forEach(card => {
            GQLdata.push( {
                ...card,
                bins: JSON.parse(card.bins),
                dates: JSON.parse(card.dates),
                flags: JSON.parse(card.flags)
            })
        });

        return GQLdata;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteCard(ID) {
    try {
        const id = {id: ID}

        const dataJson = await API.graphql({
            query: deleteCardByID,
            variables: { input: id }
        })

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putCard(card, ID) {
    try {

        const input = {
            ...card,
            bins: JSON.stringify(card.bins),
            dates: JSON.stringify(card.dates),
            flags: JSON.stringify(card.flags)
        }

        if(ID){
            input.id = ID
        }

        delete input.createdAt
        delete input.updatedAt
        
        const dataJson = await API.graphql({
            query: updateCard,
            variables: { input: input }
        })

        return dataJson.data.updateCard;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
