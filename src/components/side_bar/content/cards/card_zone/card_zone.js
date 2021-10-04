import React, { useEffect, useState, memo, useMemo } from "react"
import useWindowDimensions from "../../../../../higher_order_components/react-window-size";
import moment from 'moment';


// components internal
import StationsColumn from "../columns/station_column/station_column"
import LotQueue from "../columns/lot_queue/lot_queue"
import FinishColumn from "../columns/finish_column/finish_column"

// functions external
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"

// utils
import { getLotTotalQuantity, getCardsInBin, checkCardMatchesFilter, getMatchesFilter } from "../../../../../methods/utils/lot_utils";
import { getLoadStationId, getUnloadStationId } from "../../../../../methods/utils/route_utils";
import { getProcessStationsSorted, flattenProcessStations } from '../../../../../methods/utils/processes_utils';
import { convertShiftDetailsToWorkingTime, convertHHMMSSStringToSeconds } from '../../../../../methods/utils/time_utils'

// styles
import * as styled from "./card_zone.style"
import { isObject } from "../../../../../methods/utils/object_utils";
import { isArray } from "../../../../../methods/utils/array_utils";
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from "../../../../../constants/lot_contants";

// Import Actions
import { getStationAnalytics } from '../../../../../redux/actions/stations_actions'

// Import API
import { getStationCycleTime } from '../../../../../api/stations_api'


const CardZone = ((props) => {

    // extract props
    const {
        handleCardClick,
        processId,
        setShowCardEditor,
        showCardEditor,
        maxHeight,
        lotFilters,
        lotFilterValue,
        selectedFilterOption,
        sortMode,
        sortDirection,
        selectedCards,
        setSelectedCards,
        handleAddLotClick,
    } = props

    const { height: windowHeight, width: windowWidth } = useWindowDimensions()

    // redux state
    const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] }) || {}
    const showFinish = currentProcess.showFinish === undefined ? true: currentProcess.showFinish
    const showQueue = currentProcess.showQueue === undefined ? true: currentProcess.showQueue

    const routes = useSelector(state => { return state.tasksReducer.tasks })
    const allCards = useSelector(state => { return state.cardsReducer.processCards }) || {}
    const stations = useSelector(state => { return state.stationsReducer.stations })
    const draggedLotInfo = useSelector(state => { return state.cardPageReducer.droppedLotInfo })
    const { shiftDetails } = useSelector(state => state.settingsReducer.settings)
    const multipleFilters = useSelector(state => state.settingsReducer.settings.enableMultipleLotFilters)
    const {
        lotId: draggingLotId = "",
        binId: draggingBinId = ""
    } = draggedLotInfo || {}

    // component state
    const [cardsSorted, setCardsSorted] = useState({})
    const [bins, setBins] = useState({})
    const [queue, setQueue] = useState([])
    const [finished, setFinished] = useState([])
    const [cards, setCards] = useState({})
    const [deleteStationCycleTime, setDeleteStationCycleTime] = useState({})

    const {
        name: processName = ""
    } = currentProcess || {}

    const doesProcessEndInWarehouse = useMemo(() => {
        const processRoutes = currentProcess.routes.map(routeId => routes[routeId]);

        let loadStations = processRoutes.map(route => route.load);
        let unloadStations = processRoutes.map(route => route.unload);

        for (var i=0; i<unloadStations.length; i++) {
            const unloadStationA = unloadStations[i];


            if (loadStations.find(loadStation => loadStation === unloadStationA) === undefined) {
                if (unloadStations.slice(0, i).find(unloadStationB => unloadStationB === unloadStationA) === undefined) {
                    return stations[unloadStationA].type === 'warehouse'
                }
            }
        }

        return false;
    }, [currentProcess.routes, stations])

    // const [cardsSorted, setCardsSorted] = useState({})
    // const [queue, setQueue] = useState([])
    // const [finished, setFinished] = useState([])hideQueueFinish

    // ============================== LEAD TIME ESTIMATION ====================================== //
    const convertShiftDetails = (details) => {

        let breaks = [{
            start: moment.duration(0).asSeconds(),
            end: moment.duration(details.startOfShift).asSeconds()
        }];
        Object.values(shiftDetails.breaks)
            .sort((a, b) => a.startOfBreak - b.startOfBreak)
            .forEach(br => {
                if (br.enabled) {
                    breaks.push({
                        start: moment.duration(br.startOfBreak).asSeconds(),
                        end: moment.duration(br.endOfBreak).asSeconds()
                    })
                }
            })

        breaks.push({
            start: moment.duration(details.endOfShift).asSeconds(),
            end: moment.duration(24, 'hours').asSeconds()
        })

        return breaks;

    }

    const addWeekdays = (date, days) => {
        date = moment(date); // use a clone
        while (days > 0) {
            date = date.add(1, 'days');
            // decrease "days" only if it's a weekday.
            if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
                days -= 1;
            }
        }
        return date;
    }

    // need to loop through the process's routes first and get all station ids involved in the process
    // this must be done first in order to avoid showing lots that are in stations that are no longer a part of the process
    useEffect(() => {
        let prevLoadStationId		// tracks previous load station id when looping through routes
        let prevUnloadStationId		// tracks previous unload station id when looping through routes
        let tempBins = {}	// temp var for storing sorted cards

        // loop through routes, get load / unload station id and create entry in tempCardsSorted for each station
        currentProcess.routes && currentProcess.routes.forEach((currRouteId, index) => {

            // get current route and load / unload station ids
            const currRoute = routes[currRouteId]
            const loadStationId = getLoadStationId(currRoute)
            const unloadStationId = getUnloadStationId(currRoute)

            tempBins[loadStationId] = {
                station_id: loadStationId,
                cards: []
            }

            // add entry in tempCardsSorted
            tempBins[unloadStationId] = {
                station_id: unloadStationId,
                cards: []
            }

            // update prevLoadStationId and prevUnloadStationId
            prevLoadStationId = loadStationId
            prevUnloadStationId = unloadStationId
        })

        setBins(tempBins)

    }, [currentProcess, routes])


    // now that the object keys have been made, loop through the process's cards and add them to the correct bins
    useEffect(() => {
        let tempQueue = []		// temp var for storing queue lots
        let tempFinished = []	// temp var for storing finished lots
        let tempCardsSorted = { ...bins }

        Object.values(cards).forEach((card) => {
            // extract lot attributes
            const {
                bins: cardBins,
                _id,
                ...rest
            } = card

            const totalQuantity = getLotTotalQuantity(card)
            // const matchesFilter = lotFilters.reduce((filter, matchesAll) => matchesAll && checkCardMatchesFilter(card, filter), true)
            var matchesFilter = false
            if(!!multipleFilters){
              matchesFilter = lotFilters.reduce((matchesAll, filter) => matchesAll && checkCardMatchesFilter(card, filter), true)
            }
            else{
              matchesFilter = getMatchesFilter(card, lotFilterValue, selectedFilterOption)
            }

            if (cardBins && matchesFilter) {

                // loop through this lot's bins
                Object.entries(cardBins).forEach((binEntry) => {

                    // get bin attributes
                    const binId = binEntry[0]
                    const binValue = binEntry[1]
                    const {
                        count
                    } = binValue

                    if (!(count > -1)) return

                    // don't render lot being dragged - prevents flicker bug after drop
                    //if ((binId === draggingBinId) && (_id === draggingLotId)) return

                    const lotItem = {
                        ...rest,
                        totalQuantity,
                        binId,
                        count,
                        cardId: _id,
                        processName
                    }


                    // if there is an entry in tempCardsSorted with key matching {binId}, add the lot to this bin
                    if (bins[binId]) {
                        // tempCardsSorted[binId].cards.push(lotItem)
                        const currentObj = isObject(tempCardsSorted[binId]) ? tempCardsSorted[binId] : {}
                        const existingCards = (isArray(currentObj.cards)) ? currentObj.cards : []

                        tempCardsSorted = {
                            ...tempCardsSorted,
                            [binId]: {
                                ...currentObj,
                                cards: [...existingCards, lotItem]
                            }
                        }
                    }

                    // if {binId} is queue, add the lot to the queue
                    else if (binId === "QUEUE") {
                        tempQueue.push(lotItem)
                    }

                    // if the {binId} is finish, add the lot to the finished column
                    else if (binId === "FINISH") {
                        tempFinished.push(lotItem)
                    }

                })
            }
        })

        setCardsSorted(tempCardsSorted)
        setQueue(tempQueue)
        setFinished(tempFinished)
    }, [bins, cards, lotFilters, draggingBinId, draggingLotId, lotFilterValue, selectedFilterOption])


    const renderStationColumns = useMemo(() => {

        const columns = currentProcess.flattened_stations.map((stationNode, idx) => (

            <div id={`column-${stationNode.stationID}`}>
                
                <StationsColumn
                    containerStyle={{marginTop: `${stationNode.depth*2}rem`, position: 'relative'}}
                    setSelectedCards={setSelectedCards}
                    selectedCards={selectedCards}
                    sortMode={sortMode}
                    sortDirection={sortDirection}
                    maxHeight={maxHeight}
                    id={processId + "+" + stationNode.stationID}
                    station_id={stationNode.stationID}
                    stationName={stations[stationNode.stationID].name}
                    processId={processId}
                    cards={cardsSorted[stationNode.stationID]?.cards || []}
                    onCardClick={handleCardClick}
                    autoCycleTime={deleteStationCycleTime[stationNode.stationID]}
                >
                </StationsColumn>
            </div>

        ))

        // const pathsBoxWidth = 26*(currentProcess.flattened_stations.length + 2)
        // const pathsBoxHeight = 2*Math.max(...currentProcess.flattened_stations.map(node => node.depth))
        // const paths = (
        //     <div style={{zIndex: 1000, background: 'red', width: '400rem', top: 0, left: 0}}>
        //     {/* <svg style={{background: 'rgba(0,0,0.3,0.3)', position: 'absolute'}} fill='yellow' viewBox={`0 0 ${100*pathsBoxWidth} ${100*pathsBoxHeight}`} width={`${pathsBoxWidth}rem`} height={`${pathsBoxHeight}rem`} > 
        //         {currentProcess.routes.map(routeId => {
        //             const route = routes[routeId];
        //             const loadIdx = currentProcess.flattened_stations.findIndex(node => node.stationID === route.load)
        //             const unloadIdx = currentProcess.flattened_stations.findIndex(node => node.stationID === route.unload)

        //             return <line x1={`${26*100*loadIdx}`} y1={200*currentProcess.flattened_stations[loadIdx].depth} x2={`${26*100*unloadIdx}`} y2={200*currentProcess.flattened_stations[unloadIdx].depth} stroke="black" strokeWidth="10"/>
        //         })}
        //     </svg> */}
        //     </div>
        // )

        return (
            <>
                {columns}
                {/* {paths} */}
            </>
        )

    }, [cardsSorted, currentProcess])

    return (
        <styled.Container style={{ background: 'white' }}>
            
            <LotQueue
                setSelectedCards={setSelectedCards}
                selectedCards={selectedCards}
                key={"QUEUE"}
                sortMode={sortMode}
                sortDirection={sortDirection}
                maxHeight={maxHeight}
                station_id={"QUEUE"}
                setShowCardEditor={setShowCardEditor}
                showCardEditor={showCardEditor}
                stationName={"Queue"}
                processId={processId}
                cards={queue}
                onCardClick={handleCardClick}
                onAddLotClick={() => handleAddLotClick(processId)}
            />

            {renderStationColumns}

            {!doesProcessEndInWarehouse &&
                <FinishColumn
                    setSelectedCards={setSelectedCards}
                    selectedCards={selectedCards}
                    key={"FINISH"}
                    sortMode={sortMode}
                    sortDirection={sortDirection}
                    maxHeight={maxHeight}
                    station_id={"FINISH"}
                    setShowCardEditor={setShowCardEditor}
                    showCardEditor={showCardEditor}
                    stationName={"Finished"}
                    processId={processId}
                    cards={finished}
                    onCardClick={handleCardClick}
                />
            }
        </styled.Container>
    )
})

// Specifies propTypes
CardZone.propTypes = {
    handleCardClick: PropTypes.func,
    setShowCardEditor: PropTypes.func,
    processId: PropTypes.string,
    lotFilters: PropTypes.array,
    lotFilterValue: PropTypes.any,
    showCardEditor: PropTypes.bool,
    maxHeight: PropTypes.any
}

// Specifies the default values for props:
CardZone.defaultProps = {
    handleCardClick: () => { },
    processId: null,
    setShowCardEditor: () => { },
    showCardEditor: false,
    maxHeight: null,
    lotFilterValue: "",
    selectedFilterOption: LOT_FILTER_OPTIONS.name,
    lotFilters: [],
    sortMode: LOT_FILTER_OPTIONS.name,
    sortDirection: SORT_DIRECTIONS.ASCENDING,
}

export default memo(CardZone)
