import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as styled from './forgotPassword.style'

import { Formik, Form } from 'formik'

import configData from '../../settings/config'

import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

import {useHistory} from "react-router-dom";

import { emailSchema, passwordResetSchema } from '../../methods/utils/form_schemas'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

/**
 * 
 * @param {} props
 */
const ForgotPassword = (props) => {

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('')

    const [enableValidation, setEnableValidation] = useState(false)

    const [resetPasswordVal, setResetPasswordVal] = useState(false)

    const [warning, setWarning] = useState(false)


    var poolData = {
        UserPoolId: configData.UserPoolId,
        ClientId: configData.ClientId,
    };

    function resetPassword(email) {

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        const userData = {
            Username: email,
            Pool: userPool,
        }
    
        // setup cognitoUser first
        const cognitoUser = new CognitoUser(userData);
    
        // call forgotPassword on cognitoUser
        cognitoUser.forgotPassword({
            onSuccess: function(result) {
                setResetPasswordVal(true)
            },
            onFailure: function(err) {
                console.log(err);
            }
        });
    }
    
    // confirmPassword can be separately built out as follows...  
    async function confirmPassword(values) {

        const {
            email,
            verification,
            password
        } = values

        try {

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

            const userData = {
                Username: email,
                Pool: userPool,
            }
        
            // setup cognitoUser first
            const cognitoUser = new CognitoUser(userData);
    
            // call confirmPassword on cognitoUser
            cognitoUser.confirmPassword(verification, password, {
                onFailure(err) {
                    console.log(err);
                    alert(err.message)
                },
                onSuccess() {
                    alert('You have sucessfully changed your password!')
                    history.push('/')
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (values) => {
            if (resetPasswordVal) {
                confirmPassword(values)
            }else{
                resetPassword(values.email)
            }
    }

    return (
        <Formik
            initialValues={{
                email: email,
                verificationCode: verificationCode,
                password: password,
                checkPassword: checkPassword
            }}

            initialTouched={{
                email: false,
                verificationCode: false,
                password: false,
                checkPassword: false
            }}

            enableReinitialize

            validateOnBlur={enableValidation}
            validateOnChange={enableValidation}

            // Chooses what schema to use based on whether it's a sign in or sign up
            validationSchema={resetPasswordVal ? passwordResetSchema : emailSchema }

            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)

                await handleSubmit(values)

                setSubmitting(false)
                setEnableValidation(false)
            }}
        >
            {(formikProps) => {

                if(formikProps.errors.email || formikProps.errors.verificationCode || formikProps.errors.password || formikProps.errors.checkPassword){
                    setEnableValidation(true)
                }

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

                        <styled.SignInUpContainer>
                            {resetPasswordVal ? 
                            'Please fill this form to reset your password:' 
                            : 
                            'Please provide your email. You will recieve a verification code there shortly.'}
                        </styled.SignInUpContainer>

                        <styled.SignInUpContainer>
                    
                        <TextField
                            name={"email"}
                            placeholder='Enter Email'
                            type='text'
                            InputComponent={Textbox}
                            style={{
                                marginBottom: '.5rem',
                                width: '20rem'
                            }}
                        />

                        {resetPasswordVal &&
                            <TextField
                                name={"verification"}
                                placeholder='Verification Code'
                                type='text'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5rem',
                                    width: '20rem'
                                }}
                            />
                        }

                        {resetPasswordVal &&
                            <TextField
                                name={"password"}
                                placeholder='Enter Password'
                                type='password'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5rem',
                                    width: '20rem'
                                }}
                            />
                        }

                        {resetPasswordVal &&
                            <TextField
                                name={"checkPassword"}
                                placeholder='Check Password'
                                type='password'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5rem',
                                    width: '20rem'
                                }}
                            />
                        } 

                        {warning && <styled.NoteText>Caps Lock On!</styled.NoteText>}

                        <styled.Button type="submit">Submit</styled.Button>

                        </styled.SignInUpContainer>


                    </Form>                        
                )
            }   
        }
    </Formik>
    )

}

export default ForgotPassword
