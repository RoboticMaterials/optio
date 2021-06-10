import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as styled from "./process_work_intructions.style";
import StationWorkInstructions from "../station_work_instructions/station_work_instructions";
import {useSelector} from "react-redux";
import ScrollContainer from "../../../../../../../basic/scroll_container/scroll_container";
import SkuContextStationWorkInstructions from "../station_work_instructions/sku_context_station_work_instructions";

const ProcessWorkInstructions = props => {
    const {
        name,
        stationIds,
        containerStyle,
        workInstructions,
        processId
    } = props

    const stations = useSelector(state => { return state.stationsReducer.stations }) || {}

    const [scrolling, setScrolling] = useState(false)

    const renderStations = () => {
        return stationIds.map(stationId => {

            const station = stations[stationId] || {}
            // console.log('stationId',stationId)
            // console.log('station',station)

            const {
                name
            } = station
            // console.log('station',station)
            return(
                <SkuContextStationWorkInstructions
                    stationId={stationId}
                    key={stationId}
                    processId={processId}
                    workInstructions={workInstructions[stationId]}
                    name={name}
                />
            )
        })
    }

    return (
        <styled.Container
            style={containerStyle}
            scrolling={scrolling}
        >
            <styled.NameContainer scrolling={scrolling}>
                <styled.ProcessName>{name}</styled.ProcessName>
            </styled.NameContainer>

            {/**/}
                <ScrollContainer
                    dividerTransition={'0.25s'}
                    threshold={2}
                    containerStyle={{
                        // padding: '1rem 0'
                        // border: scrolling && '1px solid black'
                    }}
                    axis={'x'}
                    setScrolling={setScrolling}
                >
                    <styled.StationsContainer>
                {renderStations()}
                    </styled.StationsContainer>
                </ScrollContainer>
            {/*</styled.StationsContainer>*/}
        </styled.Container>
    );
};

ProcessWorkInstructions.propTypes = {
    name: PropTypes.string,
    stations: PropTypes.array,
    workInstructions: PropTypes.object
};

ProcessWorkInstructions.defaultProps = {
    name: '',
    stations: [],
    workInstructions: {}
};

export default ProcessWorkInstructions;
