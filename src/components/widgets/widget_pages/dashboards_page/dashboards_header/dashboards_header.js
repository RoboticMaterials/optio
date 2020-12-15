import React, { useContext, useEffect, useState } from "react";

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

    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    // goes to main dashboards page
    const goToMainPage = () => {
        props.history.push(`/locations/${stationID}/dashboards`)
    }

    return (
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
    )
}

export default withRouter(DashboardsHeader)
