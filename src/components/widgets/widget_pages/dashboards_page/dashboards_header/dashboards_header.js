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
const phoneViewBreakPoint = 500;

const DashboardsHeader = (props) => {

    const {
        showBackButton,
        showSaveButton,
        currentDashboard,
        onBack,
        handleToggleLock,
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
    const phoneView = windowWidth < phoneViewBreakPoint;

    const name = stations[currentDashboard.station]?.name

    useEffect(() => {
        return () => {

        }
    }, [])

    return (
        <styled.ColumnContainer>

            <styled.Header>

                { /*  {showBackButton &&
                    <BackButton styled={{ order: '1' }} containerStyle={{}}
                        onClick={onBack}
                    />
                }*/}
                {!phoneView ?
                  <>
                    <Button
                        schema="dashboards"
                        onClick={() => {
                            setShowOperationsMenu(true)
                        }}
                        disabled={showOperationsMenu}
                        style={{ height: '3rem', boxShadow: '0px 1px 3px 1px rgba(0,0,0,0.2)', width: '10rem'}}
                    >
                        Operations
                    </Button>
                    <Button
                        schema="delete"
                        onClick={() => {
                            handleOperationSelected('report')
                            setShowOperationsMenu(false)
                        }}
                        disabled={showOperationsMenu}
                        style={{
                            height: '3rem',
                            boxShadow: '0px 1px 3px 1px rgba(0,0,0,0.2)' ,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '1rem', width: '10rem'

                        }}
                    >
                        Report
                        {/* <styled.ReportIcon className={'fas fa-exclamation-triangle'} /> */}
                    </Button>
                  </>
                  :
                  <>
                    <Button
                        schema="dashboards"
                        onClick={() => {
                            setShowOperationsMenu(true)
                        }}
                        disabled={showOperationsMenu}
                        style={{ height: '3rem', boxShadow: '0px 1px 3px 1px rgba(0,0,0,0.2)' }}
                    >
                      <i class="fas fa-list" style = {{color: '#FFFFFF'}}></i>
                    </Button>
                    <Button
                        schema="delete"
                        onClick={() => {
                            handleOperationSelected('report')
                            setShowOperationsMenu(false)
                        }}
                        disabled={showOperationsMenu}
                        style={{
                            height: '3rem',
                            boxShadow: '0px 1px 3px 1px rgba(0,0,0,0.2)' ,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '1rem'

                        }}
                    >
                      <i class="fas fa-exclamation" style = {{color: '#FFFFFF'}}></i>
                    </Button>
                  </>
                }


                <styled.Title>{name}</styled.Title>
                {/* <styled.PaceContainer
                    color={color}
                >

                    <styled.PaceText color={color}>89/100</styled.PaceText>
                </styled.PaceContainer> */}

                {!mobileMode &&
                    <styled.LockIcon
                        className={!currentDashboard.locked ? 'fas fa-lock-open' : 'fas fa-lock'}
                        onClick={handleToggleLock}
                        locked={locked}
                        data-tip
                        data-for={toolTipId}
                    >
                        <ReactTooltip id={toolTipId}>
                            {!currentDashboard.locked ?
                                <styled.LockContainer>Click to lock the dashboard. This will hide the "X" button on the dashsboard screen when in mobile mode</styled.LockContainer>
                                :
                                <styled.LockContainer>Click to unlock the dashboard. This will show the "X" button on the dashsboard screen when in mobile mode</styled.LockContainer>
                            }

                        </ReactTooltip>
                    </styled.LockIcon>
                }



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
