import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {useParams} from 'react-router-dom'
// Import Styles
import * as styled from './dashboard_lot_fields.style'

// Import Components
import LotDateRangeRow from '../../../../../../side_bar/content/cards/lot/lot_date_range_row/lot_date_range_row'
import LotSimpleRow from '../../../../../../side_bar/content/cards/lot/lot_simple_row/lot_simple_row'
import LotDateRow from '../../../../../../side_bar/content/cards/lot/lot_date_row/lot_date_row'
import LotFlags from "../../../../../../side_bar/content/cards/lot/lot_flags/lot_flags";
import Button from '../../../../../../basic/button/button'

// Import Constants
import { FIELD_DATA_TYPES } from "../../../../../../../constants/lot_contants"

// Import Utils
import { getCustomFields, getLotTotalQuantity, getBinCount } from '../../../../../../../methods/utils/lot_utils'
import { getPreviousWarehouseStation } from '../../../../../../../methods/utils/processes_utils'


const DashboardLotFields = (props) => {

    const {
        currentLot,
        stationID,
        warehouse,
        onWorkInstructionsClick
    } = props || {}
    const params = useParams()

    const {
      dashboardID
    } = params

    const processes = useSelector(state => state.processesReducer.processes)
    const cards = useSelector(state => state.cardsReducer.cards)

    // If its a warehouse then use station before this one
    const count = !!warehouse ? getBinCount(currentLot, getPreviousWarehouseStation(currentLot.process_id, stationID)._id) : getBinCount(currentLot, stationID)

    const totalQuantity = getLotTotalQuantity(currentLot, currentLot)
    const processName = processes[currentLot.process_id]?.name
    const renderLotFields = useMemo(() => {
        const fields = getCustomFields(currentLot.lotTemplateId, currentLot, dashboardID)
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
                      <div style = {{marginTop:'.5rem'}}>
                          <LotSimpleRow
                              key={key}
                              label={fieldName}
                              value={value}
                              isLast={isLast}
                              labelStyle={{ fontSize: '1rem' }}
                              countStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
                case FIELD_DATA_TYPES.EMAIL: {
                    return (
                      <div style = {{marginTop:'.5rem'}}>
                          <LotSimpleRow
                              key={key}
                              label={fieldName}
                              value={value}
                              isLast={isLast}
                              labelStyle={{ fontSize: '1rem' }}
                              countStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
                case FIELD_DATA_TYPES.DATE: {
                    return (
                      <div style = {{marginTop:'.5rem'}}>
                        <LotDateRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            date={value}
                            labelStyle={{ fontSize: '1rem' }}
                            dateStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
                case FIELD_DATA_TYPES.DATE_RANGE: {
                    return (
                      <div style = {{marginTop:'.5rem'}}>
                        <LotDateRangeRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            dateRange={value}
                            labelStyle={{ fontSize: '1rem' }}
                            dateStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
                case FIELD_DATA_TYPES.URL: {
                    return (
                      <div style = {{marginTop:'.5rem'}}>
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
                case FIELD_DATA_TYPES.INTEGER: {
                    return (
                      <div style = {{marginTop:'.5rem'}}>
                        <LotSimpleRow
                            key={key}
                            label={fieldName}
                            isLast={isLast}
                            value={value}
                            labelStyle={{ fontSize: '1rem' }}
                            countStyle={{ fontSize: '1rem' }}
                          />
                        </div>
                    )
                }
            }
        })

    }, [currentLot])


    return (
        <styled.LotFieldsContainer>
        <div style = {{marginTop:'0.5rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'row', justifyContent: 'spaceAround'}}>
          <LotFlags
            flags={currentLot?.flags}
            containerStyle={{ alignSelf: "center", flex: '1' }}
          />
          <Button
            secondary
            label = 'View Work Instructions'
            style = {{flex: '3', maxWidth: '18rem', height: '3rem', color: '#5c6fff', border: 'none', boxShadow: '2px 2px 2px 2px rgba(0,0,0,0.2)'}}
            onClick = {()=>onWorkInstructionsClick()}
          />
        </div>
        <div style = {{marginTop:'0.5rem', marginBottom: '.8rem'}}>
          <LotSimpleRow
              label={currentLot.name? currentLot.name : (currentLot.lotNum).toString()}
              labelStyle={{fontSize: '1.5rem' }}
            />
          </div>

          <div style = {{marginTop:'0.5rem'}}>
            <LotSimpleRow
                label={"Quantity"}
                value={`${count}/${totalQuantity}`}
                labelStyle={{ fontSize: '1rem' }}
                countStyle={{ fontSize: '1rem' }}
              />
            </div>

            {processName &&
              <div style = {{marginTop:'.5rem'}}>
                <LotSimpleRow
                    label={"Process"}
                    value={processName}
                    labelStyle={{ fontSize: '1rem' }}
                    countStyle={{ fontSize: '1rem' }}
                />
              </div>
            }
            {renderLotFields}
        </styled.LotFieldsContainer>
    )
}

export default DashboardLotFields
