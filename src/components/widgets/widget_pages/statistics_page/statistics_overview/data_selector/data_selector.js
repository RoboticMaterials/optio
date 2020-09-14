import React from 'react'

import * as styled from './data_selector.style'

const DataSelector = (props) => {

    const {
        selector,
        setSelector
    } = props

    return (
        <styled.ButtonGroupContainer>
            <styled.SelectorButton selected={selector=='taktTime'} onClick={() => setSelector('taktTime')} style={{borderRadius: '0 0 0 0.5rem'}}>Takt Time</styled.SelectorButton>
            <styled.SelectorButton selected={selector=='pYield'} onClick={() => setSelector('pYield')}>Percent Yield</styled.SelectorButton>
            <styled.SelectorButton selected={selector=='throughPut'} onClick={() => setSelector('throughPut')} style={{borderRadius: '0 0 0.5rem 0'}}>Throughput</styled.SelectorButton>
        </styled.ButtonGroupContainer>
    )
}

export default DataSelector