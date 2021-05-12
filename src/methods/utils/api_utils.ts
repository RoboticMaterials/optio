import * as mutations from "../../api/graphql/mutations";
import * as queries from '../../api/graphql/queries'
import * as subscriptions from '../../api/graphql/subscriptions';
import {parseItem, parseLot, parseStation, RESOURCE_JSON_KEYS} from "./data_utils";
import {isFunction} from "./function_utils";
import {capitalizeFirstLetter} from "./string_utils";
import apolloClient from "../../api/apollo_client";
import {createStation} from "../../api/graphql/mutations";

export const getSubscriptionData = (subscriptionData, subscriptionName, parser) => {
    const {
        value
    } = subscriptionData || {}

    const {
        data
    } = value || {}

    const {
        [subscriptionName]: item
    } = data || {}

    if(isFunction(parser)) {
        return parser(item)
    }

    return item
}

export const getMutationData = (mutationResponse, mutationName, parser) => {
    console.log('getMutationData mutationResponse',mutationResponse)
    console.log('mutationName',mutationName)
    const {
        data
    } = mutationResponse || {}

    const {
        [mutationName]: item
    } = data || {}

    if(isFunction(parser)) {
        return parser(item)
    }
    console.log("getMutationData item",item)

    return item
}

export const getQueryData = (queryResponse, queryName, parser) => {
    const {data, loading, networkStatus} = queryResponse || {}
    const {[queryName]: values = []} = data || {}

    console.log('queryName',queryName)
    console.log('dataaaa',data)

    console.log('values',values)
    let queryData = []
    values.forEach((item: any) => {
        if(isFunction(parser)) {
            queryData.push(parser(item))
            return
        }

        queryData.push(item)
        return
    });

    return queryData
}

export const getMutationName = (mutation) => {
    for(const name in mutations) {
        if(mutations[name] === mutation) return name
    }
}

export const getQueryName = (query) => {
    for(const name in queries) {
        if(queries[name] === query) return name  // annoying but for some reason queries have the first letter capitalized
    }
}

export const getSubscriptionName = (subscription) => {
    for(const name in subscriptions) {
        if(subscriptions[name] === subscription) return name
    }
}

export const TRANSFORMS = {
    MUTATION: "MUTATION",
    QUERY: "QUERY",
    SUBSCRIPTION: "SUBSCRIPTION"
}

export const streamlinedMutation = async (query, variables, selectionSetName, parser) => {
    // const mutationName = getMutationName(query)

    // perform mutation
    const apiResponse = await apolloClient.mutate({mutation: query, variables})

    console.log('streamlinedMutation apiResponse',apiResponse)

    // return just the data
    return getMutationData(apiResponse, selectionSetName, parser)
}

export const streamlinedQuery = async (query, variables, selectionSetName, parser) => {
    console.log('streamlinedQuery called')
    // const queryName = getQueryName(query)


    const apiResponse = await apolloClient.query({query, variables})
    console.log('streamlinedQuery apiResponse',apiResponse)
    // return just the data
    return getQueryData(apiResponse, selectionSetName, parser)
}

export const streamlinedSubscription = async (sub, cb, parser) => {

    const subscription = await API.graphql(
        graphqlOperation(sub)
    ).subscribe({
        next: (subResult) => {
            const subName = getSubscriptionName(sub)
            const data = getSubscriptionData(subResult, subName, parser)
            cb(data)

        },
        error: error => console.warn(error)
    });

    return subscription
}

/*
* performs graphQL call, extracts relevant data, and parses data (if parser is provided)
*
* */
export const streamlinedGraphqlCall = async (transform, query, variables, parser) => {
    console.log('streamlinedGraphqlCall', {transform, query, variables, parser})
    const selectionSetName = query?.definitions[0]?.selectionSet?.selections[0]?.name?.value

    switch(transform) {
        case TRANSFORMS.MUTATION: {
            return await streamlinedMutation(query, variables, selectionSetName,  parser)
        }
        case TRANSFORMS.QUERY: {
            return await streamlinedQuery(query, variables,selectionSetName,  parser)
        }
        case TRANSFORMS.SUBSCRIPTION: {
            break
        }
        default:
            break
    }

}

// export const fancyCall = async (transform, query, dataType, variables) => {
//     const queryName = "listStations"
//     const response = await apolloClient.query({query: queries[queryName]})
//     const {data, loading, networkStatus} = response || {}
//     const {[queryName]: values} = data || {}
//
//     return parseItem(values, RESOURCE_JSON_KEYS[dataType])
// }

export const doOtherThing = async() => {
    // const res = await API.graphql({
    // 	query: cardsByOrgId,
    // 	variables:{
    // 		organizationId: userOrgId,
    // 		filter: {id: {eq: cardId}}
    // 	}
    // })
    //
    // if(res.data.CardsByOrgId.items[0]){
    // 	return {
    // 		...res.data.CardsByOrgId.items[0],
    // 		bins: JSON.parse(res.data.CardsByOrgId.items[0].bins),
    // 		flags: JSON.parse(res.data.CardsByOrgId.items[0].flags),
    // 		templateValues: JSON.parse(res.data.CardsByOrgId.items[0].templateValues),
    // 	};
}