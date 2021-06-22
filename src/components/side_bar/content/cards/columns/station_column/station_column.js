import React, { useState, useEffect } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import Switch from 'react-ios-switch';

import { useTheme } from "styled-components";
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
    const theme = useTheme()

    const [isCollapsed, setCollapsed] = useState(false)
    const [setTime, setSetTime] = useState(!!stations[station_id]?.cycle_time ? stations[station_id]?.cycle_time : '00:00:00')
    const [enable, setEnable] = useState(false)

    const handleConvertMoment = (time) => {
        const splitVal = time.split(':')
        return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1], 'second': splitVal[2] })
    }

    const handleSaveCycleTime = (time) => {
        let station = deepCopy(stations[station_id])
        station.cycle_time = time
        dispatchPutStation(station)
    }

    const handleEnableManualCycleTime = () => {
        let station = deepCopy(stations[station_id])
        station.manual_cycle_time = !station?.manual_cycle_time
        dispatchPutStation(station)
    }

    const renderCycleTime = () => {
        return (
            <>
                <styled.divider />
                <styled.HeaderSection style={{ marginTop: '.5rem' }}>
                    <styled.HeaderSectionTitle>
                        Cycle Time
                    </styled.HeaderSectionTitle>
                    <styled.RowContainer>
                        <styled.QuantityText style={{ marginRight: '.25rem', display: 'flex', alignItems: 'center' }}>Auto</styled.QuantityText>
                        <Switch
                            onColor={theme.schema.lots.solid}
                            style={{transform: 'scale(0.8)'}}
                            checked={!!stations[station_id]?.manual_cycle_time}
                            onChange={() => {
                                handleEnableManualCycleTime()
                            }}
                        />
                        <styled.QuantityText style={{ marginLeft: '.25rem', display: 'flex', alignItems: 'center' }}>Manual</styled.QuantityText>
                    </styled.RowContainer>


                </styled.HeaderSection>

                <styled.HeaderSection style={{ opacity: !stations[station_id]?.manual_cycle_time && '50%' }}>
                    <styled.HeaderSectionTitle style={{ fontSize: '1rem' }}>
                        Manual Cycle Time (HH:MM:SS)
                    </styled.HeaderSectionTitle>

                    <TimePicker
                        showHours={true}
                        showMinutes={true}
                        // format={'HH:mm:ss'}
                        defaultValue={handleConvertMoment(setTime)}
                        // value={setTime}
                        onChange={(val) => {
                            setSetTime(val.format('HH:mm:ss'))
                            handleSaveCycleTime(val.format('HH:mm:ss'))
                        }}
                        style={{ width: '5rem' }}
                        allowEmpty={false}
                        disabled={!stations[station_id]?.manual_cycle_time}
                    />
                    {/* <Button
                        label={'Save'}
                        secondary
                        onClick={() => {
                            handleSaveCycleTime()
                        }}
                        schema={'lots'}
                        disabled={!stations[station_id]?.manual_cycle_time}
                    /> */}

                </styled.HeaderSection>
                <styled.divider />

            </>
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
                            {renderCycleTime()}
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
