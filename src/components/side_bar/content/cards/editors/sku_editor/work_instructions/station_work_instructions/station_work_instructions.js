import React, { useState } from 'react';
import PropTypes from 'prop-types';

import * as styled from './station_work_instructions.style'
import EditButton from "../../../../../../../basic/edit_button/edit_button";
import {isString} from "../../../../../../../../methods/utils/string_utils";

const StationWorkInstructions = props => {

    const {
        name,
        workInstructions,
        onEditClick,
        processId,
        stationId,
    } = props

    const renderWorkInstructions = () => {
        return workInstructions.fields.map((workInstruction, index) => {

            const {label, value} = workInstruction

            return(
                <styled.InstructionContainer
                    key={index}
                    onClick={() => onEditClick({processId, stationId, index})}
                >
                    <styled.ValidityIcon
                        className={value ? 'fas fa-check' : 'fas fa-times'}
                        valid={value}
                    />
                    <styled.FieldLabel>{label}</styled.FieldLabel>
                    {/*<span>{isString(value) ? value : ''}</span>*/}
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
                    onClick={() => onEditClick({processId, stationId})}
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
    workInstructions: PropTypes.object
};

StationWorkInstructions.defaultProps = {
    onEditClick: () => null,
    workInstructions: {}
};



export default StationWorkInstructions;
