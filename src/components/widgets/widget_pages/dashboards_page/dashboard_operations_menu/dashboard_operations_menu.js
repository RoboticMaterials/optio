import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_operations_menu.styled'
import { theme } from '../../../../../theme'

// Import Basic Components
import Button from '../../../../basic/button/button'

// Import Components
import DashboardButton from '../dashboard_buttons/dashboard_button/dashboard_button'

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
    useOnClickOutside(ref, () => { handleCloseMenu() }) // calls onClickOutside when click outside of element


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

    const renderReportButton = () => {

        const schema = theme.main.schema.report
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Reports'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('report')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderTaskQueueButton = () => {
        const schema = theme.main.schema.report
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Task Queue'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('taskQueue')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderKickOffButton = () => {
        const schema = theme.main.schema.kick_off
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Kick Off'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('kickOff')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderFinishButton = () => {
        const schema = theme.main.schema.finish
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Finish'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('finish')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }


    return (
        <styled.MenuContainer ref={ref}>
            {renderReportButton()}
            {renderTaskQueueButton()}
            {renderKickOffButton()}
            {renderFinishButton()}
        </styled.MenuContainer>
    )

}

export default DashboardOperationsMenu

