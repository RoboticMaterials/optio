import React, {useEffect, useState, useRef} from 'react';

// external functions
import { useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

// internal components
import CardEditor from "./card_editor/card_editor";
import CardMenu from "./card_menu/card_menu";
import CardZone from "./card_zone/card_zone";
import SummaryZone from "./summary_zone/summary_zone";

// actions
import {showEditor} from '../../../../redux/actions/card_actions'

// styles
import * as styled from './cards.style'

const Cards = (props) => {

    // extract props
    const {
        id
    } = props

    // history
    const history = useHistory()

    //redux state
    const processes = useSelector(state => { return state.processesReducer.processes })
    const showCardEditor = useSelector(state=> {return state.cardsReducer.showEditor})

    // actions
    const dispatch = useDispatch()
    const onShowCardEditor = (bool) => dispatch(showEditor(bool))

    // internal state
    const [selectedCard, setSelectedCard] = useState(null)
    const [title, setTitle] = useState(null)
    const [currentProcess, setCurrentProcess] = useState(null)
    const [isProcessView, setIsProcessView] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [zoneSize, setZoneSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })

    // refs
    const zoneRef = useRef(null);

    /*
    * This effect monitors the div referenced by zoneRef and the window height
    *
    * When either of these changes, zoneSize is updated with the current width, height, top offset, and left offset of the div referenced by zoneRef
    * This ensures that the size of zoneRef is updated when the window size changes
    *
    * zoneSize is used for setting the max height of lot columns in the CardZone and SummaryZone
    *
    * @param {ref} zoneRef - ref assigned to CardZone
    * @param {int} window.innerHeight - window height
    *
    * */
    useEffect( () => {

        // if zoneRef is assigned
        if(zoneRef.current){

            // extract dimensions of zoneRef
            let height = zoneRef.current.offsetHeight;
            let width  = zoneRef.current.offsetWidth;
            let offsetTop  = zoneRef.current.offsetTop;
            let offsetLeft  = zoneRef.current.offsetLeft;

            // set zoneSize
            setZoneSize({
                width: width,
                height: height,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
            });
        }

    }, [zoneRef, window.innerHeight]);

    /*
    * This effect updates internal component state basted on the {id} props
    *
    * The value of {id} can take on 1 of 3 types of values, {"summary"}, {"timeline"}, or the id of a process
    *
    * The content of the page changes based on the value of id, and this useEffect updates internal component state in order to achieve this
    *
    * the value of {id} should produce the following content:
    *   {"summary"} - render content for the summary zone
    *   {"timeline"} - render content for timeline zone *** CURRENTLY DISABLED ***
    *   a process id - render lot content for the corresponding process
    *
    * @param {id} string - id of content to display
    *
    * */
    useEffect( () => {

        // update internal state based on id
        switch(id) {

            // summary zone
            case "summary":
                // only title needs to be set
                setTitle("Lots Summary")
                break

            // timeline zone
            case "timeline":
                // only title needs to be set
                setTitle("Timeline Zone")
                break

            // otherwise assume id is the id of a specific process
            default:
                setIsProcessView(true)
                setCurrentProcess(processes[id])
                setTitle(processes[id]?.name)
                break
        }
    }, [id]);


    /*
   * This function handles the logic for when a lot is clicked
   *
   * Clicking a lot should open the lot editor for the clicked lot
   * In order to do this, the function sets showCardEditor to true and sets selectedCard to the values passed in as arguments to this function
   *
   * @param {cardId} string - id of card clicked
   * @param {processId} string - id of clicked card's process
   * @param {binId)} string - id of clicked card's bin
   *
   * */
    const handleCardClick = (cardId, processId, binId) => {
        onShowCardEditor(true)
        setSelectedCard({cardId, processId, binId})
    }

    return(
        <styled.Container>
            {showCardEditor &&
            <CardEditor
                isOpen={showCardEditor}
                onAfterOpen={null}
                cardId={selectedCard ? selectedCard.cardId : null}
                processId={selectedCard ? selectedCard.processId : null}
                binId={selectedCard ? selectedCard.binId : null}
                close={()=>{
                    onShowCardEditor(false)
                    setSelectedCard(null)
                }}
            />
            }
            <styled.Header>
                {isProcessView ?
                    <styled.MenuButton
                        style={{marginRight: "auto"}}
                        className="fas fa-chevron-left"
                        aria-hidden="true"
                        onClick={()=>{
                            history.replace ('/processes')}
                        }
                    />
                    :
                    <styled.InvisibleItem style={{marginRight: "auto"}}/> // used for spacing
                }
                <styled.Title>{title ? title : "untitled"}</styled.Title>
                <styled.InvisibleItem
                    style={{marginLeft: "auto"}}
                />
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
                                handleCardClick={handleCardClick}
                                setShowCardEditor={onShowCardEditor}
                                showCardEditor={showCardEditor}
                            />,
                        'timeline':
                            <div
                                handleCardClick={handleCardClick}
                                initialProcesses={[currentProcess]}
                            />
                    }[id] ||
                    <styled.CardZoneContainer ref={zoneRef}>
                        <CardZone
                            maxHeight={(zoneSize.height - 75) + "px"} // maxHeight is set equal to size of parent div with some value subtracted as padding. NOTE: setting height to 100% doesn't currently work for this
                            setShowCardEditor={onShowCardEditor}
                            showCardEditor={showCardEditor}
                            processId={id}
                            handleCardClick={handleCardClick}
                            processId={id}
                        />
                    </styled.CardZoneContainer>
                }
            </styled.Body>
        </styled.Container>
    )
}

export default Cards
