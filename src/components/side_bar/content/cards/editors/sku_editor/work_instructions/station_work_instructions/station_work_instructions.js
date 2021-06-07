import React, { useState } from 'react';
import PropTypes from 'prop-types';

import * as styled from './station_work_instructions.style'
import EditButton from "../../../../../../../basic/edit_button/edit_button";

const StationWorkInstructions = props => {

    const {
        name,
        workInstructions,
        onEditClick
    } = props

    const renderWorkInstructions = () => {
        return workInstructions.fields.map(workInstruction => {

            const {label, value} = workInstruction

            return(
                <styled.InstructionContainer>
                    <styled.ValidityIcon
                        className={value ? 'fas fa-check' : 'fas fa-times'}
                        valid={value}
                    />
                    <styled.FieldLabel>{label}</styled.FieldLabel>
                    <span>{value}</span>
                </styled.InstructionContainer>
            )
        })
    }

    return (
        <styled.Container>
            <styled.Header>
                <EditButton
                    style={{
                        position: 'absolute',
                        left: 0
                    }}
                    onClick={() => onEditClick(workInstructions)}
                />
                <styled.Name>{name}</styled.Name>
            </styled.Header>

            <styled.Body>
                {renderWorkInstructions()}
            </styled.Body>
        </styled.Container>
    );
};

StationWorkInstructions.propTypes = {
    onEditClick: PropTypes.func,
};

StationWorkInstructions.defaultProps = {
    onEditClick: () => null,
};



export default StationWorkInstructions;
