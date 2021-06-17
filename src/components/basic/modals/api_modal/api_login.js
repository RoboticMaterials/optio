import React, { useState } from 'react';
import { Formik, Form } from 'formik'

import * as modalStyle from '../modals.style'
import * as styled from './api_modal.style'
import { loaderCSS } from './api_modal.style'

// Import Components
import TextField from '../../form/text_field/text_field'
import Textbox from '../../textbox/textbox'
import PropagateLoader from "react-spinners/PropagateLoader";

import { signInSchema } from '../../../../methods/utils/form_schemas'
import api_logos from '../../../../graphics/api_logos'

const ApiLogin = (props) => {

    const {
        endpoint
    } = props;

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorText, setErrorText] = useState('')

    const [capsLock, setCapsLock] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (values) => {
        console.log('Login!')
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <styled.AccountLogo src={api_logos[endpoint.replace(/\s+/g, '_').toLowerCase()]} />
            <modalStyle.Title>{endpoint} Log In</modalStyle.Title>
            <Formik
                initialValues={{
                    username: username,
                    password: password,
                }}
                initialTouched={{
                    username: true,
                    password: true,
                }}
    
                validateOnBlur={false}
                validateOnChange={false}
    
                // Chooses what schema to use based on whether it's a sign in or sign up
                validationSchema={signInSchema}
    
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
                                    name={"username"}
                                    placeholder='Enter Username'
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
    
                                {!loading &&
                                    <styled.Button type="submit">{'Sign In'}</styled.Button>
                                }
    
                                {loading &&
                                    <PropagateLoader color={'red'} loading={true} css={loaderCSS} />
                                }
    
                            </styled.Container>
                        </Form>
                    )
                }}
    
            </Formik>
        </div>
    )

}

export default ApiLogin;