import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as styled from './authentication.style'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

import configData from '../../settings/config'

// import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

// Import actions
import { postLocalSettings, getLocalSettings } from '../../redux/actions/local_actions'

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

    const [signIn, setSignIn] = useState(true)

    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    const localReducer = useSelector(state => state.localReducer.localSettings)

    useEffect(() => {
        dispatchGetLocalSettings()
    }, [])

    const handleSignInChange = (value) => {
        setSignIn(value)
    }

    const handleInitialLoad = () => {
        // Check to see if we want authentication *** Dev ONLY ***
        if (!configData.authenticationNeeded) {
          const localSettingsPromise = dispatchGetLocalSettings()
          localSettingsPromise.then(response =>{

            dispatchPostLocalSettings({
                ...response,
                authenticated: 'no',
                //non_local_api_ip: window.location.hostname,
                //non_local_api: true,
            })
          })
        } else {

            var poolData = {
                UserPoolId: configData.UserPoolId,
                ClientId: configData.ClientId,
            };

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var cognitoUser = userPool.getCurrentUser();

            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    if (err) {
                        alert(err.message || JSON.stringify(err));
                        return;
                    }

                    if (session.isValid()) {
                        dispatchPostLocalSettings({
                            ...localReducer,
                            authenticated:true,
                            non_local_api_ip: window.location.hostname,
                            non_local_api: true,
                        })
                    }
                });
            }
        }

        return (
            <styled.Container>

                <styled.LogoContainer>
                    <styled.LogoIcon className='icon-rmLogo' />
                    <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
                </styled.LogoContainer>

                <styled.LogoWelcome> Wecome Back </styled.LogoWelcome>

                <styled.CheckBoxWrapper>
                    <styled.Button
                        onClick={() => setSignIn(true)}
                        selected={signIn}
                        style={{borderRadius: '.5rem 0  0 .5rem'}}
                    >
                        Sign In
                    </styled.Button>

                    <styled.Button
                        onClick={() => setSignIn(false)}
                        selected={!signIn}
                        style={{borderRadius: '0 .5rem .5rem 0'}}
                    >
                        Sign Up
                    </styled.Button>
                </styled.CheckBoxWrapper>

                <styled.SignInUpContainer>

                    <SignInUpPage
                        signIn={signIn}
                        onChange={handleSignInChange} />

                </styled.SignInUpContainer>
            </styled.Container>
        )
    }

    return (
        handleInitialLoad()
    )

}

export default Authentication
