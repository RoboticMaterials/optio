import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import { useHistory } from "react-router";

import { useDispatch, useSelector } from 'react-redux'

import * as styled from './account_page.style'
import MoonLoader from "react-spinners/MoonLoader"
import { getUser } from '../../redux/actions/user_actions'

import { getOrg } from '../../redux/actions/organization_actions'

import { Auth }  from 'aws-amplify'

import { postLocalSettings, getLocalSettings } from '../../redux/actions/local_actions'

const AccountPage = (props) => {

    const {

    } = props

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchGetUser = async (userId) => await dispatch(getUser(userId))
    const dispatchGetOrganization = async (orgId) => await dispatch(getOrg(orgId))

    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    const [userData, setUserData] = useState({})
    const [username, setUsername] = useState("")
    const [organizationName, setOrganizationName] = useState("")
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        const cognitoUser = await Auth.currentAuthenticatedUser()

        const dbUser = await dispatchGetUser(cognitoUser.attributes.sub)

        const userOrganization = await dispatchGetOrganization(dbUser.organizationId)
        const {
            name: orgName = ""
        } = userOrganization || {}
        setOrganizationName(orgName)

        const {
            username,
            organizationId
        } = dbUser || {}

        setUsername(username)

        setLoaded(true)
    }

    const saveSettings = () => {
        console.log('saved the settings');
    }

    const localReducer = useSelector((state) => state.localReducer.localSettings);

    const logOut =  async () => {
        try {
            await Auth.signOut({ global: true });
          } catch (error) {
            console.log("error signing out: ", error);
          }

          await dispatchPostLocalSettings({
            ...localReducer,
            authenticated: false,
          });

        history.push('/')
    }

    return (
        <styled.Container>
            {loaded ?
            <>
            <styled.ProfileContainer>
            <styled.ProfileIcon
                className={"far fa-user-circle"}
                color="grey"
            />
            <styled.Username>{username}</styled.Username>
        </styled.ProfileContainer>

        <styled.ContentContainer>
            <styled.SettingSection>
                <styled.SettingLabel>Organization</styled.SettingLabel>
                <styled.SettingRow>
                    <styled.SettingValue>{organizationName}</styled.SettingValue>

                </styled.SettingRow>
                
            </styled.SettingSection>

            <styled.ButtonForm>

                    <styled.Button
                        onClick={saveSettings}
                    >Save Settings </styled.Button>

                    <styled.Button
                        onClick={logOut}
                    >Log Out</styled.Button>

                </styled.ButtonForm>

        </styled.ContentContainer>
            </>
            :
            <styled.LoaderContainer>
                <MoonLoader
                    loading={true}
                    color={"#4ffff0"}
                    size={50}
                    css={styled.spinnerCss}
                />

            </styled.LoaderContainer>   
        }
            
        </styled.Container>
    )
}

AccountPage.propTypes = {

}

export default AccountPage
