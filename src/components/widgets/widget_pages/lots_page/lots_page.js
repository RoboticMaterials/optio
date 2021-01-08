import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'


import ReactList from 'react-list';
import CardEditor from "../../../side_bar/content/cards/card_editor/card_editor";

// Import styles
import * as styled from './lots_page.style'
import { ThemeContext } from 'styled-components';
import Button from '../../../../components/basic/button/button'

import {widgetLoaded} from '../../../../redux/actions/locations_actions'
import { hoverStationInfo } from '../../../../redux/actions/stations_actions'
import * as sidebarActions from "../../../../redux/actions/sidebar_actions"
import {showEditor} from '../../../../redux/actions/card_actions'


// Import Actions


// TODO: Commented out charts for the time being (See comments that start with TEMP)
const LotsPage = (props) => {

    const params = useParams()
    const stationID = params.stationID
    const dispatch = useDispatch()
    const history = useHistory()

    const onWidgetLoaded = (bool) => dispatch(widgetLoaded(bool))
    const onShowSideBar = (bool) => dispatch(sidebarActions.setOpen(bool))
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onShowCardEditor = (bool) => dispatch(showEditor(bool))

    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const locations = useSelector(state => state.locationsReducer.locations)
    const cards = useSelector(state=>state.cardsReducer.cards)
    const showCardEditor = useSelector(state=>state.cardsReducer.showEditor)
    const [locationName, setLocationName] = useState("")
    const location = locations[stationID]
    const [selectedCard, setSelectedCard] = useState(null)
    console.log(cards)

    // update location properties
    useEffect(() => {
        const location = locations[stationID]
        setLocationName(location.name)
    }, [stationID, locations])

    const goToCardPage = () => {
        onWidgetLoaded(false)
        onShowSideBar(true)
        onHoverStationInfo(null)
        const currentPath = history.location.pathname
        history.push('/lots/summary')
    }

    const openEditor = (cardId, processId, binId) => {
      onShowCardEditor(true)
      setSelectedCard({cardId, processId, binId})
    }

    return (

      <styled.LotsContainer>

        {showCardEditor &&
        <CardEditor
            isOpen={showCardEditor}
            onAfterOpen={null}
            cardId={selectedCard ? selectedCard.cardId : null}
            processId={selectedCard ? selectedCard.processId : null}
            binId={selectedCard ? selectedCard.binId : null}
            close={()=>{
                onShowCardEditor(false)
                setSelectedCard(null)
            }}
        />
        }

        <styled.HeaderContainer>
            <styled.Header>
                <styled.StationName>{locationName}</styled.StationName>
            </styled.Header>
        </styled.HeaderContainer>

          <styled.SubtitleContainer>
            <styled.Subtitle>Lots at {locationName}:</styled.Subtitle>
            <Button
                schema={'devices'}
                onClick = {goToCardPage}
            >
                Go To Card View
            </Button>
          </styled.SubtitleContainer>

       {Object.values(cards).map((card, ind) =>
         <>
          {!!card.bins[location._id] &&
              <styled.ListItemRect>
                    <styled.RowContainer>
                      <styled.ColumnContainer1>
                      <styled.ListSubtitle>Lot Name:</styled.ListSubtitle>
                      <styled.ListContent>{card.name}</styled.ListContent>
                    </styled.ColumnContainer1>

                    <styled.ColumnContainer2>
                      <styled.ListSubtitle>Quantity:</styled.ListSubtitle>
                      <styled.ListContent>{card.bins[location._id].count}</styled.ListContent>
                    </styled.ColumnContainer2>


                      <styled.ColumnContainer2>
                        <styled.ListSubtitle>End Date:</styled.ListSubtitle>
                        {!!card.end_date &&
                          <styled.ListContent>{card.end_date.month+1 + '/' + card.end_date.day +'/' + card.end_date.year}</styled.ListContent>
                        }
                      </styled.ColumnContainer2>


                  <styled.ListItemIcon
                      className={'fas fa-edit'}
                      onClick = {()=>{
                        openEditor(card._id, card.process_id, location._id)

                      }}
                      />
                  </styled.RowContainer>
              </styled.ListItemRect>
        }
           </>
        )}

      </styled.LotsContainer>
    )
  }

export default LotsPage
