import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import Styles
import * as styled from './dashboard_lot_buttons.style'
import { theme } from "../../../../../../../theme";

// Import Components
import DashboardButton from '../../../dashboard_buttons/dashboard_button/dashboard_button'
import DashboardSplitButton from '../../../dashboard_buttons/dashboard_split_button/dashboard_split_button'
import NumberInput from '../../../../../../basic/number_input/number_input';

// Renders that buttons at the footer of the dashboard screen
// IE:
// Move
// Scrap
// Rework
const DashboardLotButtons = (props) => {

  const deviceEnabled = useSelector(state => state.settingsReducer.settings.deviceEnabled)

    const {
        handleMoveClicked,
        handleCancel,
        isFinish,
        quantity,
        setQuantity,
        maxQuantity,
        minQuantity,
        handleFinish,
        onInputChange,
        disabled,
        onKeyPress,
        onBlur,
    } = props

    const renderMoveButton = () => {
        const iconClassName = 'fas fa-play'
        const color = '#90eaa8'
        const textColor = '#1c933c'
        const iconColor = theme.main.bg.octonary

        const error = null

        return (
            <>

            <DashboardButton
                color={color}
                containerStyle={{ background: color }}
                titleStyle={{ color: textColor }}
                iconColor={iconColor}

                title={'Move'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={handleMoveClicked}

                hoverable={false}
                // taskID={taskID}
                disabled={disabled}
                // containerCss={style.ButtonContainerCss}
                error={error}
            />
            </>
        )

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
                onClick={handleMoveClicked}
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
          <styled.QuantityText>The maximum quantity is {maxQuantity}</styled.QuantityText>

            <NumberInput
                minValue={minQuantity}
                maxValue={maxQuantity}
                plusDisabled = {quantity===maxQuantity? true:false}
                minusDisabled = {quantity===1? true:false}
                value={!!Number.isInteger(parseInt(quantity)) ? quantity: null}
                onMinusClick={() => setQuantity(Number.isInteger(parseInt(quantity)) ? quantity - 1 : 0)}
                onPlusClick={() => {
                  setQuantity(!!Number.isInteger(parseInt(quantity)) ? quantity + 1 : 1)
                }}
                containerStyle={{marginBottom: '1rem', marginTop: '1rem'}}
                onInputChange = {onInputChange}
                onBlur = {onBlur}
            />
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
