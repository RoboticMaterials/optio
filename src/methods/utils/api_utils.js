import * as mutations from "../../graphql/mutations";
import * as queries from '../../graphql/queries'
import * as subscriptions from '../../graphql/subscriptions';
import {updateCard} from "../../graphql/mutations";
import {API, graphqlOperation} from "aws-amplify";
import {parseLot} from "./data_utils";
import {cardsByOrgId} from "../../graphql/queries";
import {isFunction} from "./function_utils";
import {capitalizeFirstLetter} from "./string_utils";

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
	const {
		data
	} = mutationResponse || {}

	const {
		[mutationName]: item
	} = data || {}

	if(isFunction(parser)) {
		return parser(item)
	}

	return item
}

export const getQueryData = (queryResponse, queryName, parser) => {
	const {
		data
	} = queryResponse || {}

	const {
		[queryName]: innerData
	} = data || {}

	const {
		items = []
	} = innerData || {}

	let queryData = []

	items.forEach(item => {
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
		if(queries[name] === query) return capitalizeFirstLetter(name)  // annoying but for some reason queries have the first letter capitalized
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

export const streamlinedMutation = async (query, variables, parser) => {
	const mutationName = getMutationName(query)

	// perform mutation
	const apiResponse = await API.graphql({
		query,
		variables
	})

	// return just the data
	return getMutationData(apiResponse, mutationName, parser)
}

export const streamlinedQuery = async (query, variables, parser) => {
	const queryName = getQueryName(query)

	// perform mutation
	const apiResponse = await API.graphql({
		query,
		variables
	})

	// return just the data
	return getQueryData(apiResponse, queryName, parser)
}

export const streamlinedSubscription = async (sub, cb, parser) => {

	const subscription = await API.graphql(
		graphqlOperation(sub)
	).subscribe({
		next: (subResult) => {
			console.log("subResult",subResult)
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

	switch(transform) {
		case TRANSFORMS.MUTATION: {
			return await streamlinedMutation(query, variables, parser)
			break
		}
		case TRANSFORMS.QUERY: {
			return await streamlinedQuery(query, variables, parser)
			break
		}
		case TRANSFORMS.SUBSCRIPTION: {
			break
		}
	}

}

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