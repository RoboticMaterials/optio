import React, { useState } from "react"
import PropTypes from "prop-types";

// styles
import * as modalStyle from '../modals.style'
import * as styled from './api_modal.style'

import BackButton from '../../back_button/back_button'
import ApiLogin from './api_login';

import api_logos from '../../../../graphics/api_logos'

const ApiModal = (props) => {

    const {
        isOpen,
        title,
        onClose,
        children,
        FooterContent,
        PreBodyContent,
        content,
    } = props

    const [login, setLogin] = useState(null)

    const apiAccounts = [
        {
            endpoint: "Paradigm Nexus",
            type: 'ERP',
            enabled: true
        },
        {
            endpoint: "Shopify",
            type: 'ERP',
            enabled: false
        }
    ]

    return (
        <modalStyle.Container
            isOpen={isOpen}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)' 
                },
                content: {

                },
            }}
        >
            <modalStyle.HeaderContainer>
                    {!!login ?
                        <>
                            <BackButton onClick={() => setLogin(null)} style={{color: 'grey'}} containerStyle={{border: 'none', margin: 0, height: '1.2rem'}}/>
                            <modalStyle.Title>Connect to Endpoint</modalStyle.Title>
                        </>
                        :
                        <>
                            <div style={{width: '2rem'}} />
                            <modalStyle.Title>Choose an Endpoint</modalStyle.Title>
                        </>
                    }
                    <modalStyle.Icon className="fa fa-times" aria-hidden="true" onClick={onClose}/>
            </modalStyle.HeaderContainer>
            <modalStyle.Container>
                {!!login ?
                    <ApiLogin endpoint={login} />
                    :
                    <>
                        {apiAccounts.map(account => 
                            <styled.AccountContainer enabled={account.enabled}>
                                <styled.AccountLogoContainer>
                                    <styled.AccountLogo src={api_logos[account.endpoint.replace(/\s+/g, '_').toLowerCase()]} />
                                </styled.AccountLogoContainer>
                                <styled.AccountDesc>
                                    <styled.AccountName>{account.endpoint}</styled.AccountName>
                                    <styled.AccountType>{account.type}</styled.AccountType>
                                </styled.AccountDesc>
                                {!account.enabled &&
                                    <styled.LinkIcon className="fas fa-link" onClick={() => setLogin(account.endpoint)}/>
                                }
                            </styled.AccountContainer>
                        )}
                    </>
                }
            </modalStyle.Container>
        </modalStyle.Container>
    );
};

// Specifies propTypes
ApiModal.propTypes = {
    contentLabel: PropTypes.string,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
    onCloseButtonClick: PropTypes.func,
};

// Specifies the default values for props:
ApiModal.defaultProps = {
    isOpen: false,
    title: "Choose an Endpoint",
    onRequestClose: () => {},
    onCloseButtonClick: () => {},
    children: null,
    HeaderContent: null,
    BodyContent: null,
    FooterContent: null,
};


export default ApiModal;
