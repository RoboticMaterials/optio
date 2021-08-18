import React, { Component, useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Style
import * as styled from './transfer_lot_modal.style'
import { putDashboard, getDashboards } from '../../../../../../redux/actions/dashboards_actions'

// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";


const TransferLotModal = (props) => {

    const {
        isOpen,
        close,
        options,
        lot
    } = props

    const params = useParams()
    const dispatch = useDispatch()
    const {
        stationID,
        dashboardID,
    } = params || {}

    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const currentDashboard = dashboards[dashboardID]

    useEffect(() => {

    }, [])

    const handlePutDashboard = async() => {

    }


    const renderFields = () => {
      return (
        <>
          {Object.values(options).map((process, index) =>
            <>
                <styled.ListItem
                  onClick = {()=>{
                    console.log(lot)
                  }}
                >
                  <styled.ListItemTitle>
                    {process[0].name}
                  </styled.ListItemTitle>
                </styled.ListItem>
            </>
          )}
        </>
    )
  }

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'processes'}>Select the Destination Process</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    onClick={() => {close()}}
                    style={{ cursor: 'pointer' }}
                />

            <styled.ColumnContainer>
              {renderFields()}
            </styled.ColumnContainer>


            </styled.BodyContainer>
        </styled.Container>
    )
}

export default TransferLotModal
