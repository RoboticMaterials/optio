import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_operations_menu.styled'

// Import Basic Components
import Button from '../../../../basic/button/button'

// Import Hooks
import useOnClickOutside from '../../../../../hooks/useOnClickOutside'

const DashboardOperationsMenu = (props) => {

    const {
        handleCloseMenu,
        handleOperationSelected,
    } = props

    const history = useHistory()
    const params = useParams()

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}

    const availableKickOffProcesses = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardID] })
    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardID] })

    const ref = useRef() // ref for useOnClickOutside
    useOnClickOutside(ref, () => {handleCloseMenu()}) // calls onClickOutside when click outside of element


    const renderButtons = () => {
        return (
            <>
                <Button onClick={() => handleOperationSelected('report')}>Report</Button>
                {availableKickOffProcesses &&
                    <Button onClick={() => handleOperationSelected('kickOff')}>Kick Off</Button>
                }
                {availableFinishProcesses &&
                    <Button onClick={() => handleOperationSelected('finish')}>Finish</Button>
                }
            </>

        )
    }


    return (
        <styled.MenuContainer ref={ref}>
            {renderButtons()}
        </styled.MenuContainer>
    )

}

export default DashboardOperationsMenu

