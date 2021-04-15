import React, { useState } from 'react'

import {useHistory} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

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

// Get Auth from amplify
import { Auth, API } from "aws-amplify";
import {mapsByOrgId, usersbyId} from "../../graphql/queries";
import {createBlankMap, manageTaskQueue} from "../../graphql/mutations";
import {getMaps} from "../../api/map_api";
import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */
const SignInUpPage = (props) => {

    // Hooks
    const dispatch = useDispatch()
    const history = useHistory()

    // Dispatches
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = (settings) => dispatch(getLocalSettings(settings))

    const localReducer = useSelector(state => state.localReducer.localSettings)

    // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
    const {
        signIn
    } = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorText, setErrorText] = useState('')

    const [capsLock, setCapsLock] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleSignInChange(event) {
        // Here, we invoke the callback with the new value
        props.onChange(event);
    }

    const checkForUserInDB = async (user) => {        
        try{
            const data = await API.graphql({
                query: usersbyId,
                variables: { id: user.sub }
            })

            console.log("checkForUserInDB data",data)
            // data:
            //     UsersbyId:
            //         items: Array(1)
            // 0:
            // createdAt: "2021-04-14T22:32:52.221Z"
            // id: "e28dc68b-858f-4ec7-89ff-64c3b9fd5408"
            // organizationI

            const organizationId = data?.UsersbyId?.items[0]?.organizationId

            // get the maps for this org
            // const maps = await streamlinedGraphqlCall(TRANSFORMS.QUERY, mapsByOrgId, { organizationId })
            // console.log("checkForUserInDB maps",maps)

            // if no map then create one
            // if(!(maps.length)){

            console.log("sign in up organizationId",organizationId)
                await API.graphql({
                    query: createBlankMap,
                    variables: { organizationId: "baca" }
                })

            // }

            if(data.data.UsersbyId.items.length){
                return true
            }else{
                // dispatchPostLocalSettings({
                //     ...localReducer,
                //     authenticated: true,
                // });

                history.push('/organization');
            }
        }catch(err){
            console.log(err)
        }
    }

    const handleSubmit = async (values) => {

        const {
            email,
            password,
            confirmPassword
        } = values

        // If the request is a sign in then run these functions
        if (signIn) {
            try {
                let user = await Auth.signIn(email, password);

                let userData = await checkForUserInDB(user.attributes)

                if(userData){
                    dispatchPostLocalSettings({
                        ...localReducer,
                        authenticated: true,
                    });
                
                    history.push('/')
                
                ;}

            } catch (error) {
                console.log("error signing in", error);
                setErrorText(error.message)
            }
        } else {
            if (password === confirmPassword) {

                const username = email;
                try {
                    await Auth.signUp({
                        username,
                        password,
                        attributes: {
                            email
                        }
                    });

                    alert(
                        "You have sucessfully signed up. Please check your email for a verification link."
                    );
                    handleSignInChange(true);
                } catch (error) {
                    console.log("error signing up:", error);
                    setErrorText(error.message);
                }
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

                            <div style={{display: 'flex', flexDirection: 'row'}}>
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
