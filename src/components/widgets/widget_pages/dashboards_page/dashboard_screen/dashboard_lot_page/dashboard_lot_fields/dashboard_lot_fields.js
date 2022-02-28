import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {useParams, useHistory} from 'react-router-dom'
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

import { useTranslation } from 'react-i18next';

import  uuid  from "uuid"

const DashboardLotFields = (props) => {

  const { t, i18n } = useTranslation();

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
    const history = useHistory()
    const lotSelected = history.location.pathname.includes('lots')
    const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates)
    // If its a warehouse then use station before this one
    const count = !!warehouse ? getBinCount(currentLot, getPreviousWarehouseStation(currentLot.process_id, stationID)._id) : getBinCount(currentLot, stationID)

    const totalQuantity = getLotTotalQuantity(currentLot, currentLot)
    const processName = processes[currentLot.process_id]?.name
    const renderLotFields = useMemo(() => {
        const fields = getCustomFields(currentLot.lotTemplateId, currentLot, dashboardID, true, lotSelected)
        return fields.map((field, currIndex, arr) => {
            const {
                dataType,
                fieldName,
                value,
            } = field

            const key = uuid.v4()/*`${fieldName}+dataType`*/
            const isLast = currIndex === arr.length - 1
            if(!!value){
              switch (dataType) {
                  case FIELD_DATA_TYPES.STRING: {
                      return (
                        <div key = {key} style = {{marginTop:'.5rem'}}>
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
                        <div key = {key}  style = {{marginTop:'.5rem'}}>
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
                        <div key = {key} style = {{marginTop:'.5rem'}}>
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
                        <div key = {key} style = {{marginTop:'.5rem'}}>
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
                        <div key = {key} style = {{marginTop:'.5rem'}}>
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
                        <div key = {key} style = {{marginTop:'.5rem'}}>
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
          }
        })

    }, [currentLot])


    return (
        <styled.LotFieldsContainer>
        <div style = {{marginTop:'0.5rem', marginBottom: '1.2rem', display: 'flex', flexDirection: 'row', background: 'transparent', justifyContent: 'spaceAround'}}>
          <LotFlags
            flags={currentLot?.flags}
            containerStyle={{ alignSelf: "center", flex: '1' }}
          />
        </div>
        <div style = {{marginTop:'0.5rem', marginBottom: '.8rem'}}>
          <LotSimpleRow
              label={currentLot.name? currentLot.name : (currentLot.lotNum)?.toString() || '???'}
              labelStyle={{fontSize: '1.3rem' }}
            />
          </div>

          <div style = {{marginTop:'0.5rem'}}>
            <LotSimpleRow
                label={lotTemplates[currentLot.lotTemplateId].name === 'Basic' ? 'Quantity' : lotTemplates[currentLot.lotTemplateId].displayNames.count}
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
