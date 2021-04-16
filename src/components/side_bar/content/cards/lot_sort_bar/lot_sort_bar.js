import React, { useContext, useEffect, useRef, useState } from 'react'

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search"
import RotateButton from "../../../../basic/rotate_button/rotate_button"

// functions external
import PropTypes from 'prop-types'
import { ThemeContext } from "styled-components"
import { useSelector } from "react-redux"
import { isMobile } from "react-device-detect"

// styles
import * as styled from "../zone_header/zone_header.style"

// utils
import { getAllTemplateFields } from "../../../../../methods/utils/lot_utils"
import {
    FIELD_DATA_TYPES,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants"

const LotSortBar = (props) => {

    const {
        sortMode,
        setSortMode,
        setSortDirection,
    } = props

    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}

    const [lotSortOptions, setLotSortOptions] = useState([...Object.values(LOT_SORT_OPTIONS)])
    const [open, setOpen] = useState(isMobile ? false : true)

    useEffect(() => {
        const templateFields = getAllTemplateFields()

        let tempLotSortOptions = [...Object.values(LOT_SORT_OPTIONS)]

        templateFields.forEach((currTemplateField) => {

            const {
                dataType,
                label
            } = currTemplateField

            if (dataType === FIELD_DATA_TYPES.DATE_RANGE) {
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
            open={open}
            style={{
                padding: open ? ".25rem 1rem 0 1rem" : "1rem"
            }}
        >
            <styled.Description
                css={props.descriptionCss}
                onClick={() => setOpen(!open)}
            >
                <styled.ExpandContractIcon
                    className={open ? "fas fa-chevron-down" : "fas fa-chevron-right"}
                    onClick={() => setOpen(!open)}
                />
                Sort
            </styled.Description>
            {open &&
                <styled.ContentContainer>
                    <styled.ItemContainer
                        style={{
                            flexWrap: "nowrap"
                        }}
                    >
                        <styled.OptionContainer>
                            <DropDownSearch
                                valueCss={props.valueCss}
                                options={lotSortOptions}
                                onChange={(values) => {
                                    // set sort mode
                                    setSortMode(values[0])
                                }}
                                values={[sortMode]}
                                labelField={"label"}
                                valueField={"label"}
                                schema={"lots"}
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    minWidth: "7rem",
                                    background: themeContext.bg.tertiary
                                }}
                            />
                            <RotateButton
                                schema={"lots"}
                                iconName1={"fas fa-arrow-up"}
                                containerCss={styled.rotateButtonContainerCss}
                                iconCss={styled.rotateButtonIconCss}
                                onStateOne={() => {
                                    // set sort direction
                                    setSortDirection(SORT_DIRECTIONS.ASCENDING)
                                }}
                                onStateTwo={() => {
                                    // set sort direction
                                    setSortDirection(SORT_DIRECTIONS.DESCENDING)
                                }}
                            />
                        </styled.OptionContainer>
                    </styled.ItemContainer>
                </styled.ContentContainer>
            }
        </styled.ColumnContainer>
    )
}

LotSortBar.propTypes = {
    setSortMode: PropTypes.func,
    sortMode: PropTypes.any,
    setSortDirection: PropTypes.func,
}

LotSortBar.defaultProps = {
    sortMode: {},
    setSortMode: () => { },
    setSortDirection: () => { }
}

export default LotSortBar
