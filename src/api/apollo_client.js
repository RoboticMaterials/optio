import { ApolloClient, InMemoryCache, createHttpLink, split, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";

const cache = new InMemoryCache();

const customFetch = (uri, options) => {
    const { operationName } = JSON.parse(options.body);
    console.log('customFetch', { uri, options })
    return fetch(uri, options);
};

const httpLink = createHttpLink({
    // Okay, so I think this uri Var is something that was once commited, but not anymore
    uri: process.env.REACT_APP_GQL_API_ENDPOINT,
    fetch: customFetch
});

const errorLink = onError(({
    graphQLErrors,
    networkError,
    serverError
}) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) console.error(`[Network error]: ${networkError}`);
});


// Get the auth token from AWS
const getAuthToken = () => {
    let token

    const poolData = {
        UserPoolId: process.env.REACT_APP_POOL_ID,
        ClientId: process.env.REACT_APP_POOL_CLIENT,
    }

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }

            if (session.isValid()) {
                token = session.getIdToken().getJwtToken();
            }
        });
    }

    return token
}

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GQL_REALTIME_ENDPOINT,
    options: {
        lazy: true,
        reconnect: true,
        connectionParams: async () => {
            return {
                headers: {
                    Authorization: getAuthToken(),
                },
                header: {
                    Authorization: getAuthToken(),
                },

            }
        },
        // connectionCallback: (error) => {
        // 	//@ts-ignore
        // 	if (error?.message === "Authentication Failure!") {
        // 		//@ts-ignore
        // 		//wsLink.subscriptionClient.close(false, false);
        // 	}
        // },
    },
});

console.log('wsLink', wsLink)

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: getAuthToken()
        }
    }
});

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

const wsInterceptor = new ApolloLink((operation, forward) => {

    console.log('wsInterceptor', { operation, forward })
    return forward(operation)
});

const wsBranch = from[
    // wsInterceptor,
    wsLink
]


// header: Contains information relevant to the AWS AppSync endpoint and authorization. This is a base64 string encoded from a stringified JSON object. The JSON object content varies depending on the authorization mode.
// payload: Base64 encoded string of payload.
const splitWsHttpLink = split(
    ({ query }) => {

        const { kind, operation } = getMainDefinition(query);
        console.log('link split ', { kind, operation, query })
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsBranch,
    httpLink,
);



const apolloClient = new ApolloClient({
    // Provide required constructor fields
    cache: cache,
    link: from([authLink, errorLink, splitWsHttpLink]), //authLink.concat(link),
    // uri: process.env.REACT_APP_GQL_API_ENDPOINT,

    // Provide some optional constructor fields
    name: 'react-web-client',
    version: '1.3',
    queryDeduplication: false,
    defaultOptions
});

export default apolloClient