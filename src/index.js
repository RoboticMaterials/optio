import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './methods/css/montserrat.css';
import './methods/css/iwawa.css';
import './methods/css/all.css';
import 'xmlrpc'
import { Provider } from 'react-redux'
import store from './redux/store/index.js'
import './methods/css/fontawesome.min.css'
import './graphics/icons/style.css'
import 'nivo'

import awsExports from "./aws-exports";
import Amplify, { Auth } from 'aws-amplify'
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync"

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
import { ApolloLink } from 'apollo-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from 'apollo-link-http';


Amplify.configure(awsExports);

/* uncomment to disable default logger
console.log = () => {};
console.error = () => {};
console.fatal = () => {};
console.warn = () => {};
*/

const link = ApolloLink.from([
    createAuthLink({ 
        url: awsExports.aws_appsync_graphqlEndpoint,
        region: awsExports.aws_appsync_region,
        auth: {
            type:  awsExports.aws_appsync_authenticationType,
            jwtToken: async () => {
                try {
                return (await Auth.currentSession()).getIdToken().getJwtToken()
                } catch (e) {
                console.error(e);
                return ""; // In case you don't get the token, hopefully that is a public api and that should work with the API Key alone.
                }
            }
        }
    }),
    createHttpLink({ uri: awsExports.aws_appsync_graphqlEndpoint })
])

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

if(module.hot){
    module.hot.accept()
}

    const rootElement = document.getElementById('root')
    ReactDOM.render(
        <ApolloProvider client={client}>
            <Provider store={store}>
                <App />
            </Provider>
        </ApolloProvider>,
        rootElement
    )
// }


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
