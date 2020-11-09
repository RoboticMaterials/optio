import React, {useState} from 'react';
import { useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

import * as styled from './cards.style'
import Card from "./card/card";
import {Container} from "react-smooth-dnd";
import { SortableContainer } from "react-sortable-hoc";
import arrayMove from "array-move";
import {randomHash} from "../../../../methods/utils/utils";
import {putDashboard} from "../../../../redux/actions/dashboards_actions";
import {putCard} from "../../../../redux/actions/card_actions";
const TEMP_STATIONS = {


}

const TEMP_CARDS = [
    {
        name: "card1",
    },
    {
        name: "card2",
    },
    {
        name: "card3",
    },
    {
        name: "card4",
    },
    {
        name: "card5",
    },
]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


const StationsColumn = SortableContainer((props) => {
    const {
        id,

        cards
    } = props

    const dispatch = useDispatch()
    const station = useSelector(state => { return state.locationsReducer.stations[id] })


    const {
        name
    } = station

    const handleDrop = (dropResult) => {
        console.log("handleDrop dropResult", dropResult)
        console.log("handleDrop id", id)
        const { removedIndex, addedIndex, payload, element } = dropResult;
        dispatch(putCard(payload))

        //
        // const buttonsCopy = (values.buttons)
        //
        if (payload === null) { //  No new button, only reorder
        //     const shiftedButtonsCopy = arrayMove(buttonsCopy, removedIndex, addedIndex)
        //     formikProps.setFieldValue("buttons", shiftedButtonsCopy)
        } else { // New button
            if(addedIndex !== null) {
        //         payload.id = randomHash()
        //         buttonsCopy.splice(addedIndex, 0, payload)
        //         formikProps.setFieldValue("buttons", buttonsCopy)
            }
        //
        }
    }

    const renderCards = () => {
        return(
            <styled.RouteContainer>
                <Container
                    onDrop={(DropResult)=> {
                        handleDrop(DropResult)
                    }}
                    groupName="process-cards"
                    getChildPayload={index =>
                        cards[index]
                    }
                    style={{background: "purple"}}
                >
                {cards.map((card, index) => {
                    return(
                        <Card
                            name={card.name}
                            id={index}
                            index={index}
                        />
                    )
                })}
                </Container>
            </styled.RouteContainer>

        )
    }

    return(
        <styled.RouteContainer>
            <styled.StationHeader>
                <styled.RouteName>{name}</styled.RouteName>
                <styled.StationButton>
                    <i className="fas fa-ellipsis-h"></i>
                </styled.StationButton>
            </styled.StationHeader>

            {renderCards()}


        </styled.RouteContainer>
    )
})

const StationsList = (props) => {
    const {
        routes
    } = props

    const cards = useSelector(state => { return state.cardsReducer.cards })

    // get stations from routes
    let stations = []
    routes.forEach((route) => {
        const {
            load: {station: loadStationId},
            unload: {station: unloadStationId},
        } = route

        stations.push(loadStationId)
        stations.push(unloadStationId)

    })

    let cardsSorted = {}
    // build card array for each station
    stations.forEach((stationId) => {
        cardsSorted[stationId] = []
    })

    Object.values(cards).forEach((card) => {
        if(stations.includes(card.stationId)) cardsSorted[card.stationId].push(card)
    })





    const renderStations = () => {
        return(
            <styled.RoutesListContainer>
                {
                    stations.map((stationId) => {

                        return (
                            <StationsColumn
                                // onDrop={handleDrop}
                                id={stationId}
                                cards={cardsSorted[stationId]}
                            />
                        )
                    })
                }
            </styled.RoutesListContainer>

        )
    }

    return(
        renderStations()
    )
}

const Cards = (props) => {

    const {
        id
    } = props



    const currentProcess = useSelector(state => { return state.processesReducer.processes[id] })
    const routes = useSelector(state => { return Object.values(state.tasksReducer.tasks).filter((route) => currentProcess.routes.includes(route._id)) })

    console.log("currentProcess",currentProcess)
    console.log("routes",routes)
    console.log("id",id)


    return (
        <styled.Container>
            <StationsList routes={routes}/>
        </styled.Container>
    )
}

export default Cards