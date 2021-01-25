import React, {useState} from "react";
import {useSelector} from "react-redux";
import * as styled from "./card.style";
import { Draggable } from 'react-smooth-dnd';



function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}




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
        end_date
    } = props

    console.log("card props",props)

    const startDateText = ((start_date?.month + 1) && start_date?.day && start_date?.year) ?  (start_date.month + 1) + "/" + start_date.day + "/" + start_date.year : "Planned start"
    const endDateText = ((end_date?.month + 1) && end_date?.day && end_date?.year) ?  (end_date.month + 1) + "/" + end_date.day + "/" +end_date.year : "Planned end"

    const lotColor= "#" + intToRGB(hashCode(lotId))

    console.log("card startDateText",startDateText)
    console.log("card endDateText",endDateText)

    return(
        <styled.StyledDraggable key={id} index={index}>
            <styled.Container
                onClick={onClick}
                color={lotColor}
            >
                <styled.HeaderBar
                    color={lotColor}
                >
                    {lotName &&
                        <styled.LotName style={{marginRight: "1rem"}}>Lot: {lotName}</styled.LotName>
                    }
                </styled.HeaderBar>
                <styled.ContentContainer>




                    <styled.CardName>{name}</styled.CardName>

                </styled.ContentContainer>


                <styled.FooterBar
                    color={lotColor}
                >
                    <styled.DatesContainer>
                        <styled.DateItem>
                            <styled.DateText>{startDateText}</styled.DateText>
                        </styled.DateItem>

                        <styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

                        <styled.DateItem>
                            <styled.DateText>{endDateText}</styled.DateText>
                        </styled.DateItem>
                    </styled.DatesContainer>

                    {objectName &&
                        <styled.Count style={{marginRight: "1rem"}}>{objectName}:</styled.Count>
                    }

                    <styled.Count>{count}</styled.Count>
                </styled.FooterBar>

            </styled.Container>
        </styled.StyledDraggable>
    )
}

export default Card