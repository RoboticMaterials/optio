import React, { useState, useEffect } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';

import * as styled from "./station_column.style";

// Import Components
import TimePicker from "rc-time-picker";
import Button from '../../../../../basic/button/button'
import Column from "../column/column"

// Import Actions
import { putStation } from '../../../../../../redux/actions/stations_actions'

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'

const StationsColumn = ((props) => {
    const {
        station_id,
        stationName = "Unnamed",
        onCardClick,
        cards = [],
        processId,
        maxHeight,
        sortMode,
        sortDirection,
        selectedCards,
        setSelectedCards
    } = props

    const dispatch = useDispatch()
    const dispatchPutStation = async (station) => await dispatch(putStation(station))

    const stations = useSelector(state => state.stationsReducer.stations)

    const [isCollapsed, setCollapsed] = useState(false)
    const [setTime, setSetTime] = useState(!!stations[station_id]?.cycle_time ? stations[station_id]?.cycle_time : '00:00:00')

    const handleConvertMoment = (time) => {
        const splitVal = time.split(':')
        return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1], 'second': splitVal[2] })
    }

    const handleSaveCycleTime = () => {
        let station = deepCopy(stations[station_id])
        station.cycle_time = setTime
        dispatchPutStation(station)
    }

    const renderCycleTime = () => {
        return (
            <styled.HeaderSection>
                <styled.HeaderSectionTitle>
                    Cycle Time
                </styled.HeaderSectionTitle>
                <TimePicker
                    showHours={true}
                    showMinutes={true}
                    // format={'HH:mm:ss'}
                    defaultValue={handleConvertMoment(setTime)}
                    // value={setTime}
                    onChange={(val) => {
                        setSetTime(val.format('HH:mm:ss'))
                    }}
                    style={{ width: '8rem' }}
                    allowEmpty={false}
                />
                <Button
                    label={'Save'}
                    secondary
                    onClick={() => {
                        handleSaveCycleTime()
                    }}
                    schema={'lots'}
                />

            </styled.HeaderSection>
        )
    }

    return (
        <Column
            setSelectedCards={setSelectedCards}
            selectedCards={selectedCards}
            sortDirection={sortDirection}
            maxWidth={"25rem"}
            sortMode={sortMode}
            maxHeight={maxHeight}
            HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0) => {
                if (isCollapsed) {
                    return (
                        <styled.StationHeader>
                            <i className="fa fa-chevron-right" aria-hidden="true"
                                onClick={() => setCollapsed(false)}
                                style={{ cursor: 'pointer' }}
                            />
                        </styled.StationHeader>
                    )
                }
                else {
                    return (
                        <styled.StationHeader>
                            <styled.HeaderRow
                                style={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <i className="fa fa-chevron-down" aria-hidden="true"
                                    onClick={() => setCollapsed(true)}
                                    style={{ marginRight: "1rem", cursor: "pointer" }}
                                />

                                <styled.LabelContainer>
                                    <styled.StationTitle>{stationName}</styled.StationTitle>
                                </styled.LabelContainer>

                                <i className="fas fa-ellipsis-h" style={{ opacity: 0 }}></i>

                            </styled.HeaderRow>

                            <styled.HeaderRow>
                                <div>
                                    <styled.QuantityText>Lots: </styled.QuantityText>
                                    <styled.QuantityText>{numberOfLots}</styled.QuantityText>
                                </div>

                                <div>
                                    <styled.QuantityText>Total Quantity: </styled.QuantityText>
                                    <styled.QuantityText>{lotQuantitySummation}</styled.QuantityText>
                                </div>

                            </styled.HeaderRow>
                            {/* {renderCycleTime()} */}
                        </styled.StationHeader>
                    )
                }
            }}
            station_id={station_id}
            stationName={stationName}
            onCardClick={onCardClick}
            cards={cards}
            processId={processId}
            isCollapsed={isCollapsed}
        />
    )
})

export default StationsColumn
