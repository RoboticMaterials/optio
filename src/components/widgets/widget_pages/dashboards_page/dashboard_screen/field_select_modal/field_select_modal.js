import React, { Component, useState, useEffect } from 'react';

// Import Style
import * as styled from './field_select_modal.style'

// Import Components
import TaskQueue from '../../../../../task_queue/task_queue'


const FieldSelectModal = (props) => {

    const {
        isOpen,
        close,
    } = props

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'taskQueue'}>Choose lot fields to display</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    onClick={() => {close()}}
                    style={{ cursor: 'pointer' }}
                />


                <TaskQueue />
            </styled.BodyContainer>
        </styled.Container>
    )
}

export default FieldSelectModal
