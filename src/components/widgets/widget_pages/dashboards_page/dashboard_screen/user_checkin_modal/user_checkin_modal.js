import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as styled from './user_checkin_modal.style.js';

import Textbox from '../../../../../basic/textbox/textbox';
import Button from '../../../../../basic/button/button';
import ContentListItem from '../../../../../side_bar/content/content_list/content_list_item/content_list_item.js';
import ConfirmDeleteModal from '../../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

import { putDashboard } from '../../../../../../redux/actions/dashboards_actions'

const UserCheckinModal = (props) => {

    const {
        dashboard,
        onCheckin,
        onClose
    } = props;

    const [userName, setUserName] = useState('')
    const [existingUser, setExistingUser] = useState(null)
    const [confirmDeleteOperatorIdx, setConfirmDeleteOperatorIdx] = useState(null)

    const dispatch = useDispatch();
    const dispatchPutDashboard = async (dashboard, Id) => await dispatch(putDashboard(dashboard, Id))

    const onContinue = () => {
        let existingUsers, user;
        if (existingUser !== null) {
            existingUsers = dashboard.users
            let existingUserIndex = existingUsers.findIndex(u => u === existingUser)
            existingUsers.splice(existingUserIndex, 1)
            existingUsers.unshift(existingUser)
            user = existingUser
        } else {
            existingUsers = dashboard?.users || []
            existingUsers.unshift(userName)
            user = userName
        }

        dispatchPutDashboard({
            ...dashboard,
            users: existingUsers
        }, dashboard._id.$oid);
        onCheckin(user);
    }

    return (
        <>
            {confirmDeleteOperatorIdx !== null &&
                <ConfirmDeleteModal
                    isOpen={confirmDeleteOperatorIdx !== null}
                    title={"Are you sure you want to delete this operator?"}
                    button_1_text={"Yes"}
                    button_2_text={"No"}
                    handleClose={() => setConfirmDeleteOperatorIdx(null)}
                    handleOnClick1={() => {
                        let users = dashboard.users;

                        if (users[confirmDeleteOperatorIdx] === existingUser) {
                            setExistingUser(null)
                        }
                        users.splice(confirmDeleteOperatorIdx, 1)

                        dispatchPutDashboard({
                            ...dashboard,
                            users
                        }, dashboard._id.$oid);
                        setConfirmDeleteOperatorIdx(null);
                    }}
                    handleOnClick2={() => {
                        setConfirmDeleteOperatorIdx(null);
                    }}
                />
            }
            <styled.Container
                isOpen={true}
                contentLabel="Warehouse Modal"
                onRequestClose={onClose}
                style={{
                    overlay: {
                        zIndex: 500,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    },
                }}
            >
                
                <styled.Header>
                    <styled.HeaderMainContentContainer>
                        <styled.Title>{'Select Operator'}</styled.Title>
                        <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={onClose} />
                    </styled.HeaderMainContentContainer>


                </styled.Header>

                <styled.ContentContainer>
                    <Textbox 
                        style={{width: '100%', height: '3rem', margin: '1rem'}} 
                        inputStyle={{background: 'white', fontSize: '1rem'}} 
                        autoFocus={true}
                        placeholder="Enter name/identifier of operator"
                        value={userName}
                        onChange={e => {
                            setUserName(e.target.value)
                            setExistingUser(null)
                        }}
                        schema={'users'}
                    />
                    {!!dashboard.users && dashboard.users.length ?
                        <>
                            <styled.Label>Previous Operators</styled.Label>
                            <div style={{marginBottom: '1rem', width: '100%', maxHeight: '40vh', overflowY: 'scroll'}}>
                                
                                {dashboard.users.map((user, ind) => (
                                    <ContentListItem 
                                        id={`user-list-${user}`}
                                        ind={ind}
                                        element={{name: user, type: 'user'}}
                                        schema={'user'}
                                        onClick={() => {
                                            setExistingUser(user);
                                            setUserName('')
                                        }}
                                        showEdit={false}
                                        showDelete={true}
                                        onDeleteClick={() => setConfirmDeleteOperatorIdx(ind)}
                                        style={{width: '100%', background: existingUser === user ? 'rgba(255,165,0, 0.2)' : 'white', border: existingUser === user && 'none', cursor: 'pointer'}}
                                    />
                                ))}
                            </div>
                            </>
                        : null
                    }
                    <Button 
                        style={{ height: '3rem', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2)', width: '8.5rem', padding: '0rem', marginBottom: '1rem'}} 
                        schema={'users'}
                        onClick={onContinue}
                        disabled={existingUser === null && userName.length === 0}
                    >Continue</Button>
                </styled.ContentContainer>
            </styled.Container>
        </>
    )
}

export default UserCheckinModal;