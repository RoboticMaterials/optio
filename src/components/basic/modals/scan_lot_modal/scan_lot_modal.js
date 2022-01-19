import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom'


import Button from "../../../basic/button/button";
import Textbox from "../../../basic/textbox/textbox";
import LotContainer from "../../../../components/side_bar/content/cards/lot/lot_container"

// actions
import {showLotScanModal} from '../../../../redux/actions/sidebar_actions'
import {getStationCards} from '../../../../redux/actions/card_actions'
// styles
import * as styled from './scan_lot_modal.style'

const ScanLotModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,
        handleClose,
        children,
        id,
    } = props


    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state =>state.stationsReducer.stations)

    const dispatch = useDispatch()
    const dispatchGetStationCards = (stationId) => dispatch(getStationCards(stationId))
    const dispatchShowLotScanModal = (bool) => dispatch(showLotScanModal(bool))
    const history = useHistory()

    const renderLotStations = () => {

      return Object.values(cards).map((card) => {
            if(card.lotNum == id){

          return  Object.values(stations).map((station) => {
                for(const i in card.bins){
                  if(i === station._id){
                    return (
                      <styled.ListItem
                        onClick={() => {
                          let result = dispatchGetStationCards(i)
                          result.then((res) => {
                            history.push(`/locations/${station._id}/dashboards/${stations[station._id].dashboards[0]}/lots/${card._id}`)
                            dispatchShowLotScanModal(null)
                           })
                        }}
                      >
                      <styled.HoverContainer >
                          <styled.ListItemIcon
                              className='fas fa-user-alt'
                          />
                          <styled.ListItemTitle>{station.name}</styled.ListItemTitle>
                        </styled.HoverContainer>

                          <LotContainer
                              lotId={card._id}
                              binId={station._id}
                              enableFlagSelector={false}
                              key={card._id}
                              containerStyle={{
                                  minWidth: "95%",
                                  marginBottom: "1rem"
                              }}
                          />
                      </styled.ListItem>
                    )
                  }

                }
              })
            }
          })
        }


    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>{title}</styled.Title>

                <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={handleClose}/>
            </styled.Header>
            <styled.BodyContainer>
                <styled.ContentContainer>
                    {children}
                </styled.ContentContainer>

                {renderLotStations()

                }

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default ScanLotModal
