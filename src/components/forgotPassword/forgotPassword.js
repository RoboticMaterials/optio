import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as styled from './forgotPassword.style'

import { Formik, Form } from 'formik'

// Get Auth from amplify
import { Auth } from "aws-amplify";

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

    const [errorText, setErrorText] = useState('')

    function resetPassword(email) {
        // Send confirmation code to user's email
        Auth.forgotPassword(email)
            .then(() => {
                setResetPasswordVal(true)
            })
            .catch(err => setErrorText(err));
    }
    
    // confirmPassword can be separately built out as follows...  
    async function confirmPassword(values) {

        const {
            email,
            verification,
            password
        } = values

   
        // Collect confirmation code and new password, then
        Auth.forgotPasswordSubmit(email, verification, password)
            .then(() =>{
                setErrorText('You have sucessfully changed your pasword!')
                history.push('/')
            })
            .catch(err => console.log(err));
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

                            <styled.ErrorText>
                                {errorText}
                            </styled.ErrorText>
                        
                            <TextField
                                name={"email"}
                                placeholder='Enter Email'
                                type='text'
                                InputComponent={Textbox}
                                style={{
                                    marginBottom: '.5rem',
                                    width: '25rem'
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
                                        width: '25rem'
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
                                        width: '25rem'
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
                                        width: '25rem'
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
