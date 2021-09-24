import React, { useEffect, useState, memo, useMemo } from "react"
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

    // Useeffect for cycle times
    // Stations are a dependency because that is where the manual cycle time is stored
    useEffect(() => {
        //deleteGetCycleTimes()
    }, [shiftDetails, allCards, stations])

    // This function calculates cycle time based on the throughput of that day
    // PROBABLY SHOULD DELETE THIS
    const deleteGetCycleTimes = async () => {
        // Get stations in this process
        let processStations = getProcessStationsSorted(currentProcess, routes);
        // const body = { timespan: 'day', index: 0 }
        // const workingTime = convertShiftDetailsToWlotfiltervalueorkingTime(shiftDetails)

        let stationCycleTimes = {}

        for (const ind in processStations) {
            const stationID = processStations[ind]


            const station = stations[stationID]
            if (!!station?.manual_cycle_time && !!station?.cycle_time) {
                const seconds = convertHHMMSSStringToSeconds(station.cycle_time)
                stationCycleTimes =
                {
                    ...stationCycleTimes,
                    [stationID]: seconds,

                }
            }
            else {
                const cycleTime = await getStationCycleTime(stationID)
                stationCycleTimes =
                {
                    ...stationCycleTimes,
                    [stationID]: cycleTime,

                }
            }


        }
        setDeleteStationCycleTime(stationCycleTimes)
    }

    useEffect(() => {
        // === Calculate preceding lead time based on cards in later stations

        // Get stations in this process
        let processStations = getProcessStationsSorted(currentProcess, routes);
        processStations.unshift("QUEUE")

        // Get cards in this process
        const processCards = allCards[processId] || {};

        // Convert the shiftDetails object to an array of [startShift, shiftDuration] pairs for a single day
        const breaks = convertShiftDetails(shiftDetails);

        // ================================================== //
        //// Simulate all card movements to determine lead time

        // Gather cards in this process and organize them by station
        let i, stationCards, stationSimCards, stationCycleTime;
        let stationTimesUntilMove = new Array(processStations.length);
        let pStationSimCards = [];
        for (i = 0; i < processStations.length; i++) {
            stationCards = getCardsInBin(processCards || {}, processStations[i], processId)	// Get all cards in this station's bin
            stationSimCards = stationCards.map(card => ({
                _id: card._id,
                qty: card.bins[processStations[i]].count
            }));
            pStationSimCards.push(stationSimCards);

            if (stationSimCards.length) {
                stationCycleTime = deleteStationCycleTime[stations[processStations[i]]?._id] || 0;
                stationTimesUntilMove[i] = stationSimCards[0].qty * stationCycleTime;
            } else {
                stationTimesUntilMove[i] = Infinity;
            }

        }

        // Simulate card movements:
        //
        // === Algorithm Definition === //
        // currSimTime = 0
        // pStationSimCards = cards
        // cardsToBeMoved = []
        // while there are cards in pStationSimCards
        //     nextSimStep = Inf
        //     for each station in processStations
        //         card = firstCardAtStation
        //         if card is in cardsToBeMoved, move it to next station. If station is last station, remove card from simCards and set leadTime in real cards
        //		   calculate timeUntilCardMove = time until card will move to next station (qty*cycleT)
        //         if timeUntilCardMove < nextSimStep, cardsToBeMoved = [card], nextSimStep = timeUntilCardMove
        //         else if timeUntilCardMove == nextSimStep, cardsToBeMoved.push(card)
        //		currSimTime += nextSimStep
        //

        let currSimTime = 0;
        let simStep = 0;
        let topCard, minTimeUntilMove, nextCardsToBeMoved, tempStationCards;
        let cardsToBeMoved = [];
        let totalSimCards = pStationSimCards.reduce((acc, elem) => acc + elem.length, 0);

        let itt=0
        while (totalSimCards > 0) {

            currSimTime += simStep
            itt += 1;

            totalSimCards = 0;
            nextCardsToBeMoved = [];
            minTimeUntilMove = Infinity;
            for (i = 0; i < pStationSimCards.length; i++) {
                stationCards = pStationSimCards[i];

                if (!stationCards.length) { stationTimesUntilMove[i] = Infinity; continue }
                totalSimCards += stationCards.length;

                topCard = stationCards[0];

                if (cardsToBeMoved[0] === i) {
                    if (i === (pStationSimCards.length - 1)) {
                        processCards[topCard._id].leadTime = currSimTime; // If card is at last station, currSimTime is its lead time
                    } else {
                        pStationSimCards[i + 1].push(topCard);	// Move card to next station

                        //// Since we moved a card, we now need to calculate the nextMoveTime for THAT next station
                        topCard = pStationSimCards[i + 1][0];
                        stationCycleTime = deleteStationCycleTime[stations[processStations[i+1]]?._id] || 0;
                        // This is a little hacky, buuuut in the next itt we will subtract simStep so i added it back here to offset that.
                        stationTimesUntilMove[i + 1] = (topCard.qty * stationCycleTime) + simStep;
                    }

                    cardsToBeMoved.shift(); // Remove card from list of cards to be moved

                    //// Remove card from current station
                    tempStationCards = pStationSimCards[i];
                    tempStationCards.shift();
                    pStationSimCards[i] = tempStationCards;

                    //// Now that card has been moved, calculate time until move for THIS station (based on remaining cards)
                    if (!pStationSimCards[i].length) { stationTimesUntilMove[i] = Infinity; continue }
                    topCard = pStationSimCards[i][0];
                    stationCycleTime = deleteStationCycleTime[stations[processStations[i]]?._id] || 0;
                    stationTimesUntilMove[i] = topCard.qty * stationCycleTime;

                } else {
                    // If card has not been moved, reduce the timeUntilMove by the simulation timestep
                    stationTimesUntilMove[i] -= simStep
                }

                //// Determine next column where card should be moved from (this determines sim step)

                if (stationTimesUntilMove[i] < minTimeUntilMove) {
                    minTimeUntilMove = stationTimesUntilMove[i];
                    nextCardsToBeMoved = [i];
                } else if (stationTimesUntilMove[i] === minTimeUntilMove) {
                    nextCardsToBeMoved.push(i);
                }

            }

            cardsToBeMoved = nextCardsToBeMoved;
            simStep = minTimeUntilMove;

            // console.log(itt, totalSimCards, pStationSimCards.map(stationCards => stationCards.map(card => processCards[card._id].name)), currSimTime, simStep)

        }

        // ================================================== //
        //// Determine if now is during a break of a shift. Adjust the starting offsets accordingly
        // NOTE: leadTimeWorkingSeconds keeps track of the ~active~ seconds for that lot, and is subtracted from till 0 for each loop of a shift
        // NOTE: leadTimeSeconds is the actual seconds of lead time including breaks and weekends. It is added to as workingSeconds is subtracted

        const nowSeconds = moment.duration(moment({}).format("HH:mm:ss")).asSeconds();
        let leadTimeWorkingSecondsOffset, leadTimeSecondsOffset, brStartIdx, isBreak;
        for (let i = 0; i < breaks.length; i++) {
            if (breaks[i].start > nowSeconds) { // Now is in middle of shift, add remaining shift to leadTime and remove from workingTime
                leadTimeWorkingSecondsOffset = -(breaks[i].start - nowSeconds);
                leadTimeSecondsOffset = breaks[i].start - nowSeconds;

                isBreak = false;
                brStartIdx = i;
                break;
            } else if (breaks[i].end > nowSeconds) { // Now is in middle of break, add remaining break to leadTime
                leadTimeWorkingSecondsOffset = 0;
                leadTimeSecondsOffset = breaks[i].end - nowSeconds;

                isBreak = true;
                brStartIdx = (i + 1) % breaks.length;
                break;
            }
        }

        // ================================================== //
        //// Calculate lead time for each card

        const cardsWLeadTime = Object.values(processCards).map((card, index) => {
            const {
                _id,
                count = 0,
                name,
                bins
            } = card;

            if (Object.keys(bins).includes("FINISH")) { return card }

            // Calculate lead time
            // NOTE: leadTimeWorkingSeconds keeps track of the ~active~ seconds for that lot, and is subtracted from till 0 for each loop of a shift
            // NOTE: leadTimeSeconds is the actual seconds of lead time including breaks and weekends. It is added to as workingSeconds is subtracted
            let leadTimeWorkingSeconds = card.leadTime;
            let leadTimeSeconds = isBreak ? leadTimeSecondsOffset : Math.min(leadTimeSecondsOffset, leadTimeWorkingSeconds); // might not even need to go past end of this (current) shift
            leadTimeWorkingSeconds += leadTimeWorkingSecondsOffset;

            let shiftStart, shiftEnd, shiftDuration;
            let brIdx = brStartIdx;
            while (leadTimeWorkingSeconds > 0) {

                // Break time always added
                leadTimeSeconds += breaks[brIdx].end - breaks[brIdx].start;

                // Working time (time in between breaks)
                shiftStart = breaks[brIdx].end % 86400; // Mod 86400 wraps shifts overnight
                brIdx = (brIdx + 1) % breaks.length;
                shiftEnd = breaks[brIdx].start;

                shiftDuration = Math.min(shiftEnd - shiftStart, leadTimeWorkingSeconds);
                leadTimeSeconds += shiftDuration;
                leadTimeWorkingSeconds -= shiftDuration;

            }

            const leadDays = Math.floor(leadTimeSeconds / 86400);
            const leadSeconds = leadTimeSeconds - (leadDays * 86400);
            let leadTime = isNaN(leadTimeSeconds) ? null : moment().add(leadTimeSeconds, 'seconds'); // Lead time relative to now
            // leadTime = leadTime.minute() || leadTime.second() || leadTime.millisecond() ? leadTime.add(1, 'hour').startOf('hour') : leadTime.startOf('hour'); // Round up to hour
            const formattedLeadTime = !!leadTime ? leadTime.format('lll') : null // Format lead time

            return { ...card, leadTime: formattedLeadTime }

        })

        setCards(cardsWLeadTime || {})

    }, [shiftDetails, allCards, deleteStationCycleTime])

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
                    if ((binId === draggingBinId) && (_id === draggingLotId)) return

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

    /*
    * Renders a {StationColumn} for each entry in {cardsSorted}
    *
    * */
    const renderStationColumns = useMemo(() => {
        const renderRecursiveColumns = (node) => {
            let columnContent, recursiveColumnContent;

            columnContent = (
                <>
                    {node.children.map(child => {

                        if (typeof child === 'string') {
                            let childStationId = child;
                            return (
                                <StationsColumn
                                    setSelectedCards={setSelectedCards}
                                    selectedCards={selectedCards}
                                    sortMode={sortMode}
                                    sortDirection={sortDirection}
                                    maxHeight={maxHeight}
                                    id={processId + "+" + childStationId}
                                    station_id={childStationId}
                                    stationName={stations[childStationId].name}
                                    processId={processId}
                                    cards={cardsSorted[childStationId]?.cards || []}
                                    onCardClick={handleCardClick}
                                    autoCycleTime={deleteStationCycleTime[childStationId]}
                                />
                            )
                        } else {
                            recursiveColumnContent = renderRecursiveColumns(child);
                            return (
                                <styled.ColumnGroup>
                                    {recursiveColumnContent}
                                </styled.ColumnGroup>
                            )
                        }
                    })}
                </>
            )

            return columnContent
        }
        return renderRecursiveColumns(currentProcess.graph, 0)

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
