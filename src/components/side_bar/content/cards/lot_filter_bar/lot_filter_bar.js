import React, {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import * as styled from "../zone_header/zone_header.style";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import {
    FIELD_DATA_TYPES, FLAG_OPTIONS,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants";
import {isArray} from "../../../../../methods/utils/array_utils";
import {ThemeContext} from "styled-components";
import {useSelector} from "react-redux";
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils";
import Textbox from "../../../../basic/textbox/textbox";

const LotFilterBar = (props) => {

    const {
        setLotFilterValue,
        selectedFilterOption,
        setSelectedFilterOption,
        descriptionStyle,
        containerStyle,
        shouldFocusLotFilter,
        labelDropdownProps,
        valueProps
    } = props

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

    const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])
    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
    const [flagsSize, setFlagsSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })

    const sizeRef = useRef(null)
    const flagsSizeRef = useRef(null)

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

        // if sizeRef is assigned
        if (flagsSizeRef.current) {

            // extract dimensions of flagsSizeRef
            let height = flagsSizeRef.current.offsetHeight;
            let width = flagsSizeRef.current.offsetWidth;
            let offsetTop = flagsSizeRef.current.offsetTop;
            let offsetLeft = flagsSizeRef.current.offsetLeft;

            // set zoneSize
            setFlagsSize({
                width: width,
                height: height,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
            });
        }

    }, [flagsSizeRef, window.innerWidth, selectedFilterOption])

    useEffect(() => {
        const templateFields = getAllTemplateFields()

        let tempLotFilterOptions = [...Object.values(LOT_FILTER_OPTIONS)]

        templateFields.forEach((currTemplateField) => {
            const {
                dataType,
                label
            } = currTemplateField


            // currently don't have filter for dates implemented, so skip em
            if(dataType !== FIELD_DATA_TYPES.DATE_RANGE && dataType !== FIELD_DATA_TYPES.DATE) {
                tempLotFilterOptions.push(currTemplateField)
            }

        })

        setLotFilterOptions(tempLotFilterOptions)
    }, [lotTemplates])

    const themeContext = useContext(ThemeContext)

    return (
        <styled.ColumnContainer

            style={containerStyle}
            css={props.columnCss}
        >
            <styled.Description
                style={descriptionStyle}
                css={props.descriptionCss}
            >
                Filter lots:
            </styled.Description>

            <styled.ItemContainer
                ref={sizeRef}
            >
                {/*<div style={{flex: 1}}>*/}
                <DropDownSearch
                    maxDropdownWidth={`${size.width}px` }
                    portal={document.getElementById("root")}
                    containerCss={props.containerCss}
                    reactDropdownSelectCss={props.reactDropdownSelectCss}
                    dropdownCss={props.dropdownCss}
                    valueCss={props.valueCss}
                    {...labelDropdownProps}
                    options={lotFilterOptions}
                    onChange={(values) => {
                        setSelectedFilterOption(values[0])
                        setLotFilterValue(null)
                    }}
                    values={[selectedFilterOption]}
                    labelField={"label"}
                    valueField={"label"}
                    schema={"lots"}
                    style={{
                        background: themeContext.bg.tertiary,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        fontSize: "2px",
                        borderTopLeftRadius: "1rem",
                        borderBottomLeftRadius: "1rem",
                        flex: 1,
                        overflow: "hidden",
                        // minWidth: "10rem",
                        borderBottom: `1px solid ${themeContext.bg.quinary}`,
                    }}
                />
                {/*</div>*/}
                {selectedFilterOption.label === LOT_FILTER_OPTIONS.flags.label ?
                    <div
                        ref={flagsSizeRef}
                        style={{flex: 3}}
                    >
                    <DropDownSearch

                        containerCss={props.containerCss}
                        dropdownCss={props.dropdownCss}
                        maxDropdownWidth={`${flagsSize.width}px` }
                        reactDropdownSelectCss={props.reactDropdownSelectCss}
                        portal={document.getElementById("root")}
                        {...valueProps}
                        clearable={true}
                        multi={true}
                        options={Object.values(FLAG_OPTIONS)}
                        onChange={(values) => {
                            setLotFilterValue(values)
                        }}
                        onRemoveItem={(values) => {
                            setLotFilterValue(values)
                        }}
                        onClearAll={() => {
                            setLotFilterValue([])
                        }}
                        labelField={"id"}
                        valueField={"id"}
                        schema={"lots"}
                        contentRenderer={({ props, state, methods }) => {

                            const {
                                values = []
                            } = state || {}
                            const value = state.values[0]

                            if(isArray(values) && values.length > 0) {
                                return (
                                    <styled.FlagsContainer>
                                        {values.map((currVal) => {
                                            const {
                                                color: currColor,
                                                id: currColorId
                                            } = currVal || {}

                                            return (
                                                <styled.FlagButton
                                                    style={{
                                                        margin: "0 .5rem",
                                                    }}
                                                    key={currColorId}
                                                    type={"button"}
                                                    color={currColor}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        methods.dropDown('open');
                                                    }}
                                                    schema={props.schema}
                                                    className="fas fa-flag"
                                                />
                                            )
                                        })}
                                    </styled.FlagsContainer>
                                )
                            }

                            return(
                                null
                            )
                        }}
                        itemRenderer={({ item, itemIndex, props, state, methods }) => {
                            const {
                                color: currColor,
                                id: currColorId
                            } = item

                            const isSelected = methods.isSelected(item)

                            return(
                                <styled.FlagButton
                                    style={{
                                        paddingTop: ".5rem",
                                        paddingBottom: ".5rem",
                                    }}
                                    selected={isSelected}
                                    key={currColorId}
                                    type={"button"}
                                    color={currColor}
                                    role="option"
                                    tabIndex="-1"
                                    onClick={item.disabled ? undefined : () => methods.addItem(item)}
                                    onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
                                    schema={props.schema}
                                    className="fas fa-flag"
                                />
                            )
                        }}

                        style={{
                            background: themeContext.bg.tertiary,
                            // width: "15rem",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: "1rem",
                            borderBottomRightRadius: "1rem",
                            borderLeft: `1px solid ${themeContext.bg.quaternary}`,
                            borderBottom: `1px solid ${themeContext.bg.quinary}`,
                            flex: 3,
                        }}
                    />
                    </div>
                    :
                    <Textbox

                        placeholder='Filter lots...'
                        onChange={(e) => {
                            setLotFilterValue(e.target.value)
                        }}
                        focus={shouldFocusLotFilter}
                        style={{
                            background: themeContext.bg.tertiary,
                            height: "100%",
                            flex: 1,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: "1rem",
                            borderBottomRightRadius: "1rem",
                            borderLeft: `1px solid ${themeContext.bg.quaternary}`,

                        }}
                        textboxContainerStyle={{
                            flex: 1,
                            // height: "100%",
                            alignSelf: "stretch",
                            // background: "blue",
                            margin: 0,
                            padding: 0
                        }}
                        schema={"lots"}
                    />
                }
            </styled.ItemContainer>
        </styled.ColumnContainer>
    );
};

LotFilterBar.propTypes = {

};

LotFilterBar.defaultProps = {

};



export default LotFilterBar;
