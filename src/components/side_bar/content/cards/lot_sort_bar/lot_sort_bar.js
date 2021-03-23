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
                    // reactDropdownSelectCss={props.reactDropdownSelectCss}
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
                        minWidth: "10rem",
                    }}
                />

                <DropDownSearch
                    maxDropdownWidth={`3.5rem` }
                    // portal={document.getElementById("root")}
                    dropdownCss={props.dropdownCss}
                    options={Object.values(SORT_DIRECTIONS)}
                    values={[sortDirection]}
                    onChange={(values) => {
                        setSortDirection(values[0])
                    }}
                    labelField={"id"}
                    valueField={"id"}
                    schema={"lots"}
                    contentRenderer={({ props, state, methods }) => {

                        const {
                            values = []
                        } = state || {}

                        if(isArray(values) && values.length > 0) {
                            return (
                                <>
                                    <styled.ArrowContainer>
                                        {values.map((currItem) => {
                                            const {
                                                iconClassName,
                                                id: currItemId
                                            } = currItem

                                            const isSelected = methods.isSelected(currItem)

                                            return(
                                                <styled.ArrowButton
                                                    style={{
                                                        // paddingTop: ".5rem",
                                                        // paddingBottom: ".5rem",
                                                        margin: "auto",
                                                        fontSize: '1rem',
                                                    }}
                                                    selected={isSelected}
                                                    key={currItemId}
                                                    type={"button"}
                                                    color={themeContext.bg.octonary}
                                                    role="option"
                                                    tabIndex="-1"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        methods.dropDown('open');
                                                    }}
                                                    // onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
                                                    schema={props.schema}
                                                    className={iconClassName}
                                                />
                                            )
                                        })}
                                    </styled.ArrowContainer>
                                    <styled.Spacer/>
                                </>
                            )
                        }

                        return(
                            null
                        )
                    }}
                    itemRenderer={({ item, itemIndex, props, state, methods }) => {
                        const {
                            iconClassName,
                            id: currItemId
                        } = item

                        const isSelected = methods.isSelected(item)

                        return(
                            <styled.ArrowButton
                                style={{
                                    paddingTop: ".5rem",
                                    paddingBottom: ".5rem",
                                }}
                                selected={isSelected}
                                key={currItemId}
                                type={"button"}
                                color={themeContext.bg.octonary}
                                role="option"
                                tabIndex="-1"
                                onClick={item.disabled ? undefined : () => methods.addItem(item)}
                                onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
                                schema={props.schema}
                                className={iconClassName}
                            />
                        )
                    }}

                    style={{
                        width: '3.5rem'
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
