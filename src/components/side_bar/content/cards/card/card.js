import React, {useState} from "react";
import {useSelector} from "react-redux";
import * as styled from "./card.style";
import { Container, Draggable } from 'react-smooth-dnd';

const Card = (props) => {
    const {
        name,
        index,
        id,
        onClick
    } = props


    return(
        <Draggable key={id} index={index} style={{ background: "blue" }}>
            <styled.Container
                onClick={onClick}

            >
                {name}
            </styled.Container>
        </Draggable>
    )
}

export default Card