import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import { Formik, Form } from 'formik'

// Import Utils
import { signInSchema, signUpSchema } from '../../methods/utils/form_schemas'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

// Import actions
import { postRefreshToken } from '../../redux/actions/authentication_actions'

// Import API DELETE THIS ONCE FINISHED
import { getRefreshToken } from '../../api/authentication_api'

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props 
 */
const SignInUpPage = (props) => {

    // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
    const {
        signIn
    } = props

    const dispatch = useDispatch()
    const onRefreshToken = (token, expiration) => dispatch(postRefreshToken(token, expiration))
    const refreshToken = useSelector(state => state.authenticationReducer.refreshToken)

    const [email, setEmail] = useState('kalervo@roboticmaterials.com')
    const [password, setPassword] = useState('Qwerty1.')

    // Handles submit to AWS cognito based on whether it's a sign in or sign up
    const handleSubmit = async (values) => {

        const {
            email,
            password
        } = values

        // User pool data for AWS Cognito
        const poolData = {
            UserPoolId: 'us-east-2_YFnCIb6qJ',
            ClientId: '4dghjc830130pdnr9aecshpc13',
        }

        const userPool = new CognitoUserPool(poolData)

        // If the request is a sign in then run these functions
        if (signIn) {

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
                    console.log('QQQQ Success', typeof(result), result)
                    // const accessToken = result.getAccessToken().getJwtToken();

                    const returnedRefreshToken = result.getRefreshToken().getToken()

                    onRefreshToken(returnedRefreshToken)

                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
                    const idToken = result.idToken.jwtToken;
                },

                onFailure: function (err) {
                    console.log('QQQQ Error', err)
                },

            });
        }

        // Else it must be a sign up so run these functions
        else {
            userPool.signUp(email, password, [], null, (err, data) => {
                if (err) console.log('QQQQ Error', err)
                else console.log('QQQQ Success', data)
            });
        }
    }


    return (
        <Formik
            initialValues={{
                email: email,
                password: password,
                confirmPassword: password,
            }}
            initialTouched={{
                email: true,
                password: true,
                confirmPassword: true,
            }}
            validateOnChange={true}
            validateOnMount={true}
            validateOnBlur={true}
            // Chooses what schema to use based on whether it's a sign in or sign up
            // TODO: The schemas are not 100% working as of 9/14/2020. Need to figure out regex for passwords
            validationSchema={signIn ? signInSchema : signUpSchema}

            onSubmit={async (values, { setSubmitting }) => {
                console.log('QQQQ Submiting', values)
                setSubmitting(true)

                await handleSubmit(values)

                setSubmitting(false)
            }}

        >
            {(formikProps) => {

                return (
                    <Form>
                        <TextField
                            name={"email"}
                            textStyle={{ fontWeight: 'Bold' }}
                            placeholder='Enter Email'
                            type='text'
                            InputComponent={Textbox}
                            inputProps={{
                                style: {
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    marginBottom: '.5rem',
                                    marginTop: '0',
                                }
                            }}
                        />

                        <TextField
                            name={"password"}
                            textStyle={{ fontWeight: 'Bold' }}
                            placeholder='Enter Password'
                            type='text'
                            InputComponent={Textbox}
                            inputProps={{
                                style: {
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    marginTop: '0',
                                    marginBottom: '.5rem',
                                }
                            }}
                        />

                        {/* If sign in hasn't been selected show a confirm password for sign up */}
                        {!signIn &&
                            <TextField
                                name={"confirmPassword"}
                                // disabled={dashboard.name === 'Robot Screen'}
                                textStyle={{ fontWeight: 'Bold' }}
                                placeholder='Enter Password'
                                type='text'
                                InputComponent={Textbox}
                                inputProps={{
                                    style: {
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        marginBottom: '.5rem',
                                        marginTop: '0',
                                    }
                                }}
                            />


                        }


                        <button type="submit">{signIn ? 'Sign In' : 'Sign Up'}</button>
                    </Form>
                )
            }}

        </Formik>
    )
}

export default SignInUpPage