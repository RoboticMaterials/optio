import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search"
import RotateButton from "../../../../basic/rotate_button/rotate_button"

// functions external
import PropTypes from 'prop-types'
import { ThemeContext } from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { isMobile } from "react-device-detect"

// styles
import * as styled from "../zone_header/zone_header.style"

// utils
import { getAllTemplateFields } from "../../../../../methods/utils/lot_utils"
import {postSettings, getSettings} from '../../../../../redux/actions/settings_actions'

import {
    FIELD_DATA_TYPES,
    LOT_FILTER_OPTIONS,
    LOT_SORT_OPTIONS,
    SUMMMARY_LOT_SORT_OPTIONS,
    SORT_DIRECTIONS
} from "../../../../../constants/lot_contants"

const LotSortBar = (props) => {

    const {
        sortMode,
        sortDirection,
        setSortMode,
        setSortChanged,
        setSortDirection,
    } = props

    const params = useParams()

    const {
        dashboardID,
    } = params || {}
    
    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}
    const dashboard = useSelector(state => state.dashboardsReducer.dashboards)[dashboardID]
    const settings = useSelector(state => state.settingsReducer.settings)

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchGetSettings = () => dispatch(getSettings())

    const [lotSortOptions, setLotSortOptions] = useState(dashboardID ? [...Object.values(LOT_SORT_OPTIONS)] : [...Object.values(SUMMMARY_LOT_SORT_OPTIONS)])

    useEffect(() => {
        const templateFields = getAllTemplateFields(lotTemplates)

        let tempLotSortOptions = dashboardID ? [...Object.values(LOT_SORT_OPTIONS)] : [...Object.values(SUMMMARY_LOT_SORT_OPTIONS)]

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
        <styled.ColumnContainer>
            <styled.Description
                css={props.descriptionCss}
            >

                Sort
            </styled.Description>
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
                            onChange={async(values) => {
                                setSortChanged(true)
                                // set sort mode
                                setSortMode(values[0])
                                setTimeout(() => {
                                  let settingsPromise = dispatchGetSettings()
                                  settingsPromise.then(response =>{
                                    dispatchPostSettings({
                                      ...response,
                                      lotSummarySortValue: values[0]
                                    })
                                })
                              }, 4000);
                            }}
                            values={[sortMode]}
                            labelField={"label"}
                            valueField={"label"}
                            schema={"lots"}
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                minWidth: "10rem",
                                maxWidth: "15rem",
                                background: themeContext.bg.secondary
                            }}
                        />
                        <RotateButton
                            schema={"lots"}
                            state = {sortDirection.id}
                            iconName1={'fas fa-arrow-up'}
                            containerCss={styled.rotateButtonContainerCss}
                            iconCss={styled.rotateButtonIconCss}
                            setSortChanged = {setSortChanged}
                            onStateOne={async() => {
                              // set sort direction
                              setSortDirection(SORT_DIRECTIONS.DESCENDING)
                              setTimeout(() => {
                                let settingsPromise = dispatchGetSettings()
                                settingsPromise.then(response => {
                                  dispatchPostSettings({
                                      ...response,
                                      lotSummarySortDirection: SORT_DIRECTIONS.DESCENDING
                                  })
                                })
                              }, 4000);

                            }}
                            onStateTwo={async() => {
                            // set sort direction
                              setSortDirection(SORT_DIRECTIONS.ASCENDING)
                              setTimeout(() => {
                                let settingsPromise = dispatchGetSettings()
                                settingsPromise.then(response =>{
                                  dispatchPostSettings({
                                      ...response,
                                      lotSummarySortDirection: SORT_DIRECTIONS.ASCENDING
                                  })
                                })
                              }, 4000);
                            }}
                        />
                    </styled.OptionContainer>
                </styled.ItemContainer>
            </styled.ContentContainer>
        </styled.ColumnContainer>
    )
}

LotSortBar.propTypes = {
    setSortMode: PropTypes.func,
    sortMode: PropTypes.any,
    setSortDirection: PropTypes.func,
    setSortChanged: PropTypes.func,
}

LotSortBar.defaultProps = {
    sortMode: {},
    setSortMode: () => { },
    setSortDirection: () => { },
    setSortChanged: () => { }

}

export default LotSortBar
