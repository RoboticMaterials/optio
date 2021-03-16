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
import { listCards } from '../graphql/queries'
import { createCard, updateCard } from '../graphql/mutations'
import { getCard as getCardByID } from '../graphql/queries'
import { deleteCard as deleteCardByID } from '../graphql/mutations'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

export async function getCards() {
    try {
        const res = await API.graphql({
            query: listCards
          })

        let GQLdata = []

        res.data.listCards.items.forEach(card => {
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

        const id = {id: cardId}

        const dataJson = await API.graphql({
            query: getCardByID,
            variables: { input: id }
        })

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postCard(card) {
    try {

        console.log(card)

        const fakeID = uuidv4();

        const input = {
            ...card,
            bins: JSON.stringify(card.bins),
            dates: JSON.stringify(card.dates),
            flags: JSON.stringify(card.flags),
            _id: fakeID,
            id: fakeID
        }
        
        const dataJson = await API.graphql({
            query: createCard,
            variables: { input: input }
        })

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function getCardsCount() {
    try {
        const res = await API.graphql({
            query: listCards
          })

        return res.data.listCards.items.length

    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}


export async function getProcessCards(processId) {
    try {

        const res = await API.graphql({
            query: listCards,
            variables:{
              filter: {processId: {eq: processId}}
            }
          })

        let GQLdata = []

        res.data.listCards.items.forEach(card => {
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

        delete input.createdAt
        delete input.updatedAt
        
        const dataJson = await API.graphql({
            query: updateCard,
            variables: { input: input }
        })

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
