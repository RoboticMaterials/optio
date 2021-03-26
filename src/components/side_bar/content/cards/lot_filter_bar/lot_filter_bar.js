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
import FlagButton from "./flag_button/flag_button";

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
    const [shouldRenderInvisibleFlags, setShouldRenderInvisibleFlags] = useState(true)
    const [maxFlagsSize, setMaxFlagsSize] = useState({
        offsetWidth: undefined,
        offsetHeight: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
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
    const maxFlagsSizeRef = useRef(null)
    const {
        offsetHeight: maxFlagsOffsetHeight,
        offsetWidth: maxFlagsOffsetWidth,
        offsetTop: maxFlagsOffsetTop,
        offsetLeft: maxFlagsOffsetLeft,
    } = maxFlagsSizeRef?.current || {}



    const renderInvisibleFlags = () => {
        return(
            <styled.FlagsContainer
                style={{
                    position: "absolute"
                }}
                ref={maxFlagsSizeRef}
            >
            {Object.values(FLAG_OPTIONS).map((currVal) => {
                const {
                    color: currColor,
                    id: currColorId
                } = currVal || {}

                return (
                    <FlagButton
                        style={{
                            margin: "0 .1rem",
                        }}
                        key={currColorId}
                        color={currColor}
                        schema={props.schema}
                    />
                )
            })}
        </styled.FlagsContainer>
        )
    }

    useEffect(() => {
        if(maxFlagsSizeRef.current && Number.isInteger(maxFlagsOffsetWidth)) {
            setMaxFlagsSize({
                offsetWidth: maxFlagsOffsetWidth
            })

            setShouldRenderInvisibleFlags(false)
        }
    }, [maxFlagsOffsetWidth, maxFlagsSizeRef.current])

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
                {shouldRenderInvisibleFlags &&
                    renderInvisibleFlags()
                }
                {/*<div style={{flex: 1}}>*/}
                <DropDownSearch
                    maxDropdownWidth={`${size.width}px` }
                    // portal={document.getElementById("root")}
                    // containerCss={props.containerCss}
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
                        minWidth: "10rem",
                        overflow: 'visible',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                />
                {/*</div>*/}
                {selectedFilterOption.label === LOT_FILTER_OPTIONS.flags.label ?
                    <div
                        ref={flagsSizeRef}
                        style={{flex: 3}}
                    >
                    <DropDownSearch
                        // dropdownCss={props.dropdownCss}
                        // maxDropdownWidth={`${flagsSize.width}px` }
                        // reactDropdownSelectCss={props.reactDropdownSelectCss}
                        {...valueProps}
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
                                    <styled.FlagsContainer
                                        style={{
                                            minWidth: `${maxFlagsSize.offsetWidth}px`,
                                            width: `${maxFlagsSize.offsetWidth}px`
                                        }}
                                    >
                                        {values.map((currVal) => {
                                            const {
                                                color: currColor,
                                                id: currColorId
                                            } = currVal || {}

                                            return (
                                                <FlagButton
                                                    style={{
                                                        margin: "0 .1rem",
                                                    }}
                                                    key={currColorId}
                                                    color={currColor}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        methods.dropDown('open');
                                                    }}
                                                    schema={props.schema}
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
                                <FlagButton
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
                                    className={isSelected ? "fas fa-check-square" : "fas fa-square"}
                                />
                            )
                        }}

                        style={{
                            minWidth: `${maxFlagsSize.offsetWidth}px`,
                            width: `${maxFlagsSize.offsetWidth}px`,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            alignSelf: "stretch",
                            borderLeft: `1px solid ${themeContext.bg.quaternary}`

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
                        inputStyle={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: "0.2rem",
                            borderBottomRightRadius: "0.2rem",
                            height: "100%",
                        }}
                        style={{
                            background: themeContext.bg.secondary,
                            borderTopRightRadius: "0.2rem",
                            borderBottomRightRadius: "0.2rem",
                            borderLeft: `1px solid ${themeContext.bg.quaternary}`,
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
