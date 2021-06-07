import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from './instruction_editor.style'
import {useSelector} from "react-redux";
import FieldComponentMapper from "../../../lot_template_editor/field_component_mapper/field_component_mapper";

const InstructionEditor = props => {

    const {
        stationId,
        fields
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
        return fields.map(field => {
            const {
                label,
                value,
                component
            } = field
            return(
                <styled.FieldContainer>
                    <styled.FieldName>{label}</styled.FieldName>

                    <FieldComponentMapper
                        component={component}
                        fieldName={label}
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
        </styled.Container>
    );
};

InstructionEditor.propTypes = {
    width: '10%'
};

export default InstructionEditor;
