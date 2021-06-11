import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from './instruction_editor.style'
import {useSelector} from "react-redux";
import FieldComponentMapper from "../../../lot_template_editor/field_component_mapper/field_component_mapper";
import {FIELD_COMPONENT_NAMES} from "../../../../../../../../constants/lot_contants";
import {ComponentContainer} from "./instruction_editor.style";
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
            return(
                <styled.FieldContainer direction={component === FIELD_COMPONENT_NAMES.IMAGE_SELECTOR}>
                    <styled.FieldName>{label}</styled.FieldName>

                    {/*<styled.ComponentContainer>*/}
                        <FieldComponentMapper
                            component={component}
                            fieldName={`workInstructions[${processId}][${stationId}].fields[${selectedIndex >= 0 ? selectedIndex : index}].value`}
                            preview={false}
                            showName={false}
                        />
                    {/*</styled.ComponentContainer>*/}
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
