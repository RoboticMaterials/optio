import React from 'react';

// Import Styles
import * as styled from './day_selector.style'

const DaySelector = (props) => {

    const {
        date,
        dateIndex,
        loading,
        mapInput,
        mapOutput,
        onChange,
    } = props

    return (
        <styled.RowContainer>
            <styled.DateSelectorIcon
                className='fas fa-chevron-left'
                onClick={() => {
                    const index = dateIndex + 1
                    onChange(mapOutput(index))
                }}
            />
            {loading ?
                <styled.LoadingIcon className="fas fa-circle-notch fa-spin" />
                :
                <styled.DateSelectorTitle>{mapInput(date)}</styled.DateSelectorTitle>

            }

            {/* If the current dateIndex is 0, then have a blank icon that does nothing. Can't go to the future now can we dummy */}
            {dateIndex !== 0 ?
                <styled.DateSelectorIcon
                    className='fas fa-chevron-right'
                    onClick={() => {
                        const index = dateIndex - 1
                        onChange(mapOutput(index))
                    }}
                />
                :
                <styled.DateSelectorIcon />

            }
        </styled.RowContainer>
    )
}

DaySelector.propTypes = {
}

DaySelector.defaultProps = {
    date: '',
    loading: false,
    mapInput: (val) => val,
    mapOutput: (val) => val,
}

export default DaySelector