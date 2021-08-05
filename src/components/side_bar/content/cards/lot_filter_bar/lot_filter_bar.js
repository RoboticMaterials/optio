import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useSelector } from 'react-redux';

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search"
import Textbox from "../../../../basic/textbox/textbox"
import FlagButton from "./flag_button/flag_button"
import CalendarPlaceholder from "../../../../basic/calendar_placeholder/calendar_placeholder"
import NumberInput from '../../../../basic/number_input/number_input'

// constants
import { FIELD_DATA_TYPES, FLAG_OPTIONS, LOT_FILTER_OPTIONS } from "../../../../../constants/lot_contants"
import { BASIC_FIELD_DEFAULTS } from "../../../../../constants/form_constants"

// functions external
import PropTypes from 'prop-types'
import { ThemeContext } from "styled-components"
import { isMobile } from "react-device-detect"

// utils
import { deepCopy } from '../../../../../methods/utils/utils'
import { isArray } from "../../../../../methods/utils/array_utils"
import { jsDateToString } from '../../../../../methods/utils/card_utils'
import { stringifyFilter, getAllTemplateFields } from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "./lot_filter_bar.style"
import { uuidv4 } from '../../../../../methods/utils/utils';

const VALUE_MODES = {
    TEXT_BOX: "TEXT_BOX",
    DATE_RANGE: "DATE_RANGE",
    SINGLE_DATE: "SINGLE_DATE",
    FLAGS: "FLAGS"
}

const COMPARITOR_OPERATORS = [
    {label: 'Less than', value: '<'},
    {label: 'Less than or Equal to', value: '<='},
    {label: 'Equal to', value: '='},
    {label: 'Greater than or Equal to', value: '>='},
    {label: 'Greater than', value: '>'},
]

const SET_OPERATORS = [
    {label: 'Contains All', value: 'all'},
    {label: 'Contains Any', value: 'any'},
    {label: 'Does not Contain Any', value: 'not_any'},
    {label: 'Does not Contain All', value: 'not_all'},
]

// Possible Options
// name | StringField - Contains - TextField
// process - Dropdown (processes)
// flags - contains all | contains any | dn contain all | dn contain any - FlagDropdown 
// SingleDate | DateRangeSingle - gt/lt/et/gte/lte | isBetween - DateField
// NumField | quantity | initQuantity - gt/lt/et/gte/gle | isBetween - NumField

const LotFilterBar = (props) => {

    const {
        filters,
        onAddFilter,
        onRemoveFilter,
    } = props;

    // theme
    const themeContext = useContext(ThemeContext)

    const [open, setOpen] = useState(false);
    const [canAddFilter, setCanAddFilter] = useState(false);
    const [selectedFilterKey, setSelectedFilterKey] = useState(null);
    const [selectedFilterOperator, setSelectedFilterOperator] = useState(null);
    const [selectedFilterOptions, setSelectedFilterOptions] = useState(null)
    const [lotFilterKeyOptions, setLotFilterKeyOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])    // array of options for field to filter by

    // redux state
    const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates) || {}
    const processes = useSelector(state => Object.values(state.processesReducer.processes))

    useEffect(() => {
        document.addEventListener("keydown", (e) => e.keyCode === 27 && setOpen(false), false);
    
        return () => {
          document.removeEventListener("keydown", (e) => e.keyCode === 27 && setOpen(false), false);
        };
      }, []);

    /*
        * This effect is used to set the filter options
        *
        * This is dependent on lotTemplates, as the available fields may change when a template does
        * */
    useEffect(() => {
        const templateFields = getAllTemplateFields(lotTemplates)

        let tempLotFilterKeyOptions = [...Object.values(LOT_FILTER_OPTIONS)]

        templateFields.forEach((currTemplateField) => {

            const {
                dataType,
                label
            } = currTemplateField

            if (dataType === FIELD_DATA_TYPES.DATE_RANGE) {
                tempLotFilterKeyOptions.push({
                    ...currTemplateField,
                    label: `${label} (start)`,
                    index: 0,
                    fieldName: label
                })
                tempLotFilterKeyOptions.push({
                    ...currTemplateField,
                    label: `${label} (end)`,
                    index: 1,
                    fieldName: label
                })
            }
            else {
                tempLotFilterKeyOptions.push({
                    ...currTemplateField,
                    fieldName: label
                })
            }
        })

        setLotFilterKeyOptions(tempLotFilterKeyOptions)
    }, [lotTemplates])

    const renderActiveFilters = useMemo(() => {
        return (
            <styled.ActiveFiltersContainer>
                {filters.map(filter => <styled.ActiveFilter>
                    {stringifyFilter(filter)}
                    <styled.RemoveIcon
                        className={"fas fa-times"}
                        onClick={() => onRemoveFilter(filter._id)}
                    />
                </styled.ActiveFilter>)}
            </styled.ActiveFiltersContainer>
        )
        
    }, [filters])

    const onChangeFilterKey = (values) => {
        // update filter value to appropriate default based on dataType
        let newFilterValueType = null // null is suitable for most, use as default
        switch(values[0].dataType) {
            case FIELD_DATA_TYPES.DATE_RANGE:
                newFilterValueType = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE
                break
            case FIELD_DATA_TYPES.DATE:
                newFilterValueType = BASIC_FIELD_DEFAULTS.CALENDAR_FIELD
                break
        }


        setSelectedFilterKey(values[0])
        setSelectedFilterOperator(null)
    }

    const onChangeOperatorOption = (values) => {
        setSelectedFilterOperator(values[0])
    }

    const onChangeFilterOptions = (values) => {
        setSelectedFilterOptions(values)
    }

    const handleCreateNewFilter = () => {

        const newFilter = {
            ...selectedFilterKey,
            operator: selectedFilterOperator.value,
            options: selectedFilterOptions,
            _id: uuidv4(),
        }

        onAddFilter(newFilter);
        setSelectedFilterKey(null);
        setSelectedFilterOperator(null);
        setSelectedFilterOptions(null);
        setOpen(false)
        
    }

    const renderFilterOperatorSelector = useMemo(() => {

        if (!selectedFilterKey) { return  null }

        switch (selectedFilterKey.dataType) {

            case 'STRING':
                setSelectedFilterOperator({label: 'contains', value: 'contains'})
                setCanAddFilter(false)
                return null;

            case 'INTEGER':
                return (
                    <DropDownSearch
                        options={COMPARITOR_OPERATORS}
                        onChange={(values) => {
                            onChangeOperatorOption(values)
                            setCanAddFilter(false)
                        }}
                        values={!!selectedFilterOperator ? [selectedFilterOperator] : []}
                        labelField={"label"}
                        valueField={"value"}
                        schema={"lots"}
                        style={{
                            overflow: 'visible',
                            minWidth: '10rem',
                            background: themeContext.bg.primary,
                        }}
                    />
                )

            case 'PROCESSES':
                setSelectedFilterOperator({label: 'is', value: 'is'})
                setCanAddFilter(false)
                return null;

            case 'FLAGS':
                return (
                    <DropDownSearch
                        options={SET_OPERATORS}
                        onChange={(values) => {
                            onChangeOperatorOption(values)
                            setCanAddFilter(false)
                        }}
                        values={!!selectedFilterOperator ? [selectedFilterOperator] : []}
                        labelField={"label"}
                        valueField={"value"}
                        schema={"lots"}
                        style={{
                            overflow: 'visible',
                            minWidth: '10rem',
                            background: themeContext.bg.primary,
                        }}
                    />
                )

            case 'DATE': // Calendar Items
            case 'DATE_RANGE':
                return (
                    <DropDownSearch
                        options={COMPARITOR_OPERATORS}
                        onChange={(values) => {
                            onChangeOperatorOption(values)
                            setCanAddFilter(false)
                        }}
                        values={!!selectedFilterOperator ? [selectedFilterOperator] : []}
                        labelField={"label"}
                        valueField={"value"}
                        schema={"lots"}
                        style={{
                            overflow: 'visible',
                            minWidth: '10rem',
                            background: themeContext.bg.primary,
                        }}
                    />
                )
            
        }

    }, [selectedFilterKey])

    const renderFilterOptionsSelector = useMemo(() => {

        if (!selectedFilterKey || !selectedFilterOperator) {return null}

        switch (selectedFilterKey.dataType){

            case 'STRING':
                return (
                    <Textbox
                        placeholder='Contains'
                        onChange={(e) => {
                            onChangeFilterOptions({text: e.target.value})
                            setCanAddFilter(true)
                        }}
                        focus={true}
                        inputStyle={{
                            height: "2.2rem",
                            background: themeContext.bg.primary,
                        }}
                        style={{
                            alignSelf: "stretch",
                            flex: 1,
                            minWidth: "5rem",
                        }}
                        schema={"lots"}
                    />
                )

            case 'INTEGER':
                return (
                    <Textbox
                        placeholder='Number'
                        onChange={(e) => {
                            onChangeFilterOptions({num: parseFloat(e.target.value)})
                            setCanAddFilter(true)
                        }}
                        focus={true}
                        inputStyle={{
                            height: "2.2rem",
                            background: themeContext.bg.primary,
                        }}
                        style={{
                            alignSelf: "stretch",
                            flex: 1,
                            minWidth: "5rem"
                        }}
                        schema={"lots"}
                    />
                )

            case "PROCESSES":
                return (
                    <DropDownSearch
                        multi={true}
                        options={processes}
                        onChange={values => {
                            onChangeFilterOptions({processes: values})
                            setCanAddFilter(true)
                        }}
                        values={selectedFilterOptions?.processes || []}
                        labelField={"name"}
                        valueField={"_id"}
                        schema={"lots"}
                        style={{
                            overflow: 'visible',
                            minWidth: '15rem',
                            marginBottom: '0.5rem',
                            background: themeContext.bg.primary,
                        }}
                    />
                )

            case "FLAGS":
                return (
                    <DropDownSearch
                        multi={true}
                        options={Object.values(FLAG_OPTIONS)}
                        onChange={(values) => {
                            setSelectedFilterOptions({flags: values.map(val => val.id)})
                            setCanAddFilter(true)
                        }}
                        onRemoveItem={(values) => {
                            setSelectedFilterOptions({flags: values.map(val => val.id)})
                            setCanAddFilter(true)
                        }}
                        onClearAll={() => {
                            setSelectedFilterOptions({flags: []})
                            setCanAddFilter(true)
                        }}
                        labelField={"id"}
                        valueField={"id"}
                        schema={"lots"}
                        contentRenderer={({ props, state, methods }) => {

                            const {
                                values = []
                            } = state || {}

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
                            background: themeContext.bg.primary,
                            alignSelf: "stretch",
                        }}
                    />
                )

            case "DATE": // Calendar Item
            case "DATE_RANGE":
                return (
                    <>
                    <styled.RowContainer style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                        <styled.DualSelectionButton
                            style={{ borderRadius: '.5rem 0rem 0rem .5rem' }}
                            onClick={() => {
                                onChangeFilterOptions({isRelative: false})
                                setCanAddFilter(false)
                            }}
                            selected={!selectedFilterOptions?.isRelative}
                        >
                            Date
                        </styled.DualSelectionButton>

                        <styled.DualSelectionButton
                            style={{ borderRadius: '0rem .5rem .5rem 0rem' }}
                            onClick={() => {
                                onChangeFilterOptions({isRelative: true, relativeDays: 0})
                                setCanAddFilter(true)
                            }}
                            selected={selectedFilterOptions?.isRelative}

                        >
                            Relative
                    </styled.DualSelectionButton>
                    </styled.RowContainer>
                    {selectedFilterOptions?.isRelative ?
                        <div style={{marginBottom: '0.5rem'}}>
                            <styled.Description style={{width: '100%', justifyContent: 'center', display: 'flex'}}>Days relative to current date</styled.Description>
                            <NumberInput 
                                onPlusClick={(e) => onChangeFilterOptions({...selectedFilterOptions, relativeDays: selectedFilterOptions.relativeDays+1})}
                                onMinusClick={(e) => onChangeFilterOptions({...selectedFilterOptions, relativeDays: selectedFilterOptions.relativeDays-1})}
                                onInputChange={e => onChangeFilterOptions({...selectedFilterOptions, relativeDays: parseInt(e.target.value)})}
                                inputStyle={{backgroundColor: themeContext.bg.primary, borderRadius: '0.4rem', height: '3rem', fontSize: '2rem'}}
                                buttonStyle={{fontSize: '2.6rem'}}
                                value={selectedFilterOptions.relativeDays}
                            />
                        </div>
                        :
                        <CalendarPlaceholder
                            schema={"lots"}
                            containerStyle={{
                                width: "100%",
                                height: "36px",
                                boxShadow: "0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1)",
                                backgroundColor: themeContext.bg.primary
                            }}
                            value={selectedFilterOptions?.date || null}
                            onChange={val => {
                                onChangeFilterOptions({date: val})
                                setCanAddFilter(true)
                            }}
                            usable={true}
                        />
                    }
                    </>
                )
        }


    })

    return (
        <styled.ColumnContainer>
            <styled.Description
                css={props.descriptionCss}
            >
                Filters
            </styled.Description>
            <styled.FiltersContainer>
                <styled.ExpandableContainer open={open}>
                    <styled.ActiveContainer open={open}>
                        {renderActiveFilters}
                        <styled.ExpandContractIcon
                            className={open ? "fas fa-chevron-up" : "fas fa-ellipsis-h"}
                            onClick={() => setOpen(!open)}
                        />
                    </styled.ActiveContainer>
                    
                    {open && 
                        <styled.NewFilterContainer>
                            <styled.Description>New Filter</styled.Description>
                            <DropDownSearch
                                options={lotFilterKeyOptions}
                                onChange={onChangeFilterKey}
                                values={!!selectedFilterKey ? [selectedFilterKey] : []}
                                labelField={"label"}
                                valueField={"label"}
                                schema={"lots"}
                                
                                style={{
                                    overflow: 'visible',
                                    minWidth: '15rem',
                                    marginBottom: '0.5rem',
                                    background: themeContext.bg.primary,
                                }}
                            />
                            {!!selectedFilterKey && 
                                <div style={{marginBottom: "0.5rem"}}>
                                    {renderFilterOperatorSelector}
                                </div>
                            }
                            {!!selectedFilterOperator && 
                                <div style={{marginBottom: "0.5rem"}}>
                                    {renderFilterOptionsSelector}
                                </div>
                            }
                            {canAddFilter &&
                                <styled.AddFilterButton onClick={handleCreateNewFilter}>Add Filter</styled.AddFilterButton>
                            }
                        </styled.NewFilterContainer>
                    }
                </styled.ExpandableContainer>
            </styled.FiltersContainer>
        </styled.ColumnContainer>
    )
    
}

LotFilterBar.propTypes = {

}

LotFilterBar.defaultProps = {

}

export default LotFilterBar;
