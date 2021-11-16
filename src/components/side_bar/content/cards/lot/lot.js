import React, { useContext, useEffect, useState } from "react"

// actions
import { putCardAttributes } from "../../../../../redux/actions/card_actions"

// functions external
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";

// components external
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

// constants
import { FIELD_DATA_TYPES, FLAG_OPTIONS } from "../../../../../constants/lot_contants"

// utils
import { immutableDelete, immutableReplace, isArray } from "../../../../../methods/utils/array_utils"
import { formatLotNumber } from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "./lot.style"
import LotDateRangeRow from "./lot_date_range_row/lot_date_range_row";
import LotSimpleRow from "./lot_simple_row/lot_simple_row";
import LotDateRow from "./lot_date_row/lot_date_row";
import LotFlags from './lot_flags/lot_flags'

const Lot = (props) => {
    const {
        name,
        glow,
        isFocused,
        highlight,
        stationName,
        totalQuantity,
        lotNumber,
        leadTime,
        templateValues,
        id,
        enableFlagSelector,
        onClick,
        count,
        loopCount,
        containerStyle,
        selectable,
        isSelected,
        flags,
        processName,
        showCustomFields,
        lotDisabled,
        isDashboard,
        onDeleteDisabledLot,
        onRightClickDeleteLot,
        dragging
    } = props

    const themeContext = useContext(ThemeContext)
    // actions
    const dispatch = useDispatch()
    const dispatchPutCardAttributes = async (card, ID) => await dispatch(putCardAttributes(card, ID))
    const draggingLotId = useSelector(state => { return state.cardPageReducer.draggingLotId }) || null
    const lotTemplates = useSelector(state => state.lotTemplatesReducer.lotTemplates)
    const lot = useSelector(state => state.cardsReducer.cards)[id] || {}


    // component state
    const [formattedLotNumber, setFormattedLotNumber] = useState(formatLotNumber(lotNumber))
    const [popupOpen, setPopupOpen] = useState(false)
    const [showRightClickMenu, setShowRightClickMenu] = useState(false)
    const [cardHover, setCardHover] = useState(false)
    useEffect(() => {
        setFormattedLotNumber(formatLotNumber(lotNumber))
    }, [lotNumber])


    useEffect(() => {
      if(!!cardHover) document.addEventListener('contextmenu', handleLotRightClick)
      else document.removeEventListener('contextmenu', handleLotRightClick)

      return () => {
          document.removeEventListener('contextmenu', handleLotRightClick)
      }
    }, [cardHover])

    const handleLotRightClick = (e) => {
      e.preventDefault()
      setShowRightClickMenu(!showRightClickMenu)
    }

        const renderTemplateValues = () => {
        return templateValues
            .filter((currItem) => {
                const {
                    dataType,
                } = currItem

                return Object.values(FIELD_DATA_TYPES).includes(dataType)
            })
            .map((currItem, currIndex, arr) => {
                const {
                    dataType,
                    fieldName,
                    value
                } = currItem
                const key = `${fieldName}+dataType`

                const isLast = currIndex === arr.length - 1

                if(!!value){
                switch (dataType) {
                    case FIELD_DATA_TYPES.STRING: {
                        return (
                            <LotSimpleRow
                                key={key}
                                label={fieldName}
                                value={value}
                                isLast={isLast}
                            />
                        )
                    }
                    case FIELD_DATA_TYPES.EMAIL: {
                        return (
                            <LotSimpleRow
                                key={key}
                                label={fieldName}
                                value={value}
                                isLast={isLast}
                            />
                        )
                    }
                    case FIELD_DATA_TYPES.DATE: {
                        return (
                            <LotDateRow
                                key={key}
                                label={fieldName}
                                isLast={isLast}
                                date={value}
                            />

                        )
                    }
                    case FIELD_DATA_TYPES.DATE_RANGE: {
                        return (
                            <LotDateRangeRow
                                key={key}
                                label={fieldName}
                                isLast={isLast}
                                dateRange={value}
                            />
                        )
                    }
                    case FIELD_DATA_TYPES.URL: {
                        return (
                            <LotSimpleRow
                                key={key}
                                label={fieldName}
                                value={value}
                                isLast={isLast}
                            />
                        )
                    }
                    case FIELD_DATA_TYPES.INTEGER: {
                        return (
                            <LotSimpleRow
                                key={key}
                                label={fieldName}
                                isLast={isLast}
                                value={value}
                            />
                        )
                    }
                }
              }
            })
    }

    const renderFlags = () => {
        return (
          <styled.PartsRow>
              <LotFlags
                  flags={flags}
              />
            {!!showRightClickMenu && !isDashboard &&
              <styled.ColumnContainer disabled = {lotDisabled}>
                <i
                 className = {'fas fa-chevron-up'}
                 style = {{marginBottom: '.3rem', fontSize: '1.2rem', marginLeft: '0.4rem'}}
                 onClick = {() => {
                   setShowRightClickMenu(false)

                 }}
                 />
                <styled.PartContainer
                  style = {{paddingBottom: '0.5rem'}}
                  onClick = {lotDisabled ? onDeleteDisabledLot: onRightClickDeleteLot}
                >
                Delete Lot
                </styled.PartContainer>
              </styled.ColumnContainer>
            }

            </styled.PartsRow>
        )
    }

    return (
        <styled.Container
            disabled = {lotDisabled}
            dragging = {dragging}
            isDashboard = {isDashboard}
            glow={glow}
            draggable = {!isDashboard ? 'true' : 'false'}
            isFocused={isFocused}
            highlight={highlight}
            selectable={selectable}
            isSelected={isSelected}
            onClick={onClick}
            style={{
              ...containerStyle
            }}
            onMouseEnter = {()=>setCardHover(true)}
            onMouseLeave = {() =>setCardHover(false)}
        >

            <styled.HeaderBar>
                {enableFlagSelector ?
                    <Popup
                        contentStyle={{
                            background: themeContext.bg.primary,
                            width: "fit-content",
                        }}
                        arrowStyle={{
                            color: themeContext.bg.primary,
                            transform: 'translateX(0rem)'
                        }}

                        trigger={open => (
                            <div style = {{paddingTop: showRightClickMenu? '0rem' : '0.4rem'}}>
                                {renderFlags()}
                            </div>
                        )}
                        open={popupOpen}
                        position="left center"
                        closeOnDocumentClick
                    >
                        <styled.FlagsContainer>
                            {Object.values(FLAG_OPTIONS).map((currOption, currIndex) => {

                                const {
                                    color: currColor,
                                    id: currColorId
                                } = currOption

                                const isSelected = flags.includes(currColorId)
                                const selectedIndex = flags.indexOf(currColorId)

                                return (
                                    <styled.FlagButton
                                        color={currColor}
                                        selected={isSelected}
                                        className={isSelected ? "fas fa-check-square" : "fas fa-square"}
                                        key={currColorId}
                                        type={"button"}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            if ((isArray(flags) && !isSelected)) {
                                                dispatchPutCardAttributes({
                                                    flags: [...flags, currColorId]
                                                }, id)
                                            }
                                            else {
                                                dispatchPutCardAttributes({
                                                    flags: immutableDelete(flags, selectedIndex)
                                                }, id)
                                            }
                                        }}
                                    />
                                )
                            })}
                        </styled.FlagsContainer>
                    </Popup>
                    :
                    renderFlags()

                }

                {!!loopCount &&
                    <styled.LoopIndicator>
                        <styled.LoopIcon className="fas fa-redo-alt"/>
                        <styled.LoopCount>{loopCount}</styled.LoopCount>
                    </styled.LoopIndicator>
                }

                <styled.NameNumberContainer>
                    <styled.CardName>{name ? name : lotNumber}</styled.CardName>

                    {!!lotNumber &&
                        <styled.LotNumber>#{lotNumber}</styled.LotNumber>
                    }
                </styled.NameNumberContainer>


            </styled.HeaderBar>

            <styled.ContentContainer hasLeadTime={!!leadTime}>
                <LotSimpleRow
                    label= {lotTemplates[lot.lotTemplateId].name === 'Basic' ? 'Quantity' : lotTemplates[lot.lotTemplateId].displayNames.count}
                    value={`${count}/${totalQuantity}`}
                />

                {processName &&
                    <LotSimpleRow
                        label={"Process"}
                        value={processName}
                    />
                }

              {/* {stationName &&
                    <LotSimpleRow
                        label={"Station"}
                        value={stationName}
                    />
                } */}

                {showCustomFields && renderTemplateValues()}
            </styled.ContentContainer>

            {!!leadTime &&
                <styled.FooterContainer>
                    {leadTime}
                </styled.FooterContainer>
            }

        </styled.Container>
    )
}

// Specifies propTypes
Lot.propTypes = {
    isSelected: PropTypes.bool,
    selectable: PropTypes.bool,
    isFocused: PropTypes.bool,
    showCustomFields: PropTypes.bool,
    disabled: PropTypes.bool,
}

// Specifies the default values for props:
Lot.defaultProps = {
    isSelected: false,
    isFocused: false,
    selectable: false,
    flags: [],
    highlight: false,
    enableFlagSelector: true,
    templateValues: [],
    count: 0,
    glow: false,
    stationName: "",
    showCustomFields: true,
    disabled: false,
}

export default Lot
