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
import ClipLoader from 'react-spinners/ClipLoader'

import { useTranslation } from 'react-i18next';

// Renders that buttons at the footer of the dashboard screen
// IE:
// Move
// Scrap
// Rework
const DashboardLotButtons = (props) => {

  const { t, i18n } = useTranslation();

  const deviceEnabled = false
  const [startClicked, setStartClicked] = useState(false)

    const {
        hasStarted,
        handleStartClicked,
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
        warehouseDisabled,
        onKeyPress,
        onBlur,
        onFractionClick,
        selectedFraction,
        fractionMove
    } = props

    const renderStartButton = () => {
      const iconClassName = 'fas fa-play'
      const color = '#90C7EA'
      const textColor = '#545454'
      const iconColor = theme.main.bg.octonary

      const error = null

      return (
          <>
          {startClicked &&
            <styled.LoopIndicator>
                <ClipLoader size={20} speedMultiplier={0.1}/>
            </styled.LoopIndicator>
          }

          <DashboardButton
              color={startClicked? '#b8b9bf'  : color}
              containerStyle={{ background: startClicked? '#b8b9bf' : color }}
              titleStyle={{ color: textColor }}
              iconColor={iconColor}

              title={startClicked ? t('Starting Timer...') : t('Start')}
              iconColor={"black"}
              iconClassName={iconClassName}
              onClick={() => {
                setStartClicked(true)
                handleStartClicked()
              }}

              hoverable={false}
              // taskID={taskID}
              disabled={startClicked ? true : false}
              // containerCss={style.ButtonContainerCss}
              error={error}
          />
          </>
      )

  }

    const [fractionClicked, setFractionClicked] = useState(true)

    const renderMoveButton = () => {
        const iconClassName = 'fas fa-play'
        const color = disabled ? '#dedfe3' : '#90eaa8'
        const textColor = disabled ? '#545454' : '#545454'
        const iconColor = theme.main.bg.octonary

        const error = null

        return (
            <>

            <DashboardButton
                color={color}
                containerStyle={{ background: color }}
                titleStyle={{ color: textColor }}
                iconColor={iconColor}

                title={t('Move Quantity')}
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
        const color = disabled || warehouseDisabled ? '#dedfe3': '#90eaa8'
        const textColor = disabled || warehouseDisabled ? '#999' : '#15702e'

        return (
            <DashboardButton
                title={t('Finish Quantity')}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={handleMoveClicked}
                containerStyle={{ background: color }}
                hoverable={false}
                color={color}
                titleStyle={{ color: textColor }}
                disabled = {disabled || warehouseDisabled}
            />
        )
    }

    const renderCancelButton = () => {
        const iconClassName = "fas fa-times"

        const color = '#ff9898'
        const textColor = '#8f0000'
        return (
            <DashboardButton
                title={t('Go back')}
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
              <styled.ColumnContainer>
                <styled.RowContainer>
                  <Button
                      style={{minWidth: '6rem', height: '3rem', marginBottom: '1rem'}}
                      secondary = {!fractionClicked || selectedFraction !== '1/4'}
                      onClick = {()=> {
                        onFractionClick('1/4')
                        setFractionClicked(true)
                    }}
                      label={'25%' }
                      type="button"
                  />
                  <Button
                      style={{minWidth: '6rem', height: '3rem', marginBottom: '1rem'}}
                      secondary = {!fractionClicked || selectedFraction !== '1/2'}
                      onClick = {()=> {
                        onFractionClick('1/2')
                        setFractionClicked(true)
                    }}
                      label={'50%'}
                      type="button"
                  />

                  <Button
                      style={{minWidth: '6rem', height: '3rem', marginBottom: '1rem'}}
                      secondary = {!fractionClicked || selectedFraction !== '3/4'}
                      onClick = {()=> {
                        onFractionClick('3/4')
                        setFractionClicked(true)
                    }}
                      label={'75%'}
                      type="button"
                  />
                  <Button
                      style={{minWidth: '6rem', height: '3rem', marginBottom: '1rem'}}
                      onClick = {()=> {
                        onFractionClick('1')
                        setFractionClicked(true)
                    }}
                      secondary = {!fractionClicked || selectedFraction !== '1'}
                      label={'100%'}
                      type="button"
                  />
                </styled.RowContainer>
                <NumberInput
                    onFocus={() => {
                      onInputChange(null)
                      setFractionClicked(false)
                    }}
                    minValue={minQuantity}
                    maxValue={maxQuantity}
                    plusDisabled = {quantity===maxQuantity? true:false}
                    minusDisabled = {quantity===1? true:false}
                    value={!!Number.isInteger(parseInt(quantity)) ? quantity : ''}
                    onMinusClick={() => {
                      setQuantity(Number.isInteger(parseInt(quantity)) ? quantity - 1 : 0)
                      setFractionClicked(false)
                    }}
                    onPlusClick={() => {
                      setQuantity(!!Number.isInteger(parseInt(quantity)) ? quantity + 1 : 1)
                      setFractionClicked(false)
                    }}
                    containerStyle={{marginBottom: '1rem', marginTop: '0rem', alignSelf: 'center'}}
                    onInputChange = {onInputChange}
                    onBlur = {onBlur}
                />
              </styled.ColumnContainer>
            }
            {hasStarted ?
              isFinish ?
                renderFinishButton()
                :
                renderMoveButton()
              :
              renderStartButton()
            }
            {renderCancelButton()}
        </styled.ButtonContainer>
    )
}

export default DashboardLotButtons
