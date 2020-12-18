import React, {useEffect, useState} from "react";

// external components
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {getProcessCards, putCard} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './kick_off_modal.style'
import {useTheme} from "styled-components";

Modal.setAppElement('body');

const KickOffModal = (props) => {

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
    const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const kickOffEnabledInfo = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}

    const [submitting, setSubmitting] = useState(false)
    const [availableKickOffCards, setAvailableKickOffCards] = useState([])
    const isButtons = availableKickOffCards.length > 0

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
            count,              //0
            description,        // ""
            end_date,           //null
            lot_id,             //"5fdaa65e5a8a68e6a887f832"
            name: cardName,               //"n"
            object_id,          //null
            process_id,         // "f5cc9fc7-08f2-4082-b1d4-b23f211e3cab"
            route_id,           // "QUEUE"
            start_date,         // null
            station_id,         // "QUEUE"
            _id: cardId,                // "5fdaa65e5a8a68e6a887f833"
        } = card

        // get process of card
        const cardProcess = processes[process_id]

        // get routes of process
        const processRoutes = cardProcess.routes

        // get id of first route
        var firstRouteId = null
        if(processRoutes && Array.isArray(processRoutes)) firstRouteId = processRoutes[0]

        // get first route
        const firstRoute = routes[firstRouteId]

        // extract route attributes
        const {
            load: {
                station: loadStation
            }
        } = firstRoute || {}

        // update card
        if(firstRouteId && firstRoute && loadStation) {

            // udpated card will maintain all of the cards previous attributes with the station_id and route_id updated
            const updatedCard = {
                ...card,
                station_id: loadStation,
                route_id: firstRouteId
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
                color = {theme.schema.kick_off.solid}
                disabled = {false}
            />
            )
        })



    }

    /**
     * When modal is opened, get cards for processes
     *
     *
     */
    useEffect(() => {
        if(kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo)) kickOffEnabledInfo.forEach((currProcessId) => {
            onGetProcessCards(currProcessId)
        })

    }, [])

    /**
     * When modal is opened, get cards for processes
     *
     *
     */
    useEffect(() => {
        var tempAvailableCards = []

        if(kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo)) kickOffEnabledInfo.forEach((currProcessId) => {
            const currProcessCards = processCards[currProcessId]

            var filteredCards = []
            if(currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => currCard.station_id === "QUEUE")
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
                                    <styled.NoButtonsText>There are currently no lots in the queue available for kick off.</styled.NoButtonsText>
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

export default KickOffModal
