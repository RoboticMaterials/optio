import React, { useMemo, useEffect, useState } from 'react';

const HeatSpot = (props) => {

    const {
        station,
        wipRatio,
        d3Scale
    } = props;

    const color = () => {
        if (wipRatio < 1.5) {
            return 'url(#goodGrad)';
        } else if (wipRatio < 3) {
            return 'url(#okayGrad)';
        } else {
            return 'url(#badGrad)'
        }
    }

    const spotSize = 30*Math.min(Math.max(1, wipRatio), 4)*d3Scale;
    if (isNaN(spotSize)) {return null}
    

    return (
        
        <g>
            <circle cx={station.x} cy={station.y} r={spotSize} fill={color()} />
        </g>
    )
}

export default HeatSpot;