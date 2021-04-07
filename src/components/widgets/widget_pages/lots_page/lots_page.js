import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'

// actions
import {widgetLoaded, hoverStationInfo} from '../../../../redux/actions/widget_actions'
import * as sidebarActions from "../../../../redux/actions/sidebar_actions"
import {showEditor} from '../../../../redux/actions/card_actions'

// functions external
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// components internal
import Button from '../../../../components/basic/button/button'
import LotEditorContainer from "../../../side_bar/content/cards/card_editor/lot_editor_container"
import LotListItem from "./lot_list_item/lot_list_item"
import Lot from '../../../side_bar/content/cards/lot/lot'

// utils
import {getBinQuantity, getIsCardAtBin} from "../../../../methods/utils/lot_utils"

// styles
import * as styled from './lots_page.style'
import LotContainer from "../../../side_bar/content/cards/lot/lot_container";

// TODO: Commented out charts for the time being (See comments that start with TEMP)
const LotsPage = (props) => {

    const params = useParams()
    const stationID = params.stationID
    const dispatch = useDispatch()
    const history = useHistory()

    const onWidgetLoaded = (bool) => dispatch(widgetLoaded(bool))
    const onShowSideBar = (bool) => dispatch(sidebarActions.setOpen(bool))
    const onHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const onShowCardEditor = (bool) => dispatch(showEditor(bool)) // <-- why is redux being used for this?

    const stations = useSelector(state => state.stationsReducer.stations)
    const cards = useSelector(state=>state.cardsReducer.cards)
    const showCardEditor = useSelector(state=>state.cardsReducer.showEditor) // <-- why is redux being used for this?
    const [locationName, setLocationName] = useState("")
    const [selectedCard, setSelectedCard] = useState(null)
    const [lotsPresent, setLotsPresent] = useState(false)

    const location = stations[stationID]

    // update location properties
    useEffect(() => {
        const location = stations[stationID]
        setLocationName(location.name)
    }, [stationID, stations])

    useEffect(() => {
        for (let i = 0; i < Object.values(cards).length; i++) {
            if (!!Object.values(cards)[i].bins[location.id]) {
                setLotsPresent(true)
                break
            }
        }
    },[])

    const goToCardPage = () => {
        onWidgetLoaded(false)
        onShowSideBar(true)
        onHoverStationInfo(null)
        const currentPath = history.location.pathname
        history.push('/lots/summary')
    }

    const openEditor = (cardId, processId, binId) => {
        onShowCardEditor(true)
        setSelectedCard({cardId, processId, binId})
    }

    return (

        <styled.LotsContainer>

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

            <styled.HeaderContainer>
                <styled.Header>
                    <styled.StationName>{locationName}</styled.StationName>
                </styled.Header>
            </styled.HeaderContainer>

            <styled.ContentContainer>
            <styled.SubtitleContainer>
                {!!lotsPresent ?
                    <styled.Subtitle>Lots at {locationName}:</styled.Subtitle>
                    :
                    <styled.Subtitle>No Lots</styled.Subtitle>
                }
                <Button
                    schema={'lots'}
                    onClick = {goToCardPage}
                    style = {{position: 'absolute', right:'1.6rem'}}
                >
                    Go To Card View
                </Button>
            </styled.SubtitleContainer>


            {Object.values(cards)
                .filter((card, ind) => {
                    return getIsCardAtBin(card, location?.id)
                })
                .map((card, ind) => {
                    const {
                        id: currCardId,
                        processId: currCardProcessId
                    } = card || {}

                    return <LotContainer
                        lotId={currCardId}
                        binId={stationID}
                        enableFlagSelector={false}
                        key={currCardId}
                        onClick={() => {
                            openEditor(currCardId, currCardProcessId, location.id)
                        }}
                        containerStyle={{
                            marginBottom: "0.5rem",
                        }}
                    />
                })}
                </styled.ContentContainer>
        </styled.LotsContainer>
    )
}

export default LotsPage
