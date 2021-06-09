import React, {Component} from "react";
import PropTypes from 'prop-types';

import * as styled from "./with_modal.style";

const withModal = (WrappedComponent, minWidth = 'auto', maxWidth = 'auto', minHeight = 'auto', maxHeight = 'auto') => {
    return (props) => {

        const {
            close,
            contentLabel,
            isOpen
        } = props

        return <styled.Container
            minWidth={minWidth}
            minHeight={minHeight}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            isOpen={isOpen}
            onRequestClose={() => {
                close()
            }}
            contentLabel={contentLabel}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '.4rem'

                },
                content: {
                    borderRadius: '0.4rem',
                    overflow: 'hidden'
                }
            }}
        >
            <WrappedComponent {...props} />
        </styled.Container>

    };
}

export default withModal