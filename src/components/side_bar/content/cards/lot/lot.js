import React, {useContext, useEffect, useState} from "react"

// actions
import {putCard, putCardAttributes} from "../../../../../redux/actions/card_actions"

// functions external
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {ThemeContext} from "styled-components";

// components external
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

// constants
import {FIELD_DATA_TYPES, FLAG_OPTIONS} from "../../../../../constants/lot_contants"

// utils
import {immutableDelete, immutableReplace, isArray} from "../../../../../methods/utils/array_utils"
import {formatLotNumber} from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "./lot.style"
import LotDateRangeRow from "./lot_date_range_row/lot_date_range_row";
import LotSimpleRow from "./lot_simple_row/lot_simple_row";
import LotDateRow from "./lot_date_row/lot_date_row";

const Lot = (props) => {
    const {
        name,
        glow,
        isFocused,
        highlight,
        stationName,
        totalQuantity,
        lotNumber,
        templateValues,
        id,
        enableFlagSelector,
        onClick,
        count,
        start_date,
        end_date,
        containerStyle,
        selectable,
        isSelected,
        flags,
        processName
    } = props

    const themeContext = useContext(ThemeContext)

    // actions
    const dispatch = useDispatch()
    const dispatchPutCardAttributes = async (card, ID) => await dispatch(putCardAttributes(card, ID))

    // component state
    const [formattedLotNumber, setFormattedLotNumber] = useState(formatLotNumber(lotNumber))

    useEffect(() => {
        setFormattedLotNumber(formatLotNumber(lotNumber))
    }, [lotNumber])

    const renderTemplateValues = () => {
        return templateValues
            .filter((currItem) => {
                const {
                    dataType,
                } = currItem

                return Object.values(FIELD_DATA_TYPES).includes(dataType)
            })
            .map((currItem, currIndex, arr) => {
            const {
                dataType,
                fieldName,
                value
            } = currItem

            const isLast = currIndex === arr.length - 1


            switch(dataType) {
                case FIELD_DATA_TYPES.STRING: {
                    return(
                    <LotSimpleRow
                        label={fieldName}
                        value={value}
                        isLast={isLast}
                    />
                    )
                }
                case FIELD_DATA_TYPES.EMAIL: {
                    return(
                        <LotSimpleRow
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                        />
                    )
                }
                case FIELD_DATA_TYPES.DATE: {
                    return(
                        <LotDateRow
                            label={fieldName}
                            isLast={isLast}
                            date={value}
                        />

                    )
                }
                case FIELD_DATA_TYPES.DATE_RANGE: {
                    return(
                        <LotDateRangeRow
                            label={fieldName}
                            isLast={isLast}
                            dateRange={value}
                        />
                    )
                }
                case FIELD_DATA_TYPES.URL: {
                    return(
                        <LotSimpleRow
                            label={fieldName}
                            value={value}
                            isLast={isLast}
                        />
                    )
                }
                case FIELD_DATA_TYPES.INTEGER: {
                    return(
                        <LotSimpleRow
                            label={fieldName}
                            isLast={isLast}
                            value={value}
                        />
                    )
                }
            }
        })
    }

    const renderFlags = () => {
        return(
            <styled.FlagsContainer
                style={{
                    margin: 0,
                    padding: 0
                }}
            >
                {flags.length > 0 ?
                    <>
                        {flags.map((currFlagId) => {
                            const flagOption = FLAG_OPTIONS[currFlagId]
                            const {
                                color: currColor
                            } = flagOption

                            return(
                                <styled.FlagButton
                                    key={currFlagId}
                                    type={"button"}
                                    selected={true}
                                    color={currColor}
                                    className="fas fa-flag"
                                    style={{
                                        margin: "0 .25rem",
                                        padding: 0,
                                        fontSize: "1rem"
                                    }}
                                />
                            )
                        })

                        }

                    </>
                    :
                    <styled.FlagButton
                        type={"button"}
                        color={"rgb(25,25,25,0.5)"}
                        selected={true}
                        className="fas fa-flag"
                    />
                }
            </styled.FlagsContainer>
        )
    }

    return(
        <styled.Container
            glow={glow}
            isFocused={isFocused}
            highlight={highlight}
            selectable={selectable}
            isSelected={isSelected}
            onClick={onClick}
            containerStyle={containerStyle}
        >

            <styled.HeaderBar>
                <styled.NameContainer>
                    <styled.CardName>{name ? name : formattedLotNumber}</styled.CardName>

                    {name &&
                    <styled.LotNumber>{formattedLotNumber}</styled.LotNumber>
                    }
                </styled.NameContainer>

                {enableFlagSelector ?
                    <Popup
                        contentStyle={{
                            background: themeContext.bg.octonary,
                            width: "fit-content"
                        }}
                        arrowStyle={{
                            color: themeContext.bg.octonary,
                        }}

                        trigger={open => (
                            renderFlags()
                        )}
                        position="right center"
                        closeOnDocumentClick
                    >
                        <styled.FlagsContainer>
                            {Object.values(FLAG_OPTIONS).map((currOption, currIndex) => {

                                const {
                                    color: currColor,
                                    id: currColorId
                                } = currOption

                                const isSelected = flags.includes(currColorId)
                                const selectedIndex = flags.indexOf(currColorId)

                                return(
                                    <styled.FlagButton
                                        color={currColor}
                                        selected={isSelected}
                                        className="fas fa-flag"
                                        key={currIndex}
                                        type={"button"}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            if((isArray(flags) && !isSelected)) {
                                                dispatchPutCardAttributes({
                                                    flags: [...flags, currColorId]
                                                }, id)
                                            }
                                            else {
                                                dispatchPutCardAttributes({
                                                    flags: immutableDelete(flags, selectedIndex)
                                                }, id)
                                            }
                                        }}
                                    />
                                )
                            })}
                        </styled.FlagsContainer>
                    </Popup>
                    :
                    renderFlags()
                }



            </styled.HeaderBar>
            <styled.ContentContainer>

                    {processName &&
                        <LotSimpleRow
                            label={"Process"}
                            value={processName}
                        />
                    }

                {stationName &&
                <LotSimpleRow
                    label={"Bin"}
                    value={stationName}
                />
                }

                <LotSimpleRow
                    label={"Quantity"}
                    value={`${count}/${totalQuantity}`}
                />

                {renderTemplateValues()}
            </styled.ContentContainer>

        </styled.Container>
    )
}

// Specifies propTypes
Lot.propTypes = {
    isSelected: PropTypes.bool,
    selectable: PropTypes.bool,
    isFocused: PropTypes.bool,
}

// Specifies the default values for props:
Lot.defaultProps = {
    isSelected: false,
    isFocused: false,
    selectable: false,
    flags: [],
    highlight: false,
    enableFlagSelector: true,
    templateValues: [],
    count: 0,
    glow: false,
    stationName: ""
}

export default Lot