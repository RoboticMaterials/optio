import React, { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'
// Import Styles
import * as styled from './child_lot_fields.style'

// Import Components
import LotDateRangeRow from '../../../../../../side_bar/content/cards/lot/lot_date_range_row/lot_date_range_row'
import LotSimpleRow from '../../../../../../side_bar/content/cards/lot/lot_simple_row/lot_simple_row'
import LotDateRow from '../../../../../../side_bar/content/cards/lot/lot_date_row/lot_date_row'

// Import Constants
import { FIELD_DATA_TYPES } from "../../../../../../../constants/lot_contants"

// Import Utils
import { getCustomFields, formatLotNumber } from '../../../../../../../methods/utils/lot_utils'


const ChildLotFields = (props) => {

    const {
        child
    } = props;

    const {
        mergedQuantity,
        fromStationID,
        mergeStationID,
        lotID
    } = child

    const stations = useSelector(state => state.stationsReducer.stations);
    const cards = useSelector(state => state.cardsReducer.cards);
    const currentLot = useRef(cards[lotID]).current
    const formattedLotNumber = useRef(formatLotNumber(currentLot.lotNumber)).current

    const renderLotFields = useMemo(() => {
        const fields = getCustomFields(currentLot.lotTemplateId, currentLot, null)
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
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
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
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
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
                            labelStyle={{ fontSize: '1rem' }}
                            dateStyle={{ fontSize: '1rem' }}
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
                            labelStyle={{ fontSize: '1rem' }}
                            dateStyle={{ fontSize: '1rem' }}
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
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
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
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
                        />
                    )
                }
            }
        })

    }, [currentLot])


    return (
        <styled.LotFieldsContainer>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '1rem'}}>
                <styled.LotName>{currentLot.name}</styled.LotName>
                <styled.LotNumber>{formattedLotNumber}</styled.LotNumber>
            </div>
            <LotSimpleRow
                label={"Merged Quantity"}
                value={`${mergedQuantity}/${currentLot.totalQuantity}`}
                labelStyle={{ fontSize: '1rem' }}
                countStyle={{ fontSize: '1rem' }}
            />

            <LotSimpleRow
                label={"Warehoused"}
                value={`${stations[fromStationID]?.name}`}
                labelStyle={{ fontSize: '1rem' }}
                countStyle={{ fontSize: '1rem' }}
            />

            <LotSimpleRow
                label={"Merged Station"}
                value={`${stations[mergeStationID]?.name}`}
                labelStyle={{ fontSize: '1rem' }}
                countStyle={{ fontSize: '1rem' }}
            />

            {renderLotFields}
        </styled.LotFieldsContainer>
    )
}

export default ChildLotFields
