import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import { Formik, Form } from 'formik'

// Import Utils
import { signInSchema, getSignUpSchema } from '../../methods/utils/form_schemas'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

import * as styled from './sign_in_up_page.style'

import { loaderCSS } from './sign_in_up_page.style'

import PropagateLoader from "react-spinners/PropagateLoader";

// Import actions
import { postLocalSettings, getLocalSettings, updateLocalSettingsState } from '../../redux/actions/local_actions'

import configData from '../../settings/config'

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */
const SignInUpPage = (props) => {

    // Hooks
    const dispatch = useDispatch()
    const history = useHistory()

    // Dispatches
    const dispatchUpdateLocalSettings = (settings) => dispatch(updateLocalSettingsState(settings))
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = (settings) => dispatch(getLocalSettings(settings))

    const localReducer = useSelector(state => state.localReducer.localSettings)

    // Check to see if we want authentication *** Dev ONLY ***
    if (!configData.authenticationNeeded) {
        const localSettingsPromise = dispatchGetLocalSettings()
        localSettingsPromise.then(response => {
            dispatchUpdateLocalSettings({
                ...response,
                authenticated: 'no',
            })
        })

    }

    // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
    const {
        signIn
    } = props

    const [email, setEmail] = useState('')
    const [accessCode, setAccessCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorText, setErrorText] = useState('')
    const [successText, setSuccessText] = useState('')

    const [capsLock, setCapsLock] = useState(false)
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
        console.log(userPool)

        // If the request is a sign in then run these functions
        if (signIn) {

            // This is setting up the header for the sign in request
            const authenticationData = {
                Username: email,
                Password: password,
            };

            const authenticationDetails = new AuthenticationDetails(authenticationData)
            console.log(authenticationDetails)

            const userData = {
                Username: email,
                Pool: userPool,
            }

            const cognitoUser = new CognitoUser(userData);
            console.log(cognitoUser.pool)

            cognitoUser.authenticateUser(authenticationDetails, {

                onSuccess: function (result) {
                    dispatchUpdateLocalSettings({
                        authenticated: result.accessToken.payload.username,
                        idToken: result?.idToken?.jwtToken || null
                    })

                },

                onFailure: function (err) {
                    setErrorText(err.message)
                    setLoading(false)
                },

            });
        } else {
            if (password === confirmPassword) {
                userPool.signUp(email, password, [{Name: 'email', Value: email}], null, (err, data) => {
                    if (err) {
                        if (err.message === 'Invalid version. Version should be 1') {
                            setErrorText('Invalid email. Please use a valid email.')
                            setSuccessText('')
                            setLoading(false)
                        } else {
                            setErrorText(err.message)
                            setSuccessText('')
                            setLoading(false)
                        }
                    } else {
                        setErrorText('')
                        setSuccessText('You have successfully signed up! Please check you email for a verification link.')
                        history.push('/')
                        handleSignInChange(true)
                        setLoading(false)
                    }
                });
            } else {
                setErrorText('Passwords must match!')
                setLoading(false)
            }
        }
    }

    return (
        <Formik
            initialValues={{
                email: email,
                accessCode: accessCode,
                password: password,
                confirmPassword: confirmPassword,
            }}
            initialTouched={{
                email: true,
                accessCode: true,
                password: true,
                confirmPassword: true,
            }}

            validateOnBlur={false}
            validateOnChange={false}

            // Chooses what schema to use based on whether it's a sign in or sign up
            validationSchema={signIn ? signInSchema : getSignUpSchema(configData.ClientId)}

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
                                if (keyEvent.keyCode === 20 || Event.KEY === "CapsLock") {
                                    setCapsLock(!capsLock)
                                }
                                else {
                                    if (keyEvent.getModifierState("CapsLock")) {
                                        setCapsLock(true)
                                    } else {
                                        setCapsLock(false)
                                    }
                                }
                            }
                        }
                    >
                        <styled.Container>
                            <styled.ErrorText>
                                {errorText}
                            </styled.ErrorText>
                            <styled.SuccessText>
                                {successText}
                            </styled.SuccessText>
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

                            {!signIn &&
                                <TextField
                                    name={"accessCode"}
                                    placeholder='Enter Access Code'
                                    InputComponent={Textbox}
                                    style={{
                                        marginBottom: '.5rem',
                                        flexGrow: 1
                                    }}
                                />
                            }

                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                {capsLock && <styled.CapsIconContainer><styled.CapsIcon className="fas fa-arrow-alt-circle-up" /></styled.CapsIconContainer>}
                                <TextField
                                    name={"password"}
                                    placeholder='Enter Password'
                                    type='password'
                                    InputComponent={Textbox}
                                    style={{
                                        marginBottom: '.5rem',
                                        flexGrow: 1
                                    }}
                                />
                            </div>

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
                                    Note: Your password must be 8 charaters long and contain 1 upper case letter, 1 lower case letter, and 1 number
                                </styled.NoteText>
                            }

                            {!loading &&
                                <styled.Button isSignIn={signIn} type="submit">{signIn ? 'Sign In' : 'Sign Up'}</styled.Button>
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
