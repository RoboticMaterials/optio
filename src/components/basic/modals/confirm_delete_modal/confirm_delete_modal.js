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
        button_2_text
    } = props


    const dispatch = useDispatch()




    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>{title}</styled.Title>

                <Button
                    onClick={handleClose}
                    schema={'error'}
                >
                    <i className="fa fa-times" aria-hidden="true"/>
                </Button>
            </styled.Header>
            <styled.BodyContainer>

                        <styled.ContentContainer>

                        </styled.ContentContainer>

                        <styled.ButtonForm>
                            <Button
                                tertiary
                                schema={"delete"}
                                onClick={handleOnClick1}
                                label={button_1_text}
                                type="button"
                            />
                            <Button
                                tertiary
                                schema={"delete"}
                                onClick={handleOnClick2}
                                label={button_2_text}
                                type="button"
                            />

                        </styled.ButtonForm>

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ConfirmDeleteModal
