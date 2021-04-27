import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'


// Import Styles
import * as styled from './dashboard_lot_buttons.style'

// Import Components
import DashboardButton from '../../../dashboard_buttons/dashboard_button/dashboard_button'

import { theme } from "../../../../../../../theme";



// Renders that buttons at the footer of the dashboard screen
// IE:
// Move
// Scrap
// Rework
const DashboardLotButtons = (props) => {

    const {
        handleMove,
        handleCancel,
        handleScrap,
    } = props

    const renderMoveButton = () => {
        const iconClassName = 'fas fa-play'
        const color = '#90eaa8'
        const textColor = '#1c933c'

        const error = null
        const taskID = ''
        const buttonId = ''

        return (
            <DashboardButton
                color={color}
                containerStyle={{ background: color }}
                titleStyle={{ color: textColor }}
                iconColor={textColor}

                title={'Move'}
                iconColor={"black"}
                iconClassName={iconClassName}
                key={`${taskID}-${buttonId}`}
                onClick={() => handleMove('human')}

                hoverable={false}
                taskID={taskID}
                disabled={false}
                // containerCss={style.ButtonContainerCss}
                error={error}
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
            {renderMoveButton()}
            {renderCancelButton()}
        </styled.ButtonContainer>
    )
}

export default DashboardLotButtons