import React, { useState, useMemo, useEffect } from 'react';

// functions external
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components internal
import BackButton from '../../../../basic/back_button/back_button';
import Button from '../../../../basic/button/button';
import ReactTooltip from "react-tooltip";

// Import Components
import DashboardOperationsMenu from '../dashboard_operations_menu/dashboard_operations_menu'

import uuid from 'uuid'

// hooks internal
import useWindowSize from '../../../../../hooks/useWindowSize';

// utils
import { getBinQuantity, getIsCardAtBin } from "../../../../../methods/utils/lot_utils";

// styles
import * as styled from './dashboards_header.style';

const widthBreakPoint = 1000;

const DashboardsHeader = (props) => {

    const {
        showBackButton,
        showSaveButton,
        currentDashboard,
        onBack,
        onLockClick,
        locked,
        onSave,
        handleOperationSelected,
        handleTaskAlert,
    } = props

    const stations = useSelector(state => state.stationsReducer.stations)

    const [toolTipId,] = useState(`tooltip-${uuid.v4()}`)
    const [showOperationsMenu, setShowOperationsMenu] = useState(false)

    const [color, setColor] = useState('#5294ff')

    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;

    const name = currentDashboard.name.length > 0 ? currentDashboard.name : stations[currentDashboard.station].name

    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <styled.ColumnContainer>

            <styled.Header>
                {showBackButton &&
                    <styled.LockIcon
                        styled={{ marginRight: locked ? '1rem' : '.68rem', }}
                        className={!locked ? 'fas fa-lock-open' : 'fas fa-lock'}
                        onClick={onLockClick}
                        locked={locked}
                        data-tip
                        data-for={toolTipId}
                    >
                        <ReactTooltip id={toolTipId}>
                            <styled.LockContainer>Click to toggle the lock. When the lock is enabled the "X" button on the dashsboards screen is hidden</styled.LockContainer>
                        </ReactTooltip>
                    </styled.LockIcon>
                }

                {showBackButton &&
                    <BackButton styled={{ order: '1' }} containerStyle={{}}
                        onClick={onBack}
                    />
                }

                <Button
                    schema="dashboards"
                    onClick={() => {
                        setShowOperationsMenu(true)
                    }}
                    disabled={showOperationsMenu}
                    style={{height: '3rem'}}
                >
                    Operations
                </Button>
                <styled.Title>{name}</styled.Title>
                <styled.PaceContainer
                    color={color}
                >
                    <styled.PaceText color={color}>89/100</styled.PaceText>
                </styled.PaceContainer>

                {showOperationsMenu &&
                    <DashboardOperationsMenu
                        handleCloseMenu={() => { setShowOperationsMenu(false) }}
                        handleOperationSelected={(op) => {
                            handleOperationSelected(op)
                            setShowOperationsMenu(false)
                        }}
                        handleTaskAlert={handleTaskAlert}
                    />
                }

                {/* {showEditButton && !mobileMode &&
                    <Button styled={{ order: '3', position: 'absolute', right: '0', marginRight: '0' }}
                        onClick={setEditingDashboard}
                        secondary
                    >
                        Edit Dashboard
                </Button>
                } */}

                {showSaveButton &&
                    <>
                        <Button styled={{ order: '3', minWidth: '10rem' }}
                            type='submit'
                            // disabled={saveDisabled}
                            schema="dashboards"
                            onClick={onSave}
                        >
                            Save
                        </Button>

                    </>
                }

            </styled.Header>
        </styled.ColumnContainer>

    )
}

export default withRouter(DashboardsHeader)
