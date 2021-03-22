import React from "react"
import PropTypes from "prop-types";

import Button from "../../../basic/button/button";

// styles
import * as styled from './basic_modal.style'


const BasicModal = (props) => {

    const {
        isOpen,
        onRequestClose,
        handleOnClick1,
        handleOnClick2,
        button_1_text,
        button_2_text,
        button_1_disabled,
        button_2_disabled,
        children,
        contentLabel,
        HeaderContent,
        BodyContent,
        FooterContent,
    } = props

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel={contentLabel}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    zIndex: 500
                },
                content: {

                }
            }}
        >

            <styled.Header>
            </styled.Header>

            <styled.BodyContainer>
                        <styled.ContentContainer>

                        </styled.ContentContainer>

                        <styled.ButtonForm>
                            {FooterContent}
                        </styled.ButtonForm>
            </styled.BodyContainer>
        </styled.Container>
    );
};

// Specifies propTypes
BasicModal.propTypes = {
    contentLabel: PropTypes.string,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
    onCloseButtonClick: PropTypes.func,
    handleOnClick1: PropTypes.func,
    handleOnClick2: PropTypes.func,
    button_1_text: PropTypes.string,
    button_2_text: PropTypes.string,
};

// Specifies the default values for props:
BasicModal.defaultProps = {
    contentLabel: "Simple Modal",
    isOpen: false,
    title: "Simple Modal",
    onRequestClose: () => {},
    onCloseButtonClick: () => {},
    handleOnClick1: () => {},
    handleOnClick2: () => {},
    button_1_text: "Ok",
    button_2_text: "Cancel",
    children: null,
    button_1_disabled: false,
    button_2_disabled: false,
    HeaderContent: null,
    BodyContent: null,
    FooterContent: null,
};


export default BasicModal
