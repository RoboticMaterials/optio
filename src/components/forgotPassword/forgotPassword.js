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

    const [resetPasswordVal, setResetPasswordVal] = useState(false)

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
                console.log('call result: ', result);
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

        console.log('here', values);

        try {

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

            const userData = {
                Username: email,
                Pool: userPool,
            }
        
            // setup cognitoUser first
            const cognitoUser = new CognitoUser(userData);
    
            // await cognitoUser.confirmPassword(verification, password)

            // call confirmPassword on cognitoUser
            cognitoUser.confirmPassword(verification, password, {
                onFailure(err) {
                    console.log(err);
                },
                onSuccess() {
                    console.log('sucess');
                    history.push('/login')
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
                email: true,
                verificationCode: true,
                password: true,
                checkPassword: true
            }}

            validateOnBlur={false}
            validateOnChange={true}

            // Chooses what schema to use based on whether it's a sign in or sign up
            validationSchema={resetPasswordVal ? passwordResetSchema : emailSchema }

            onSubmit={async (values, { setSubmitting }) => {

                setSubmitting(true)

                await handleSubmit(values)

                setSubmitting(false)

            }}

        >
            {(formikProps) => {

                return (
                  
                    <Form>
                            <styled.Container>

                                <styled.LogoContainer>
                                    <styled.LogoIcon className='icon-rmLogo' />
                                    <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
                                </styled.LogoContainer>

                                {!resetPasswordVal &&
                                <div>

                                    <styled.SignInUpContainer>
                                        Please provide your Email
                                    </styled.SignInUpContainer>
                                
                                    <styled.SignInUpContainer>
                                    You will get an email with a verification code to your email
                                    </styled.SignInUpContainer>

                                </div>
                                }

                                {resetPasswordVal &&
                                    <styled.SignInUpContainer>
                                        Please fill this out to reset your password:
                                    </styled.SignInUpContainer>
                                }
                                
                                    <TextField
                                        name={"email"}
                                        placeholder='Enter Email'
                                        type='text'
                                        InputComponent={Textbox}
                                        style={{
                                            marginBottom: '.5rem',
                                            height: '3rem',
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
                                            height: '3rem',
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
                                            height: '3rem',
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
                                            height: '3rem',
                                            width: '20rem'
                                        }}
                                    />
                                }

                                <styled.Button type="submit" style={{width: '20rem', margin: 0}}>Submit</styled.Button>

                            </styled.Container>
                        
                    
                        </Form>                        

                
                )
            }   
        }
    </Formik>
    )

}

export default ForgotPassword
