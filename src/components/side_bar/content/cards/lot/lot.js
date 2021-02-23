import React, {useContext, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as styled from "./lot.style";
import { Draggable } from 'react-smooth-dnd';
import PropTypes from "prop-types";
import TextField from "../../../../basic/form/text_field/text_field";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {ThemeContext} from "styled-components";
import theme from "../../../../../theme";
import {FLAG_OPTIONS} from "../../../../../constants/lot_contants";
import {putCard, putCardAttributes} from "../../../../../redux/actions/card_actions";
import {immutableDelete, immutableReplace, isArray} from "../../../../../methods/utils/array_utils";


const Card = (props) => {
    const {
        name,
        index,
        id,
        onClick,
        count,
        objectName,
        lotName,
        lotId = 2,
        start_date,
        end_date,
        containerStyle,
        selectable,
        isSelected,
        flags
    } = props
    console.log("flags",flags)

    const themeContext = useContext(ThemeContext)

    // actions
    const dispatch = useDispatch()
    const dispatchPutCardAttributes = async (card, ID) => await dispatch(putCardAttributes(card, ID))

    const startDateText = ((start_date?.month + 1) && start_date?.day && start_date?.year) ?  (start_date.month + 1) + "/" + start_date.day + "/" + start_date.year : "Start"
    const endDateText = ((end_date?.month + 1) && end_date?.day && end_date?.year) ?  (end_date.month + 1) + "/" + end_date.day + "/" +end_date.year : "End"

    return(
        <styled.StyledDraggable key={id} index={index}>
            <styled.Container
                selectable={selectable}
                isSelected={isSelected}
                onClick={onClick}
                containerStyle={containerStyle}
            >
                <styled.HeaderBar>
                    <styled.CardName>{name}</styled.CardName>

                    <Popup
                        contentStyle={{
                            background: themeContext.bg.octonary,
                            width: "fit-content"
                        }}
                        arrowStyle={{
                            color: themeContext.bg.octonary,
                        }}

                        trigger={open => (
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
                                                    onClick={(e) => {
                                                        // e.preventDefault()
                                                        // e.stopPropagation()
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
                                        onClick={(e) => {
                                            // e.preventDefault()
                                            // e.stopPropagation()
                                        }}
                                    />
                                }
                            </styled.FlagsContainer>

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

                </styled.HeaderBar>
                <styled.ContentContainer>

                    <styled.Row>
                        <styled.Label>Dates</styled.Label>
                    <styled.DatesContainer>
                        <styled.DateItem>
                            <styled.DateText>{startDateText}</styled.DateText>
                        </styled.DateItem>

                        <styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

                        <styled.DateItem>
                            <styled.DateText>{endDateText}</styled.DateText>
                        </styled.DateItem>
                    </styled.DatesContainer>
                    </styled.Row>

                    <styled.Row style={{border: "none"}}>
                        <styled.Label>Quantity</styled.Label>
                        <styled.Count>{count}</styled.Count>
                    </styled.Row>






                </styled.ContentContainer>


                {/*<styled.FooterBar*/}
                {/*    color={lotColor}*/}
                {/*>*/}


                {/*    {objectName &&*/}
                {/*        <styled.Count style={{marginRight: "1rem"}}>{objectName}:</styled.Count>*/}
                {/*    }*/}


                {/*</styled.FooterBar>*/}

            </styled.Container>
        </styled.StyledDraggable>
    )
}

// Specifies propTypes
Card.propTypes = {
    isSelected: PropTypes.bool,
    selectable: PropTypes.bool
};

// Specifies the default values for props:
Card.defaultProps = {
    isSelected: false,
    selectable: false,
    flags: []
};

export default Card