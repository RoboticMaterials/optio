import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useHistory } from 'react-router-dom'

import { Formik, Form } from 'formik'

// Import Utils
import { signInSchema, signUpSchema } from '../../methods/utils/form_schemas'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

import * as styled from './sign_in_up_page.style'

// Import actions
import { postLocalSettings } from '../../redux/actions/local_actions'

// Get Auth from amplify
import { Auth, API } from "aws-amplify";
import { usersbyId } from "../../graphql/queries";

/**
 * This page handles both sign in and sign up for RMStudio
 * @param {signIn} props
 */
const SignInUpPage = (props) => {

    const dispatch = useDispatch()
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const localReducer = useSelector(state => state.localReducer.localSettings)

    const history = useHistory()

    // signIn prop is passed from authentication container to tell this page to show sign in or sign up components
    const {
        signIn
    } = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

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

            if(data.data.UsersbyId.items.length){
                return true
            }else{
                history.push('/login/organization');
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
                    alert(error.message);
                }
            } else {
                alert('Passwords must match!')
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

            onSubmit={async (values, { setSubmitting }) => {

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
                            placeholder='Enter Email'
                            type='text'
                            InputComponent={Textbox}
                            style={{
                                marginBottom: '.5em',
                                height: '3rem'
                            }}
                        />

                        <TextField
                            name={"password"}
                            placeholder='Enter Password'
                            type='password'
                            InputComponent={Textbox}
                            style={{
                                marginBottom: '.5rem',
                                height: '3rem'
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
                                    height: '3rem'
                                }}
                            />
                        }

                        {!signIn &&
                                <styled.NoteText>
                                    Note: Your password must be 8 charaters long and contain 1 upper case letter, 1 lower case letter, 1 number and 1 special character
                                </styled.NoteText>
                        }


                        <styled.Container>
                            <styled.Button type="submit">{signIn ? 'Sign In' : 'Sign Up'}</styled.Button>
                        </styled.Container>
                    </Form>
                )
            }}

        </Formik>
    )
}

export default SignInUpPage
