import React, {useState} from "react";
import {useSelector} from "react-redux";
import * as styled from "./card.style";
import { Draggable } from 'react-smooth-dnd';

const Card = (props) => {
    const {
        name,
        index,
        id,
        onClick
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

                </styled.FooterBar>

            </styled.Container>
        </styled.StyledDraggable>
    )
}

export default Card