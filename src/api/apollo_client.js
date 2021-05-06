import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

const cache = new InMemoryCache();

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_GQL_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
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

	console.log('token',token)
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		}
	}
});

const apolloClient = new ApolloClient({
	// Provide required constructor fields
	cache: cache,
	link: authLink.concat(httpLink),
	// uri: process.env.REACT_APP_GQL_API_ENDPOINT,

	// Provide some optional constructor fields
	name: 'react-web-client',
	version: '1.3',
	queryDeduplication: false,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	},
});

export default apolloClient