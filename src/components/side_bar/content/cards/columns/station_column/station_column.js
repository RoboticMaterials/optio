import React, { useState, useMemo } from "react";
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
import { convertSecondsToHHMMSS, convertHHMMSSStringToSeconds } from '../../../../../../methods/utils/time_utils'

const StationsColumn = ((props) => {
    const {
        id,
        station_id,
        stationName = "Unnamed",
        onCardClick,
        cards = [],
        processId,
        maxHeight,
        sortMode,
        sortDirection,
        selectedCards,
        setSelectedCards,
        autoCycleTime,
        containerStyle
    } = props

    const dispatch = useDispatch()
    const dispatchPutStation = async (station) => await dispatch(putStation(station))

    const stations = useSelector(state => state.stationsReducer.stations)
    const theme = useTheme()

    const [isCollapsed, setCollapsed] = useState(false)

    const cycleTimeDisplayTime = useMemo(() => {

        let time = '00:00:00'

        // If there is a manual time and its enable then use that time
        if (stations[station_id].cycle_time_mode === 'auto' && !!stations[station_id]?.cycle_time) {
            time = convertSecondsToHHMMSS(stations[station_id].cycle_time);
        } else if (stations[station_id].cycle_time_mode === 'manual' && !!stations[station_id]?.manual_cycle_time) {
            time = convertSecondsToHHMMSS(stations[station_id]?.manual_cycle_time);
        }

        // Split the time up
        const splitVal = time.split(':')

        // Set it to a moment for the time picker
        return moment().set({ 'hour': splitVal[0], 'minute': splitVal[1], 'second': splitVal[2] })
    }, [stations[station_id]])


    const handleSaveCycleTime = (time) => {
        let station = deepCopy(stations[station_id])
        station.manual_cycle_time = convertHHMMSSStringToSeconds(time)
        dispatchPutStation(station)
    }

    const handleToggleManualCycleTime = (isManual) => {
        let station = deepCopy(stations[station_id])
        station.cycle_time_mode = isManual ? 'manual' : 'auto'
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
                            style={{ transform: 'scale(0.8)' }}
                            checked={stations[station_id]?.cycle_time_mode === 'manual'}
                            onChange={switched => {
                                handleToggleManualCycleTime(switched)
                            }}
                        />
                        <styled.QuantityText style={{ marginLeft: '.25rem', display: 'flex', alignItems: 'center' }}>Manual</styled.QuantityText>
                    </styled.RowContainer>


                </styled.HeaderSection>

                <styled.HeaderSection style={{ opacity: stations[station_id]?.cycle_time_mode === 'auto' && '70%', pointerEvents: stations[station_id]?.cycle_time_mode === 'auto' ? 'none' : 'auto', borderRadius: '0 3px 3px 0'}}>
                    <styled.HeaderSectionTitle style={{ fontSize: '1rem' }}>
                        (HH:MM:SS)
                    </styled.HeaderSectionTitle>

                    <TimePicker
                        showHours={true}
                        showMinutes={true}
                        value={cycleTimeDisplayTime}
                        onChange={(val) => {
                            handleSaveCycleTime(val.format('HH:mm:ss'))
                        }}
                        style={{width: '5.5rem'}}
                        allowEmpty={false}
                        // disabled={stations[station_id]?.cycle_time_mode === 'auto'}
                    />


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
            id={id}
            containerStyle={containerStyle}
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
                                    marginBottom: "1rem",
                                    justifyContent: 'center'
                                }}
                            >
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
