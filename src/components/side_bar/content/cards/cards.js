import React, {useEffect, useState, useRef, useContext, memo} from 'react';

// external functions
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// internal components
import CardMenu from "./card_menu/card_menu";
import CardZone from "./card_zone/card_zone";
import SummaryZone from "./summary_zone/summary_zone";

// actions
import {deleteCard, putCard, showEditor} from '../../../../redux/actions/card_actions'

// styles
import * as styled from './cards.style'
import Textbox from "../../../basic/textbox/textbox";
import { ThemeContext } from "styled-components";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import ZoneHeader from "./zone_header/zone_header";
import {SORT_MODES} from "../../../../constants/common_contants";
import LotCreatorForm from "./card_editor/template_form";
import {getLotTemplates} from "../../../../redux/actions/lot_template_actions";
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../constants/lot_contants";
import LotEditorContainer from "./card_editor/lot_editor_container";
import SummaryHeader from "./summary_header/summary_header";
import {immutableDelete} from "../../../../methods/utils/array_utils";
import MultiSelectOptions from "./multi_select_options/multi_select_options";
import {isEmpty} from "../../../../methods/utils/object_utils";
import ConfirmDeleteModal from "../../../basic/modals/confirm_delete_modal/confirm_delete_modal";
import DeleteMultipleLots from "./modals/delete_multiplie_lots_modal/delete_multiplie_lots_modal";
import DeleteMultipleLotsModal from "./modals/delete_multiplie_lots_modal/delete_multiplie_lots_modal";
import {isControl, isControlAndShift, isShift} from "../../../../methods/utils/event_utils";
import MoveMultipleLotsModal from "./modals/move_multiplie_lots_modal/move_multiplie_lots_modal";

const Cards = (props) => {

    // extract props
    const {
        id
    } = props

    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())

    //redux state
    const processes = useSelector(state => { return state.processesReducer.processes })
    const showCardEditor = useSelector(state => { return state.cardsReducer.showEditor })
    const currentMap = useSelector(state => state.mapReducer.currentMap)

    // actions
    const dispatch = useDispatch()
    const onShowCardEditor = (bool) => dispatch(showEditor(bool))

    // internal state
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [showMoveModal, setShowMoveModal] = useState(false)
    const [selectedCards, setSelectedCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    const [title, setTitle] = useState(null)
    const [currentProcess, setCurrentProcess] = useState(null)
    const [isProcessView, setIsProcessView] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [filteredProcesses, setFilteredProcesses] = useState(Object.values(processes).filter((currProcess) => currProcess.map_id === currentMap._id))
    const [zoneSize, setZoneSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
    const [lotFilterValue, setLotFilterValue] = useState('')
    const [ selectedFilterOption, setSelectedFilterOption ] = useState(LOT_FILTER_OPTIONS.name)
    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    // internal component state
    const [selectedProcesses, setSelectedProcesses] = useState(filteredProcesses) // array of {process} objects - the list of selected processes

    // refs
    const zoneRef = useRef(null);

    useEffect( () => {
        dispatchGetLotTemplates()

    }, [])

    /*
    * filters processes by map id
    * */
    useEffect(() => {
        setFilteredProcesses(Object.values(processes).filter((currProcess) => currProcess.map_id === currentMap._id))
    }, [processes])

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
    useEffect(() => {

        // if zoneRef is assigned
        if (zoneRef.current) {

            // extract dimensions of zoneRef
            let height = zoneRef.current.offsetHeight;
            let width = zoneRef.current.offsetWidth;
            let offsetTop = zoneRef.current.offsetTop;
            let offsetLeft = zoneRef.current.offsetLeft;

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
    useEffect(() => {

        // update internal state based on id
        switch (id) {

            // summary zone
            case "summary":
                setTitle("Lots Summary")
                setIsProcessView(false)
                break

            // timeline zone
            case "timeline":
                setTitle("Timeline Zone")
                setIsProcessView(false)
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
   * @param {cardId} string - id of lot clicked
   * @param {processId} string - id of clicked lot's process
   * @param {binId)} string - id of clicked lot's bin
   *
   * */
    const handleCardClick = (event, {lotId, processId, binId}, lotsBetween) => {

        /*
        * Special keys: (ctrl (windows) OR cmd (mac)) AND shift
        * Action: add cards between last added and just clicked (including just clicked)
        * */
        if(isControlAndShift(event)) {
            // for each lot in lotsBetween, see if it already exists in selectedCards
            lotsBetween.forEach((currLotToAdd) => {
                const {
                    binId: currAddingBinId,
                    cardId: currAddingLotId,
                    process_id: currAddingProcessId,
                } = currLotToAdd

                const existingIndex = selectedCards.findIndex((currExistingLot) => {
                    const {
                        cardId: currExistingLotId,
                        binId: currExistingBinId,
                        processId: currExistingProcessId
                    } = currExistingLot

                    return (currAddingLotId === currExistingLotId) && (currAddingBinId === currExistingBinId) && (currAddingProcessId === currExistingProcessId)
                })

                // if it doesn't already exist in selectedCards, add it. Otherwise do nothing.
                if(existingIndex === -1) {
                    setSelectedCards((previous) => {
                        return(
                            [
                                ...previous,
                                {
                                    cardId: currAddingLotId,
                                    processId: currAddingProcessId,
                                    binId: currAddingBinId
                                }
                            ]
                        )
                    })
                }
            })
        }

        /*
        * Special keys: shift
        * Action: replace selected in current column with lots between last added and just clicked (including just clicked)
        * */
        else if (isShift(event)) {
            // filter out lots in current column from selectedCards
            let tempSelectedCards = selectedCards.filter((currLot) => {
                const {
                    binId: currBinId,
                } = currLot

                return currBinId !== binId
            })

            // add all lots from lotsBetween to selectedCards
            lotsBetween.forEach((currLotToAdd) => {
                const {
                    binId: currAddingBinId,
                    cardId: currAddingLotId,
                    process_id: currAddingProcessId,
                } = currLotToAdd


                tempSelectedCards.push({
                    cardId: currAddingLotId,
                    processId: currAddingProcessId,
                    binId: currAddingBinId
                })
            })

            // update selectedCards
            setSelectedCards(tempSelectedCards)
        }

        /*
        * Special keys: ctrl (windows), cmd (mac)
        * Action: add just clicked
        * */
        else if(isControl(event)) {
            // get index of lot in selected cards
            const existingIndex = selectedCards.findIndex((currLot) => {
                const {
                    cardId: currLotId,
                    binId: currBinId,
                    processId: currExistingProcessId
                } = currLot

                return (lotId === currLotId) && (binId === currBinId) && (processId === currExistingProcessId)
            })

            // if index === -1, lot isn't already in selected cards, so add
            if(existingIndex === -1) {
                setSelectedCards([
                    ...selectedCards,
                    { cardId: lotId, processId, binId }
                ])
            }
            // otherwise lot is in selectedCards already, so remove
            else {
                setSelectedCards(immutableDelete(selectedCards, existingIndex))
            }
        }

        /*
        * No special key pressed, open editor
        * */
        else {
            onShowCardEditor(true)
            setSelectedCard({ cardId: lotId, processId, binId })
        }
    }

    const handleDeleteClick = () => {
        setShowConfirmDeleteModal(true)
    }

    const handleMoveClick = () => {
        setShowMoveModal(true)
    }

    const handleAddLotClick = (processId) => {
        onShowCardEditor(true)
        setSelectedCard({ cardId: null, processId, binId: null })
    }

    return (
        <styled.Container>
            {showConfirmDeleteModal &&
            <DeleteMultipleLotsModal
                handleClose={() => setShowConfirmDeleteModal(false)}
                lots={selectedCards}
                isOpen={showConfirmDeleteModal}
                setShowConfirmDeleteModal={setShowConfirmDeleteModal}
                setSelectedCards={setSelectedCards}
                selectedCards={selectedCards}
            />
            }
            {showMoveModal &&
            <MoveMultipleLotsModal
                handleClose={() => setShowMoveModal(false)}
                lots={selectedCards}
                isOpen={showMoveModal}
                setShowConfirmDeleteModal={setShowMoveModal}
                setSelectedCards={setSelectedCards}
                selectedCards={selectedCards}
            />
            }

            {showCardEditor &&
            <LotEditorContainer
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
            <SummaryHeader
                showBackButton={isProcessView}
                title={title}
            />
            <div style={{display: 'flex', flexDirection: 'row', margin: '1rem 1rem'}}>
                <ZoneHeader
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    setLotFilterValue={setLotFilterValue}
                    selectedFilterOption={selectedFilterOption}
                    setSelectedFilterOption={setSelectedFilterOption}
                    selectedProcesses={selectedProcesses}
                    setSelectedProcesses={setSelectedProcesses}
                    zone={id}
                />
                {selectedCards.length > 0 &&
                <MultiSelectOptions
                    selectedLots={selectedCards}
                    onDeleteClick={handleDeleteClick}
                    onMoveClick={handleMoveClick}
                    onClearClick={()=>setSelectedCards([])}
                />
                }
            </div>

            <styled.Body
                id={"cards-body"}
            >
                {showMenu &&
                    <CardMenu
                        currentProcess={currentProcess}
                        close={() => setShowMenu(false)}
                    />
                }

                {
                    {
                        'summary':
                            <SummaryZone
                                setSelectedCards={setSelectedCards}
                                selectedCards={selectedCards}
                                sortMode={sortMode}
                                sortDirection={sortDirection}
                                selectedProcesses={selectedProcesses}
                                lotFilterValue={lotFilterValue}
                                selectedFilterOption={selectedFilterOption}
                                handleCardClick={handleCardClick}
                                setShowCardEditor={onShowCardEditor}
                                showCardEditor={showCardEditor}
                                handleAddLotClick={handleAddLotClick}
                            />,
                        'timeline':
                            <div
                                handleCardClick={handleCardClick}
                                initialProcesses={[currentProcess]}
                            />
                    }[id] ||
                    <styled.CardZoneContainer ref={zoneRef}>
                        <CardZone
                            handleAddLotClick={handleAddLotClick}
                            setSelectedCards={setSelectedCards}
                            selectedCards={selectedCards}
                            maxHeight={(zoneSize.height - 75) + "px"} // maxHeight is set equal to size of parent div with some value subtracted as padding. NOTE: setting height to 100% doesn't currently work for this
                            setShowCardEditor={onShowCardEditor}
                            showCardEditor={showCardEditor}
                            handleCardClick={handleCardClick}
                            processId={id}
                            lotFilterValue={lotFilterValue}
                            selectedFilterOption={selectedFilterOption}
                            sortMode={sortMode}
                            sortDirection={sortDirection}
                        />
                    </styled.CardZoneContainer>
                }
            </styled.Body>
        </styled.Container>
    )
}

export default memo(Cards)
