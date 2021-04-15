import React, { useState, } from 'react';
import PropTypes from 'prop-types';

// Import styles
import * as styled from './sort_dropdown.style'

// Import components
import DropDownSearch from '../drop_down_search_v2/drop_down_search'
import RotateButton from '../rotate_button/rotate_button'

const SortDropDown = (props) => {

    const {
        labelField,
        valueField,
        options,
        values,
        onChange,
        mapInput,
        mapOutput,

        label,
        placeholder,

        labelStyle,
        dropDownSearchStyle,
        schema,
        containerCss,
        dropdownCss,
        valueCss,
        portal,
        maxDropdownWidth,

        orderEnabled,
        onChangeOrderDirection,
        rotateButtonContainerCss,
        rotateButtonIconCss,


        ...rest
    } = props || {}


    return (
        <styled.Container>
            <styled.Label style={{ ...labelStyle }}>{label}</styled.Label>
            <DropDownSearch
                maxDropdownWidth={maxDropdownWidth}
                portal={portal}
                placeholder={placeholder}
                containerCss={containerCss}
                dropdownCss={dropdownCss}
                valueCss={valueCss}
                options={options}
                onChange={(values) => {
                    onChange(mapOutput(values[0]))
                }}
                values={mapInput(values)}
                labelField={labelField}
                valueField={valueField}
                schema={schema}
                style={{ ...dropDownSearchStyle }}
            />
            {orderEnabled &&
                <RotateButton
                    schema={schema}
                    iconName1={"fas fa-arrow-up"}
                    containerCss={rotateButtonContainerCss}
                    iconCss={rotateButtonIconCss}

                    onStateOne={() => {
                        onChangeOrderDirection('ascending')
                    }}
                    onStateTwo={() => {
                        onChangeOrderDirection('descending')
                    }}
                />
            }

        </styled.Container >
    )

}

// Specifies propTypes
SortDropDown.propTypes = {
    style: PropTypes.object,
    mapInput: PropTypes.func,
    mapOutput: PropTypes.func,
    orderEnabled: PropTypes.bool,
};

// Specifies the default values for props:
SortDropDown.defaultProps = {
    label: 'Sort By:',
    orderEnabled: false,
    onChange: null,
    mapInput: (val) => val,
    mapOutput: (val) => val,
    style: {}
};


export default SortDropDown