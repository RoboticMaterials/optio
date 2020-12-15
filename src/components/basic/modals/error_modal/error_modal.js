import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";


import Button from "../../../basic/button/button";
import Textbox from "../../../basic/textbox/textbox";

// actions

// styles
import * as styled from './error_modal.style'

const ErrorModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,
        handleClose,
        handleDeleteWithRoutes,
        handleDeleteWithoutRoutes,
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
                                onClick={handleDeleteWithoutRoutes}
                                label={"Delete process and KEEP associated routes"}
                                type="button"
                            />
                            <Button
                                primary
                                schema={"delete"}
                                onClick={handleDeleteWithRoutes}
                                label={"Delete process and DELETE associated routes"}
                                type="button"
                            />

                        </styled.ButtonForm>

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ErrorModal
