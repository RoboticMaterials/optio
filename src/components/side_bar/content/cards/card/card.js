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
        lotId = 2
    } = props

    const lotColor= "#" + intToRGB(hashCode(lotId))
    console.log("lotColor",lotColor)

    return(
        <styled.StyledDraggable key={id} index={index}>
            <styled.Container
                onClick={onClick}
                color={lotColor}
            >
                <styled.ContentContainer>

                    {name &&
                    <span>{name}</span>
                    }
                </styled.ContentContainer>


                <styled.FooterBar>
                    {lotName&&
                    <span>Lot:{lotName}</span>
                    }
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