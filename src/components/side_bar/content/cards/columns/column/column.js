import React, { useEffect, useRef, useState } from "react";
import moment from 'moment';

// actions
import { putCard } from "../../../../../../redux/actions/card_actions";
import {
    setDroppingLotId,
    setLotHovering,
    setDraggingLotId
} from "../../../../../../redux/actions/card_page_actions";

// components external
import { Draggable, Container } from 'react-smooth-dnd';

// components internal
import Lot from "../../lot/lot";

// functions external
import { useDispatch, useSelector } from "react-redux";

// styles
import * as styled from "./column.style";

/// utils
import { sortBy } from "../../../../../../methods/utils/card_utils";
import { immutableDelete, immutableReplace, isArray, isNonEmptyArray } from "../../../../../../methods/utils/array_utils";
import { getCustomFields } from "../../../../../../methods/utils/lot_utils";
import { getProcessStationsSorted } from '../../../../../../methods/utils/processes_utils'

import LotContainer from "../../lot/lot_container";

const Column = ((props) => {

    const {
        stationId,
        stationName = "Unnamed",
        onCardClick,
        selectedCards,
        processId,
        HeaderContent,
        isCollapsed,
        maxWidth,
        maxHeight,
        sortMode,
        sortDirection,
        setSelectedCards
    } = props

    // redux state
    const objects = useSelector(state => { return state.objectsReducer.objects })
    const reduxCards = useSelector(state => { return state.cardsReducer.processCards[processId] }) || {}
    const hoveringLotId = useSelector(state => { return state.cardPageReducer.hoveringLotId }) || null
    const draggingLotId = useSelector(state => { return state.cardPageReducer.draggingLotId }) || null

    const allCards = useSelector(state => state.cardsReducer.cards)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)
    const processes = useSelector(state => state.processesReducer.processes)
    const { shiftDetails } = useSelector(state => state.settingsReducer.settings)

    // console.log(shiftDetails)

    // actions
    const dispatch = useDispatch()
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchSetDroppingLotId = async (lotId, binId) => await dispatch(setDroppingLotId(lotId, binId))
    const dispatchSetLotHovering = async (lotId) => await dispatch(setLotHovering(lotId))
    const dispatchSetDraggingLotId = async (lotId) => await dispatch(setDraggingLotId(lotId))

    // component state
    const [dragEnter, setDragEnter] = useState(false)
    const [lotQuantitySummation, setLotQuantitySummation] = useState(0)
    const [numberOfLots, setNumberOfLots] = useState(0)
    const [cards, setCards] = useState([])

    // const [breaks, setBreaks] = useState([])
    // const [bottlneckCycleTime, setBottleneckCycleTime] = useState(0);
    // const [precedingQuantity, setPrecedingQuantity] = useState(0);

    let cumulativeLotQuantity = 0

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

    function addWeekdays(date, days) {
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

    useEffect(() => {
        // === Calculate preceding lead time based on cards in later stations

        // Get stations in this process (reversed list because cards further in process are processed first)
        const processStations = getProcessStationsSorted(processes[processId], routes).reverse()

        if (stationId === 'FINISH') {	// No lead time once in finished bin
            return;
        }

        // Convert the shiftDetails object to an array of [startShift, shiftDuration] pairs for a single day
        const breaks = convertShiftDetails(shiftDetails)

        // ================================================== //
        //// Get total quanity of all SKUs in subsequent stations and get bottleneck (max) cycle time for subsequent stations

        var i
        let bottleneckCycleTime = 0;
        let precedingQty = 0;
        for (i = 0; i < processStations.length; i++) {
            let pStationId = processStations[i]
            let stationCycleTime = stations[pStationId].cycle_time;

            // Once we get to this current station break. No need to deal with earlier stations in the process
            if (pStationId === stationId) {
                bottleneckCycleTime = Math.max(bottleneckCycleTime, moment.duration(stationCycleTime).asSeconds());
                break;
            }

            // Get all cards in this station's bin
            let stationCards = getCardsInBin(allCards, pStationId, processId)

            // Get the total quantity of parts in this process, after this station
            stationCards.forEach((currLot) => {
                precedingQty += currLot.bins[pStationId].count
            })

            bottleneckCycleTime = Math.max(bottleneckCycleTime, moment.duration(stationCycleTime).asSeconds());

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


        let columnCount = 0;
        const cardsWLeadTime = props.cards.map((card, index) => {
            const {
                _id,
                count = 0,
                name
            } = card;

            // Calculate lead time
            // NOTE: leadTimeWorkingSeconds keeps track of the ~active~ seconds for that lot, and is subtracted from till 0 for each loop of a shift
            // NOTE: leadTimeSeconds is the actual seconds of lead time including breaks and weekends. It is added to as workingSeconds is subtracted
            let leadTimeWorkingSeconds = (precedingQty + (columnCount + count)) * bottleneckCycleTime;
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
            const formattedLeadTime = leadTime.format('lll') // Format lead time

            columnCount += count;

            return { leadTime: formattedLeadTime, ...card }

        })

        setCards(cardsWLeadTime);

    }, [shiftDetails, props.cards])

    useEffect(() => {
        let tempLotQuantitySummation = 0
        let tempNumberOfLots = 0
        cards.forEach((currLot) => {
            const {
                count = 0
            } = currLot || {}

            tempNumberOfLots = parseInt(tempNumberOfLots) + 1
            tempLotQuantitySummation = parseInt(tempLotQuantitySummation) + parseInt(count)
        })

        setNumberOfLots(tempNumberOfLots)
        setLotQuantitySummation(tempLotQuantitySummation)
    }, [cards])

    const [isSelectedCardsNotEmpty, setIsSelectedCardsNotEmpty] = useState(false)

    useEffect(() => {
        setIsSelectedCardsNotEmpty(isNonEmptyArray(selectedCards))
    }, [selectedCards])

    useEffect(() => {
        if (sortMode) {
            let tempCards = [...props.cards] // *** MAKE MODIFIABLE COPY OF CARDS TO ALLOW SORTING ***
            sortBy(tempCards, sortMode, sortDirection)
            setCards(tempCards)
        }
        else {
            setCards(props.cards)
        }
    }, [props.cards, sortMode, sortDirection])


    const shouldAcceptDrop = (sourceContainerOptions, payload) => {
        const {
            binId,
            cardId,
            processId: oldProcessId,
            ...remainingPayload
        } = payload

        if (oldProcessId !== processId) return false
        // if(binId === stationId) return false
        return true
    }

    const onMouseEnter = (event, lotId) => {
        dispatchSetLotHovering(lotId)
    }

    const onMouseLeave = (event) => {
        dispatchSetLotHovering(null)
    }

    const getSelectedIndex = (lotId, binId) => {
        return selectedCards.findIndex((currLot) => {
            const {
                cardId: currLotId,
                binId: currBinId
            } = currLot

            return (lotId === currLotId) && (binId === currBinId)
        })
    }

    const getIsSelected = (lotId, binId) => {
        const existingIndex = getSelectedIndex(lotId, binId)
        return (existingIndex !== -1)
    }

    const getLastSelectedIndex = () => {
        let addedIndex = -1
        for (var i = selectedCards.length - 1; i >= 0; i--) {
            const currLot = selectedCards[i]
            const {
                binId: currBinId
            } = currLot || {}

            if ((currBinId === stationId) && (i > addedIndex)) {
                addedIndex = i
            }
        }

        return addedIndex
    }

    const getLastSelected = () => {
        const lastSelectedIndex = getLastSelectedIndex()
        return selectedCards[lastSelectedIndex]
    }

    const getIsLastSelected = (lotId) => {
        const lastSelected = getLastSelected() || {}
        const {
            cardId: currLotId,
        } = lastSelected

        return lotId === currLotId
    }

    const getBetweenSelected = (lotId) => {
        const lastSelected = getLastSelected() || {}
        const {
            cardId: lastSelectedLotId,
        } = lastSelected

        const selectedIndex = cards.findIndex((currLot) => {
            const {
                cardId: currLotId,
                binId: currBinId
            } = currLot

            return (lastSelectedLotId === currLotId) && (stationId === currBinId)
        })

        const existingIndex = cards.findIndex((currLot) => {
            const {
                cardId: currLotId,
                binId: currBinId
            } = currLot

            return (lotId === currLotId) && (stationId === currBinId)
        })

        if (selectedIndex === -1) {
            return [cards[existingIndex]]
        }
        else if (selectedIndex < existingIndex) {
            return cards.slice(selectedIndex, existingIndex + 1)
        }
        else {
            return cards.slice(existingIndex, selectedIndex + 1).reverse()
        }
    }

    const handleDrop = async (dropResult) => {
        const { removedIndex, addedIndex, payload, element } = dropResult || {}

        if (payload === null) { //  No new button, only reorder
            return
        } else {
            if (addedIndex !== null) {
                const {
                    binId,
                    cardId,
                    count,
                    ...remainingPayload
                } = payload

                await dispatchSetDroppingLotId(cardId, binId)

                if (!(binId === stationId)) {
                    const droppedCard = reduxCards[cardId] ? reduxCards[cardId] : {}

                    const oldBins = droppedCard.bins ? droppedCard.bins : {}
                    const {
                        [binId]: movedBin,
                        ...remainingOldBins
                    } = oldBins || {}

                    if (movedBin) {
                        // already contains items in bin
                        if (oldBins[stationId] && movedBin) {

                            // handle updating lot
                            {
                                const oldCount = parseInt(oldBins[stationId]?.count || 0)
                                const movedCount = parseInt(movedBin?.count || 0)

                                await dispatchPutCard({
                                    ...remainingPayload,
                                    bins: {
                                        ...remainingOldBins,
                                        [stationId]: {
                                            ...oldBins[stationId],
                                            count: oldCount + movedCount
                                        }
                                    }
                                }, cardId)
                            }

                            // handle updating selectedLots
                            {
                                // current action is to remove lot from selectedLots if it is merged
                                const existingIndex = getSelectedIndex(cardId, binId)
                                if (existingIndex !== -1) {
                                    setSelectedCards(immutableDelete(selectedCards, existingIndex))
                                }
                            }

                        }

                        // no items in bin
                        else {
                            // update lot
                            {
                                const a = await dispatchPutCard({
                                    ...remainingPayload,
                                    bins: {
                                        ...remainingOldBins,
                                        [stationId]: {
                                            ...movedBin,
                                        }
                                    }
                                }, cardId)
                            }

                            // update selectedLots
                            {
                                // current action is to remove lot from selectedLots if it is merged
                                const existingIndex = getSelectedIndex(cardId, binId)
                                if (existingIndex !== -1) {
                                    setSelectedCards(immutableReplace(selectedCards, {
                                        ...selectedCards[existingIndex],
                                        binId: stationId
                                    }, existingIndex))
                                }
                            }

                        }
                    }
                }

                await dispatchSetDroppingLotId(null, null)
            }
        }
    }

    const renderCards = () => {
        return (
            <styled.BodyContainer
                dragEnter={dragEnter}
            >
                <Container
                    onDrop={async (DropResult) => {
                        await handleDrop(DropResult)
                        setDragEnter(false)
                    }}
                    shouldAcceptDrop={shouldAcceptDrop}
                    getGhostParent={() => document.body}
                    onDragStart={(dragStartParams, b, c) => {
                        const {
                            isSource,
                            payload,
                            willAcceptDrop
                        } = dragStartParams

                        if (isSource) {
                            const {
                                binId,
                                cardId
                            } = payload

                            dispatchSetDraggingLotId(cardId)
                        }
                    }}
                    onDragEnd={(dragEndParams) => {
                        const {
                            isSource,
                        } = dragEndParams

                        if (isSource) {
                            dispatchSetDraggingLotId(null)
                        }
                    }}
                    onDragEnter={() => {
                        setDragEnter(true)
                    }}
                    onDragLeave={() => {
                        setDragEnter(false)
                    }}
                    onDropReady={(dropResult) => { }}
                    groupName="process-cards"
                    getChildPayload={index =>
                        cards[index]
                    }
                    style={{ overflow: "auto", height: "100%", padding: "1rem 1rem 2rem 1rem" }}
                >
                    {cards.map((card, index) => {
                        const {
                            id,
                            count = 0,
                            leadTime,
                            name,
                            objectId,
                            cardId,
                            flags,
                            lotNumber,
                            processName,
                            lotTemplateId,
                            ...rest
                        } = card

                        // console.log(lotNumber, leadTime)

                        // const templateValues = getCustomFields(lotTemplateId, card)

                        // const lotName = lots[lot_id] ? lots[lot_id].name : null
                        // const objectName = objects[object_id] ? objects[object_id].name : null

                        const isSelected = getIsSelected(cardId, stationId)
                        const isDragging = draggingLotId === cardId
                        const isHovering = hoveringLotId === cardId

                        const isLastSelected = getIsLastSelected(cardId)

                        // const isSelected = (draggingLotId !== null) ? () : ()
                        const selectable = (hoveringLotId !== null) || (draggingLotId !== null) || isSelectedCardsNotEmpty

                        return (
                            <Draggable
                                key={cardId}
                                onMouseEnter={(event) => onMouseEnter(event, cardId)}
                                onMouseLeave={onMouseLeave}
                                style={{
                                }}
                            >
                                <div
                                    style={{
                                    }}
                                >
                                    <LotContainer
                                        glow={isLastSelected}
                                        isFocused={isDragging || isHovering}
                                        enableFlagSelector={true}
                                        selectable={selectable}
                                        isSelected={isSelected}
                                        key={cardId}
                                        // processName={processName}
                                        totalQuantity={totalQuantity}
                                        lotNumber={lotNumber}
                                        name={name}
                                        count={count}
                                        leadTime={leadTime}
                                        id={cardId}
                                        flags={flags || []}
                                        index={index}
                                        lotId={cardId}
                                        binId={stationId}
                                        onClick={(e) => {
                                            const payload = getBetweenSelected(cardId)
                                            onCardClick(
                                                e,
                                                {
                                                    lotId: cardId,
                                                    processId: processId,
                                                    binId: stationId
                                                },
                                                payload
                                            )
                                        }}
                                        containerStyle={{
                                            marginBottom: "0.5rem",
                                        }}
                                    />
                                </div>
                            </Draggable>
                        )
                    })}

                </Container>
            </styled.BodyContainer>

        )
    }

    if (isCollapsed) {
        return (
            <styled.StationContainer
                maxHeight={maxHeight}
                isCollapsed={isCollapsed}
                maxWidth={maxWidth}
            >
                {HeaderContent(numberOfLots, lotQuantitySummation)}

                <styled.BodyContainer style={{
                    padding: "1rem 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                }}>
                    <styled.RotationWrapperOuter>
                        <styled.RotationWrapperInner>
                            <styled.RotatedRouteName>{stationName}</styled.RotatedRouteName>
                        </styled.RotationWrapperInner>
                    </styled.RotationWrapperOuter>
                </styled.BodyContainer>
            </styled.StationContainer>
        )
    }

    else {
        return (
            <styled.StationContainer
                isCollapsed={isCollapsed}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
            >
                {HeaderContent(numberOfLots, lotQuantitySummation)}

                {renderCards()}
            </styled.StationContainer>
        )
    }

})

export default Column