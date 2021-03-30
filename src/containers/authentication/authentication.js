import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import * as styled from './authentication.style'

import { Link } from 'react-router-dom'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

import { useHistory, useParams } from 'react-router-dom'

// Import actions
import { postLocalSettings, getLocalSettings } from '../../redux/actions/local_actions'
import ForgotPassword from '../../components/forgotPassword/forgotPassword'

// Get Auth from amplify
import { Auth } from "aws-amplify";

/**
 * After the APIs have been loaded in the api_container this container is loaded
 * It checks to see if the user has already signed in based on whether or not a refresh token exists in cookies
 *
 * @param {authenticated} props
 */
const Authentication = (checkAuth) => {

    // Get all the hooks 
    const history = useHistory()
    const params = useParams()
    const dispatch = useDispatch()

    // Define state
    const [signIn, setSignIn] = useState(true)
    const [forgotPassword, setForgotPassword] = useState(false)

    const [organization, setOrganization] = useState(false)
    const [user, setUser] = useState(null);

    // Define all dispatched
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    // Define all useEffects

    useEffect(() => {
        checkUser();
        setAuthenticated()
    }, []);

    useEffect(() => {
        setAuthenticated()
    }, [user])

    useEffect(() => {
        if(history.location.pathname === '/'){
            setSignIn(true)
            setForgotPassword(false)
        }else if(history.location.pathname === '/forgot-password'){
            setForgotPassword(true)
        }else if(history.location.pathname === '/create-account'){
            setSignIn(false)
            setForgotPassword(false)
        }else if(history.location.pathname === '/organization'){
            setSignIn(false)
            setForgotPassword(false)

            setOrganization(true)
        }
    }, [params])

    // Define all neccessary functions
    const handleSignInChange = (value) => {
        setSignIn(value)
    }

   const checkUser = async () => {
       try{
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
       }catch{
           // USER NOT AUTHENTICATED
       }
    }

    const setAuthenticated = async () => {
        if (user) {
            const fetchedSettings = await dispatchGetLocalSettings()
            dispatchPostLocalSettings({
                ...fetchedSettings,
                authenticated: true,
            });
        }
    }

    // Return HTML
    return (
        <>
            { !organization &&
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
            }
        </>
    )
}

export default Authentication