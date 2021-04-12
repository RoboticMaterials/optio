/**
 * This will show up if this is the user's first time signing in
 * It will then ask them for their
 * @param {authenticated} props 
 */

import React, {useState} from 'react'

import * as styled from './firstSignIn.style'

import { Formik, Form } from 'formik'

import { useHistory } from 'react-router-dom'

// Import Components
import TextField from '../basic/form/text_field/text_field'
import Textbox from '../basic/textbox/textbox'

// import the API category from Amplify library
import { API, Auth } from 'aws-amplify'

import { mapsByOrgId, orgsByKey } from '../../graphql/queries'

import { createBlankMap, createUser } from '../../graphql/mutations'

const FirstSignIn = () => {

    const [key] = useState('')

    const history = useHistory()

    const handleSubmit = async (key) => {

        try {
            const dataJson = await API.graphql({
                query: orgsByKey,
                variables: { key: key }
            })
    
            const userInput = await Auth.currentAuthenticatedUser();


            const user = {
                id: userInput.attributes.sub,
                organizationId: dataJson.data.OrgsByKey.items[0].organizationId,
                username: userInput.attributes.email
            }
            
            const userData = await API.graphql({
                query: createUser,
                variables: { input: user }
            })

            // get the maps for this org
            const maps = await API.graphql({
                query: mapsByOrgId,
                variables: { organizationId: userData.data.createUser.organizationId }
            })

            // if no map then create one
            if(maps.data.MapsByOrgId === null){
                await API.graphql({
                    query: createBlankMap,
                    variables: { organizationId: userData.data.createUser.organizationId }
                })
            }

            history.push('/');

            window.location.reload()
    
        } catch (error) {
            console.log(error);
        }
        
        
    }

    return (
        <Formik
            initialValues={{
                key: key,
            }}
            initialTouched={{
                key: true,
            }}

            onSubmit={async (values, { setSubmitting }) => {

                setSubmitting(true)

                await handleSubmit(values.key)

                setSubmitting(false)

            }}

        >
    {() => {

        return (
            <>
                <styled.Container>

                    <styled.LogoContainer>
                        <styled.LogoIcon className='icon-rmLogo' />
                        <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
                    </styled.LogoContainer>

                    <h1> Please provide us with your organizations key </h1>

                    <Form>

                        <TextField
                            name={"key"}
                            placeholder='Enter Key'
                            type='text'
                            InputComponent={Textbox}
                            style={{
                                marginBottom: '.5em',
                                height: '3rem'
                            }}
                        />

                        <styled.Button type="submit"> Submit </styled.Button>
                    
                    </Form>

                    
                </styled.Container>
            </>
        )
    }
}
</Formik>
    )
}

export default FirstSignIn


// import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'

// import * as styled from './authentication.style'

// // Import components
// import SignInUpPage from '../../components/sign_in_up_page/sign_in_up_page'

// // Import actions
// import { postLocalSettings } from '../../redux/actions/local_actions'

// // Get Auth from amplify
// import { Auth } from "aws-amplify";

/**
 * After the APIs have been loaded in the api_container this container is loaded
 * It checks to see if the user has already signed in based on whether or not a refresh token exists in cookies
 * If there is a token, it uses that to get a new JWT and uses that to make sure the session is valid, no reason to sign in if there's a valid session. 
 * If the refresh token is expired, you have to sign in again
 * If there is no token, the user either has to sign in or sign up 
 * Authenticated props is used for telling APP.js the user is authenticated
 * 
 * TODO: Should show loading when there is a refresh token and its being used to get new JWT credntials
 * TODO: Styling updates
 * TODO: Forgot password
 * TODO: Add HTTPS connection to server which allows for the use of a secure cookie. Increases security a lot 
 * @param {authenticated} props 
 */
// const Authentication = () => {

//     const dispatch = useDispatch()

//     const [signIn, setSignIn] = useState(true)

//     const [user, setUser] = useState(null);

//     const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
//     const localReducer = useSelector(state => state.localReducer.localSettings)

//     const handleSignInChange = (value) => {
//         setSignIn(value)
//     }

//     useEffect(() => {
//         checkUser();
//       }, []);
    
//    const checkUser = async () => {
//        try{
//         const user = await Auth.currentAuthenticatedUser();
//         setUser(user);
//        }catch{
//            // USER NOT AUTHENTICATED
//        }
//     }

//     const handleInitialLoad = () => {
//         if (user) {
//             dispatchPostLocalSettings({
//                 ...localReducer,
//                 authenticated: true,
//             });
//         }

//         return (
//             <styled.Container>

//                 <styled.LogoContainer>
//                     <styled.LogoIcon className='icon-rmLogo' />
//                     <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
//                 </styled.LogoContainer>

//                 <styled.LogoWelcome> Wecome Back </styled.LogoWelcome>

//                 <styled.CheckBoxWrapper>
//                     <styled.Button
//                         onClick={() => setSignIn(true)}
//                         selected={signIn}
//                         style={{borderRadius: '.5rem 0  0 .5rem'}}
//                     >
//                         Sign In
//                     </styled.Button>

//                     <styled.Button
//                         onClick={() => setSignIn(false)}
//                         selected={!signIn}
//                         style={{borderRadius: '0 .5rem .5rem 0'}}
//                     >
//                         Sign Up
//                     </styled.Button>
//                 </styled.CheckBoxWrapper>

//                 <styled.SignInUpContainer>

//                     <SignInUpPage
//                         signIn={signIn}
//                         onChange={handleSignInChange} />

//                 </styled.SignInUpContainer>
//             </styled.Container>
//         )
//     }

//     return (
//         handleInitialLoad()
//     )

// }

// export default Authentication