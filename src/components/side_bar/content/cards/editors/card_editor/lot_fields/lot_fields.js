import React from 'react';

import * as styled from "./lot_fields.style";
import FieldComponentMapper from "../../lot_template_editor/field_component_mapper/field_component_mapper";

const LotFields = (props) => {

    const {
        fields,
        preview,
        usable
    } = props

    /*
	* Renders fields
	* */
    const renderFields = () => {

        return (
            <styled.Container>

                {fields.map((currRow, currRowIndex) => {

                    const isLastRow = currRowIndex === fields.length - 1
                    return <div
                        style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
                        key={currRowIndex}
                    >
                        <styled.Row>

                            {currRow.map((currItem, currItemIndex) => {
                                const {
                                    _id: dropContainerId,
                                    component,
                                    fieldName,
                                    dataType,
                                    key,
                                    required,
                                    showInPreview,
                                } = currItem || {}

                                // get full field name
                                const fullFieldName = `fields[${currRowIndex}][${currItemIndex}].value`

                                return <styled.FieldContainer
                                    key={dropContainerId}
                                >
                                    <FieldComponentMapper
                                        required={required}
                                        fieldId={dropContainerId}
                                        displayName={fieldName}
                                        preview={preview}
                                        usable={usable}
                                        component={component}
                                        fieldName={fullFieldName}
                                    />
                                </styled.FieldContainer>
                            })}

                        </styled.Row>
                    </div>
                })}
            </styled.Container>
        )
    }

    return (renderFields());
};

LotFields.propTypes = {

};

LotFields.defaultProps = {
    preview: false,
    usable: true
};



export default LotFields;
