import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import { Formik, Form } from 'formik'

// Import Utils
import { signInSchema, signUpSchema } from '../../methods/utils/form_schemas'

// Import Components
// import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

// Import actions
import { postRefreshToken } from '../../redux/actions/authentication_actions'

import * as styled from './sign_in_up_page.style'

// Import actions
import { postLocalSettings } from '../../redux/actions/local_actions'
import { getLocalSettings } from '../../redux/actions/local_actions'


// Import API DELETE THIS ONCE FINISHED
// import { getRefreshToken } from '../../api/authentication_api'

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
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const localReducer = useSelector(state => state.localReducer.localSettings)

    // refresh token
    // const onRefreshToken = (token, expiration) => dispatch(postRefreshToken(token, expiration))
    // const refreshToken = useSelector(state => state.authenticationReducer.refreshToken)

    // const onGetLocalSettings = () => dispatch(getLocalSettings())

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // useEffect( () => {
    //     async function checkLocalSettings() {
    //         // Get local storage
    //         const localSettings = await onGetLocalSettings()

    //         // See if authenticated is not null
    //         if (localSettings.authenticated){
    //             // If so, assume logged in
    //             setLoggedIn(true)
    //         }
    //         // Else, require login
    //       }

    //     checkLocalSettings()
            
    // }, [])

    const handleSubmit = () => {

        // User pool data for AWS Cognito
        const poolData = {
            UserPoolId: 'us-east-2_YFnCIb6qJ',
            ClientId: '5bkenhii8f4mqv36k0trq6hgc7',
        }

        const userPool = new CognitoUserPool(poolData)

        console.log(email, password, confirmPassword)
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

            let serverIP = '18.223.113.55'

            cognitoUser.authenticateUser(authenticationDetails, {

                onSuccess: function (result) {
                    dispatchPostLocalSettings({
                        ...localReducer,
                        authenticated: result.accessToken.payload.username,
                        non_local_api_ip: serverIP,
                        non_local_api: true,
                        refreshToken: result.getRefreshToken().getToken()
                    })

                    // onRefreshToken(result.getRefreshToken().getToken())

                    console.log('QQQQ Success', typeof(result), result.accessToken.payload, localReducer)

                },

                onFailure: function (err) {
                    console.log('QQQQ Error', err)
                },

            });
        }else{
            if(password === confirmPassword){
                userPool.signUp(email, password, [], null, (err, data) => {
                    if (err){
                        console.log('QQQQ Error', err)
                        alert(err.message)
                    }else {
                        console.log('QQQQ Success', data)

                    }
                });
            }else{
                alert('Passwords must match!')
            }

            
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
                        <styled.Container>
                        <styled.Input
                            name={"email"}
                            // textStyle={{ fontWeight: 'Bold' }}
                            placeholder='Enter Email'
                            type='text'
                            InputComponent={Textbox}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <styled.Input
                            name={"password"}
                            // textStyle={{ fontWeight: 'Bold' }}
                            placeholder='Enter Password'
                            type='password'
                            InputComponent={Textbox}
                            onChange={e => setPassword(e.target.value)}
                        />

                        {/* If sign in hasn't been selected show a confirm password for sign up */}
                        {!signIn &&
                            <styled.Input
                                name={"confirmPassword"}
                                // disabled={dashboard.name === 'Robot Screen'}
                                // textStyle={{ fontWeight: 'Bold' }}
                                placeholder='Enter Password'
                                type='password'
                                InputComponent={Textbox}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />


                        }

                        <styled.Button onClick={handleSubmit} type="button">{signIn ? 'Sign In' : 'Sign Up'}</styled.Button>

                        </styled.Container>
                    </Form>
                )
            }}

        </Formik>
    )
}

export default SignInUpPage

// import React, { useState, useEffect } from 'react'

// import { useDispatch, useSelector } from 'react-redux'

// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
// // Import styles
// import * as styled from './sign_in_up_page.style'

// // Import actions
// import { postLocalSettings } from '../../redux/actions/local_actions'
// import { getLocalSettings } from '../../redux/actions/local_actions'

// /**
//  * This page handles both sign in and sign up for RMStudio
//  * @param {signIn} props
//  */

// const SignInUpPage = (props) => {

//     const dispatch = useDispatch()
//     const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
//     const localReducer = useSelector(state => state.localReducer.localSettings)

//     const onGetLocalSettings = () => dispatch(getLocalSettings())

//     const [loggedIn, setLoggedIn] = useState(false)
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')


//     useEffect( () => {
//         async function checkLocalSettings() {
//             // Get local storage
//             const localSettings = await onGetLocalSettings()

//             // See if authenticated is not null
//             if (localSettings.authenticated){
//                 // If so, assume logged in
//                 setLoggedIn(true)
//             }
//             // Else, require login
//           }

//         checkLocalSettings()
            
//     }, [])

//     const signIn = () => {

//         // User pool data for AWS Cognito
//         const poolData = {
//             UserPoolId: 'us-east-2_YFnCIb6qJ',
//             ClientId: '5bkenhii8f4mqv36k0trq6hgc7',
//         }

//         const userPool = new CognitoUserPool(poolData)

//         // This is setting up the header for the sign in request
//         const authenticationData = {
//             Username: email,
//             Password: password,
//         };

//         const authenticationDetails = new AuthenticationDetails(authenticationData)

//         const userData = {
//             Username: email,
//             Pool: userPool,
//         }

//         const cognitoUser = new CognitoUser(userData);

//         let serverIP = '18.223.113.55'

//         cognitoUser.authenticateUser(authenticationDetails, {

//             onSuccess: function (result) {
//                 dispatchPostLocalSettings({
//                     ...localReducer,
//                     authenticated: result.accessToken.payload.username,
//                     non_local_api_ip: serverIP,
//                     non_local_api: true
//                 })

//                 console.log('QQQQ Success', typeof(result), result.accessToken.payload, localReducer)

//             },

//             onFailure: function (err) {
//                 console.log('QQQQ Error', err)
//             },

//         });
//     }

//     return (
//             <styled.Container>
                
//                 {!loggedIn && <styled.Input
//                     name={"email"}
//                     placeholder='Email'
//                     type='email'
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                 />}
//                 {!loggedIn && 
//                 <styled.Input
//                     name={"password"}
//                     placeholder='Password'
//                     type='password'
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     />
//                 }


//                 {!loggedIn && <styled.Button onClick={signIn}> Login </styled.Button>}

//             </styled.Container>
//     )
// }

// export default SignInUpPage
