import React, { useState } from 'react';
import PropTypes from 'prop-types';

import * as styled from './station_work_instructions.style'
import EditButton from "../../../../../../../basic/edit_button/edit_button";
import {isString} from "../../../../../../../../methods/utils/string_utils";
import {FIELD_COMPONENT_DATA_TYPES, FIELD_DATA_TYPES} from "../../../../../../../../constants/lot_contants";
import {convertValue} from "../../../../../../../../methods/utils/card_utils";
import ErrorTooltip from "../../../../../../../basic/form/error_tooltip/error_tooltip";

const VALIDITY_STATUSES = {
    VALID: "VALID",
    NO_VALUE: "NO VALUE",
    VALUE_ERROR: "ERROR RETRIEVING VALUE"
}
const StationWorkInstructions = props => {

    const {
        name,
        workInstructions,
        onEditClick,
        processId,
        stationId,
    } = props

    const checkWorkInstructionValue = (value, component) => {

        const dataType = FIELD_COMPONENT_DATA_TYPES[component]

        if(value) {
            switch (dataType) {


                case FIELD_DATA_TYPES.PDF: {
                    // for pdf document to have data, value must have truthy data attribute
                    const {data, id} = value || {}

                    if(data) {
                        return VALIDITY_STATUSES.VALID
                    }
                    else if(id && !data) {
                        return VALIDITY_STATUSES.VALUE_ERROR
                    }
                    else {
                        return VALIDITY_STATUSES.NO_VALUE
                    }
                }
                default: {
                    // otherwise, if there is a truthy value attribute, set to true
                    return VALIDITY_STATUSES.VALID
                }
            }
        }

        return false
    }

    const renderWorkInstructions = () => {
        return workInstructions.fields.map((workInstruction, index) => {

            const {label, value, component} = workInstruction || {}

            let isValid
            let iconClassName

            const validityStatus = checkWorkInstructionValue(value, component)
            switch(validityStatus) {
                case VALIDITY_STATUSES.VALID: {
                    isValid = true
                    iconClassName = 'fas fa-check'
                    break
                }
                case VALIDITY_STATUSES.NO_VALUE: {
                    isValid = false
                    iconClassName = 'fas fa-times'
                    break
                }
                case VALIDITY_STATUSES.VALUE_ERROR: {
                    isValid = false
                    iconClassName = 'fas fa-times'
                    break
                }
                default: {
                    isValid = false
                    iconClassName = 'fas fa-times'
                }

            }

            return(
                <styled.InstructionContainer
                    key={index}
                    onClick={() => onEditClick({processId, stationId, index})}
                >
                    {validityStatus === VALIDITY_STATUSES.VALUE_ERROR ?
                        <ErrorTooltip
                            visible={true}
                            // color={'#32a852'}
                            text={'Error retrieving data.'}
                            ContainerComponent={styled.TooltipContainer}
                        />
                        :
                        <styled.ValidityIcon
                            className={iconClassName}
                            valid={isValid}
                        />
                    }
                    <styled.FieldLabel>{label}</styled.FieldLabel>
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
    workInstructions: {fields: []}
};



export default StationWorkInstructions;
