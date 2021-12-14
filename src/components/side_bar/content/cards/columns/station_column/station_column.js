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

    const [isCollapsed, setCollapsed] = useState(false)


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
            HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0) => (
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
                </styled.StationHeader>
            )}
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
