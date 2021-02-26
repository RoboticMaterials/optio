import React, { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// import components
import BounceButton from "../../../../basic/bounce_button/bounce_button";
import BackButton from '../../../../basic/back_button/back_button'
import Button from '../../../../basic/button/button'

// Import hooks
import useWindowSize from '../../../../../hooks/useWindowSize'

// import external funcations
import { ThemeContext } from "styled-components";
import { withRouter } from "react-router-dom";
import { getCards } from "../../../../../redux/actions/card_actions";


// import constants
import { PAGES } from "../../../../../constants/dashboard_contants";

import * as style from "./dashboards_header.style";

const widthBreakPoint = 1000;

const DashboardsHeader = (props) => {

    const {
        children,
        showTitle,
        showBackButton,
        showEditButton,
        showSaveButton,
        showSidebar,
        setEditingDashboard,
        page,

        saveDisabled,
        onBack,
        onDelete
    } = props

    const themeContext = useContext(ThemeContext);

    // extract url params
    const { stationID, dashboardID, editing } = props.match.params
    const dispatch = useDispatch()
    const onGetCards = () => dispatch(getCards())

    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)

    const locations = {
        ...positions,
        ...stations
    }

    const location = locations[stationID]

    const [slice, setSlice] = useState(null)
    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;


    // goes to main dashboards page
    const goToMainPage = () => {
        props.history.push(`/locations/${stationID}/dashboards`)
    }

    /**
     * Renders Lots that are are the station
     */
    const renderLotsTitle = useMemo(() => {

        //  If there is a location then see if it has lots. There wouldnt be a location because its a Mir dashboard
        if (location === undefined) return

        let hasLot = false

        for (let i = 0; i < Object.values(cards).length; i++) {
            if (!!Object.values(cards)[i].bins[location._id]) {
                hasLot = true
                break
            }
        }

        if (!!hasLot) {
            return (
                <style.RowContainer windowWidth={windowWidth}>
                    <style.LotsTitle>Lots:</style.LotsTitle>
                    {Object.values(cards).map((card, ind) =>
                        <>
                            {!!card.bins[location._id] &&

                                <style.LotItem>{card.name + ' (' + card.bins[location._id].count + ')'}</style.LotItem>
                            }
                        </>

                    )}
                </style.RowContainer>
            )
        }

        else {
            return (
                <style.RowContainer>
                    <style.LotsTitle>No Lots</style.LotsTitle>
                </style.RowContainer>
            )
        }
    }, [cards])

    return (
        <style.ColumnContainer>

            {renderLotsTitle}

            <style.Header>

                {showBackButton &&
                    <BackButton style={{ order: '1' }} containerStyle={{ marginTop: '1.8rem' }}
                        onClick={onBack}
                    />
                }

                {showTitle &&
                    <style.Title style={{ order: '2' }}>{page}</style.Title>
                }

                {showEditButton && !mobileMode &&
                    <Button style={{ order: '3', marginTop: '1.8rem' }}
                        onClick={setEditingDashboard}
                    >
                        Edit
  				</Button>
                }

                {showSaveButton &&
                    <>
                        <Button style={{ order: '3', marginTop: '1.8rem' }}
                            type="submit"
                            disabled={saveDisabled}
                        >
                            Save
  				</Button>

                        {/* Comment out for now since locations only have one dashboard, so you should not be able to delete the only dashboard */}
                        {/* <Button
                          schema={'delete'}
                          style={{ order: '4', marginTop: '1.8rem', marginLeft: '2rem' }}
                          onClick={onDelete}
                      >
                          Delete
                      </Button> */}
                    </>
                }

                {children}
            </style.Header>
        </style.ColumnContainer>

    )
}

export default withRouter(DashboardsHeader)
