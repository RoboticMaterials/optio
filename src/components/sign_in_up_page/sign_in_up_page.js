import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import { Formik, Form } from 'formik'

// Import Utils
import { signInSchema, signUpSchema } from '../../methods/utils/form_schemas'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

import * as styled from './sign_in_up_page.style'

import {loaderCSS} from './sign_in_up_page.style'

import PropagateLoader from "react-spinners/PropagateLoader";

// Import actions
import { postLocalSettings, getLocalSettings, } from '../../redux/actions/local_actions'

import configData from '../../settings/config'
import { Block } from '@material-ui/icons'

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */
const SignInUpPage = (props) => {

    const dispatch = useDispatch()
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = (settings) => dispatch(getLocalSettings(settings))

    const localReducer = useSelector(state => state.localReducer.localSettings)

    // Check to see if we want authentication *** Dev ONLY ***
    if (!configData.authenticationNeeded) {
        const localSettingsPromise = dispatchGetLocalSettings()
        localSettingsPromise.then(response => {
            dispatchPostLocalSettings({
                ...response,
                authenticated: 'no',
                //non_local_api_ip: window.location.hostname,
                //non_local_api: true,
            })
        })

    }

    // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
    const {
        signIn
    } = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [warning, setWarning] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleSignInChange(event) {
        // Here, we invoke the callback with the new value
        props.onChange(event);
    }

    const handleSubmit = (values) => {

        const {
            email,
            password,
            confirmPassword
        } = values

        // User pool data for AWS Cognito
        const poolData = {
            UserPoolId: configData.UserPoolId,
            ClientId: configData.ClientId,
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
                    dispatchPostLocalSettings({
                        ...localReducer,
                        authenticated: result.accessToken.payload.username,
                        non_local_api_ip: window.location.hostname,
                        non_local_api: true,
                        refreshToken: true
                    })


                },

                onFailure: function (err) {
                    alert(err.message)
                    setLoading(false)
                },

            });
        } else {
            if (password === confirmPassword) {
                userPool.signUp(email, password, [], null, (err, data) => {
                    if (err) {
                        if (err.message === 'Invalid version. Version should be 1') {
                            alert('Invalid email. Please use a valid email.')
                        } else {
                            alert(err.message)
                            setLoading(false)
                        }
                    } else {
                        alert('You have sucessfully signed up! Please check you email for a verification link.')
                        handleSignInChange(true)
                    }
                });
            } else {
                alert('Passwords must match!')
                setLoading(false)
            }
        }
    }

    return (
        <Formik
            initialValues={{
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }}
            initialTouched={{
                email: true,
                password: true,
                confirmPassword: true,
            }}

            validateOnBlur={false}
            validateOnChange={false}

            // Chooses what schema to use based on whether it's a sign in or sign up
            validationSchema={signIn ? signInSchema : signUpSchema}

            onChange={() => {
                console.log('changing');
              }}

            onSubmit={async (values, { setSubmitting }) => {

                setSubmitting(true)
                setLoading(true)

                await handleSubmit(values)

                setSubmitting(false)
            }}

        >
            {(formikProps) => {

                return (
                    <Form
                        onKeyDown={
                            (keyEvent) => {
                                if(keyEvent.keyCode === 20 || Event.KEY === "CapsLock") {
                                    setWarning(!warning)
                                }
                                else {
                                    if (keyEvent.getModifierState("CapsLock")) {
                                        setWarning(true)
                                    } else {
                                        setWarning(false)
                                    }
                                }
                            }
                        }
                    >
                        <styled.Container>
                            <TextField
                                name={"email"}
                                placeholder='Enter Email'
                                type='text'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5em',
                                    width: '25rem'
                                }}
                            />

                            <TextField
                                name={"password"}
                                placeholder='Enter Password'
                                type='password'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5rem',
                                    width: '25rem'
                                }}
                            />

                            {/* If sign in hasn't been selected show a confirm password for sign up */}
                            {!signIn &&
                                <TextField
                                    name={"confirmPassword"}
                                    placeholder='Enter Password'
                                    type='password'
                                    InputComponent={Textbox}
                                    style={{
                                        marginBottom: '.5rem',
                                        width: '25rem'
                                    }}
                                />
                            }

                            {!signIn &&
                                <styled.NoteText>
                                    Note: Your password must be 8 charaters long and contain 1 upper case letter, 1 lower case letter, 1 number and 1 special character
                                </styled.NoteText>
                            }

                            {warning && <styled.NoteText>Caps Lock On!</styled.NoteText>}

                            {!loading &&
                                <styled.Button type="submit">{signIn ? 'Sign In' : 'Sign Up'}</styled.Button>
                            }

                            {loading &&
                                <PropagateLoader color={'red'} loading={true} css={loaderCSS} />
                            }

                        </styled.Container>
                    </Form>
                )
            }}

        </Formik>
    )
}

export default SignInUpPage
