import React, { useContext } from 'react';

import { ThemeContext } from 'styled-components'

import PropTypes from 'prop-types'

import * as styled from './account_modal.style'
import AccountPage from "../account_page/account_page"

const AccountModal = (props) => {
    const {
        isOpen,
        onClose,
    } = props

    const themeContext = useContext(ThemeContext);

    return (
        <styled.Container
            isOpen={isOpen}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>
                    Account Information
                </styled.Title>
                <styled.CloseIcon
                    className={"fas fa-times"}
                    color={themeContext.bad}
                    onClick={onClose}
                />
            </styled.Header>

            <AccountPage/>

            <styled.Footer>
                
            </styled.Footer>
        </styled.Container>
    )
}

AccountModal.propTypes = {
    isOpen: PropTypes.bool
}

export default AccountModal
