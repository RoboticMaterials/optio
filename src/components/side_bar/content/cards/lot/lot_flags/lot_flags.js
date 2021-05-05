import React, { useState, useEffect } from 'react'

// Import Styles
import * as styled from './lot_flags.style'

// constants
import { FLAG_OPTIONS } from "../../../../../../constants/lot_contants"

const LotFlags = (props) => {

    const {
        currentLot,
        containerStyle,
    } = props

    const flags = currentLot?.flags

    if(!flags){
        return
    }

    return (
        <styled.FlagsContainer
            style={{
                padding: 0,
                margin: '0.5rem 0',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: 'fit-content',
                justifyContent: 'flex-start',
                ...containerStyle
            }}
        >
            {flags.length > 0 ?
                <>
                    {flags.map((currFlagId) => {
                        const flagOption = FLAG_OPTIONS[currFlagId]
                        const {
                            color: currColor
                        } = flagOption

                        return (
                            <styled.FlagButton
                                key={currFlagId}
                                type={"button"}
                                selected={true}
                                color={currColor}
                                className="fas fa-square"
                                style={{
                                    margin: "0 .55rem",
                                    padding: 0,
                                    fontSize: "1rem",
                                    transform: 'scaleX(2)'
                                }}
                            />
                        )
                    })

                    }

                </>
                :
                <styled.FlagButton
                    type={"button"}
                    selected={true}
                    color={'rgba(0, 0, 0, 0.3)'}
                    className="fas fa-square"
                    style={{
                        margin: "0 .55rem",
                        padding: 0,
                        fontSize: "1rem",
                        transform: 'scaleX(2)'
                    }}
                />
            }
        </styled.FlagsContainer>
    )
}

export default LotFlags