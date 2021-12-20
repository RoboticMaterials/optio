import React, {useEffect, useState, useRef, useContext, memo, useCallback, useMemo, lazy, Suspense} from 'react';

import LotContainer from './lot/lot_container'
import LotEditorContainer from './card_editor/lot_editor_container'

// external functions
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import useInterval from 'react-useinterval'
import {deleteCard, putCard, showEditor} from '../../../../redux/actions/card_actions'
import {throttle, debounce} from 'lodash'
// styles
import * as styled from './cardss.style'
import { ThemeContext } from "styled-components";
import useWindowSize from '../../../../hooks/useWindowSize'
// Utils
import {isEmpty} from "../../../../methods/utils/object_utils";
import {isControl, isControlAndShift, isShift} from "../../../../methods/utils/event_utils";
import { deepCopy } from '../../../../methods/utils/utils'


const Cardss = (props) => {

    const {
        id
    } = props

    const size = useWindowSize()
    const viewHeight = size.height*0.8
    const dispatch = useDispatch()

    const themeContext = useContext(ThemeContext)
    const process = useSelector(state => state.processesReducer.processes)[id] || {}
    const processCards = useSelector(state => state.cardsReducer.processCards)[id] || {}
    const stations = useSelector(state => state.stationsReducer.stations) || {}
    const localSettings = useSelector(state => state.localReducer.localSettings)

    const [cards, setCards] = useState(processCards)
    const [showLotEditor, setShowLotEditor] = useState(false)
    const [hoveringCard, setHoveringCard] = useState(null)
    const [cardCount, setCardCount] = useState({})
    const [partCount, setPartCount] = useState({})
    const [dragFromStation, setDragFromStation] = useState(null)
    const [draggingLotId, setDraggingLotId] = useState(null)
    const [draggingStationId, setDraggingStationId] = useState(null)
    const [orderedIds, setOrderedIds] = useState(null)
    const [startIndex, setStartIndex] = useState(null)
    const [clientY, setClientY] = useState(null)
  	const [clientX, setClientX] = useState(null)
    const [divHeight, setDivHeight] = useState(null)
    const [dragIndex, setDragIndex] = useState(null)
    const [allowHomeDrop, setAllowHomeDrop] = useState(null)
    const [mouseOffsetY, setMouseOffsetY] = useState(null)
  	const [mouseOffsetX, setMouseOffsetX] = useState(null)


    useEffect(() => {
      if(processCards) setCards(processCards)
  	}, [processCards])


    useEffect(() => {//this sets the order cards are displayed. Array of card IDs
      let tempIds = []
      tempIds[id] = []
      for(const i in process.flattened_stations){
        let statId = process.flattened_stations[i].stationID
        for(const j in processCards){
          if(!!processCards[j].bins[statId]){
            if(!tempIds[id][statId]) tempIds[id][statId] = []
            tempIds[id][statId].push(cards[j]._id)
          }
        }
      }
      setOrderedIds(tempIds)
    }, [])

    useEffect(() => {
  		if(dragIndex && startIndex){
  				setAllowHomeDrop(true)
  				let lotDiv = document.getElementById(draggingLotId)
  		}
  	}, [dragIndex])

    useEffect(() => {
      setDragIndex(dragIndexSearch())
    }, [clientY])

    useEffect(() => {//how many cards are in each column
      let tempCardCount = {}
      let tempPartCount = {}
      for(const i in process.flattened_stations){
        let cardCount = 0
        let partCount = 0
        let id = process.flattened_stations[i].stationID
        for(const j in cards){
          if(!!cards[j].bins[id]){
            cardCount+=1
            partCount+=cards[j].bins[id].count
          }
        }
        tempCardCount = {
          ...tempCardCount,
          [id]: cardCount
        }
        tempPartCount = {
          ...tempPartCount,
          [id]: partCount
        }
      }
      setCardCount(tempCardCount)
      setPartCount(tempPartCount)
  	}, [cards])


    const onDragClient = (e) => {
      setClientY(e.clientY)
      console.log(e.clientY)
    }


    const debouncedDrag = useCallback(throttle(onDragClient, 80), []);

    const dragIndexSearch = () => {
      if(!!draggingLotId && !!draggingStationId){
        for(const i in orderedIds[id][draggingStationId]){
          let ele = document.getElementById(orderedIds[id][draggingStationId][i])
          let midY = (ele?.getBoundingClientRect().bottom + ele?.getBoundingClientRect().top)/2
          let draggingY = clientY + mouseOffsetY
          if(!!ele && midY> draggingY){
            return parseInt(i)
          }
        }
      }
    }

    const handleAddLotClick = (processId) => {
        setShowLotEditor(true)
    }

    const renderHeaderContent = (stationId) => {
      let name
      if(stationId === 'QUEUE') name = 'Queue'
      else if(stationId === 'FINISH') name = 'Finish'
      else name = stations[stationId].name
      return (
        <styled.HeaderContainer>
          <styled.StationName>
            {name}
          </styled.StationName>
          <styled.ColumnHeader>
            <styled.RowContainer>
              <styled.LotCount>
              {cardCount[stationId]}
              </styled.LotCount>
              <i className = 'far fa-window-restore' style = {{color: '#79797d', fontSize: '1.2rem', marginLeft: '0.5rem'}}/>
            </styled.RowContainer>
            <styled.RowContainer>
              <styled.LotCount>
              {partCount[stationId]}
              </styled.LotCount>
              <i className = 'far fa-lemon' style = {{color: '#79797d', fontSize: '1.2rem', marginLeft: '0.5rem'}}/>
            </styled.RowContainer>
          </styled.ColumnHeader>
        </styled.HeaderContainer>
      )
    }

    const renderCards = (stationId) => {
      if(orderedIds && orderedIds[id] && orderedIds[id][stationId]){
        return(
          orderedIds[id][stationId].map((cardId, index) => {
            let card = cards[cardId]
            return (
                <styled.CardContainer
                  id = {cardId}
                  onMouseOver = {()=>setHoveringCard(card)}
                  onMouseLeave = {()=>setHoveringCard(null)}
                  onClick = {()=>setShowLotEditor(true)}
                  draggable = {true}
                  onDragStart = {(e)=>{
                    setDraggingLotId(card._id)
                    setDragFromStation(stationId)
                    setStartIndex(index)
                    setDivHeight(e.target.offsetHeight)

                    let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
                    let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

                    setMouseOffsetY(offsetY)
                    setMouseOffsetX(offsetX)

                    e.target.style.opacity = '0.001'

                  }}
                  onDragEnd = {(e)=>{
                    setDraggingLotId(null)
                    setDragIndex(null)
                    setStartIndex(null)
                    setAllowHomeDrop(null)
                    setMouseOffsetY(null)
                    setDragFromStation(null)
                    setDraggingStationId(null)
                    e.target.style.opacity = '1'
                    e.target.style.display = 'flex'
                  }}
                >
                  <LotContainer
                    containerStyle = {{margin: '0.5rem'}}
                    selectable={true}
                    key={card._id}
                    totalQuantity={card.totalQuantity}
                    lotNumber={card.lotNum}
                    name={card.name}
                    count={card.bins[stationId].count}
                    lotId={card._id}
                    binId={stationId}
                    containerStyle={{
                      borderBottom: draggingLotId === card._id && stationId === dragFromStation && '.35rem solid #b8b9bf',
                      borderRight: draggingLotId === card._id && stationId === dragFromStation && '.2rem solid #b8b9bf',
                      borderLeft: draggingLotId === card._id && stationId === dragFromStation && '.1rem solid #b8b9bf',
                      borderTop: draggingLotId === card._id && stationId === dragFromStation && '.05rem solid #b8b9bf',
                      boxShadow: draggingLotId === card._id && stationId === dragFromStation && '2px 3px 2px 1px rgba(0,0,0,0.2)',
                      borderRadius: '0.3rem',
                      padding: '0.2rem',
                      margin: '.4rem',
                      width: '96%',
                      pointerEvents: !!draggingLotId && draggingLotId !== card._id && 'none',
                    }}
                  />
                </styled.CardContainer>
              )
            })
          )
        }
      }

    const renderStationColumns = () => {
      return (
        Object.values(process.flattened_stations).map((station) => {
          return (
            <div
              onDragEnter = {(e)=>{
                setDraggingStationId(station.stationID)
              }}
            >
              <styled.ColumnContainer>
                {renderHeaderContent(station.stationID)}
                <styled.StationColumnContainer maxHeight = {viewHeight?.toString() + 'px'}>
                    {renderCards(station.stationID)}
                </styled.StationColumnContainer>
              </styled.ColumnContainer>
            </div>
          )
        })
      )
    }
    const renderQueue = () => {
      return (
        <styled.ColumnContainer style = {{paddingBottom: '0.5rem'}}>
         {renderHeaderContent('QUEUE')}
          <styled.StationColumnContainer maxHeight = {viewHeight?.toString() + 'px'}>
              {renderCards('QUEUE')}
          </styled.StationColumnContainer>
          <styled.AddLotContainer onClick = {()=>handleAddLotClick()}>
          <i className = 'fas fa-plus' style = {{marginTop: '1.2rem', color: '#7e7e7e'}}/>
            <styled.AddLot>
              Add New Lot
            </styled.AddLot>
          </styled.AddLotContainer>
        </styled.ColumnContainer>
      )
    }

    const renderFinish = () => {
      return (
        <styled.ColumnContainer>
         {renderHeaderContent('FINISH')}
          <styled.StationColumnContainer maxHeight = {viewHeight?.toString() + 'px'}>
              {renderCards('FINISH')}
          </styled.StationColumnContainer>
        </styled.ColumnContainer>
      )
    }

    const renderLotEditor = () => {
      return (
        <LotEditorContainer
            isOpen={showLotEditor}
            onAfterOpen={null}
            cardId={hoveringCard ? hoveringCard._id : null}
            processId={id ? id : null}
            binId={hoveringCard ? hoveringCard.binId : null}
            close={()=>{
                setShowLotEditor(false)
            }}
        />
      )
    }

    return (
        <styled.Container
          onDragOver = {(e) => {
            e.preventDefault()
            debouncedDrag(e)
          }}
        >
          {showLotEditor &&
            renderLotEditor()
          }
          {renderQueue()}
          {renderStationColumns()}
          {renderFinish()}
        </styled.Container>
    )
  }


export default Cardss
