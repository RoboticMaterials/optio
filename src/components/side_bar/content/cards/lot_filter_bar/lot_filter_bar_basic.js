import React, {useContext, useEffect, useRef, useState} from 'react'

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search"
import Textbox from "../../../../basic/textbox/textbox"
import FlagButton from "./flag_button/flag_button"
import CalendarPlaceholder from "../../../../basic/calendar_placeholder/calendar_placeholder"

// constants
import {
    FIELD_DATA_TYPES, FLAG_OPTIONS,
    LOT_FILTER_OPTIONS,
} from "../../../../../constants/lot_contants"
import {BASIC_FIELD_DEFAULTS} from "../../../../../constants/form_constants"

// functions external
import PropTypes from 'prop-types'
import {ThemeContext} from "styled-components"
import {useSelector} from "react-redux"
import { isMobile } from "react-device-detect"

// utils
import {immutableDelete, immutableReplace, isArray, isNonEmptyArray} from "../../../../../methods/utils/array_utils"
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "../zone_header/zone_header.style"
import AdvancedCalendarPlaceholderButton
    , {FILTER_DATE_OPTIONS} from "../../../../basic/advanced_calendar_placeholder_button/advanced_calendar_placeholder_button"
import {newPositionTemplate} from "../../../../../constants/position_constants";

const VALUE_MODES = {
    TEXT_BOX: "TEXT_BOX",
    DATE_RANGE: "DATE_RANGE",
    SINGLE_DATE: "SINGLE_DATE",
    FLAGS: "FLAGS"
}

const LotFilterBarBasic = (props) => {

    const {
        setLotFilterValue,
        lotFilterValue,
        selectedFilterOption,
        setSelectedFilterOption,
        shouldFocusLotFilter,
    } = props

    // theme
    const themeContext = useContext(ThemeContext)

    // redux state
    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

    // component state
    const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])    // array of options for field to filter by
    const [open, setOpen] = useState(isMobile ? shouldFocusLotFilter : true) // is filter options open ?
    const [valueMode, setValueMode] = useState()      // used as var in switch statement to control what component to render for entering filter value (ex: use a textbox for strings, calendar picker for dates)

    /*
    * This effect is used to set valueMode based on the current selected filter option (name / date type)
    * */
    useEffect(() => {
        const {
            label,
            dataType
        } = selectedFilterOption || {}


        // for flags, use flags mode
        if(label === LOT_FILTER_OPTIONS.flags.label) {
            setValueMode(VALUE_MODES.FLAGS)
        }

        // for date range, use date range mode
        else if(dataType === FIELD_DATA_TYPES.DATE_RANGE) {
            setValueMode((VALUE_MODES.DATE_RANGE))
        }

        // for date, use date mode
        else if(dataType === FIELD_DATA_TYPES.DATE) {
            setValueMode(VALUE_MODES.SINGLE_DATE)
        }

        // everything else, use a text box
        else {
          setValueMode(VALUE_MODES.TEXT_BOX)
        }

    }, [selectedFilterOption])

    /*
    * This effect is used to set the filter options
    *
    * This is dependent on lotTemplates, as the available fields may change when a template does
    * */
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



    return (
        <styled.ColumnContainer
            open={open}
            style={{
                flex: (open && valueMode === VALUE_MODES.TEXT_BOX) && 1,
                padding: open ? ".25rem 1rem 0 1rem" : "1rem",
                maxWidth: valueMode === VALUE_MODES.TEXT_BOX && "30rem"
            }}
        >
            <styled.Description
                css={props.descriptionCss}
                onClick={()=>setOpen(!open)}
            >
                <styled.ExpandContractIcon
                    className={open ? "fas fa-chevron-down" : "fas fa-chevron-right"}
                    onClick={()=>setOpen(!open)}
                />
                Filter
            </styled.Description>

            {/* only show content when open */}
            {open &&
            <styled.ContentContainer>
                <styled.ItemContainer>
                    <styled.OptionContainer>
                        <DropDownSearch
                            // reactDropdownSelectCss={props.reactDropdownSelectCss}
                            // dropdownCss={props.dropdownCss}
                            // valueCss={props.valueCss}
                            options={lotFilterOptions}
                            onChange={(values) => {
                                // *** selected new option ***
                                const newFilterOption = values[0]

                                // updated selectedFilterOption
                                setSelectedFilterOption(newFilterOption)
                                const {
                                    dataType
                                } = newFilterOption

                                // update filter value to appropriate default based on dataType

                                let newFilterValue = null // null is suitable for most, use as default
                                switch(dataType) {
                                    case FIELD_DATA_TYPES.DATE_RANGE:
                                        newFilterValue = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE
                                        break
                                    case FIELD_DATA_TYPES.DATE:
                                        newFilterValue = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD
                                        break
                                }
                                setLotFilterValue(newFilterValue)
                            }}
                            values={[selectedFilterOption]}
                            labelField={"label"}
                            valueField={"label"}
                            schema={"lots"}
                            style={{
                                minWidth: "15rem",
                                maxWidth: "15rem",
                                overflow: 'visible',
                                background: themeContext.bg.tertiary,
                            }}
                            containerStyle={{
                                marginRight: "1rem",
                            }}
                        />
                    </styled.OptionContainer>

                    <styled.OptionContainer
                    style={{flex:1}}>
                        { // render different component for entering value depending on value type
                            {
                                [VALUE_MODES.FLAGS]:
                                    <div
                                        style={{flex: 3}}
                                    >
                                        <DropDownSearch
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
                                                                        event.stopPropagation()
                                                                        methods.dropDown('open')
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
                                                minWidth: "10rem",
                                                flex: 1,
                                                background: themeContext.bg.tertiary,
                                                alignSelf: "stretch",
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
                                            height: "100%",
                                            background: themeContext.bg.tertiary,
                                        }}
                                        style={{
                                            alignSelf: "stretch",
                                            flex: 1,
                                            minWidth: "5rem"
                                            // width: "5rem"
                                        }}
                                        schema={"lots"}
                                    />,
                                [VALUE_MODES.DATE_RANGE]:
                                    <CalendarPlaceholder
                                        schema={"lots"}
                                        PlaceholderButton={<AdvancedCalendarPlaceholderButton
                                            filterValue={lotFilterValue}
                                            onOptionClick={(index, option) => {
												// this function toggles option in lotFilerValue at index

                                                const {
                                                    options: prevOptions = []
                                                } = lotFilterValue[index] || {}

                                                // spread current options
                                                let newOptions = [...prevOptions]

                                                // get index of new option (if it exists)
                                                const optionIndex = prevOptions.indexOf(option)

                                                // if it doesn't exist, add it
                                                if(optionIndex === -1) {
                                                    const equalsIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.EQUAL)
                                                    if(equalsIndex !== -1) {
                                                        /*
                                                            if we are adding the "greater than" condition
                                                                check if less than condition already exists
                                                                remove it if it does, as having less than, equal to, and greater than would include everything, which is pointless
                                                        */
                                                        if(option === FILTER_DATE_OPTIONS.GREATER_THAN) {
                                                            const lessThanIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.LESS_THAN)
                                                            if(lessThanIndex !== -1) {
                                                                newOptions = immutableDelete(newOptions, lessThanIndex)
                                                            }
                                                        }

                                                        /*
                                                            if we are adding the "less than" condition
                                                                check if greater than condition already exists
                                                                remove it if it does, as having less than, equal to, and greater than would include everything, which is pointless
                                                         */
                                                        else if(option === FILTER_DATE_OPTIONS.LESS_THAN) {
                                                            const greaterThanIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.GREATER_THAN)
                                                            if(greaterThanIndex !== -1) {
                                                                newOptions = immutableDelete(newOptions, greaterThanIndex)
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        // if we are adding equals condition, and the current number of conditions is one less than the max, adding the equals will have all conditions, which does not filtering, so remove one
                                                        if(prevOptions.length === Object.values(FILTER_DATE_OPTIONS).length - 1) {
                                                            newOptions = immutableDelete(newOptions, 0)
                                                        }
                                                    }

                                                    newOptions.push(option)
                                                }
                                                // if it does, remove it
                                                else {
                                                    newOptions = immutableDelete(newOptions, optionIndex)
                                                }

                                                // set filterValue with updated option
                                                setLotFilterValue(immutableReplace(lotFilterValue, {
                                                    ...lotFilterValue[index],
                                                    options: newOptions
                                                }, index))
                                            }}
                                        />}
                                        minDate={isNonEmptyArray(lotFilterValue) ? lotFilterValue[0]?.value : null}
                                        maxDate={isNonEmptyArray(lotFilterValue) ? lotFilterValue[1]?.value : null}
                                        value={isNonEmptyArray(lotFilterValue) ? lotFilterValue.map((currValue) => currValue?.value) : BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE}
                                        containerStyle={{
                                            background: "transparent",
                                            padding: "0",
                                            margin: 0,
                                        }}
                                        onChange={(val) => {
                                            // this function updates lot filter value

                                            setLotFilterValue(val.map((currItem, currIndex) => {
                                                const prevValue = isNonEmptyArray(lotFilterValue) ? lotFilterValue[currIndex] : {} // previous value
                                                return {
                                                    options: [FILTER_DATE_OPTIONS.EQUAL],   // default to use EQUALS option
                                                    ...prevValue,                           // spread previous attributes
                                                    value: currItem,                        // update value
                                                }
                                            }))
                                        }}
                                        usable={true}
                                        selectRange={true}
                                    />,
                                [VALUE_MODES.SINGLE_DATE]:
                                    <CalendarPlaceholder
                                        schema={"lots"}
                                        PlaceholderButton={<AdvancedCalendarPlaceholderButton
                                            filterValue={lotFilterValue}
                                            onOptionClick={(index, option) => {
                                                // this function toggles option in lotFilerValue (index ignored since its single value)
                                                const {
                                                    options: prevOptions = []
                                                } = lotFilterValue || {}

                                                // spread prev options
                                                let newOptions = [...prevOptions]

                                                // get index of option (if it exists)
                                                const optionIndex = prevOptions.indexOf(option)

                                                // if it doesn't exist, add it
                                                if(optionIndex === -1) {
                                                    const equalsIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.EQUAL)
                                                    if(equalsIndex !== -1) {
                                                        /*
                                                            if we are adding the "greater than" condition
                                                                check if less than condition already exists
                                                                remove it if it does, as having less than, equal to, and greater than would include everything, which is pointless
                                                        */
                                                        if(option === FILTER_DATE_OPTIONS.GREATER_THAN) {
                                                            const lessThanIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.LESS_THAN)
                                                            if(lessThanIndex !== -1) {
                                                                newOptions = immutableDelete(newOptions, lessThanIndex)
                                                            }
                                                        }

                                                        /*
                                                            if we are adding the "less than" condition
                                                                check if greater than condition already exists
                                                                remove it if it does, as having less than, equal to, and greater than would include everything, which is pointless
                                                         */
                                                        else if(option === FILTER_DATE_OPTIONS.LESS_THAN) {
                                                            const greaterThanIndex = prevOptions.indexOf(FILTER_DATE_OPTIONS.GREATER_THAN)
                                                            if(greaterThanIndex !== -1) {
                                                                newOptions = immutableDelete(newOptions, greaterThanIndex)
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        // if we are adding equals condition, and the current number of conditions is one less than the max, adding the equals will have all conditions, which does not filtering, so remove one
                                                        if(prevOptions.length === Object.values(FILTER_DATE_OPTIONS).length - 1) {
                                                            newOptions = immutableDelete(newOptions, 0)
                                                        }
                                                    }

                                                    newOptions.push(option)
                                                }

                                                // if it does exist, remove it
                                                else {
                                                    newOptions = immutableDelete(newOptions, optionIndex)
                                                }

                                                // update filter value with updated options
                                                setLotFilterValue({
                                                    ...lotFilterValue,
                                                    options: newOptions
                                                })
                                            }}
                                        />}
                                        containerStyle={{
                                            width: "8rem",
                                            height: "36px",
                                            boxShadow: "0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)",
                                        }}
                                        value={lotFilterValue?.value}
                                        onChange={(val) => {
                                            // update filer value
                                            setLotFilterValue({
                                                options: [FILTER_DATE_OPTIONS.EQUAL],   // by default, use EQUAL condition
                                                ...lotFilterValue,                      // include previous attributes (also prevents overwriting conditions with the equal that was just added if conditions have already been set)
                                                value: val,                             // set the actual value
                                            })
                                        }}
                                        usable={true}
                                    />
                            }[valueMode] ||
                            null
                        }
                    </styled.OptionContainer>
                </styled.ItemContainer>
            </styled.ContentContainer>
            }
        </styled.ColumnContainer>
    )
}

LotFilterBarBasic.propTypes = {
    setLotFilterValue: PropTypes.func,
    lotFilterValue: PropTypes.any,
    selectedFilterOption: PropTypes.object,
    setSelectedFilterOption: PropTypes.func,
    shouldFocusLotFilter: PropTypes.bool,
}

LotFilterBarBasic.defaultProps = {
    setLotFilterValue: () => {},
    lotFilterValue: null,
    selectedFilterOption: () => {},
    setSelectedFilterOption: () => {},
    shouldFocusLotFilter: false,
}

export default LotFilterBarBasic
