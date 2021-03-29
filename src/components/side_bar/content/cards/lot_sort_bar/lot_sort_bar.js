import React, {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import * as styled from "../zone_header/zone_header.style";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import {
    FIELD_DATA_TYPES,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants";
import {isArray} from "../../../../../methods/utils/array_utils";
import {ThemeContext} from "styled-components";
import {useSelector} from "react-redux";
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils";
import Portal from "../../../../../higher_order_components/portal";
import RotateButton from "../../../../basic/rotate_button/rotate_button";

const LotSortBar = (props) => {

    const {
        sortMode,
        setSortMode,
        sortDirection,
        setSortDirection,
    } = props

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

    const [lotSortOptions, setLotSortOptions] = useState([...Object.values(LOT_SORT_OPTIONS)])
    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })

    const sizeRef = useRef(null)

    useEffect(() => {

        // if sizeRef is assigned
        if (sizeRef.current) {

            // extract dimensions of sizeRef
            let height = sizeRef.current.offsetHeight;
            let width = sizeRef.current.offsetWidth;
            let offsetTop = sizeRef.current.offsetTop;
            let offsetLeft = sizeRef.current.offsetLeft;

            // set zoneSize
            setSize({
                width: width,
                height: height,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
            });
        }

    }, [sizeRef, window.innerWidth])

    useEffect(() => {
        const templateFields = getAllTemplateFields()

        let tempLotSortOptions = [...Object.values(LOT_SORT_OPTIONS)]

        templateFields.forEach((currTemplateField) => {

            const {
                dataType,
                label
            } = currTemplateField

            if(dataType === FIELD_DATA_TYPES.DATE_RANGE) {
                tempLotSortOptions.push({
                    ...currTemplateField,
                    label: `${label} (start)`,
                    index: 0,
                    fieldName: label
                })
                tempLotSortOptions.push({
                    ...currTemplateField,
                    label: `${label} (end)`,
                    index: 1,
                    fieldName: label
                })
            }
            else {
                tempLotSortOptions.push({
                    ...currTemplateField,
                    fieldName: label
                })
            }
        })

        setLotSortOptions(tempLotSortOptions)
    }, [lotTemplates])

    const themeContext = useContext(ThemeContext)

    return (
        <styled.ColumnContainer
            css={props.columnCss}
        >
            <styled.Description
                css={props.descriptionCss}
            >
                Sort By:
            </styled.Description>

            <styled.ItemContainer
                ref={sizeRef}
            >
                <DropDownSearch
                    maxDropdownWidth={`${size.width}px` }
                    portal={document.getElementById("root")}
                    containerCss={props.containerCss}
                    dropdownCss={props.dropdownCss}
                    valueCss={props.valueCss}
                    options={lotSortOptions}
                    onChange={(values) => {
                        setSortMode(values[0])
                    }}
                    values={[sortMode]}
                    labelField={"label"}
                    valueField={"label"}
                    schema={"lots"}
                    style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        minWidth: "10rem",
                    }}
                />
                <RotateButton
                    schema={"lots"}
                    iconName1={"fas fa-arrow-up"}
                    containerCss={styled.rotateButtonContainerCss}
                    iconCss={styled.rotateButtonIconCss}

                    onStateOne={() => {
                        setSortDirection(SORT_DIRECTIONS.ASCENDING)
                    }}
                    onStateTwo={() => {
                        setSortDirection(SORT_DIRECTIONS.DESCENDING)
                    }}
                />
            </styled.ItemContainer>
        </styled.ColumnContainer>
    );
};

LotSortBar.propTypes = {

};

LotSortBar.defaultProps = {
    sortMode: {},
    setSortMode: () => {},
    lotSortOptions: [],
    sortDirection: {},
    setSortDirection: () => {}
};



export default LotSortBar;
