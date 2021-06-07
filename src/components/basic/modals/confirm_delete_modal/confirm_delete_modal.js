import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";


import Button from "../../../basic/button/button";
import Textbox from "../../../basic/textbox/textbox";

// actions

// styles
import * as styled from './confirm_delete_modal.style'

const ConfirmDeleteModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,
        handleClose,
        handleOnClick1,
        handleOnClick2,
        button_1_text,
        button_2_text,
        children
    } = props

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
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
                <styled.Title>{title}</styled.Title>
                <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={handleClose}/>
            </styled.Header>
            <styled.BodyContainer>
                <styled.ContentContainer>
                    {children}
                </styled.ContentContainer>

                This action cannot be undone

                <styled.ButtonForm>

                    <Button
                        tertiary
                        style={{minWidth: '10rem'}}
                        schema={"delete"}
                        onClick={handleOnClick2}
                        label={button_2_text}
                        type="button"
                    />
                    <Button
                        secondary
                        style={{minWidth: '10rem'}}
                        schema={"delete"}
                        onClick={handleOnClick1}
                        label={button_1_text}
                        type="button"
                    />

                </styled.ButtonForm>

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ConfirmDeleteModal;
