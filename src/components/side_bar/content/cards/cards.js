import React, {useEffect, useState, useRef} from 'react';
import { useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

import * as styled from './cards.style'
import CardEditor from "./card_editor/card_editor";
import CardMenu from "./card_menu/card_menu";
import CardZone from "./card_zone/card_zone";
import TimelineZone from "./timeline_zone/timeline_zone";
import Button from "../../../basic/button/button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Portal from "../../../../higher_order_components/portal";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import SummaryZone from "./summary_zone/summary_zone";


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
    const isCardDragging = useSelector(state => { return state.cardPageReducer.isCardDragging })
    const isHoveringOverColumn = useSelector(state => { return state.cardPageReducer.isHoveringOverColumn })
    const processIds = Object.keys(processes)

    const [showCardEditor, setShowCardEditor] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [zoneSize, setZoneSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
    const zoneRef = useRef(null);

    // useEffect will run on zoneRef value assignment
    useEffect( () => {

        // The 'current' property contains info of the reference:
        // align, title, ... , width, height, etc.
        if(zoneRef.current){

            console.log("zoneRef.current",zoneRef.current)
            let height = zoneRef.current.offsetHeight;
            let width  = zoneRef.current.offsetWidth;
            let offsetTop  = zoneRef.current.offsetTop;
            let offsetLeft  = zoneRef.current.offsetLeft;
            setZoneSize({
                width: width,
                height: height,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
            });
        }

    }, [zoneRef]);


    let title
    let showAddCard
    let showGanttViewButton = false
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

                <styled.Title>{title}</styled.Title>
                {showAddCard &&
                    <Button
                        onClick={()=>setShowCardEditor(!showCardEditor)}
                        schema={'processes'}
                    >
                        + Card
                    </Button>
                }
                {showGanttViewButton &&
                    <Button
                        schema={'processes'}
                    >
                        Gantt View
                    </Button>
                }
                {(id === "summary" || id === "timeline") &&
                    <Button
                        schema={'processes'}
                        onClick={()=>history.replace ('/processes/' + processIds[0] + "/card")}
                    >
                        Leave Zone
                    </Button>
                }
            </styled.Header>
            <styled.Body id={"cards-body"}>
                {showMenu &&
                <CardMenu
                    currentProcess={currentProcess}
                    close={()=>setShowMenu(false)}
                />
                }

                {
                    {
                        'summary':
                            <SummaryZone
                                zoneRef={zoneRef}
                                zoneSize={zoneSize}
                                handleCardClick={handleCardClick}
                            />,
                        'timeline':
                            <TimelineZone
                                handleCardClick={handleCardClick}
                                initialProcesses={[currentProcess]}
                            />
                    }[id] ||
                    <div ref={zoneRef} style={{overflow: "hidden", height: "100%", flex: 1, maxHeight: "100%"}}>
                        <TransformWrapper
                            defaultScale={1}
                            style={{background: "green", padding: "2rem", flex: 1}}
                            options={{
                                minScale: 0.2,
                                limitToBounds: false,
                                // limitToWrapper: true,
                                disabled: isCardDragging,
                            }}
                            pan={{
                                disabled: isCardDragging
                            }}
                            enablePanPadding={false}
                            enablePadding={false}
                            wheel={{
                                disabled: isHoveringOverColumn,
                                // wheelEnabled: false,
                                step: 50
                            }}
                            scalePadding={{
                                disabled: false
                            }}
                            pinch={{
                                disabled: true
                            }}
                        >
                            <TransformComponent>
                                <CardZone
                                    processId={id}
                                    size={zoneSize}
                                    handleCardClick={handleCardClick}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                }
            </styled.Body>
        </styled.Container>
    )
}

export default Cards