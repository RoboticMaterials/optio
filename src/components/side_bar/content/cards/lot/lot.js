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
import {FLAG_OPTIONS} from "../../../../../constants/lot_contants"

// utils
import {immutableDelete, immutableReplace, isArray} from "../../../../../methods/utils/array_utils"
import {formatLotNumber} from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "./lot.style"

const Lot = (props) => {
    const {
        name,
        highlight,
        index,
        totalQuantity,
        lotNumber,
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

    const startDateText = ((start_date?.month + 1) && start_date?.day && start_date?.year) ?  (start_date.month + 1) + "/" + start_date.day + "/" + start_date.year : "Start"
    const endDateText = ((end_date?.month + 1) && end_date?.day && end_date?.year) ?  (end_date.month + 1) + "/" + end_date.day + "/" +end_date.year : "End"

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
                    <styled.Row>
                        <styled.Label>Process</styled.Label>
                        <styled.Count>{processName}</styled.Count>
                    </styled.Row>
                    }


                {/*    <styled.Row>*/}
                {/*        <styled.Label>Dates</styled.Label>*/}
                {/*    <styled.DatesContainer>*/}
                {/*        <styled.DateItem>*/}
                {/*            <styled.DateText>{startDateText}</styled.DateText>*/}
                {/*        </styled.DateItem>*/}
                
                {/*        <styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>*/}
                
                {/*        <styled.DateItem>*/}
                {/*            <styled.DateText>{endDateText}</styled.DateText>*/}
                {/*        </styled.DateItem>*/}
                {/*    </styled.DatesContainer>*/}
                {/*</styled.Row>*/}

                <styled.Row style={{border: "none"}}>
                    <styled.Label>Quantity</styled.Label>
                    <styled.Count>{count}/{totalQuantity}</styled.Count>
                </styled.Row>
            </styled.ContentContainer>

        </styled.Container>
    )
}

// Specifies propTypes
Lot.propTypes = {
    isSelected: PropTypes.bool,
    selectable: PropTypes.bool
}

// Specifies the default values for props:
Lot.defaultProps = {
    isSelected: false,
    selectable: false,
    flags: [],
    highlight: false,
    enableFlagSelector: true,
}

export default Lot