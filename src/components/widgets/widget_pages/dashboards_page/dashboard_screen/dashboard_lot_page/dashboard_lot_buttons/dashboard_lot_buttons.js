import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import Styles
import * as styled from './dashboard_lot_buttons.style'
import { theme } from "../../../../../../../theme";

// Import Components
import DashboardButton from '../../../dashboard_buttons/dashboard_button/dashboard_button'
import DashboardSplitButton from '../../../dashboard_buttons/dashboard_split_button/dashboard_split_button'
import NumberInput from '../../../../../../basic/number_input/number_input';
import Button from '../../../../../../basic/button/button'

// Renders that buttons at the footer of the dashboard screen
// IE:
// Move
// Scrap
// Rework
const DashboardLotButtons = (props) => {

  const deviceEnabled = false


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
        onFractionClick,
        selectedFraction,
        fractionMove
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
        {!fractionMove ?
          <styled.QuantityText>The maximum quantity is {maxQuantity}</styled.QuantityText>
          :
          <styled.QuantityText>Select a fraction of the lot to move</styled.QuantityText>
        }
            {!fractionMove ?
              <NumberInput
                  onFocus={() => onInputChange(null)}
                  minValue={minQuantity}
                  maxValue={maxQuantity}
                  plusDisabled = {quantity===maxQuantity? true:false}
                  minusDisabled = {quantity===1? true:false}
                  value={!!Number.isInteger(parseInt(quantity)) ? quantity : ''}
                  onMinusClick={() => setQuantity(Number.isInteger(parseInt(quantity)) ? quantity - 1 : 0)}
                  onPlusClick={() => {
                    setQuantity(!!Number.isInteger(parseInt(quantity)) ? quantity + 1 : 1)
                  }}
                  containerStyle={{marginBottom: '1rem', marginTop: '1rem'}}
                  onInputChange = {onInputChange}
                  onBlur = {onBlur}
              />
              :
              <styled.RowContainer>
                <Button
                    style={{minWidth: '8rem', height: '4rem', marginBottom: '1rem'}}
                    secondary = {selectedFraction !== '1/4'}
                    onClick = {()=> onFractionClick('1/4')}
                    label={'1/4 (' + Math.ceil(maxQuantity/4) + ')'}
                    type="button"
                />
                <Button
                    style={{minWidth: '8rem', height: '4rem', marginBottom: '1rem'}}
                    secondary = {selectedFraction !== '1/2'}
                    onClick = {()=> onFractionClick('1/2')}
                    label={'1/2 (' + Math.ceil(maxQuantity/2) + ')'}
                    type="button"
                />
                <Button
                    style={{minWidth: '8rem', height: '4rem', marginBottom: '1rem'}}
                    secondary = {selectedFraction !== '3/4'}
                    onClick = {()=> onFractionClick('3/4')}
                    label={'3/4 (' + Math.ceil(3*maxQuantity/4) + ')'}
                    type="button"
                />
                <Button
                    style={{minWidth: '8rem', height: '4rem', marginBottom: '1rem'}}
                    onClick = {()=> onFractionClick('1')}
                    secondary = {selectedFraction !== '1'}
                    label={'1 (' + maxQuantity + ')'}
                    type="button"
                />
              </styled.RowContainer>
            }
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
