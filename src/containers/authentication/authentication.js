import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

// Import components
import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'
import ForgotPassword from '../../components/forgotPassword/forgotPassword'
import { ReactComponent as OptioLogo } from '../../graphics/icons/optioFull.svg'
import { Link } from 'react-router-dom'
import * as styled from './authentication.style'

// Authentication
import configData from '../../settings/config'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

// Import actions
import { postLocalSettings, getLocalSettings, updateLocalSettingsState } from '../../redux/actions/local_actions'
import { uuidv4 } from '../../methods/utils/utils'


/**
 * After the APIs have been loaded in the api_container this container is loaded
 * It checks to see if the user has already signed in based on whether or not a refresh token exists in cookies
 * @param {mobileMode} props
 */
const Authentication = (props) => {

    const {
        mobileMode
    } = props

    const history = useHistory()
    const params = useParams()

    const dispatch = useDispatch()

    const [signIn, setSignIn] = useState(true)
    const [forgotPassword, setForgotPassword] = useState(false)

    const dispatchUpdateLocalSettings = (settings) => dispatch(updateLocalSettingsState(settings))
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
        if (!configData.authenticationNeeded) {

            dispatchUpdateLocalSettings({
                authenticated: 'no'
            })

            

        } else {
            var poolData = {
                UserPoolId: configData.UserPoolId,
                ClientId: configData.ClientId,
                Region: configData.Region
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
                        console.log(session.getAccessToken().getJwtToken())
                        dispatchUpdateLocalSettings({
                            authenticated:true,
                            idToken: session.getAccessToken().getJwtToken() || null
                        })
                    }
                });
                
               /*cognitoUser.getUserAttributes(function(err,result){ //getUserAttributes
                    if (err) {
                        alert(err.message || JSON.stringify(err));
                        return;
                    }

                    result.map(res =>{
                        console.log(
                            'attribute ' + res.getName() + ' has value ' + res.getValue()
                        )
                    });

                });*/
                
            }




        }
    }

    return (
        <styled.Page className={mobileMode ? '' : 'signin-page'}>
            <styled.Container mobileMode={mobileMode}>

                <styled.LogoContainer>
                    <OptioLogo preserveAspectRatio="xMinYMid meet" height="100%" width="100%"/>
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
