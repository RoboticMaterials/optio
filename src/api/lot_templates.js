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
import { lotTemplatesByOrgId } from '../graphql/queries'
import { createLotTemplate, updateLotTemplate } from '../graphql/mutations'
import { deleteLotTemplate as deleteLotById } from '../graphql/mutations'

// to get user org id
import getUserOrgId from './user_api'

// For creating a card
import { uuidv4 } from '../methods/utils/utils'

export async function getLotTemplate(id) {
    try {
        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: lotTemplatesByOrgId,
            variables: { 
                organizationId: userOrgId,
                filter: {_id: {eq: id}} 
            }
          })

        let GQLdata = []

        res.data.LotTemplatesByOrgId.items.forEach(lotTemplate => {
            GQLdata.push( {
                ...lotTemplate,
                displayNames: JSON.parse(lotTemplate.displayNames),
                fields: JSON.parse(lotTemplate.fields),
            })
        });
        
        return GQLdata[0];

    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}

export async function getLotTemplates() {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: lotTemplatesByOrgId,
            variables: { organizationId: userOrgId }
          })

        let GQLdata = []

        res.data.LotTemplatesByOrgId.items.forEach(lotTemplate => {
            GQLdata.push( {
                ...lotTemplate,
                displayNames: JSON.parse(lotTemplate.displayNames),
                fields: JSON.parse(lotTemplate.fields),
            })
        });
        
        return GQLdata;

    } catch (error) {
        // Error 😨
        errorLog(error)
    }

}

export async function deleteLotTemplate(ID) {
    try {
        const id = {id: ID}

        const dataJson = await API.graphql({
            query: deleteLotById,
            variables: { input: id }
        })

        return dataJson;


    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postLotTemplate(lotTemplate) {
    try {

        const fakeID = uuidv4();

        const userOrgId = await getUserOrgId()

        const input = {
            ...lotTemplate,
            displayNames: JSON.stringify(lotTemplate.displayNames),
            fields: JSON.stringify(lotTemplate.fields),
            _id: fakeID,
            id: fakeID,
            organizationId: userOrgId
        }
        
        const dataJson = await API.graphql({
            query: createLotTemplate,
            variables: { input: input }
        })

        console.log(dataJson);

        return {
            ...dataJson.data.createLotTemplate,
            displayNames: lotTemplate.displayNames,
            fields: lotTemplate.fields
        }

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putLotTemplate(lotTemplate, ID) {
    try {

        const input = {
            ...lotTemplate,
            displayNames: JSON.stringify(lotTemplate.displayNames),
            fields: JSON.stringify(lotTemplate.fields),
        }
        
        const dataJson = await API.graphql({
            query: updateLotTemplate,
            variables: { input: input }
        })

        return {
            ...dataJson.data.createLotTemplate,
            displayNames: lotTemplate.displayNames,
            fields: lotTemplate.fields
        }

    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
