import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

import * as styled from './cards.style'
import CardEditor from "./card_editor/card_editor";
import CardMenu from "./card_menu/card_menu";
import CardZone from "./card_zone/card_zone";
import TimelineZone from "./timeline_zone/timeline_zone";

const PAGES = {
    CARDS: "CARDS",
    SUMMARY: "SUMMARY",
    TIMELINE: "TIMELINE"
}
const Cards = (props) => {

    const {
        id
    } = props

    const history = useHistory()
    const processes = useSelector(state => { return state.processesReducer.processes })
    const routes = useSelector(state => { return state.tasksReducer.tasks })
    const cards = useSelector(state => { return state.cardsReducer.processCards[id] })
    const processIds = Object.keys(processes)

    const [showCardEditor, setShowCardEditor] = useState(false)
    const [page, setPage] = useState()
    const [selectedCard, setSelectedCard] = useState(null)
    const [showMenu, setShowMenu] = useState(false)

    var stations = []
    let filteredRoutes = []

    let title
    let showAddCard
    let showGanttViewButton = false

    console.log("id",id)
    console.log("processIds",processIds)
    let currentProcess

    switch(id) {
        case "summary":
            title = "Summary Zone"
            showAddCard = false
            currentProcess = processes[processIds[0]]
            break
        case "timeline":
            showAddCard = false
            showGanttViewButton = true
            title = "Timeline Zone"
            currentProcess = processes[processIds[0]]
            break
        default:
            showAddCard = true
            currentProcess = processes[id]
            title = currentProcess.name
            break
    }

    console.log("processes",processes)
    console.log("currentProcess",currentProcess)



    const handleCardClick = (cardId) => {
        setShowCardEditor(true)
        setSelectedCard(cardId)
    }


    return(
        <styled.Container>
            <CardEditor
                isOpen={showCardEditor}
                onAfterOpen={null}
                cardId={selectedCard}
                close={()=>{
                    setShowCardEditor(false)
                    setSelectedCard(null)
                }}
            />

            <styled.Header>
                <styled.MenuButton
                    className="fa fa-th"
                    aria-hidden="true"
                    onClick={()=>setShowMenu(!showMenu)}
                />

                <styled.ProcessName>{title}</styled.ProcessName>
                {showAddCard &&
                    <styled.AddCardButton
                        onClick={()=>setShowCardEditor(!showCardEditor)}
                    >
                        + Card
                    </styled.AddCardButton>
                }
                {showGanttViewButton &&
                <styled.AddCardButton
                >
                    Gantt View
                </styled.AddCardButton>
                }
                {(id === "summary" || id === "timeline") &&
                    <styled.AddCardButton
                        onClick={()=>history.replace ('/processes/' + processIds[0] + "/card")}
                    >
                        Leave Zone
                    </styled.AddCardButton>
                }
            </styled.Header>
            <styled.Body>
                {showMenu &&
                    <CardMenu
                        currentProcess={currentProcess}
                        close={()=>setShowMenu(false)}
                    />
                }
                {
                    {
                        'summary':
                            <div>THIS WILL BE THE SUMMARY ZONE</div>,
                        'timeline':
                            <TimelineZone
                                handleCardClick={handleCardClick}
                                initialProcesses={[currentProcess]}
                            />
                    }[id] ||
                    <CardZone
                        processId={id}
                        // stations={stations}
                        handleCardClick={handleCardClick}
                    />
                }
            </styled.Body>


        </styled.Container>
    )
}

export default Cards