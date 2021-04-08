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
import { createCard, createCardEvent, updateCard } from '../graphql/mutations'
import { getCardById } from '../graphql/queries'
import { deleteCard as deleteCardByID } from '../graphql/mutations'

// to get user org id
import getUserOrgId, {getUser} from './user_api'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

import * as _ from 'lodash'

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
                templateValues: JSON.parse(card.templateValues),
                bins: JSON.parse(card.bins),
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
                filter: {id: {eq: cardId}}
            }
        })

        if(res.data.CardsByOrgId.items[0]){
            return {
                ...res.data.CardsByOrgId.items[0],
                bins: JSON.parse(res.data.CardsByOrgId.items[0].bins),
                flags: JSON.parse(res.data.CardsByOrgId.items[0].flags),
                templateValues: JSON.parse(res.data.CardsByOrgId.items[0].templateValues),
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
            templateValues: JSON.stringify(card.templateValues),
            bins: JSON.stringify(card.bins),
            flags: JSON.stringify(card.flags),
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
                templateValues: JSON.parse(card.templateValues),
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

        const {
            id,
            _id,
            organizationId,
            createdAt,
            updatedAt,
            bins,
            flags,
            templateValues,
            lotNumber,
            lotTemplateId,
            name,
            process_id
        } = card || {}

        const oldCard = await getCard(ID)

        // get all the keyts possible
        var allkeys = _.union(_.keys(card), _.keys(oldCard))

        // find the difference betweenall the keys
        var difference = _.reduce(allkeys, function (result, key) {
            if ( !_.isEqual(card[key], oldCard[key]) ) {
                result[key] = {new: card[key], old: oldCard[key]}
            }
            return result;
        }, {});

        const user = await getUser()

        const eventInput = {
            delta: JSON.stringify(difference),
            cardId: ID,
            organizationId: oldCard.organizationId,
            userId: user.id,
            username: user.username
        }

        const input = {
            id: ID,
            _id,
            organizationId,
            bins: JSON.stringify(bins),
            flags: JSON.stringify(flags),
            templateValues: JSON.stringify(templateValues),
            lotNumber,
            lotTemplateId,
            name,
            process_id
        }

        const dataJson = await API.graphql({
            query: updateCard,
            variables: { input: input }
        })

        await API.graphql({
            query: createCardEvent,
            variables: { input: eventInput }
        })

        return dataJson.data.updateCard;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
