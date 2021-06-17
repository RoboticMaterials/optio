import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from './instruction_editor.style'
import {useSelector} from "react-redux";
import FieldComponentMapper from "../../../lot_template_editor/field_component_mapper/field_component_mapper";
import {
    FIELD_COMPONENT_DATA_TYPES,
    FIELD_COMPONENT_NAMES,
    FIELD_DATA_TYPES
} from "../../../../../../../../constants/lot_contants";
import Button from "../../../../../../../basic/button/button";

const InstructionEditor = props => {

    const {
        stationId,
        processId,
        fields,
        selectedIndex,
        close
    } = props

    const stations = useSelector(state => { return state.stationsReducer.stations }) || {}

    const [station, setStation] = useState({})
    const {
        name
    } = station || {}

    useEffect(() => {
        setStation(stations[stationId] || {})
    }, [stationId])

    const renderFields = () => {
        return fields
            .filter((field, index) => selectedIndex >= 0 ? index === selectedIndex : true)
            .map((field, index) => {
                const {
                    label,
                    value,
                    component
                } = field

                const dataType = FIELD_COMPONENT_DATA_TYPES[component]

                return(
                    <styled.FieldContainer>
                        <styled.FieldName>{label}</styled.FieldName>

                        <FieldComponentMapper
                            component={component}
                            mapInput={(val) => {
                                switch(dataType) {
                                    // for pdf, the data comes as object {id, data}
                                    // we just want the data for the field
                                    case FIELD_DATA_TYPES.PDF: {
                                        return val?.data
                                    }
                                    default: {
                                        return val
                                    }
                                }
                                    return val?.data
                            }}
                            mapOutput={(val) => {
                                switch(dataType) {
                                    // for pdf, the output is just the file, but we want to store the file and id
                                    // we just want the data for the field
                                    case FIELD_DATA_TYPES.PDF: {
                                        return {
                                            data: val,
                                            id: null,
                                            formMeta: {
                                                changed: true
                                            }
                                        }
                                    }
                                    default: {
                                        return val
                                    }
                                }
                                    return val?.data
                            }}

                            fieldName={`workInstructions[${processId}][${stationId}].fields[${selectedIndex >= 0 ? selectedIndex : index}].value`}
                            preview={false}
                            showName={false}
                        />
                    </styled.FieldContainer>
                )
            })
    }

    return (
        <styled.Container>
            <styled.Header>
                <styled.StationName>{name}</styled.StationName>
            </styled.Header>

            <styled.FieldsContainer>{renderFields()}</styled.FieldsContainer>

            <styled.Footer>
                <Button
                    schema={'ok'}
                    label={'Ok'}
                    onClick={close}
                />
            </styled.Footer>
        </styled.Container>
    );
};

InstructionEditor.propTypes = {
    // width: PropTypes.string
};

InstructionEditor.defaultProps = {
    width: '10%'
};



export default InstructionEditor;
