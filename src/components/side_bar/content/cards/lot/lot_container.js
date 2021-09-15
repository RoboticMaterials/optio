import React, { useEffect, useState, useMemo } from 'react'

// components internal
import Lot from "./lot"
import VisibilitySensor from 'react-visibility-sensor'

// functions external
import PropTypes from 'prop-types'

import { useSelector } from "react-redux"
import {useParams, useHistory} from 'react-router-dom'
// utils
import { getBinQuantity, getCustomFields, getLotTotalQuantity } from "../../../../../methods/utils/lot_utils"
import * as styled from "./lot.style"

const LotContainer = (props) => {

    const {
        lotId,
        binId,
        enableFlagSelector,
        containerStyle,
        quantity,
        ...rest
    } = props
    const history = useHistory()
    const pageName = history.location.pathname
    const isDashboard = (!!pageName.includes('/locations'))
    const params = useParams()
    const {
      dashboardID
    } = params

    const lot = useSelector(state => { return state.cardsReducer.cards[lotId] }) || {}
    const {
        bins,
        lotNumber,
        lotTemplateId,
        name,
        flags,
        process_id: processId
    } = lot || {}
    const process = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
    const station = useSelector(state => { return state.stationsReducer.stations[binId] }) || {}

    const processName = useMemo(() => process.name, [process])
    const stationName = useMemo(() => station.name, [station])
    const templateValues = useMemo(() => getCustomFields(lotTemplateId, lot), [lotTemplateId, lot])
    const totalQuantity = useMemo(() => getLotTotalQuantity(lot), [lot])
    const count = useMemo(() => getBinQuantity({ bins }, binId), [bins, binId])

    const getParts = () => {
      let parts = []
      let values = []
      if(!!lot && !!lot?.bins[station?._id]){
        for(const i in lot.bins[station._id])
          if(i!=='count'){
            parts.push(i)
            values.push(lot.bins[station._id][i])
          }
      }

      return (
        parts.map((part, index) => {
          return (
            <styled.PartContainer>
              <styled.PartName>
                {part + '-' + values[index]}
              </styled.PartName>
            </styled.PartContainer>
          )
        })
      )
    }

    return (
        <Lot
            getParts = {getParts}
            lotDisabled = {count < 1 && !!isDashboard}
            stationName={stationName}
            templateValues={templateValues}
            totalQuantity={totalQuantity}
            lotNumber={lotNumber}
            processName={processName}
            flags={flags || []}
            enableFlagSelector={enableFlagSelector}
            name={name}
            count={quantity ? quantity : count}
            id={lotId}
            isSelected={false}
            selectable={false}
            onClick={() => {

            }}
            {...rest}
            containerStyle={{ width: '80%', margin: '.5rem auto .5rem auto', ...containerStyle }}
        />

    )
}

LotContainer.propTypes = {
    lotId: PropTypes.string,
    binId: PropTypes.string
}

LotContainer.defaultProps = {
    lotId: "",
    binId: "",
    enableFlagSelector: false,
}

export default LotContainer
