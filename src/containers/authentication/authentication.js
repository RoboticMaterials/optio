import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CognitoUser, CognitoUserPool, CognitoRefreshToken, CognitoUserSession } from 'amazon-cognito-identity-js'

import * as styled from './authentication.style'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

import { postCognitoUserSession } from '../../redux/actions/authentication_actions'

// import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import * as AWS from 'aws-sdk/global';

// Import actions
import { postLocalSettings } from '../../redux/actions/local_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'

/**
 * After the APIs have been loaded in the api_container this container is loaded
 * It checks to see if the user has already signed in based on whether or not a refresh token exists in cookies
 * If there is a token, it uses that to get a new JWT and uses that to make sure the session is valid, no reason to sign in if there's a valid session. 
 * If the refresh token is expired, you have to sign in again
 * If there is no token, the user either has to sign in or sign up 
 * Authenticated props is used for telling APP.js the user is authenticated
 * 
 * TODO: Should show loading when there is a refresh token and its being used to get new JWT credntials
 * TODO: Styling updates
 * TODO: Forgot password
 * TODO: Add HTTPS connection to server which allows for the use of a secure cookie. Increases security a lot 
 * @param {authenticated} props 
 */
const Authentication = (props) => {

    const {
        authenticated
    } = props

    const dispatch = useDispatch()
    const onCognitoUserSession = (JWT) => dispatch(postCognitoUserSession(JWT))

    const refreshToken = useSelector(state => state.authenticationReducer.refreshToken)
    const cognitoUserSession = useSelector(state => state.authenticationReducer.cognitoUserSession)

    const [signIn, setSignIn] = useState(true)

    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const localReducer = useSelector(state => state.localReducer.localSettings)

    const handleInitialLoad = () => {

        var poolData = {
            UserPoolId: 'us-east-2_YFnCIb6qJ',
            ClientId: '5bkenhii8f4mqv36k0trq6hgc7',
        };

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var cognitoUser = userPool.getCurrentUser();
        
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                console.log('session validity: ' + session.isValid());

                if(session.isValid()){
                    dispatchPostLocalSettings({
                        ...localReducer,
                        authenticated: true,
                        non_local_api_ip: '18.223.113.55',
                        non_local_api: true,
                    })
                }
            });
        }

        // // check to see if refresh token exists and is still good
        // if(localReducer.refreshToken !== null){
        //     // Information assembled for the request
        //     const poolData = {
                // UserPoolId: 'us-east-2_YFnCIb6qJ',
                // ClientId: '5bkenhii8f4mqv36k0trq6hgc7',
        //     }

        //     const userPool = new CognitoUserPool(poolData)

        //     const userData = {
        //         Username: 'daniel@roboticmaterials.com',
        //         Pool: userPool,
        //     }

        //     const cognitoUser = userPool.getCurrentUser()

        //     // Gets new tokens if access token is not valid
        //     // .refreshSession requies an instance of the CognitioRefreshToken class not just the refresh token sting
        //     const token = new CognitoRefreshToken({ RefreshToken: localReducer.refreshToken })

        //     let serverIP = '18.223.113.55'
            
        //     cognitoUser.refreshSession(token, (err, session) => {
        //         console.log('QQQQ', err, session)

        //         // If the session has succesfully been refreshed then verify
        //         if (!!session) {
        //             console.log('QQQQ Valid session ', session.isValid())
        //             const verified = onCognitoUserSession(session)

        //             // If verrified, then no need to sign in or sign up
        //             if (verified) {
        //                 dispatchPostLocalSettings({
        //                     ...localReducer,
        //                     authenticated: userData.Username,
        //                     non_local_api_ip: serverIP,
        //                     non_local_api: true
        //                 })
        //             }
        //         }
        //     })
        // }

        return (
            <styled.Container>

                <styled.LogoContainer>
                    <styled.LogoIcon className='icon-rmLogo' />
                    <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
                </styled.LogoContainer>

                <styled.LogoWelcome> Wecome Back </styled.LogoWelcome>

                <styled.CheckBoxWrapper>
                    <styled.LogoWelcome> {signIn ? 'Sign In' : 'Sign Up'} </styled.LogoWelcome>

                    <styled.CheckBox id="checkbox" type="checkbox" onClick={() => setSignIn(!signIn)}/>
                    <styled.CheckBoxLabel htmlFor="checkbox" />
                    
                </styled.CheckBoxWrapper>

                <styled.SignInUpContainer>

                    <SignInUpPage signIn={signIn} />

                </styled.SignInUpContainer>
            </styled.Container>
        )
    }

    return (
        handleInitialLoad()
    )

}

export default Authentication