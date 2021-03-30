import React, {useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import * as styled from "../zone_header/zone_header.style";
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import {
    CONTENT,
    FIELD_DATA_TYPES, FLAG_OPTIONS, FORM_BUTTON_TYPES,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants";
import {isArray, isNonEmptyArray} from "../../../../../methods/utils/array_utils";
import {ThemeContext} from "styled-components";
import {useSelector} from "react-redux";
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils";
import Textbox from "../../../../basic/textbox/textbox";
import FlagButton from "./flag_button/flag_button";
import Button from "../../../../basic/button/button";
import {FORM_MODES} from "../../../../../constants/scheduler_constants";
import CalendarField, {CALENDAR_FIELD_MODES} from "../../../../basic/form/calendar_field/calendar_field";
import CalendarPlaceholder from "../../../../basic/calendar_placeholder/calendar_placeholder";
import FieldComponentMapper from "../card_editor/field_component_mapper/field_component_mapper";
import {jsDateToString} from "../../../../../methods/utils/card_utils";
import Calendar from "../../../../basic/calendar/calendar";
import {BASIC_FIELD_DEFAULTS} from "../../../../../constants/form_constants";

const VALUE_MODES = {
    TEXT_BOX: "TEXT_BOX",
    DATE_RANGE: "DATE_RANGE",
    SINGLE_DATE: "SINGLE_DATE",
    FLAGS: "FLAGS"
}

const LotFilterBar = (props) => {

    const {
        setLotFilterValue,
        lotFilterValue,
        selectedFilterOption,
        setSelectedFilterOption,
        descriptionStyle,
        containerStyle,
        shouldFocusLotFilter,
        labelDropdownProps,
        valueProps
    } = props

    console.log("lotFilterValue",lotFilterValue)

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

    const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])
    const [valueMode, setValueMode] = useState()
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
        const {
            label,
            dataType
        } = selectedFilterOption || {}

        if(label === LOT_FILTER_OPTIONS.flags.label) {
            setValueMode(VALUE_MODES.FLAGS)
        }
        else if(dataType === FIELD_DATA_TYPES.DATE_RANGE) {
            setValueMode((VALUE_MODES.DATE_RANGE))
        }
        else if(dataType === FIELD_DATA_TYPES.DATE) {
            setValueMode(VALUE_MODES.SINGLE_DATE)
        }
        else {
          setValueMode(VALUE_MODES.TEXT_BOX)
        }

    }, [selectedFilterOption])

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
            // if(dataType !== FIELD_DATA_TYPES.DATE_RANGE && dataType !== FIELD_DATA_TYPES.DATE) {
                tempLotFilterOptions.push(currTemplateField)
            // }

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

                {
                    {
                        [VALUE_MODES.FLAGS]:
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

                                        return (
                                            <styled.FlagsContainer style={{minWidth: '4rem', paddingRight: '1rem'}}>
                                                {isArray(values) && values.map(currVal => {
                                                    const {
                                                        color: currColor,
                                                        id: currColorId
                                                    } = currVal || {}

                                                    return (
                                                        <styled.FlagButton
                                                            style={{
                                                                margin: "0rem .1rem",
                                                            }}
                                                            key={currColorId}
                                                            type={"button"}
                                                            color={currColor}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                methods.dropDown('open');
                                                            }}
                                                            schema={props.schema}
                                                            className="fas fa-square"
                                                        />
                                                    )
                                                })}

                                            </styled.FlagsContainer>
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
                            </div>,

                        [VALUE_MODES.TEXT_BOX]:
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
                            />,
                        [VALUE_MODES.DATE_RANGE]:
                            <CalendarPlaceholder
                                // text={lotFilterValue ? jsDateToString(lotFilterValue) : "Select Date"}
                                calendarProps={{
                                    value: isNonEmptyArray(lotFilterValue) ? lotFilterValue : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE
                                }}
                                containerStyle={{
                                    overflow: "hidden",
                                    // width: "8rem",
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeft: `1px solid ${themeContext.bg.quaternary}`,
                                    background: themeContext.bg.secondary,
                                    // height: "36px",
                                    boxShadow: "0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)",
                                }}
                                onChange={(val) => {
                                    console.log("onChangeonChangeonChange val",val)
                                    setLotFilterValue(val)
                                }}
                                usable={true}
                                selectRange={true}
                                startText={(isNonEmptyArray(lotFilterValue) && lotFilterValue[0]) ? jsDateToString(lotFilterValue[0]) : "Select Start Date"}
                                endText={(isNonEmptyArray(lotFilterValue) && lotFilterValue[1]) ? jsDateToString(lotFilterValue[1]) : "Select End Date"}
                            />,
                        [VALUE_MODES.SINGLE_DATE]:
                            <CalendarPlaceholder
                                text={lotFilterValue ? jsDateToString(lotFilterValue) : "Select Date"}
                                calendarProps={{
                                    value: lotFilterValue
                                }}
                                containerStyle={{
                                    overflow: "hidden",
                                    width: "8rem",
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeft: `1px solid ${themeContext.bg.quaternary}`,
                                    background: themeContext.bg.secondary,
                                    height: "36px",
                                    boxShadow: "0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)",
                                }}
                                onChange={(val) => {
                                    setLotFilterValue(val)
                                }}
                                usable={true}
                            />
                    }[valueMode] ||
                    <>
                    </>
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
