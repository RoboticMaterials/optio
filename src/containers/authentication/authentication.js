import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as styled from './authentication.style'

import { Link } from 'react-router-dom'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

import configData from '../../settings/config'

// import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import { useHistory, useParams } from 'react-router-dom'

// Import actions
import { postLocalSettings, getLocalSettings } from '../../redux/actions/local_actions'
import ForgotPassword from '../../components/forgotPassword/forgotPassword'

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

    const history = useHistory()
    const params = useParams()

    const dispatch = useDispatch()

    const [signIn, setSignIn] = useState(true)
    const [forgotPassword, setForgotPassword] = useState(false)

    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    useEffect(() => {
        handleInitialLoad()
    }, [])

    useEffect(() => {
        if(history.location.pathname === '/'){
            setSignIn(true)
            setForgotPassword(false)
        }else if(history.location.pathname === '/forgot-password'){
            setForgotPassword(true)
        }else if(history.location.pathname === '/create-account'){
            setSignIn(false)
            setForgotPassword(false)
        }
    }, [params])

    const handleSignInChange = (value) => {
        setSignIn(value)
    }

    const handleInitialLoad = () => {
        // Check to see if we want authentication *** Dev ONLY ***
        const localSettingsPromise = dispatchGetLocalSettings()
        localSettingsPromise.then(response =>{

            if (!configData.authenticationNeeded) {

                dispatchPostLocalSettings({
                    ...response,
                    authenticated: 'no'
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
                                ...response,
                                authenticated:true,
                            })
                        }
                    });
                }
            }
        })
    }

    return (
        <styled.Page className="signin-page">
        <styled.Container>

            <styled.LogoContainer>
                <styled.LogoIcon className='icon-rmLogo' />
                <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
            </styled.LogoContainer>
        
            { !forgotPassword &&
            <styled.SignInUpContainer>

                <SignInUpPage
                    signIn={signIn}
                    onChange={handleSignInChange} />

            </styled.SignInUpContainer>
            }

            { forgotPassword &&
            <styled.SignInUpContainer>

                <ForgotPassword />

            </styled.SignInUpContainer>
            }

            <styled.LogoContainer>
            
            {!forgotPassword && 
            <div>

                <Link to="/forgot-password">Forgot Password? </Link>
                
                <Link to="/login" style={{
                    marginLeft: '.5rem', 
                    marginRight: '.5rem',
                    textDecoration: 'none',
                    cursor: 'default'
                    }}> • </Link>

                {signIn &&
                    <Link to="/create-account"> Create an account </Link>
                }

                {!signIn &&
                    <Link to="/"> Sign in </Link>
                }

            </div>
            }

            </styled.LogoContainer>
            
        </styled.Container>
        </styled.Page>
    )

}

export default Authentication
