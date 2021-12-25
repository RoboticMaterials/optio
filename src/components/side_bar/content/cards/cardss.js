import React, {useEffect, useState, useRef, useContext, memo, useCallback, useMemo, lazy, Suspense} from 'react';

import LotContainer from './lot/lot_container'
import LotEditorContainer from './card_editor/lot_editor_container'

// external functions
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import useInterval from 'react-useinterval'
import {deleteCard, putCard, showEditor} from '../../../../redux/actions/card_actions'
import {throttle, debounce} from 'lodash'
import {findProcessStartNodes, findProcessEndNodes, isStationOnBranch } from '../../../../methods/utils/processes_utils'
import { getCustomFields, handleNextStationBins, handleCurrentStationBins, handleMergeParts } from "../../../../methods/utils/lot_utils";
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'

// styles
import * as styled from './cardss.style'
import { ThemeContext } from "styled-components";
import useWindowSize from '../../../../hooks/useWindowSize'
// Utils
import {isEmpty} from "../../../../methods/utils/object_utils";
import {isControl, isControlAndShift, isShift} from "../../../../methods/utils/event_utils";
import { deepCopy } from '../../../../methods/utils/utils'
import { isArray } from "../../../../methods/utils/array_utils";


const Cardss = (props) => {

    const {
        id
    } = props

    const size = useWindowSize()
    let params = useParams()
    const history = useHistory()
    const viewHeight = size.height*0.8
    const dispatch = useDispatch()
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))

    const themeContext = useContext(ThemeContext)
    const process = useSelector(state => state.processesReducer.processes)[id] || {}
    const orderedCardIds = useSelector(state => state.settingsReducer.settings.orderedCardIds) || {}
    const serverSettings = useSelector(state => state.settingsReducer.settings) || {}
    const processCards = useSelector(state => state.cardsReducer.processCards)[id] || {}
    const routes = useSelector(state => state.tasksReducer.tasks) || {}
    const stations = useSelector(state => state.stationsReducer.stations) || {}

    const [cards, setCards] = useState(null)
    const [showLotEditor, setShowLotEditor] = useState(false)
    const [hoveringCard, setHoveringCard] = useState(null)
    const [cardCount, setCardCount] = useState({})
    const [partCount, setPartCount] = useState({})
    const [dragFromStation, setDragFromStation] = useState(null)
    const [draggingLotId, setDraggingLotId] = useState(null)
    const [draggingStationId, setDraggingStationId] = useState(null)
    const [orderedIds, setOrderedIds] = useState(orderedCardIds)
    const [startIndex, setStartIndex] = useState(null)
    const [startStationId, setStartStationId] = useState(null)
    const [clientY, setClientY] = useState(null)
  	const [clientX, setClientX] = useState(null)
    const [divHeight, setDivHeight] = useState(null)
    const [divWidth, setDivWidth] = useState(null)
    const [dragIndex, setDragIndex] = useState(null)
    const [allowHomeDrop, setAllowHomeDrop] = useState(null)
    const [mouseOffsetY, setMouseOffsetY] = useState(null)
  	const [mouseOffsetX, setMouseOffsetX] = useState(null)
    const [dropNodes, setDropNodes] = useState([])
    const [previousProcessId, setPreviousProcessId] = useState(null)
    //the following variables are to prevent cards glitching from drag by preventing
    //api updates right after dragEnd. Its nonsense but it works.
    //when dragging lots of cards there is a risk that api call occurs right when card
    //is being posted and causes glitch.
    const [update, setUpdate] = useState(true)
    const dragIdRef = useRef(draggingLotId)
    const [activeTimeout, setActiveTimeout] = useState(false)
    const [currTimeout, setCurrTimeout] = useState(null)
    dragIdRef.current = draggingLotId

    useEffect(() => {//sets display to none. Cant do it onDragStart as wont work
  		if(dragIndex && (startIndex || startIndex===0) && draggingLotId){
          setAllowHomeDrop(true)
  				let fieldDiv = document.getElementById(draggingLotId + dragFromStation)
  				fieldDiv.style.display = 'none'
  		}
  	}, [dragIndex, clientY])

    useEffect(() => {//this sets the order cards are displayed. Array of card IDs
      if(!orderedCardIds[id]){
        console.log('1')
        let tempIds = {}
        tempIds[id] = {}
        if(!tempIds[id]['QUEUE']) tempIds[id]['QUEUE'] = []
        if(!tempIds[id]['FINISH']) tempIds[id]['FINISH'] = []

        for(const i in process.flattened_stations){
          let statId = process.flattened_stations[i].stationID
          tempIds[id][statId] = []

          for(const j in processCards){
            if(!!processCards[j].bins[statId]){
              tempIds[id][statId].push(processCards[j]._id)
            }
            if(!!processCards[j].bins['QUEUE'] && i == 0){
              tempIds[id]['QUEUE'].push(processCards[j]._id)
            }
            if(!!processCards[j].bins['FINISH'] && i == 0){
              tempIds[id]['FINISH'].push(processCards[j]._id)
            }
          }
        }
        dispatchPostSettings({
          ...serverSettings,
          orderedCardIds: tempIds
        })
        setOrderedIds(tempIds)
        setCards(processCards)
      }
      else if(JSON.stringify(orderedIds) !== JSON.stringify(orderedCardIds) && JSON.stringify(cards) === JSON.stringify(processCards) && update){
        console.log('3')
        setOrderedIds(orderedCardIds)
      }
      else if((JSON.stringify(processCards) !== JSON.stringify(cards)) && update){
        console.log('2')
        //ids exist in backend. Check against processCards in case anything has changed from operator moves/imports and update Ids
          let tempIds = deepCopy(orderedIds)
          //remove ids for queue
          for(const i in tempIds[id]['QUEUE']){
            let cardId = tempIds[id]['QUEUE'][i]
            if(!processCards[cardId] || !processCards[cardId].bins || !processCards[cardId].bins['QUEUE']){
              tempIds[id]['QUEUE'].splice(i,1)
            }
          }
          //remove ids for finish
          for(const i in tempIds[id]['FINISH']){
            let cardId = tempIds[id]['FINISH'][i]
            if(!processCards[cardId] || !processCards[cardId].bins || !processCards[cardId].bins['FINISH']) tempIds[id]['FINISH'].splice(i,1)
          }
          for(const i in process.flattened_stations){//if new cards are at station x then push the ids to top (moved via dashboard)
            let statId = process.flattened_stations[i].stationID
            //remove ids where cards are no longer in Column
            for(const i in tempIds[id][statId]){
              let cardId = tempIds[id][statId][i]
              if(!processCards[cardId] || !processCards[cardId].bins || !processCards[cardId].bins[statId]) tempIds[id][statId].splice(i,1)
            }

            for(const j in processCards){
              if(!!processCards[j].bins[statId] && !tempIds[id][statId].includes(processCards[j]._id)) {
                tempIds[id][statId].push(processCards[j]._id)

              }
              if(!!processCards[j].bins['QUEUE'] && !tempIds[id]['QUEUE'].includes(processCards[j]._id) && i == 0){
                tempIds[id]['QUEUE'].splice(0,0,processCards[j]._id)
              }
              if(!!processCards[j].bins['FINISH'] && !tempIds[id]['FINISH'].includes(processCards[j]._id) && i == 0){
                tempIds[id]['FINISH'].splice(0,0,processCards[j]._id)
              }
            }
          }
          setOrderedIds(tempIds)
          setCards(processCards)
          if(JSON.stringify(tempIds) !== JSON.stringify(orderedCardIds)){
            dispatchPostSettings({
              ...serverSettings,
              orderedCardIds: tempIds
            })
          }
        }
    }, [processCards, orderedCardIds])

    useEffect(() => {
      setDragIndex(dragIndexSearch(draggingStationId))
    }, [clientY])

    useEffect(() => {//how many cards are in each column
      let tempCardCount = {}
      let tempPartCount = {}

      let queueCardCount = 0
      let queuePartCount = 0
      let finishCardCount = 0
      let finishPartCount = 0
      for(const i in process.flattened_stations){
        let cardCount = 0
        let partCount = 0

        let id = process.flattened_stations[i].stationID
        for(const j in cards){
          if(!!cards[j].bins[id]){
            cardCount+=1
            partCount+=cards[j].bins[id].count
          }
          if(!!cards[j].bins['QUEUE'] && i == 0){
            queueCardCount+=1
            queuePartCount+=cards[j].bins['QUEUE'].count
          }
          if(!!cards[j].bins['FINISH'] && i == 0){
            finishCardCount+=1
            finishPartCount+=cards[j].bins['FINISH'].count
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

      tempPartCount = {
        ...tempPartCount,
        ['QUEUE']: queuePartCount,
        ['FINISH']: finishPartCount
      }

      tempCardCount = {
        ...tempCardCount,
        ['QUEUE']: queueCardCount,
        ['FINISH']: finishCardCount
      }
      setCardCount(tempCardCount)
      setPartCount(tempPartCount)
  	}, [])


    const onDragClient = (e) => {
      setClientY(e.clientY)
    }


    const debouncedDrag = useCallback(throttle(onDragClient, 20), []);

    const dragIndexSearch = (stationId) => {
      if(!!draggingLotId && !!stationId){
        for(const i in orderedIds[id][stationId]){
          let ele = document.getElementById(orderedIds[id][stationId][i] + stationId)
          let midY = (ele?.getBoundingClientRect().bottom + ele?.getBoundingClientRect().top)/2
          let draggingY = clientY + mouseOffsetY
          if(!!ele && midY> draggingY){
            return parseInt(i)
          }
          else if(i == orderedIds[id][stationId].length-1){
            return orderedIds[id][stationId].length
          }
        }
        return 0
      }
    }

    const handleAddLotClick = (processId) => {
      if (params.page === 'processes') {
          setPreviousProcessId(params.id)
      }
      history.push(`/lots/${id}/create`)
    }

    const onShowCardEditor = (card) => {
        if (card) {
            if (params.page === 'processes') {
                setPreviousProcessId(params.id)
            }
            history.push(`/lots/${card._id}/editing/`)
        } else {
            if (!!id) {
                history.push(`/lots/${id}/lots`)
                setPreviousProcessId(null)
            } else {
                history.push('/lots/summary')
            }

        }
    }

    const handleSetUpdate = () => {
      if(!dragIdRef.current){
        setUpdate(true)
        setActiveTimeout(false)
      }
      else setTimeout(handleSetUpdate,1000)
    }

    //This function is now more limiting with split/merge
    // -dont allow moving lot to next stations(s) if current station disperses a lot
    //-dont allow movinga lot backwards if the previous node has routes merging into it or if it disperses a lot
    //-dont allow moving lot back if current node has routes merging into it
    //-These limitations ensure dragging lots around in cardZone dont mess merge/split functionality
    //-We should make it more flexible in the future with functions that handle the above cases...
    //-There is some functionality that i added where you can drag lots forward into their merging station and it will properly merge them
    const shouldAcceptDrop = (cardId, startId, currId) => {
      let lastStationTraversed = false
      let tempDropNodes = dropNodes
      const processRoutes = process.routes.map(routeId => routes[routeId])

      let startNodes = findProcessStartNodes(processRoutes, stations)
      let endNode = findProcessEndNodes(processRoutes)

      if(startId === currId) {
        tempDropNodes.push(currId)
      }

        const forwardsTraverseCheck = (currentStationID) => {
          if(endNode.includes(currentStationID) && currId =='FINISH'){//If you can traverse to the end node, also allow finish column
            tempDropNodes.push(currId)
          }
          else if(currentStationID === 'QUEUE' && (process.startDivergeType!=='split' || startNodes.length ===1)){
            //if lot is in queue and station is one of the the start nodes and start disperse isnt split then allow move
            if(startNodes.includes(currId)){
              tempDropNodes.push(currId)
            }
            else{//If the station is not one of the start nodes still traverse forwards from all the start nodes to see if you can get to station
              for(const ind in startNodes){
                const canMove = forwardsTraverseCheck(startNodes[ind])
                if(!!canMove){
                  tempDropNodes.push(currId)
                }
              }
            }
          }
          const nextRoutes = processRoutes.filter(route => route.load === currentStationID)
          if(!!nextRoutes[0] && (!nextRoutes[0].divergeType || nextRoutes[0].divergeType!=='split')){//can't drag forward if station disperses lots
            for(const ind in nextRoutes){
              if(nextRoutes[ind].unload === currId){
                //If you are skipping over nodes and drag to a merge station we need to keep track of the station right before
                //the merge station as merge functions need this to find routeTravelled
                lastStationTraversed = nextRoutes[ind].load
                tempDropNodes.push(currId)
              }
              else{
                const mergingRoutes = processRoutes.filter((route) => route.unload === nextRoutes[ind].unload);
                if(mergingRoutes.length === 1){
                  const canMove = forwardsTraverseCheck(nextRoutes[ind].unload)
                  if(!!canMove) {
                    tempDropNodes.push(currId)
                  }
                }
              }
            }
          }

        }

        const backwardsTraverseCheck = (currentStationID) => {//dragging into Queue, make sure kickoff isnt dispersed
          if(startNodes.includes(currentStationID) && currId === 'QUEUE' && (process.startDivergeType!=='split' || startNodes.length ===1)) {//can traverse back to queue
            tempDropNodes.push(currId)
          }

          else if(currentStationID === 'FINISH'){//dragging from Finish. Can drag into traversed stations provided theyre not a merge station
            if(endNode.includes(currId)){
              tempDropNodes.push(currId)
              }
            else{
              const canMove = backwardsTraverseCheck(endNode)
              if(!!canMove) tempDropNodes.push(currId)
            }
          }

          const mergingRoutes = processRoutes.filter((route) => route.unload === currentStationID);
          if(mergingRoutes.length===1){//Can't drag backwards from merge station
            for(const ind in mergingRoutes){
              const dispersingRoutes = processRoutes.filter((route) => route.load === mergingRoutes[ind].load);
              if(mergingRoutes[ind].load === currId) {
                if(dispersingRoutes.length === 1 || dispersingRoutes[0].divergeType!=='split' || !dispersingRoutes[0].divergeType ){
                  tempDropNodes.push(currId)
                  return currId
                }
              }
              else{
                  if(dispersingRoutes.length === 1 || !dispersingRoutes[0].divergeType || dispersingRoutes[0].divergeType!=='split'){
                    const canMove = backwardsTraverseCheck(mergingRoutes[ind].load)
                    if(!!canMove) {
                      tempDropNodes.push(currId)
                      return currId
                    }
                  }
                }
              }
            }
          }
          forwardsTraverseCheck(startId)
          backwardsTraverseCheck(startId)
          setDropNodes(tempDropNodes)
          return lastStationTraversed

        }

    const handleDrop = (containsPartial) => {
      if(dragFromStation === draggingStationId){//dragging within column
        if((!!dragIndex || dragIndex === 0) && dragIndex !== startIndex+1){//drop zone existst and not dropping in home position
          let newIds = orderedIds
          newIds[id][draggingStationId].splice(dragIndex, 0, newIds[id][draggingStationId][startIndex])
          if(dragIndex<=startIndex){//dragging up
            newIds[id][draggingStationId].splice(startIndex+1,1)
          }
          else{//dragging down
            newIds[id][draggingStationId].splice(startIndex,1)
          }
          setOrderedIds(newIds)
          dispatchPostSettings({
            ...serverSettings,
            orderedCardIds: newIds
          })
        }
      }
      else if((dragIndex || dragIndex ===0) && dragFromStation!==draggingStationId){
        //update ID array
        let newIds = orderedIds
        if(!newIds[id][draggingStationId]) newIds[id][draggingStationId] = []
        if(!newIds[id][draggingStationId].includes(draggingLotId)){
          newIds[id][draggingStationId].splice(dragIndex, 0, newIds[id][dragFromStation][startIndex])
        }
        if(!containsPartial) newIds[id][dragFromStation].splice(startIndex,1)
        if(newIds[id][dragFromStation].length === 0) newIds[id][dragFromStation] = []
        setOrderedIds(newIds)
        dispatchPostSettings({
          ...serverSettings,
          orderedCardIds: newIds
        })
        //post new lot bins
        let lastStn = shouldAcceptDrop(draggingLotId, dragFromStation, draggingStationId)
        let updatedLot = cards[draggingLotId]
        let stationBeforeMerge = !!lastStn ? lastStn : dragFromStation
        updatedLot.bins = handleNextStationBins(updatedLot.bins, updatedLot.bins[dragFromStation]?.count, stationBeforeMerge, draggingStationId, process, routes, stations)
        updatedLot.bins = handleCurrentStationBins(updatedLot.bins, updatedLot.bins[dragFromStation]?.count, dragFromStation, process, routes)
        if(!!updatedLot.bins[dragFromStation] && !updatedLot.bins[dragFromStation]['count']){
          updatedLot.bins[dragFromStation] = {
            ...updatedLot.bins[dragFromStation],
            count: 0
          }
        }
        //Bin exists but nothing in it. Delete the bin as this messes various things up.
        if(!!updatedLot.bins[dragFromStation] && updatedLot.bins[dragFromStation]['count'] === 0 && Object.values(updatedLot.bins[dragFromStation]).length === 1){
          delete updatedLot.bins[dragFromStation]
        }
        let result = dispatchPutCard(updatedLot, updatedLot._id)
     }
    }

    const handleRightClickDeleteLot = (card, binId, partId) => {
        let currLot = processCards[card._id]
        let currBin = currLot.bins[binId]
        if(!!partId){
          delete currBin[partId]
        }
        else currBin['count'] = 0

        let submitLot = {
          ...currLot,
          bins: {
            ...currLot.bins,
            [binId]: currBin
          }
        }
        if(!!partId){
          if(Object.values(currBin).length===1 && currBin['count'] === 0) delete submitLot.bins[binId]
        }
        else if(Object.values(currBin).length===1) delete submitLot.bins[binId]
        dispatchPutCard(submitLot, submitLot._id)
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
      if(orderedIds && cards && orderedIds[id] && orderedIds[id][stationId] && orderedIds[id][stationId].length>0){
        return(
          orderedIds[id][stationId].map((cardId, index) => {
            let card = cards[cardId]
              let partBins = card?.bins[stationId] || {}
              if(Object.values(partBins).length === 1){
                return (
                  <styled.CardContainer
                    onMouseOver = {()=>{
                      setHoveringCard(card)
                    }}
                    onMouseLeave = {()=>setHoveringCard(null)}
                    onClick = {()=>setShowLotEditor(true)}
                    draggable = {true}
                    onDragStart = {(e)=>{
                      setUpdate(false)
                      setDivHeight(e.target.offsetHeight)
                      setDivWidth(e.target.offsetWidth)
                      setDraggingLotId(card._id)
                      setDragFromStation(stationId)
                      setStartIndex(index)
                      let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
                      let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

                      setMouseOffsetY(offsetY)
                      setMouseOffsetX(offsetX)

                      e.target.style.opacity = '0.001'

                      for(const i in process.flattened_stations){
                        shouldAcceptDrop(card._id, stationId, process.flattened_stations[i].stationID)
                      }

                    }}
                    onDragEnd = {(e)=>{
                      handleDrop(false)
                      if(!activeTimeout){
                        setActiveTimeout(true)
                      }
                      else{
                        clearTimeout(currTimeout)
                      }
                      let timeout = setTimeout(handleSetUpdate, 2000)
                      setCurrTimeout(timeout)
                      let lotDiv = document.getElementById(draggingLotId + dragFromStation )
                      lotDiv.style.display = 'flex'//restore
                      setDraggingLotId(null)
                      setDragIndex(null)
                      setStartIndex(null)
                      setAllowHomeDrop(null)
                      setMouseOffsetY(null)
                      setDragFromStation(null)
                      setDraggingStationId(null)
                      setDropNodes([])
                      e.target.style.opacity = '1'
                      e.target.style.display = 'flex'
                    }}
                  >
                  {dragIndex === 0 && index === 0 && draggingStationId === stationId && allowHomeDrop &&
                    <styled.DropContainer
                      divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                      divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
                    />
                  }
                  <div id = {cardId + stationId}>
                    <LotContainer
                      containerStyle = {{margin: '0.5rem'}}
                      selectable={true}
                      key={card._id}
                      onClick = {()=> {
                        onShowCardEditor(card)
                      }}
                      onRightClickDeleteLot = {()=>{
                        handleRightClickDeleteLot(card, stationId)
                      }}
                      totalQuantity={card.totalQuantity}
                      lotNumber={card.lotNum}
                      name={card.name}
                      count={!!card.bins[stationId] ? card.bins[stationId].count : 1}
                      lotId={card._id}
                      binId={stationId}
                      containerStyle={{
                        borderBottom: draggingLotId === card._id && stationId === dragFromStation && '.35rem solid #b8b9bf',
                        borderRight: draggingLotId === card._id && stationId === dragFromStation && '.2rem solid #b8b9bf',
                        borderLeft: draggingLotId === card._id && stationId === dragFromStation && '.1rem solid #b8b9bf',
                        borderTop: draggingLotId === card._id && stationId === dragFromStation && '.05rem solid #b8b9bf',
                        boxShadow: draggingLotId === card._id && stationId === dragFromStation && '2px 3px 2px 1px rgba(0,0,0,0.2)',
                        borderRadius: '0.2rem',
                        padding: '0.2rem',
                        margin: '.5rem',
                        width: '22rem',
                        pointerEvents: !!draggingLotId && draggingLotId !== card._id && 'none',
                      }}
                      />
                    </div>
                    {dragIndex === index+1 && draggingStationId === stationId && allowHomeDrop &&
                      <styled.DropContainer
                        divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                        divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
                      />
                    }
                  </styled.CardContainer>
                )
              }
                else{
                  return (
                    Object.keys(partBins).map((part) => {
                      const isPartial = part !== 'count' ? true : false
                      return (
                        <>
                          {(partBins[part]>0 || (part === 'count' && partBins['count']>0)) &&
                            <styled.CardContainer
                              onMouseOver = {()=>{
                                setHoveringCard(card)
                              }}
                              onMouseLeave = {()=>setHoveringCard(null)}
                              onClick = {()=>setShowLotEditor(true)}
                              draggable = {isPartial ? false : true}
                              onDragStart = {(e)=>{
                                setUpdate(false)
                                setDivHeight(e.target.offsetHeight)
                                setDivWidth(e.target.offsetWidth)
                                setDraggingLotId(card._id)
                                setDragFromStation(stationId)
                                setStartIndex(index)
                                let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
                                let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

                                setMouseOffsetY(offsetY)
                                setMouseOffsetX(offsetX)

                                e.target.style.opacity = '0.001'

                                for(const i in process.flattened_stations){
                                  shouldAcceptDrop(card._id, stationId, process.flattened_stations[i].stationID)
                                }

                              }}
                              onDragEnd = {(e)=>{
                                handleDrop(true)
                                setTimeout(handleSetUpdate, 3000)
                                let lotDiv = document.getElementById(draggingLotId + dragFromStation )
                                lotDiv.style.display = 'flex'//restore
                                setDraggingLotId(null)
                                setDragIndex(null)
                                setStartIndex(null)
                                setAllowHomeDrop(null)
                                setMouseOffsetY(null)
                                setDragFromStation(null)
                                setDraggingStationId(null)
                                setDropNodes([])
                                e.target.style.opacity = '1'
                                e.target.style.display = 'flex'
                              }}
                            >
                            {dragIndex === 0 && index === 0 && draggingStationId === stationId && allowHomeDrop
                              && !isPartial && draggingStationId === dragFromStation &&
                              <styled.DropContainer
                                divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                                divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
                              />
                            }
                            <div id = {cardId + stationId}>
                              <LotContainer
                                containerStyle = {{margin: '0.5rem'}}
                                selectable={true}
                                isPartial = {isPartial}
                                key={card._id}
                                onDeleteDisabledLot = {() => {
                                  handleRightClickDeleteLot(card, stationId, part)
                                }}
                                onRightClickDeleteLot = {()=>{
                                  handleRightClickDeleteLot(card, stationId)
                                }}
                                enableFlagSelector={true}
                                totalQuantity={card.totalQuantity}
                                lotNumber={card.lotNum}
                                name={isPartial ? card.name + ` (${routes[part]?.part})` : card.name}
                                count={isPartial ? partBins[part] : partBins['count']}
                                lotId={card._id}
                                leadTime = {card.leadTime}
                                flags = {card.flags || []}
                                binId={stationId}
                                containerStyle={{
                                  borderBottom: draggingLotId === card._id && stationId === dragFromStation && '.35rem solid #b8b9bf',
                                  borderRight: draggingLotId === card._id && stationId === dragFromStation && '.2rem solid #b8b9bf',
                                  borderLeft: draggingLotId === card._id && stationId === dragFromStation && '.1rem solid #b8b9bf',
                                  borderTop: draggingLotId === card._id && stationId === dragFromStation && '.05rem solid #b8b9bf',
                                  boxShadow: draggingLotId === card._id && stationId === dragFromStation && '2px 3px 2px 1px rgba(0,0,0,0.2)',
                                  borderRadius: '0.2rem',
                                  padding: '0.2rem',
                                  margin: '.4rem',
                                  width: '22rem',
                                  pointerEvents: !!draggingLotId && draggingLotId !== card._id && 'none',
                                }}
                                onClick = {()=>{
                                  onShowCardEditor(hoveringCard)
                                }}
                                />
                              </div>
                              {dragIndex === index+1 && ((dragIndex === startIndex+1 && !isPartial //crazay logic for showing drop container for partial disabled lots
                               && draggingStationId === dragFromStation) || ((draggingLotId !== card._id || draggingStationId!==dragFromStation) && isPartial))
                               && draggingStationId === stationId && allowHomeDrop &&
                                <styled.DropContainer
                                  divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                                  divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
                                />
                              }
                            </styled.CardContainer>
                          }
                        </>
                      )
                  })
                )
              }
          })
        )
      }
        else if(orderedIds && orderedIds[id] && draggingStationId===stationId){
          return (
              <styled.DropContainer
                divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
              />
          )
        }
      }

    const renderStationColumns = useMemo(() => {
      return (
        Object.values(process.flattened_stations).map((station) => {
          return (
            <div
              style = {{pointerEvents: !dropNodes.includes(station.stationID) && draggingLotId && 'none'}}
              onDragEnter = {(e)=>{
                setDragIndex(dragIndexSearch(station.stationID))
                setDraggingStationId(station.stationID)
              }}
            >
              <styled.ColumnContainer
                disabled = {!dropNodes.includes(station.stationID) && draggingLotId}
              >
                {renderHeaderContent(station.stationID)}
                <styled.StationColumnContainer
                  maxHeight = {viewHeight?.toString() + 'px'}
                >
                  {renderCards(station.stationID)}
                </styled.StationColumnContainer>
              </styled.ColumnContainer>
            </div>
          )
        })
      )
    },[draggingStationId, cards, dragIndex, allowHomeDrop, draggingLotId, partCount, cardCount])

    const renderQueue = useMemo(() => {
      console.log('quueu')
      return (
        <div
          onDragEnter = {(e)=>{
            setDragIndex(dragIndexSearch('QUEUE'))
            setDraggingStationId('QUEUE')
          }}
        >
          <styled.ColumnContainer style = {{paddingBottom: '0.5rem'}}>
           {renderHeaderContent('QUEUE')}
            <styled.StationColumnContainer maxHeight = {(viewHeight-55)?.toString() + 'px'}>
                {renderCards('QUEUE')}
            </styled.StationColumnContainer>
            <styled.AddLotContainer onClick = {()=>handleAddLotClick()}>
            <i className = 'fas fa-plus' style = {{marginTop: '1.2rem', color: '#7e7e7e'}}/>
              <styled.AddLot>
                Add New Lot
              </styled.AddLot>
            </styled.AddLotContainer>
          </styled.ColumnContainer>
        </div>
      )
    },[draggingStationId, cards, dragIndex, allowHomeDrop, draggingLotId, partCount, cardCount])

    const renderFinish = useMemo(() => {
      return (
        <div
          onDragEnter = {(e)=>{
            setDragIndex(dragIndexSearch('FINISH'))
            setDraggingStationId('FINISH')
          }}
        >
          <styled.ColumnContainer>
           {renderHeaderContent('FINISH')}
            <styled.StationColumnContainer maxHeight = {viewHeight?.toString() + 'px'}>
                {renderCards('FINISH')}
            </styled.StationColumnContainer>
          </styled.ColumnContainer>
        </div>
      )
    },[draggingStationId, cards, dragIndex, allowHomeDrop, draggingLotId, partCount, cardCount])

    const renderLotEditor = () => {
      return (
        <LotEditorContainer
            isOpen={showLotEditor}
            onAfterOpen={null}
            cardId={hoveringCard ? hoveringCard._id : null}
            processId={id ? id : null}
            binId={hoveringCard ? hoveringCard.binId : null}
            onClose={()=>{
                setHoveringCard(null)
                onShowCardEditor(false)
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
          {params.subpage!=='lots' &&
            renderLotEditor()
          }
          {renderQueue}
          {renderStationColumns}
          {renderFinish}
        </styled.Container>
    )
  }


export default Cardss
