import React, {Component} from "react";
import PropTypes from 'prop-types';

import * as styled from "./with_modal.style";

const withModal = (WrappedComponent, width = 'auto', height = 'auto') => {
    // const {
    //     width,
    //     height
    // } = props
    return (props) => {

        const {
            close,
            contentLabel,
        } = props

        return <styled.Container
            width={width}
            height={height}
            isOpen={true}
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