import React, {useState} from "react";
import {useSelector} from "react-redux";
import * as styled from "./card.style";
import { Container, Draggable } from 'react-smooth-dnd';

const Card = (props) => {
    const {
        name,
        index,
        id
    } = props


    return(
        <Draggable key={id} index={index} style={{ overflow: 'visible', background: "blue" }}>
            <styled.Container>{name}</styled.Container>
        </Draggable>
    )
}

export default Card