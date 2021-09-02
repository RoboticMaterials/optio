import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment';

// functions external
import { useDispatch, useSelector } from "react-redux";

/// utils
import { getProcessStationsSorted } from '../../../methods/utils/processes_utils';
import { getCardsInBin, getLotTotalQuantity } from '../../../methods/utils/lot_utils';
import HeatSpot from './heatspot/heatspot';


const HeatMap = (props) => {

    const {
        map_id,
        d3Scale
    } = props;

    const [stationWIPRatios, setStationWIPRatios] = useState({})

    const cards = useSelector(state => state.cardsReducer.cards)
	const routes = useSelector(state => state.tasksReducer.tasks)

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)

    let stations = useSelector(state => state.stationsReducer.stations)
    stations = Object.values(stations).filter(station => (station.map_id === map_id))

	let processes = useSelector(state => state.processesReducer.processes)
    processes = Object.values(processes).filter((currProcess) => currProcess.map_id === map_id)

    useEffect(() => {

        let WIPBuildupRatios = {};    // The WIP ratios of each station on the map (stationWIP / meanProcessWIP) (refer to meanProcessWIP (~line 45))
        processes.forEach(process => {
            const processStations = getProcessStationsSorted(process, routes);

            let totalProcessWIP = 0;    // Tracks total WIP in the process
            let stationWIP = {}         // Tracks WIP at each station in the process (by id)
            let i, pStationId, stationCards, stationWIPAccumulator;
            for (i=0; i<processStations.length; i++) { // Loop through each station in process to get mean WIP of the process
                pStationId = processStations[i];
                stationCards = getCardsInBin(cards, pStationId, process._id);

                stationWIPAccumulator = 0;
                stationCards.forEach((currLot) => {
                    stationWIPAccumulator += currLot.count;
                })
                stationWIP[pStationId] = stationWIPAccumulator; // NOTE: Dont update in the object until end (better performance)
                totalProcessWIP += stationWIPAccumulator;
            }

            const meanProcessWIP = totalProcessWIP / processStations.length;    // The mean WIP at each station in this prcess

            // Loop through stations again to find WIP Ratio (stationWIP / meanProcessWIP)
            let WIPRatio;
            for (i=0; i<processStations.length; i++) {
                pStationId = processStations[i];
                WIPRatio = stationWIP[pStationId] / meanProcessWIP;

                if (pStationId in WIPBuildupRatios) {
                    WIPBuildupRatios[pStationId] = Math.max(WIPRatio, WIPBuildupRatios[pStationId]) // Only care about the max of all the WIP ratios at the station
                } else if (WIPRatio > 0) {
                    WIPBuildupRatios[pStationId] = WIPRatio;
                }

            }
        });

        setStationWIPRatios(WIPBuildupRatios);
    }, [cards])

    const spotStartOpacity = 0.7;
    const spotEndOpacity = 0;

    // console.log('render', stationWIPRatios)
    
    return (
        <g>
            <defs>
                <radialGradient id="goodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="20%" style={{stopColor: '#00ffcf', stopOpacity: spotStartOpacity}} />
                    <stop offset="100%" style={{stopColor: '#00ff97', stopOpacity: spotEndOpacity}} />
                </radialGradient>
                <radialGradient id="okayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="20%" style={{stopColor: '#ff9300', stopOpacity: spotStartOpacity}} />
                    <stop offset="100%" style={{stopColor: '#ffc200', stopOpacity: spotEndOpacity}} />
                </radialGradient>
                <radialGradient id="badGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="20%" style={{stopColor: '#ff0e00', stopOpacity: spotStartOpacity}} />
                    <stop offset="100%" style={{stopColor: '#ff6800', stopOpacity: spotEndOpacity}} />
                </radialGradient>
            </defs>
            {!editingStation && !editingPosition &&
                stations.map(station => 
                    station._id in stationWIPRatios && 
                        <HeatSpot 
                            key={station._id+'-heatspot'}
                            station={station} 
                            wipRatio={stationWIPRatios[station._id]} 
                            d3Scale={d3Scale}
                        />
                )
            }
        </g>
    );
}

export default HeatMap;