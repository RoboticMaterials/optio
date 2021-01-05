import React, {useEffect, useState} from "react";

// external components
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {getCards, getProcessCards, putCard} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './finish_modal.style'
import {useTheme} from "styled-components";
import {getProcesses} from "../../../../../../redux/actions/processes_actions";

Modal.setAppElement('body');

const FinishModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit
    } = props

    // get current buttons, default to empty array
    const dashboardId = dashboard?._id?.$oid

    const theme = useTheme()

    const dispatch = useDispatch()
    // const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetProcesses = () => dispatch(getProcesses())
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const finishEnabledDashboard = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}

    const [submitting, setSubmitting] = useState(false)
    const [availableKickOffCards, setAvailableKickOffCards] = useState([])
    const isButtons = availableKickOffCards.length > 0

    const stationId = dashboard.station

    /*
    * handles the logic for when a kick-off button is pressed
    *
    * When a kick-off button is pressed, the card is to be moved from the queue of the current process it resides in
    * to the first station in the process
    *
    * This is done by updating the cards station_id and route_id to those of the first station in the first route
    * */
    const onButtonClick = async (card) => {

        // extract card attributes
        const {
            bins,
            name: cardName,
            process_id,
            _id: cardId,
        } = card

        // update card
        if(true) {

            // extract first station's bin and queue bin from bins
            const {
                [stationId]: currentStationBin,
                ["FINISH"]: finishBin,
               ...unalteredBins
            } = bins || {}

            const queueBinCount = finishBin?.count ? finishBin.count : 0
            const currentStationBinCount = currentStationBin?.count ? currentStationBin.count : 0

            // udpated card will maintain all of the cards previous attributes with the station_id and route_id updated
            const updatedCard = {
                ...card,                                // spread unaltered attributes
                bins: {
                    ...unalteredBins,                   // spread unaltered bins
                    ["FINISH"]: {
                        ...finishBin,              // spread unaltered attributes of station bin if it exists
                        count: parseInt(queueBinCount) + parseInt(currentStationBinCount)    // increment first station's count by the count of the queue
                    }
                },
            }

            // send update action
            const result = await onPutCard(updatedCard, cardId)

            var requestSuccessStatus = false

            // check if request was successful
            if(!(result instanceof Error)) {
                requestSuccessStatus = true
            }

            onSubmit(cardName, requestSuccessStatus)
            setSubmitting(false)
            close()
        }
    }


    /*
    * renders an array of buttons for each kick off lot
    * */
    const renderKickOffButtons = () => {
        return availableKickOffCards.map((currCard, cardIndex) => {
            const {
                name,
                _id
            } = currCard

            return(
            <DashboardButton
                title={name}
                key={_id}
                type={null}
                onClick={()=>{
                    onButtonClick(currCard)
                }}
                containerStyle={{height: '4rem', minHeight: "4rem", lineHeight: '3rem', margin: '0.5rem 0', width: '80%'}}
                hoverable={false}
                taskID = {null}
                color = {theme.schema.finish.solid}
                disabled = {false}
            />
            )
        })
    }

    /**
     * When modal is opened, get all cards associated with the processes
     *
     *
     */
    useEffect(() => {
        dispatchGetCards()
        dispatchGetProcesses()
    }, [])

    /**
     * Get the cards actually available for kick off
     *
     * For a card to be available for kick off, it must have at least 1 item in the 'queue' bin
     *
     * This function creates a temporary array for storing kick off cards as it checks each card of each process associated with the station
     *
     * This function loops through every card belonging to a process that the current station is the first station of
     * Each card's bins attribute is checked to see if it contains any items in the "QUEUE" bin
     *
     * if a card is found to have items in the "QUEUE" bin, it is added to the list of kick off cards
     *
     * finally, local state variable availableKickOffCards is set to the list of kick off cards for later use
     *
     */
    useEffect(() => {
        var tempAvailableCards = []

        if(finishEnabledDashboard && Array.isArray(finishEnabledDashboard)) finishEnabledDashboard.forEach((currProcessId) => {
            const currProcessCards = processCards[currProcessId]

            var filteredCards = []
            if(currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => {
                // currCard.station_id === "QUEUE"
                if(currCard.bins && currCard.bins[stationId]) return true
            })
            tempAvailableCards = tempAvailableCards.concat(filteredCards)
        })

        setAvailableKickOffCards(tempAvailableCards)

    }, [processCards])

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.Title>{title}</styled.Title>

                <Button
                    onClick={close}
                    schema={'dashboards'}
                >
                    <i className="fa fa-times" aria-hidden="true"/>
                </Button>
            </styled.Header>

            <styled.BodyContainer>
                    <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
                        <styled.ContentContainer>
                            <styled.ReportButtonsContainer isButtons={isButtons}>
                                {isButtons ?
                                    renderKickOffButtons()
                                    :
                                    <styled.NoButtonsText>No available lots.</styled.NoButtonsText>
                                }

                            </styled.ReportButtonsContainer>
                        </styled.ContentContainer>

                        <styled.ButtonsContainer>
                            <Button
                                tertiary
                                schema={"dashboards"}
                                onClick={close}
                                label={"Close"}
                                type="button"
                            />
                        </styled.ButtonsContainer>
                    </div>
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default FinishModal
