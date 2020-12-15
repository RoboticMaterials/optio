import React, {useState} from "react";
import {useSelector} from "react-redux";
import * as styled from "./card.style";
import { Draggable } from 'react-smooth-dnd';

const Card = (props) => {
    const {
        name,
        index,
        id,
        onClick,
        count,
        objectName
    } = props


    return(
        <styled.StyledDraggable key={id} index={index}>
            <styled.Container
                onClick={onClick}
            >
                <styled.ContentContainer>
                    {name}
                </styled.ContentContainer>


                <styled.FooterBar>
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