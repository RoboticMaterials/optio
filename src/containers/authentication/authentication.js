import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import { CognitoUser, CognitoUserPool, CognitoRefreshToken, CognitoUserSession } from 'amazon-cognito-identity-js'

import * as styled from './authentication.style'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

// import { postCognitoUserSession } from '../../redux/actions/authentication_actions'

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

    // const dispatch = useDispatch()
    // const onCognitoUserSession = (JWT) => dispatch(postCognitoUserSession(JWT))

    // const refreshToken = useSelector(state => state.authenticationReducer.refreshToken)
    // const cognitoUserSession = useSelector(state => state.authenticationReducer.cognitoUserSession)

    const [signIn, setSignIn] = useState(true)

    const handleInitialLoad = () => {

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