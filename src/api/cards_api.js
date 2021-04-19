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
import { cardsByOrgId, getCardById } from '../graphql/queries'
import { createCard, createCardEvent, updateCard, deleteCard as deleteCardByID } from '../graphql/mutations'

// to get user org id
import getUserOrgId, {getUser} from './user_api'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

import * as _ from 'lodash'
import {parseLot, stringifyLot, stringifyLotEvent} from "../methods/utils/data_utils";
import {
    getMutationData,
    getTransformName,
    getSubscriptionData,
    streamlinedGraphqlCall,
    TRANSFORMS
} from "../methods/utils/api_utils";

export const getCards = async () => {
    try {
        const userOrgId = await getUserOrgId()

        const lots = await streamlinedGraphqlCall(TRANSFORMS.QUERY, cardsByOrgId, { organizationId: userOrgId }, parseLot)

        return lots;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function getCard(cardId) {
    try {

        const userOrgId = await getUserOrgId()

        const lots = await streamlinedGraphqlCall(TRANSFORMS.QUERY, cardsByOrgId, {
            organizationId: userOrgId,
            filter: {id: {eq: cardId}}
        }, parseLot)

        return lots[0] ? lots[0] : null

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postCard(card) {
    try {
        const userOrgId = await getUserOrgId()

        const input = stringifyLot({
            ...card,
            organizationId: userOrgId
        })

        const postedLot = await streamlinedGraphqlCall(TRANSFORMS.MUTATION, createCard, { input: input }, parseLot)

        return postedLot

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function getCardsCount() {
    try {
        const userOrgId = await getUserOrgId()

        const lots = await streamlinedGraphqlCall(TRANSFORMS.QUERY, cardsByOrgId, { organizationId: userOrgId })

        return lots.length

    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}


export async function getProcessCards(processId) {
    try {

        const userOrgId = await getUserOrgId()

        const lots = await streamlinedGraphqlCall(TRANSFORMS.QUERY, cardsByOrgId, {
            organizationId: userOrgId,
            filter: {processId: {eq: processId}}
        }, parseLot)

        return lots

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function deleteCard(ID) {
    try {
        const id = {id: ID}

        const dataJson = await streamlinedGraphqlCall(TRANSFORMS.MUTATION, deleteCardByID, { input: id }, parseLot)

        return dataJson;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putCard(card, ID) {
    try {
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

        const eventInput = stringifyLotEvent({
            delta: difference,
            cardId: ID,
            organizationId: oldCard.organizationId,
            userId: user.id,
            username: user.username
        })

        const input = stringifyLot({...card, id: ID})

        const updatedLot = await streamlinedGraphqlCall(TRANSFORMS.MUTATION, updateCard, { input: input }, parseLot)

        // create event
        await streamlinedGraphqlCall(TRANSFORMS.MUTATION, createCardEvent, { input: eventInput })


        return updatedLot

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
