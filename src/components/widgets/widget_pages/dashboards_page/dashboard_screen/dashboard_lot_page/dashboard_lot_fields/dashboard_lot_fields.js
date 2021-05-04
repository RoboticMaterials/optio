import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

// Import Styles
import * as styled from './dashboard_lot_fields.style'

// Import Components
import LotDateRangeRow from '../../../../../../side_bar/content/cards/lot/lot_date_range_row/lot_date_range_row'
import LotSimpleRow from '../../../../../../side_bar/content/cards/lot/lot_simple_row/lot_simple_row'
import LotDateRow from '../../../../../../side_bar/content/cards/lot/lot_date_row/lot_date_row'

// Import Constants
import { FIELD_DATA_TYPES, FLAG_OPTIONS } from "../../../../../../../constants/lot_contants"

// Import Utils
import { getCustomFields, getLotTotalQuantity, getBinQuantity } from '../../../../../../../methods/utils/lot_utils'


const DashboardLotFields = (props) => {

    const {
        currentLot,
        stationID,
    } = props || {}

    const processes = useSelector(state => state.processesReducer.processes)

    const count = getBinQuantity(currentLot, stationID)
    const totalQuantity = getLotTotalQuantity(currentLot)
    const processName = processes[currentLot.process_id]?.name

    const renderLotFields = useMemo(() => {
        const fields = getCustomFields(currentLot.lotTemplateId, currentLot)

        return fields.map((field, currIndex, arr) => {
            const {
                dataType,
                fieldName,
                value,
            } = field

            const key = `${fieldName}+dataType`
            const isLast = currIndex === arr.length - 1


            switch (dataType) {
                case FIELD_DATA_TYPES.STRING: {
                    return (
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                            labelStyle={{ fontSize: '1.25rem' }}
                            countStyle={{ fontSize: '1.25rem' }}
                        />
                    )
                }
                case FIELD_DATA_TYPES.EMAIL: {
                    return (
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                        />
                    )
                }
                case FIELD_DATA_TYPES.DATE: {
                    return (
                        <LotDateRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            date={value}
                        />

                    )
                }
                case FIELD_DATA_TYPES.DATE_RANGE: {
                    return (
                        <LotDateRangeRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            dateRange={value}
                            labelStyle={{ fontSize: '1.25rem' }}
                            dateStyle={{ fontSize: '1.25rem' }}
                        />
                    )
                }
                case FIELD_DATA_TYPES.URL: {
                    return (
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                        />
                    )
                }
                case FIELD_DATA_TYPES.INTEGER: {
                    return (
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            value={value}
                        />
                    )
                }
            }
        })

    }, [currentLot])


    return (
        <styled.LotFieldsContainer>
            <LotSimpleRow
                label={"Quantity"}
                value={`${count}/${totalQuantity}`}
            />

            {processName &&
                <LotSimpleRow
                    label={"Process"}
                    value={processName}
                />
            }
            {renderLotFields}
        </styled.LotFieldsContainer>
    )
}

export default DashboardLotFields