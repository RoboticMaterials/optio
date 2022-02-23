import React, { useState, useEffect, useMemo, useContext, useRef} from 'react';
import { useParams, useHistory } from 'react-router-dom'

// functions external
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components internal
import BackButton from '../../../../basic/back_button/back_button';
import Button from '../../../../basic/button/button';
import ReactTooltip from "react-tooltip";

// Import Components
import DashboardOperationsMenu from '../dashboard_operations_menu/dashboard_operations_menu'
import DashboardButton from '../dashboard_buttons/dashboard_button/dashboard_button'

import uuid from 'uuid'



// hooks internal
import useWindowSize from '../../../../../hooks/useWindowSize';
import useOnClickOutside from '../../../../../hooks/useOnClickOutside'

// utils
import { getBinQuantity, getIsCardAtBin } from "../../../../../methods/utils/lot_utils";
import { getNodeIncoming, getNodeOutgoing, isNodeStartWarehouse } from '../../../../../methods/utils/processes_utils';

// styles
import * as styled from './dashboards_header.style';
import { ThemeContext } from 'styled-components'

import { useTranslation } from 'react-i18next';


const widthBreakPoint = 1000;
const phoneViewBreakPoint = 500;

const DashboardsHeader = (props) => {

    const { t, i18n } = useTranslation();

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

    const theme = useContext(ThemeContext);
    const history = useHistory()
    const processes = useSelector(state => state.processesReducer.processes);
    const stations = useSelector(state => state.stationsReducer.stations);
    const routes = useSelector(state => state.tasksReducer.tasks);
    const stationBasedLots = useSelector(state => state.settingsReducer.settings.stationBasedLots)

    const [toolTipId,] = useState(`tooltip-${uuid.v4()}`)
    const [showOperationsMenu, setShowOperationsMenu] = useState(false)

    const [pullButtons, setPullButtons] = useState([])

    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;
    const phoneView = windowWidth < phoneViewBreakPoint;

    const name = stations[currentDashboard.station]?.name + ' Dashboard'

    const menuRef = useRef() // ref for useOnClickOutside
    useOnClickOutside(menuRef, () => { setShowOperationsMenu(false) }) // calls onClickOutside when click outside of element

    useEffect(() => {

        let tempPullButtons = [];
        if (stations[currentDashboard.station]?.type === 'warehouse') return []
        Object.values(processes).forEach(process => {

            const processRoutes = process.routes.map(routeId => routes[routeId]);
            const incomingRoutes = getNodeIncoming(currentDashboard.station, processRoutes)
                .filter(route => !isNodeStartWarehouse(route.load, processRoutes, stations));
            const outgoingRoutes = getNodeOutgoing(currentDashboard.station, processRoutes);


            if (incomingRoutes.length === 0 && outgoingRoutes.length > 0) {
                tempPullButtons.push({
                    type: 'kickoff',
                    processID: process._id
                });
            } else {

                incomingRoutes
                    .filter(route => stations[route.load]?.type === 'warehouse')
                    .forEach(route => {
                        if (getNodeIncoming(route.load, processRoutes).length > 0) { // Cannot pull from start warehouses, must merge them into another lot
                            tempPullButtons.push({
                                type: 'warehouse',
                                warehouseID: route.load
                            })
                        }
                    })


            }

        });

        setPullButtons(tempPullButtons)

    }, [processes, routes, stations, currentDashboard.station])

    const renderPullButtons = useMemo(() => {

        return pullButtons.map(pullBtn => {

            const btnLabel = pullBtn.type === 'kickoff' ? `Kick Off ${processes[pullBtn.processID]?.name}` : `${stations[pullBtn.warehouseID]?.name}`

            const schema = pullBtn.type === 'kickoff' ? theme.schema.kick_off : theme.schema.warehouse
            const iconClassName = schema?.iconName
            const iconColor = schema?.solid


            return (
                <DashboardButton
                    title={btnLabel}
                    iconColor={"black"}
                    key={uuid.v4()}
                    iconClassName={iconClassName}
                    onClick={() => {
                        const { type, ...meta }  = pullBtn;
                        handleOperationSelected({operation: type, ...meta})}
                    }
                    containerStyle={{}}
                    hoverable={true}
                    color={iconColor}
                    svgColor={theme.bg.secondary}
                />
            )

        })



    }, [pullButtons])

    const renderStationBasedLotsButton = () => {

    }

    return (
        <styled.ColumnContainer>

            <styled.Header>

                {!phoneView ?
                  <>
                    {pullButtons.length > 0 &&
                        <Button
                            onClick={() => {
                                setShowOperationsMenu(true)
                            }}
                            disabled={showOperationsMenu}
                            style={{ height: '3rem', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2)', width: '6rem', padding: '0rem'}}
                        >
                            Pull
                        </Button>
                    }

                    <Button
                        schema="delete"
                        onClick={() => {
                            handleOperationSelected({operation: 'report'})
                            setShowOperationsMenu(false)
                        }}
                        disabled={showOperationsMenu}
                        style={{
                            height: '3rem',
                            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2)' ,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '.5rem',
                            width: '6rem',
                            padding:'0rem'

                        }}
                    >
                        {t("report")}
                        {/* <styled.ReportIcon className={'fas fa-exclamation-triangle'} /> */}
                    </Button>
                    {!!stationBasedLots && !mobileMode && !history.location.pathname.includes('lots') &&
                      <Button
                          schema="locations"
                          onClick={() => {
                              handleOperationSelected({operation: 'fieldSelect'})
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
                              right: '7.5rem',
                              width: '4rem',
                              padding:'0rem'

                          }}
                      >
                      <i class="fas fa-list" style = {{color: '#FFFFFF'}}></i>
                      </Button>
                    }
                  </>
                  :
                  <>
                    <Button
                        schema="dashboards"
                        onClick={() => {
                            setShowOperationsMenu(true)
                        }}
                        disabled={showOperationsMenu}
                        style={{ height: '3rem', width: '3rem', boxShadow: '0px 1px 3px 1px rgba(0,0,0,0.2)' }}
                    >
                      <i class="fas fa-arrow-right" style = {{color: '#FFFFFF'}}></i>
                    </Button>
                    <Button
                        schema="delete"
                        onClick={() => {
                            handleOperationSelected({operation: 'report'})
                            setShowOperationsMenu(false)
                        }}
                        disabled={showOperationsMenu}
                        style={{
                            height: '3rem',
                            width: '3rem',
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
                                <styled.LockContainer>{t("Dashboard.lockmsg","Click to lock the dashboard. This will hide the \"X\" button on the dashsboard screen when in mobile mode")}</styled.LockContainer>
                                :
                                <styled.LockContainer>{t("Dashboard.unlockmsg","Click to unlock the dashboard. This will show the \"X\" button on the dashsboard screen when in mobile mode")}</styled.LockContainer>
                            }

                        </ReactTooltip>
                    </styled.LockIcon>
                }



                {showOperationsMenu &&
                    <styled.MenuContainer ref={menuRef}>
                    {renderPullButtons}
                    </styled.MenuContainer>
                }

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
