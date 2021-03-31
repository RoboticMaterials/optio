import React, {useContext, useEffect, useRef, useState} from 'react';

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import Textbox from "../../../../basic/textbox/textbox";
import FlagButton from "./flag_button/flag_button";
import CalendarPlaceholder from "../../../../basic/calendar_placeholder/calendar_placeholder";

// constants
import {
    CONTENT,
    FIELD_DATA_TYPES, FLAG_OPTIONS, FORM_BUTTON_TYPES,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants";
import {BASIC_FIELD_DEFAULTS} from "../../../../../constants/form_constants";

// functions external
import PropTypes from 'prop-types';
import {ThemeContext} from "styled-components";
import {useSelector} from "react-redux";

// utils
import {isArray, isNonEmptyArray} from "../../../../../methods/utils/array_utils";
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils";
import {jsDateToString} from "../../../../../methods/utils/card_utils";

// styles
import * as styled from "../zone_header/zone_header.style";

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
        shouldFocusLotFilter,
        labelDropdownProps,
        valueProps
    } = props

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

    const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])
    const [valueMode, setValueMode] = useState()

    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })

    const sizeRef = useRef(null)

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

        let tempLotFilterOptions = [...Object.values(LOT_FILTER_OPTIONS)]

        templateFields.forEach((currTemplateField) => {
            const {
                dataType,
                label
            } = currTemplateField

            tempLotFilterOptions.push(currTemplateField)

        })

        setLotFilterOptions(tempLotFilterOptions)
    }, [lotTemplates])

    const themeContext = useContext(ThemeContext)

    return (
        <styled.ColumnContainer
        >
            <styled.Description
                // style={descriptionStyle}
                css={props.descriptionCss}
            >
                Filter lots:
            </styled.Description>

            <styled.ItemContainer
                ref={sizeRef}
            >
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
                        height: "100%",
                        alignSelf: "stretch",
                        padding: ".5rem"

                    }}
                    containerStyle={{
                        height: "100%",
                        alignSelf: "stretch",

                    }}
                />
                {/*</div>*/}

                {
                    {
                        [VALUE_MODES.FLAGS]:
                            <div
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
                                        width: "10rem",
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
                                minDate={isNonEmptyArray(lotFilterValue) ? lotFilterValue[0] : null}
                                maxDate={isNonEmptyArray(lotFilterValue) ? lotFilterValue[1] : null}
                                value={isNonEmptyArray(lotFilterValue) ? lotFilterValue : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE}
                                containerStyle={{
                                    overflow: "hidden",
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderLeft: `1px solid ${themeContext.bg.quaternary}`,
                                    background: themeContext.bg.secondary,
                                    boxShadow: "0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)",
                                    padding: ".5rem"
                                }}
                                onChange={(val) => {
                                    console.log("onChangeonChangeonChange val",val)
                                    setLotFilterValue(val)
                                }}
                                usable={true}
                                selectRange={true}
                                // defaultStartText={"Select Start Date"} //(isNonEmptyArray(lotFilterValue) && lotFilterValue[0]) ? jsDateToString(lotFilterValue[0]) :
                                // defaultEndText={} //(isNonEmptyArray(lotFilterValue) && lotFilterValue[1]) ? jsDateToString(lotFilterValue[1]) :
                            />,
                        [VALUE_MODES.SINGLE_DATE]:
                            <CalendarPlaceholder
                                // defaultText={"Select Date"}
                                // text={lotFilterValue ? jsDateToString(lotFilterValue) }
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
