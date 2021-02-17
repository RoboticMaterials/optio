import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
// Import styles
import * as styled from './sign_in_up_page.style'

// Import actions
import { postCognitoUserSession } from '../../redux/actions/authentication_actions'

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */

const SignInUpPage = (props) => {

    const dispatch = useDispatch()

    const onCognitoUserSession = (JWT) => dispatch(postCognitoUserSession(JWT))

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = () => {

        // User pool data for AWS Cognito
        const poolData = {
            UserPoolId: 'us-east-2_YFnCIb6qJ',
            ClientId: '5bkenhii8f4mqv36k0trq6hgc7',
        }

        const userPool = new CognitoUserPool(poolData)

        // This is setting up the header for the sign in request
        const authenticationData = {
            Username: email,
            Password: password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData)

        const userData = {
            Username: email,
            Pool: userPool,
        }

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {

            onSuccess: function (result) {
                console.log('QQQQ Success', typeof(result), result.accessToken.payload)
                onCognitoUserSession(result.accessToken.payload)
            },

            onFailure: function (err) {
                console.log('QQQQ Error', err)
            },

        });
    }

    return (
            <styled.Container>

                <styled.InputContainer>

                <styled.Input
                    name={"email"}
                    placeholder='Email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <styled.Input
                    name={"password"}
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />

                </styled.InputContainer>

                <styled.Button onClick={signIn}> Login </styled.Button>

        </styled.Container>
    )
}

export default SignInUpPage
