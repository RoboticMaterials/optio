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
        setShowSidebar,
        setEditingDashboard,
        page,

        saveDisabled,
        onBack,
        onDelete
    } = props

    const themeContext = useContext(ThemeContext);

    // extract url params
    const { stationID, dashboardID, editing } = props.match.params

    const cards = useSelector(state => state.cardsReducer.cards)
    const locations = useSelector(state => state.locationsReducer.locations)
    const location = locations[stationID]

    const [locationName, setLocationName] = useState("")

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;


    useEffect(() => {
        const location = locations[stationID]
        setLocationName(location.name)
    }, [stationID, locations])

    // goes to main dashboards page
    const goToMainPage = () => {
        props.history.push(`/locations/${stationID}/dashboards`)
    }

    /**
     * Renders Lots that are are the station
     */
    const renderLotsTitile = useMemo(() => {

        let hasLot = false

        for (let i = 0; i < Object.values(cards).length; i++) {
            if (!!Object.values(cards)[i].bins[location._id]) {
                hasLot = true
                break
            }
        }

        if (!!hasLot) {
            return (
                <style.RowContainer>
                    <style.LotsTitle>Lots:</style.LotsTitle>
                    {Object.values(cards).map((card, ind) =>
                        <>
                            {!!card.bins[location._id] &&
                                <style.LotItem>{card.bins[location._id].count}</style.LotItem>
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

            {renderLotsTitile}

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
