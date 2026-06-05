// @ts-nocheck
import React, {useEffect, useState, useRef, useContext, memo, useCallback, useMemo, lazy, Suspense} from 'react';
import VisibilitySensor from 'react-visibility-sensor'

import LotContainer from './lot/lot_container'
import LotEditorContainer from './card_editor/lot_editor_container'
import ZoneHeader from './zone_header/zone_header'
import BackButton from '../../../../components/basic/back_button/back_button'
import ReactTooltip from "react-tooltip";

// external functions
import { useHistory, useParams } from 'react-router-dom'
import {v4 as uuid} from "uuid"
import { useDispatch, useSelector } from "react-redux";
import useInterval from 'react-useinterval'
import {deleteCard, putCard, showEditor} from '../../../../redux/actions/card_actions'
import {setSelectedProcess} from '../../../../redux/actions/processes_actions'
import {throttle, debounce} from 'lodash'
import {findProcessStartNodes, findProcessEndNodes } from '../../../../methods/utils/processes_utils'
import { getCustomFields, handleNextStationBins, handleCurrentStationBins, handleMergeParts } from "../../../../methods/utils/lot_utils";
import { getLotTotalQuantity, checkCardMatchesFilter, getMatchesFilter } from "../../../../methods/utils/lot_utils";
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'

// styles
import * as styled from './cards.style'
import { ThemeContext } from "styled-components";
import useWindowSize from '../../../../hooks/useWindowSize'
// Utils
import {isEmpty} from "../../../../methods/utils/object_utils";
import {isControl, isControlAndShift, isShift} from "../../../../methods/utils/event_utils";
import { deepCopy } from '../../../../methods/utils/utils'
import { isArray } from "../../../../methods/utils/array_utils";
import { sortBySummary } from "../../../../methods/utils/card_utils";

//sort constants
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../constants/lot_contants";
import {SORT_MODES} from "../../../../constants/common_contants";

import { useTranslation } from 'react-i18next';

const Cards = (props) => {

    const { t, i18n } = useTranslation();

    const {
        id
    } = props

    const size = useWindowSize()
    let params = useParams()
    const history = useHistory()
    const viewHeight = size.height-310
    const dispatch = useDispatch()
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchSetSelectedProcess = (processID) => dispatch(setSelectedProcess(processID))
    const dispatchDeleteCard = async (ID) => await dispatch(deleteCard(ID))

    const themeContext = useContext(ThemeContext)
    const process = useSelector(state => state.processesReducer.processes)[id] || {}
    const orderedCardIds = useSelector(state => state.settingsReducer.settings.orderedCardIds) || {}
    const serverSettings = useSelector(state => state.settingsReducer.settings) || {}
    const processCards = useSelector(state => state.cardsReducer.processCards)[id] || {}
    const routes = useSelector(state => state.tasksReducer.tasks) || {}
    const stations = useSelector(state => state.stationsReducer.stations) || {}
    const multipleFilters = useSelector(state => state.settingsReducer.settings.enableMultipleLotFilters) || false
    const toolTipId = useRef(`tooltip-${uuid()}`).current;
    const currProcessCards = useRef(processCards).current || {}
    const openEvents = useSelector(state => state.touchEventsReducer.openEvents|| {})

    //filter & sort state
    const [sortMode, setSortMode] = useState(!!serverSettings.lotSummarySortValue ?
       serverSettings.lotSummarySortValue : LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(!!serverSettings.lotSummarySortDirection ?
       serverSettings.lotSummarySortDirection : SORT_DIRECTIONS.ASCENDING)
    const [lotFilterValue, setLotFilterValue] = useState(!!serverSettings.lotSummaryFilterValue ?
      serverSettings.lotSummaryFilterValue : '')
    const [selectedFilterOption, setSelectedFilterOption ] = useState(!!serverSettings.lotSummaryFilterOption ?
       serverSettings.lotSummaryFilterOption : LOT_FILTER_OPTIONS.name)
    const [lotFilters, setLotFilters] = useState([])
    const handleAddLotFilter = (filter) => {
        let filtersCopy = deepCopy(lotFilters);
        filtersCopy.push(filter);
        setLotFilters(filtersCopy);
    }
    const handleRemoveLotFilter = (removeFilterID) => {
        let filtersCopy = deepCopy(lotFilters);
        filtersCopy = filtersCopy.filter(filter => filter._id !== removeFilterID)
        setLotFilters(filtersCopy)
    }

    const [cards, setCards] = useState({})
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
    const [hoveringStation, setHoveringStation] = useState(null)
    //the following variables are to prevent cards glitching from drag by preventing
    //api updates right after dragEnd. Its nonsense but it works.
    //when dragging lots of cards there is a risk that api call occurs right when card
    //is being posted and causes glitch.
    const [update, setUpdate] = useState(true)
    const dragIdRef = useRef(draggingLotId)
    const justDraggedRef = useRef(false)
    const sortMountedRef = useRef(false)
    const [activeTimeout, setActiveTimeout] = useState(false)
    const [currTimeout, setCurrTimeout] = useState(null)
    dragIdRef.current = draggingLotId
    const cardsRef = useRef(cards)
    const orderedIdsRef = useRef(orderedIds)
    const dragFromStationRef = useRef(dragFromStation)
    const draggingLotIdRef = useRef(draggingLotId)
    const draggingStationIdRef = useRef(draggingStationId)
    const startIndexRef = useRef(startIndex)
    const dragIndexRef = useRef(dragIndex)
    //sorting state
    //console.log(cards)
    const [sortedCards, setSortedCards] = useState(null)
    const [needsSortUpdate, setNeedsSortUpdate] = useState(false)
    const [sortChanged, setSortChanged] = useState(false)
    //filtering
    const [filteredIds, setFilteredIds] = useState(null)

    useEffect(() => {
      cardsRef.current = cards
    }, [cards])

    useEffect(() => {
      orderedIdsRef.current = orderedIds
    }, [orderedIds])

    useEffect(() => {
      dragFromStationRef.current = dragFromStation
    }, [dragFromStation])

    useEffect(() => {
      draggingLotIdRef.current = draggingLotId
    }, [draggingLotId])

    useEffect(() => {
      draggingStationIdRef.current = draggingStationId
    }, [draggingStationId])

    useEffect(() => {
      startIndexRef.current = startIndex
    }, [startIndex])

    useEffect(() => {
      dragIndexRef.current = dragIndex
    }, [dragIndex])

    useEffect(() => {//sets display to none. Cant do it onDragStart as wont work
  		if(dragIndex && (startIndex || startIndex===0) && draggingLotId){
          setAllowHomeDrop(true)
  				let fieldDiv = document.getElementById(draggingLotId + dragFromStation)
        if(fieldDiv){
          fieldDiv.style.maxHeight = '1px'
            fieldDiv.style.paddingTop = '1px'
          }
  		}

  	}, [dragIndex, clientY, clientX])

    useEffect(() => {
      return () => {
        dispatchSetSelectedProcess(null)
      }
    }, [])


    useEffect(() => {//this sets the order cards are displayed. Array of card IDs

      // ── Branch 1: Initial load or sort change — build orderedIds from scratch ──
      if(!orderedCardIds[id] || needsSortUpdate){
        let tempCards = needsSortUpdate ? deepCopy(sortedCards): deepCopy(processCards)
        let tempIds = {}
        tempIds[id] = {}
        if(!tempIds[id]['QUEUE']) tempIds[id]['QUEUE'] = []
        if(!tempIds[id]['FINISH']) tempIds[id]['FINISH'] = []

        for(const i in process.flattened_stations){
          let statId = process.flattened_stations[i].stationID
          tempIds[id][statId] = []

          for(const j in tempCards){
            if(!!tempCards[j].bins[statId]){
              tempIds[id][statId].push(tempCards[j]._id)
            }
            if(!!tempCards[j].bins['QUEUE'] && i == 0){
              tempIds[id]['QUEUE'].push(tempCards[j]._id)
            }
            if(!!tempCards[j].bins['FINISH'] && i == 0){
              tempIds[id]['FINISH'].push(tempCards[j]._id)
            }
          }
        }

        dispatchPostSettings({
          ...serverSettings,
          orderedCardIds: {
            ...serverSettings.orderedCardIds,
            [id]: tempIds[id]
           }
        })
        if(needsSortUpdate) setNeedsSortUpdate(false)

        setOrderedIds({
          ...orderedIds,
          [id]: tempIds[id]
        })
        setCards(processCards)
        return
      }

      // Skip all sync logic while a drag is in progress
      if(!update) return

      // ── Branch 2: processCards changed (websocket push) ──
      // Sync card DATA only. Update orderedIds surgically:
      //   - add cards that are new in processCards
      //   - remove cards that no longer exist in processCards
      // Never reorder existing cards — orderedIds is the user's ordering authority.
      if(JSON.stringify(processCards) !== JSON.stringify(cards) && lotFilterValue === '' && lotFilters.length === 0){
        justDraggedRef.current = false

        const allColumns = ['QUEUE', 'FINISH',
          ...Object.values(process.flattened_stations || {}).map(s => s.stationID)]

        let tempIds = deepCopy(orderedIdsRef.current)
        if(!tempIds[id]) tempIds[id] = {}

        // For every column: remove cards no longer belonging there, add new arrivals
        for(const col of allColumns){
          if(!tempIds[id][col]) tempIds[id][col] = []

          // Remove ids whose card no longer has a bin at this column
          tempIds[id][col] = tempIds[id][col].filter(cardId =>
            processCards[cardId]?.bins?.[col]
          )

          // Add any card that belongs here but isn't listed yet
          for(const cardId in processCards){
            if(processCards[cardId]?.bins?.[col] && !tempIds[id][col].includes(cardId)){
              tempIds[id][col].push(cardId)
            }
          }
        }

        orderedIdsRef.current = tempIds
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
      const nextDragIndex = dragIndexSearch(draggingStationId)
      dragIndexRef.current = nextDragIndex
      setDragIndex(nextDragIndex)
    }, [clientY])

    useEffect(() => {//updates orderedIds when sort is changed
        if(!sortMountedRef.current){ sortMountedRef.current = true; return }
        setUpdate(false)
        if(!activeTimeout){
          setActiveTimeout(true)
        }
        else{
          clearTimeout(currTimeout)
        }
        let timeout = setTimeout(handleSetUpdate, 4000)
        setCurrTimeout(timeout)

        if (sortMode && sortChanged) {
          let tempCards = []
          Object.values(cards).forEach((card) => {
            tempCards.push(card)
          })
          sortBySummary(tempCards, sortMode, sortDirection)

          let sortCards = {}
          for(let i = 0; i<tempCards.length; i++){
            sortCards[tempCards[i]._id] = tempCards[i]
          }
          setSortedCards(sortCards)
          setNeedsSortUpdate(true)
          setSortChanged(false)
        }
    }, [sortMode, sortDirection])

    useEffect(() => {//updates orderedIds when filter is changed
      if(orderedIds && cards){
        let tempCards = {}
        for(const i in orderedIds[id]){
          for(const j in orderedIds[id][i]){
            let tempCard = processCards[orderedIds[id][i][j]]
            const totalQuantity = !!tempCard ? getLotTotalQuantity(tempCard) : 0

            //filtering magic
            var matchesFilter = false
            if(!!multipleFilters){
              matchesFilter = lotFilters.reduce((matchesAll, filter) => matchesAll && checkCardMatchesFilter(tempCard, filter), true)
            }
            else{
              matchesFilter = getMatchesFilter(tempCard, lotFilterValue, selectedFilterOption)
            }
            if(matchesFilter) tempCards[tempCard?._id] = tempCard
          }
        }
        if(lotFilterValue!== '' || Object.values(tempCards).length>0) setCards(tempCards)
      }

    }, [lotFilterValue, selectedFilterOption, lotFilters])

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
          if(!!cards[j] && !!cards[j].bins[id]){
            cardCount+=1
            if(Number.isInteger(cards[j].bins[id].count)) partCount+=cards[j].bins[id].count
          }
          if(!!cards[j] && !!cards[j].bins['QUEUE'] && i == 0){
            queueCardCount+=1
            if(Number.isInteger(cards[j].bins['QUEUE'].count)) queuePartCount+=cards[j].bins['QUEUE'].count
          }
          if(!!cards[j] && !!cards[j].bins['FINISH'] && i == 0){
            finishCardCount+=1
            if(Number.isInteger(cards[j].bins['FINISH'].count)) finishPartCount+=cards[j].bins['FINISH'].count
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
  	}, [draggingLotId, cards])


    const onDragClient = (e) => {
      setClientY(e.clientY)
    }

    const debouncedDrag = useCallback(throttle(onDragClient, 20), []);

    const dragIndexSearch = (stationId) => {
      if(!!draggingLotId && !!stationId){
        if(lotFilterValue !== '') {
          return 0
        }
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
        setCurrTimeout(null)
      }
      else {
        clearTimeout(currTimeout)
        let timeout = setTimeout(handleSetUpdate, 4000)
        setCurrTimeout(timeout)

      }
    }

    const scheduleUpdateReset = (delay = 4000) => {
      if(activeTimeout && currTimeout){
        clearTimeout(currTimeout)
      }

      setActiveTimeout(true)
      const timeout = setTimeout(() => {
        setUpdate(true)
        setActiveTimeout(false)
        setCurrTimeout(null)
      }, delay)
      setCurrTimeout(timeout)
    }

    const finalizeDrag = (target, lotDiv) => {
      if(lotDiv){
        lotDiv.style.display = 'flex'
        lotDiv.style.maxHeight = '100rem'
        lotDiv.style.paddingTop = ''
      }

      resetDragState()
      justDraggedRef.current = true

      // Re-enable processCards→cards syncing immediately.
      // We awaited dispatchPutCard before reaching here, so the backend
      // response is already in Redux — no extra delay needed.
      setUpdate(true)
      setActiveTimeout(false)
      setCurrTimeout(null)

      if(target){
        target.style.opacity = '1'
        target.style.display = 'flex'
        target.style.maxHeight = '100rem'
      }
    }

    const resetDragState = () => {
      dragIndexRef.current = null
      startIndexRef.current = null
      dragFromStationRef.current = null
      draggingStationIdRef.current = null
      draggingLotIdRef.current = null
      setDragIndex(null)
      setStartIndex(null)
      setAllowHomeDrop(null)
      setMouseOffsetY(null)
      setMouseOffsetX(null)
      setDragFromStation(null)
      setDraggingStationId(null)
      setDraggingLotId(null)
      setDropNodes([])
    }

    //This function is now more limiting with split/merge
    // -dont allow moving lot to next stations(s) if current station disperses a lot
    //-dont allow movinga lot backwards if the previous node has routes merging into it or if it disperses a lot
    //-dont allow moving lot back if current node has routes merging into it
    //-These limitations ensure dragging lots around in cardZone dont mess merge/split functionality
    //-We should make it more flexible in the future with functions that handle the above cases...
    //-There is some functionality that i added where you can drag lots forward into their merging station and it will properly merge them
    const shouldAcceptDrop = (cardId, startId, currId, shouldUpdateDropNodes = true) => {
      let lastStationTraversed = false
      let tempDropNodes = []
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
          if(shouldUpdateDropNodes){
            setDropNodes((prevDropNodes) => [...new Set([...(prevDropNodes || []), ...tempDropNodes])])
          }
          return lastStationTraversed

        }

    const handleDrop = async (containsPartial) => {
      const currentDragFromStation = dragFromStationRef.current
      const currentDraggingStationId = draggingStationIdRef.current
      const currentDragIndex = dragIndexRef.current
      const currentStartIndex = startIndexRef.current
      const currentDraggingLotId = draggingLotIdRef.current
      const currentOrderedIds = orderedIdsRef.current
      const currentCards = cardsRef.current

      if(currentDragFromStation === currentDraggingStationId){//dragging within column
        if((!!currentDragIndex || currentDragIndex === 0) && currentDragIndex !== currentStartIndex+1){//drop zone existst and not dropping in home position
          let newIds = deepCopy(currentOrderedIds)
          newIds[id][currentDraggingStationId].splice(currentDragIndex, 0, newIds[id][currentDraggingStationId][currentStartIndex])
          if(currentDragIndex<=currentStartIndex){//dragging up
            newIds[id][currentDraggingStationId].splice(currentStartIndex+1,1)
          }
          else{//dragging down
            newIds[id][currentDraggingStationId].splice(currentStartIndex,1)
          }
          orderedIdsRef.current = newIds
          setOrderedIds(newIds)
          dispatchPostSettings({
            ...serverSettings,
            orderedCardIds: newIds
          })
        }
      }
      else if((!!currentDragIndex || currentDragIndex ===0) && currentDragFromStation!==currentDraggingStationId){
        //update ID array
        let newIds = deepCopy(currentOrderedIds)
        if(!newIds[id][currentDraggingStationId]) newIds[id][currentDraggingStationId] = []
        if(!newIds[id][currentDraggingStationId].includes(currentDraggingLotId)){
          newIds[id][currentDraggingStationId].splice(currentDragIndex, 0, newIds[id][currentDragFromStation][currentStartIndex])
        }
        if(!containsPartial) newIds[id][currentDragFromStation].splice(currentStartIndex,1)
        if(newIds[id][currentDragFromStation].length === 0) newIds[id][currentDragFromStation] = []
        orderedIdsRef.current = newIds
        setOrderedIds(newIds)
        dispatchPostSettings({
          ...serverSettings,
          orderedCardIds: newIds
        })
        //post new lot bins
        let lastStn = shouldAcceptDrop(currentDraggingLotId, currentDragFromStation, currentDraggingStationId, false)
        let updatedLot = deepCopy(currentCards[currentDraggingLotId])
        let stationBeforeMerge = !!lastStn ? lastStn : currentDragFromStation
        updatedLot.bins = handleNextStationBins(updatedLot.bins, updatedLot.bins[currentDragFromStation]?.count, stationBeforeMerge, currentDraggingStationId, process, routes, stations)
        updatedLot.bins = handleCurrentStationBins(updatedLot.bins, updatedLot.bins[currentDragFromStation]?.count, currentDragFromStation, process, routes)
        if(!!updatedLot.bins[currentDragFromStation] && !updatedLot.bins[currentDragFromStation]['count']){
          updatedLot.bins[currentDragFromStation] = {
            ...updatedLot.bins[currentDragFromStation],
            count: 0
          }
        }
        //Bin exists but nothing in it. Delete the bin as this messes various things up.
        if(!!updatedLot.bins[currentDragFromStation] && updatedLot.bins[currentDragFromStation]['count'] === 0 && Object.values(updatedLot.bins[currentDragFromStation]).length === 1){
          delete updatedLot.bins[currentDragFromStation]
        }
        let newCards = deepCopy(currentCards)
        newCards[updatedLot._id] = updatedLot
        cardsRef.current = newCards
        setCards(newCards)
        await dispatchPutCard(updatedLot, updatedLot._id)
     }
     draggingLotIdRef.current = null
     setDraggingLotId(null)
    }

    const isOverflowing = (stationID) => {
      let div = document.getElementById(stationID)
      let divHeight = div.getBoundingClientRect().height
      if(viewHeight-divHeight<60){
        return true
      }
      return false
    }

    const handleRightClickDeleteLot = (card, binId, partId) => {
        //delete card from ordered ids to make card immediately dissapear
        if(!partId){
          let updatedIds = deepCopy(orderedIds)
          let ind = updatedIds[id][binId].findIndex(cardId => cardId === card._id)
          updatedIds[id][binId].splice(ind,1)
          setOrderedIds(updatedIds)
          dispatchPostSettings({
            ...serverSettings,
            orderedCardIds: updatedIds
          })

          //update card/part count array immediately
          let tempPartCount = deepCopy(partCount)
          let tempCardCount = deepCopy(cardCount)
          tempPartCount[binId] -= card.bins[binId]['count']
          tempCardCount[binId] -= 1

          setPartCount(tempPartCount)
          setCardCount(tempCardCount)
        }

        let currLot = deepCopy(card)
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


        if(Object.values(submitLot.bins).length === 0) {
          dispatchDeleteCard(card._id)
        }
        else dispatchPutCard(submitLot, submitLot._id)
    }

    const renderHeaderContent = (stationId) => {
      let name
      if(stationId === 'QUEUE') name = t("Queue")
      else if(stationId === 'FINISH') name = t("Finish")
      else name = stations[stationId].name
      return (
        <styled.HeaderContainer>
          <styled.StationName>
            {name}
          </styled.StationName>
          <styled.ColumnHeader>
          <div data-tip data-for = {'lots-' + stationId}>
            <ReactTooltip
                id={'lots-' + stationId}
                place="right"
                effect="solid"
                offset = {{top: 70, left: 95}}
                backgroundColor = '#FFFFFF'
                textColor = '#363636'
                border = {true}
                >
               <styled.LotCount>{t("Parts at the current station")}</styled.LotCount>
              </ReactTooltip>
              <styled.RowContainer>
                <styled.LotCount>
                {cardCount[stationId]}
                </styled.LotCount>
                <i className = 'far fa-window-restore' style = {{color: '#79797d', fontSize: '1.2rem', marginLeft: '0.5rem', marginTop: '0.1rem'}}/>
              </styled.RowContainer>
            </div>

            <div data-tip data-for = {'parts-' + stationId}>
              <ReactTooltip
                  id={'parts-' + stationId}
                  place="right"
                  effect="solid"
                  offset = {{top: 70, left: 95}}
                  backgroundColor = '#FFFFFF'
                  textColor = '#363636'
                  border = {true}
                  >
                
                  <styled.LotCount>{t("Lots at the current station")}</styled.LotCount>
                      
                </ReactTooltip>
                <styled.RowContainer>
                  <styled.LotCount>
                  {partCount[stationId]}
                  </styled.LotCount>
                  <i className = 'fas fa-splotch' style = {{color: '#79797d', fontSize: '1.2rem', marginLeft: '0.5rem', marginTop: '0.1rem'}}/>
                </styled.RowContainer>
              </div>
          </styled.ColumnHeader>
        </styled.HeaderContainer>

      )
    }

    const renderCards = (stationId) => {

      if(orderedIds && cards && orderedIds[id] && orderedIds[id][stationId] && orderedIds[id][stationId].length>0){
        let ids = orderedIds
        return(
          ids[id][stationId].map((cardId, index) => {
            let card = cards[cardId]
            let partBins = card?.bins[stationId] || {}

            if(Object.values(partBins).length === 1){
              return (
                  <VisibilitySensor partialVisibility = {true} offset = {{bottom: -550, top: -550}}>
                    {({isVisible}) =>
                      <>
                        {isVisible || draggingLotId === card._id ?
                          <styled.CardContainer
                            onMouseOver = {()=>{
                              setHoveringCard(card)
                            }}
                            key = {cardId}
                            onMouseLeave = {()=>setHoveringCard(null)}
                            onClick = {()=>setShowLotEditor(true)}
                            draggable = {true}
                            onDragStart = {(e)=>{
                              setUpdate(false)
                              setDropNodes([])
                              setDivHeight(e.target.offsetHeight)
                              setDivWidth(e.target.offsetWidth-35)
                              draggingLotIdRef.current = card._id
                              setDraggingLotId(card._id)
                              dragFromStationRef.current = stationId
                              setDragFromStation(stationId)
                              draggingStationIdRef.current = stationId
                              setDraggingStationId(stationId)
                              startIndexRef.current = index
                              setStartIndex(index)
                              dragIndexRef.current = index
                              setDragIndex(index)
                              let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
                              let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

                              setMouseOffsetY(offsetY)
                              setMouseOffsetX(offsetX)

                              e.target.style.opacity = '0.001'

                              for(const i in process.flattened_stations){
                                shouldAcceptDrop(card._id, stationId, process.flattened_stations[i].stationID)
                              }
                              shouldAcceptDrop(card._id, stationId, 'QUEUE')
                              shouldAcceptDrop(card._id, stationId, 'FINISH')
                            }}
                            onDragEnd = {async (e)=>{
                              const target = e.target
                              let lotDiv = document.getElementById(card._id + stationId)
                              try {
                                await handleDrop(false)
                              } finally {
                                finalizeDrag(target, lotDiv)
                              }
                              e.preventDefault()
                            }}
                          >
                          {dragIndex === 0 && index === 0 && draggingStationId === stationId && (allowHomeDrop || lotFilterValue!== '') &&
                            <styled.DropContainer
                              divHeight = {!!divHeight ? divHeight +'px' : '8rem'}
                              divWidth = {!!divWidth ? divWidth +'px' : '20rem'}
                            />
                          }
                          <div id = {cardId + stationId}>
                            <LotContainer
                              containerStyle = {{margin: '0.5rem'}}
                              isInProgress = {!!openEvents[stationId] && openEvents[stationId].findIndex(e => e.lot_id === cardId) !== -1}
                              selectable={true}
                              key={card._id}
                              enableFlagSelector={true}
                              onClick = {()=> {
                                onShowCardEditor(card)
                              }}
                              onRightClickDeleteLot = {()=>{
                                handleRightClickDeleteLot(card, stationId)
                              }}
                              totalQuantity={card.totalQuantity ? card.totalQuantity : 0}
                              lotNumber={card.lotNum ? card.lotNum : 0}
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
                                width: '21.1rem',
                                maxWidth: '21.1rem',
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
                          :
                          <div style = {{minHeight:'12rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ddd', borderRadius: '0.4rem', margin: '0.5rem 1rem'}}>...Loading</div>
                        }
                      </>
                    }
                  </VisibilitySensor>
                )
              }
                else if (Object.values(partBins).length>1){
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
                                setDropNodes([])
                                setDivHeight(e.target.offsetHeight)
                                setDivWidth(e.target.offsetWidth)
                                draggingLotIdRef.current = card._id
                                setDraggingLotId(card._id)
                                dragFromStationRef.current = stationId
                                setDragFromStation(stationId)
                                draggingStationIdRef.current = stationId
                                setDraggingStationId(stationId)
                                startIndexRef.current = index
                                setStartIndex(index)
                                dragIndexRef.current = index
                                setDragIndex(index)
                                let offsetY = ((e.target.getBoundingClientRect().bottom - e.target.getBoundingClientRect().top)/2 + e.target.getBoundingClientRect().top - e.clientY)
                                let offsetX = ((e.target.getBoundingClientRect().right - e.target.getBoundingClientRect().left)/2 + e.target.getBoundingClientRect().left - e.clientX)

                                setMouseOffsetY(offsetY)
                                setMouseOffsetX(offsetX)

                                e.target.style.opacity = '0.001'

                                for(const i in process.flattened_stations){
                                  shouldAcceptDrop(card._id, stationId, process.flattened_stations[i].stationID)
                                }
                                shouldAcceptDrop(card._id, stationId, 'QUEUE')
                                shouldAcceptDrop(card._id, stationId, 'FINISH')
                              }}
                              onDragEnd = {async (e)=>{
                                const target = e.target
                                  let lotDiv = document.getElementById(card._id + stationId)
                                try {
                                  await handleDrop(true)
                                } finally {
                                  finalizeDrag(target, lotDiv)
                                  }
                                e.preventDefault()
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
                                name={isPartial ? card.name? card.name + ` (${routes[part]?.name})` : card.lotNum + ` (${routes[part]?.name})` : card.name ? card.name : card.lotNum}
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
                                  margin: '.5rem',
                                  width: '21.1rem',
                                  maxWidth: '21.1rem',
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

      const renderStationColumn = (stationID) => {
        return (
          <div
            style = {{pointerEvents: !dropNodes.includes(stationID) && draggingLotId && 'none'}}
            onDragEnter = {(e)=>{
              const nextDragIndex = dragIndexSearch(stationID)
              dragIndexRef.current = nextDragIndex
              setDragIndex(nextDragIndex)
              draggingStationIdRef.current = stationID
              setDraggingStationId(stationID)
            }}
            onMouseEnter = {() => {
              setHoveringStation(stationID)
            }}
          >
            <styled.ColumnContainer
              disabled = {!dropNodes.includes(stationID) && draggingLotId}
            >
              {renderHeaderContent(stationID)}
              <styled.StationColumnContainer
                id = {stationID}
                maxHeight = {viewHeight?.toString() + 'px'}
                isOverflowing = {dragFromStation === stationID ? isOverflowing(dragFromStation) ? true : false : true}
              >
                {renderCards(stationID)}
              </styled.StationColumnContainer>
            </styled.ColumnContainer>
          </div>
        )
      }

    const renderStationColumns = useMemo(() => {
      return (
        Object.values(process.flattened_stations || {}).map((station) => {
          return (
            <React.Fragment key={station.stationID}>
              {renderStationColumn(station.stationID)}
            </React.Fragment>
          )
        })
      )
    },[draggingStationId, viewHeight, orderedIds, dragIndex, filteredIds, cards, allowHomeDrop, draggingLotId, partCount, cardCount])


    const renderQueue = useMemo(() => {
      return (
        <div
          style = {{pointerEvents: !dropNodes.includes('QUEUE') && draggingLotId && 'none'}}
          onDragEnter = {(e)=>{
            const nextDragIndex = dragIndexSearch('QUEUE')
            dragIndexRef.current = nextDragIndex
            setDragIndex(nextDragIndex)
            draggingStationIdRef.current = 'QUEUE'
            setDraggingStationId('QUEUE')
          }}
          onMouseEnter = {() => {
            setHoveringStation('QUEUE')
          }}
        >
          <styled.ColumnContainer
            style = {{paddingBottom: '0.5rem'}}
            disabled = {!dropNodes.includes('QUEUE') && draggingLotId}
          >
           {renderHeaderContent('QUEUE')}
            <styled.StationColumnContainer
              id = {'QUEUE'}
              maxHeight = {(viewHeight-55)?.toString() + 'px'}
              isOverflowing = {dragFromStation === 'QUEUE' ? isOverflowing(dragFromStation) ? true : false : true}
            >
                {renderCards('QUEUE')}
            </styled.StationColumnContainer>
            <styled.AddLotContainer onClick = {()=>handleAddLotClick()}>
            <i className = 'fas fa-plus' style = {{marginTop: '1.2rem', color: '#7e7e7e'}}/>
              <styled.AddLot>
                {t("Add New Lot")}
              </styled.AddLot>
            </styled.AddLotContainer>
          </styled.ColumnContainer>
        </div>
      )
    },[draggingStationId, viewHeight, orderedIds, filteredIds, cards, dragIndex, allowHomeDrop, draggingLotId, partCount, cardCount])

    const renderFinish = useMemo(() => {
      return (
        <div
          style = {{pointerEvents: !dropNodes.includes('FINISH') && draggingLotId && 'none'}}
          onDragEnter = {(e)=>{
            const nextDragIndex = dragIndexSearch('FINISH')
            dragIndexRef.current = nextDragIndex
            setDragIndex(nextDragIndex)
            draggingStationIdRef.current = 'FINISH'
            setDraggingStationId('FINISH')
          }}
          onMouseEnter = {() => {
            setHoveringStation('FINISH')
          }}
        >
          <styled.ColumnContainer
            disabled = {!dropNodes.includes('FINISH') && draggingLotId}
          >
           {renderHeaderContent('FINISH')}
            <styled.StationColumnContainer
              id = 'FINISH'
              isOverflowing = {dragFromStation === 'FINISH' ? isOverflowing(dragFromStation) ? true : false : true}
              maxHeight = {viewHeight?.toString() + 'px'}
            >
                {renderCards('FINISH')}
            </styled.StationColumnContainer>
          </styled.ColumnContainer>
        </div>
      )
    },[draggingStationId, viewHeight, orderedIds, filteredIds, cards, dragIndex, allowHomeDrop, draggingLotId, partCount, cardCount])

    const renderLotEditor = () => {
      return (
        <LotEditorContainer
            isOpen={showLotEditor}
            onAfterOpen={null}
            cardId={hoveringCard ? hoveringCard._id : null}
            processId={id ? id : null}
            binId={hoveringStation ? hoveringStation : null}
            onClose={()=>{
                setHoveringCard(null)
                onShowCardEditor(false)
            }}
        />
      )
    }

    const renderFilterSortBar = useMemo(() => {
      return (
        <div style = {{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <div style={{marginLeft: '0.5rem', display: 'flex', padding: ".5rem 0rem 0rem 0.5rem", flexDirection: 'row', margin: '0rem', flexWrap: "wrap"}}>
            <BackButton
              containerStyle = {{alignSelf: 'center'}}
              schema = {'lots'}
              onClick = {() => {
                history.push('/lots/summary')
              }}
               />
              <ZoneHeader
                  lotFilterValue={lotFilterValue}
                  sortDirection={sortDirection}
                  sortMode={sortMode}
                  setSortMode={setSortMode}
                  setLotFilterValue={setLotFilterValue}
                  selectedFilterOption={selectedFilterOption}
                  setSelectedFilterOption={setSelectedFilterOption}
                  setSortDirection={setSortDirection}
                  setSortChanged = {setSortChanged}
                  filters={lotFilters}
                  onAddFilter={handleAddLotFilter}
                  onRemoveFilter={handleRemoveLotFilter}

                  selectedProcesses={process}
                  selectedLots={cards}
                  onClearClick={()=>setCards([])}
              />
          </div>
          <styled.StationName style = {{alignSelf: 'center', position: 'absolute', left: '50%', fontSize: '1.8rem'}}>{process.name}</styled.StationName>
        </div>
      )
    },[lotFilterValue, sortDirection, sortMode, selectedFilterOption, lotFilters, cards])

    return (
      <styled.PageContainer
      >
        {renderFilterSortBar}
        <styled.Container
          style = {{height: size.height}}
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
      </styled.PageContainer>
    )
  }

export default Cards
