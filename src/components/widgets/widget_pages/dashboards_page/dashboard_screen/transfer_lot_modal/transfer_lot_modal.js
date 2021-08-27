import React, { Component, useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Style
import * as styled from './transfer_lot_modal.style'
import { putDashboard, getDashboards } from '../../../../../../redux/actions/dashboards_actions'
import {putCard, postCard, deleteCard} from '../../../../../../redux/actions/card_actions'
import {uuidv4} from '../../../../../../methods/utils/utils'

// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";
import QuantityModal from '../../../../../../components/basic/modals/quantity_modal/quantity_modal'
import TaskAddedAlert from "../../../../../../components/widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
import { ADD_TASK_ALERT_TYPE } from "../../../../../../constants/dashboard_constants";


const TransferLotModal = (props) => {

    const {
        isOpen,
        close,
        options,
        lot
    } = props
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const {
        stationID,
        dashboardID,
    } = params || {}


    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const cards = useSelector(state=>state.cardsReducer.cards)
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchPostCard = async (card) => await dispatch(postCard(card))
    const dispatchDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))

    const currentDashboard = dashboards[dashboardID]
    const [selectedProcess, setSelectedProcess] = useState(null)
    const [addTaskAlert, setAddTaskAlert] = useState(null)
    const [showQuantityModal, setShowQuantityModal] = useState(false)

    const onBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)
    }

    const handleTransferLot = async(process, quantity) => {

      let remainingCount = lot.bins[stationID].count - quantity
      let matchingCard = null

      if(!!lot.multipleProcesses){
        Object.values(cards).forEach((card)=>{
          if(card.process_id === process._id && card.lotNumber === lot.lotNumber){
            matchingCard = card
          }
        })
      }

      if(remainingCount == 0){
        if(!!matchingCard){
          const updatedCard = {
            ...matchingCard,
            bins: {
              ...matchingCard.bins,
              [stationID]: {
                count: !!matchingCard.bins[stationID]? matchingCard.bins[stationID].count + quantity : quantity
              }
            }
          }
          console.log(updatedCard)

          onBack()
          await dispatchPutCard(updatedCard, matchingCard._id)
          await dispatchDeleteCard(lot._id,lot.process_id)
        }
        else{
          const updatedCard = {
            ...lot,
            process_id: process._id,
            processName: process.name,
          }
          await dispatchPutCard(updatedCard, lot._id)
          onBack()
        }
      }

      else{
        const updatedCard = {
          ...lot,
          multipleProcesses: true,
          bins: {
            ...lot.bins,
            [stationID]: {
              ...lot.bins[stationID],
              count: remainingCount,
            }
          }
        }

      if(!!matchingCard){
        const updatedCard = {
          ...matchingCard,
          bins: {
            ...matchingCard.bins,
            [stationID]: {
              count: !!matchingCard.bins[stationID]? matchingCard.bins[stationID].count + quantity : quantity
            }
          }
        }

        await dispatchPutCard(updatedCard, matchingCard._id)

        const updatedExistingCard = {
          ...lot,
          bins: {
            ...lot.bins,
            [stationID]: {
              ...lot.bins[stationID],
              count: remainingCount
            }
          }
        }
        await dispatchPutCard(updatedExistingCard, lot._id)
        onBack()



      }
      else{
        const newCard = {
          ...lot,
          process_id: process._id,
          multipleProcesses: true,
          processName: process.name,
          bins: {
            [stationID]: {
              ...lot.bins[stationID],
              count: quantity
            }
          }
        }
        //console.log(updatedCard)
        await dispatchPutCard(updatedCard, lot._id)

        await dispatchPostCard(newCard)
        .then((result) => {
          const updatedPostedCard = {
            ...result,
            lotNumber: lot.lotNumber,
            multipleProcesses: true
          }

          dispatchPutCard(updatedPostedCard, result._id)
          onBack()
        })
      }
    }
  }




    const renderFields = () => {
      return (
        <>
          {Object.values(options).map((process, index) =>
            <>
                <styled.ListItem
                  onClick = {()=>{
                    setShowQuantityModal(true)
                    setSelectedProcess(process)
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

  const renderConfirmation = () => {
    setAddTaskAlert({
        type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
        label: "Success! " + lot.name + " has been transferred to " + selectedProcess[0].name,
    })
    return (
      setTimeout(() => setAddTaskAlert(null), 2500),
      setTimeout(() => close(), 2500)
    )
  }
    return (
      <>
      {!!addTaskAlert ?
        <TaskAddedAlert
            containerStyle={{
                'position': 'absolute',
                'z-index': '5000'
            }}
            {...addTaskAlert}
            visible={!!addTaskAlert}
        />
        :
        <>
        {!!showQuantityModal &&
          <QuantityModal
              //validationSchema={quantityOneSchema}
              maxValue={!!lot.bins[stationID] ? lot.bins[stationID].count : 1}
              minValue={1}
              infoText={''}
              isOpen={true}
              title={"Select Quantity"}
              onRequestClose={() => setShowQuantityModal(false)}
              onCloseButtonClick={() => setShowQuantityModal(false)}
              handleOnClick2={(quantity) => {
                  handleTransferLot(selectedProcess[0], quantity)
                  setShowQuantityModal(false)
                  renderConfirmation()
                }}
              handleOnClick1={() => {
                setShowQuantityModal(false)
              }}
              button_2_text={"Confirm"}
              button_1_text={"Cancel"}
          />
        }
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
        </>
      }
    </>
  )
}

export default TransferLotModal
