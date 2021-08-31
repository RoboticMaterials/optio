import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'


// Import Styles
import * as styled from './dashboard_lot_buttons.style'
import { theme } from "../../../../../../../theme";

// Import Components
import DashboardButton from '../../../dashboard_buttons/dashboard_button/dashboard_button'
import DashboardSplitButton from '../../../dashboard_buttons/dashboard_split_button/dashboard_split_button'

// Import Constants
import { DEVICE_CONSTANTS } from '../../../../../../../constants/device_constants'

// Renders that buttons at the footer of the dashboard screen
// IE:
// Move
// Scrap
// Rework
const DashboardLotButtons = (props) => {

  const deviceEnabled = useSelector(state => state.settingsReducer.settings.deviceEnabled)

    const {
        handleMove,
        handleCancel,
        handleScrap,
        isDeviceRoute,
        isFinish,
        handleFinish,
        disabled
    } = props

    const renderMoveButton = () => {
        const iconClassName = 'fas fa-play'
        const color = '#90eaa8'
        const textColor = '#1c933c'
        const iconColor = theme.main.bg.octonary

        const error = null
        const buttonId = ''
        if (isDeviceRoute && deviceEnabled ) {
            return (
                <DashboardSplitButton
                    color={color}
                    containerStyle={{ background: color }}
                    titleStyle={{ color: textColor }}
                    iconColor={iconColor}

                    title={'Move'}
                    iconClassName={iconClassName}
                    clickable={true}
                    onClick={(props) => {
                        handleMove(props)
                    }}
                    hoverable={false}
                    // taskID={taskID}
                    // disabled={disabled}
                    // containerCss={style.ButtonContainerCss}
                    error={error}
                />
            )
        }
        else {
            return (
                <DashboardButton
                    color={color}
                    containerStyle={{ background: color }}
                    titleStyle={{ color: textColor }}
                    iconColor={iconColor}

                    title={'Move'}
                    iconColor={"black"}
                    iconClassName={iconClassName}
                    onClick={() => handleMove(DEVICE_CONSTANTS.HUMAN)}

                    hoverable={false}
                    // taskID={taskID}
                    disabled={false}
                    // containerCss={style.ButtonContainerCss}
                    error={error}
                />
            )
        }
    }

    const renderFinishButton = () => {
        const iconClassName = "fas fa-flag-checkered"
        const color = !!disabled ? '#dedfe3': '#90eaa8'
        const textColor = '#1c933c'

        return (
            <DashboardButton
                title={'Finish'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={handleFinish}
                containerStyle={{ background: color }}
                hoverable={false}
                color={color}
                titleStyle={{ color: textColor }}
                disabled = {disabled}
            />
        )
    }

    const renderCancelButton = () => {
        const iconClassName = "fas fa-times"


        const color = '#ff9898'
        const textColor = '#ff1818'
        return (
            <DashboardButton
                title={'Cancel'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={handleCancel}
                containerStyle={{ background: color }}
                hoverable={false}
                color={color}
                titleStyle={{ color: textColor }}
            />
        )
    }


    return (
        <styled.ButtonContainer>
            {isFinish ?
                renderFinishButton()
                :
                renderMoveButton()
            }
            {renderCancelButton()}
        </styled.ButtonContainer>
    )
}

export default DashboardLotButtons
