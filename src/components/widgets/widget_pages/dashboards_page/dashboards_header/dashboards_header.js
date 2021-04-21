import React, { useState, useMemo } from 'react';

// functions external
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components internal
import BackButton from '../../../../basic/back_button/back_button';
import Button from '../../../../basic/button/button';
import SimpleLot from "../dashboard_screen/simple_lot/simple_lot";
import ReactTooltip from "react-tooltip";

import uuid from 'uuid'

// hooks internal
import useWindowSize from '../../../../../hooks/useWindowSize';

// utils
import { getBinQuantity, getIsCardAtBin } from "../../../../../methods/utils/lot_utils";

// styles
import * as style from './dashboards_header.style';

const widthBreakPoint = 1000;

const DashboardsHeader = (props) => {

    const {
        showBackButton,
        showEditButton,
        showSaveButton,
        setEditingDashboard,
        currentDashboard,
        onBack,
        onLockClick,
        locked,
        onSave
    } = props

    const [toolTipId,] = useState(`tooltip-${uuid.v4()}`)
    const [editDashboard, setEditDashboard] = useState(false)

    console.log('QQQQ current dashboard', currentDashboard)
    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;

    const name = currentDashboard.name

    return (
        <style.ColumnContainer>

            <style.Header>
                {showBackButton &&
                    <style.LockIcon
                        style={{ marginRight: locked ? '1rem' : '.68rem', }}
                        className={!locked ? 'fas fa-lock-open' : 'fas fa-lock'}
                        onClick={onLockClick}
                        locked={locked}
                        data-tip
                        data-for={toolTipId}
                    >
                        <ReactTooltip id={toolTipId}>
                            <style.LockContainer>Click to toggle the lock. When the lock is enabled the "X" button on the dashsboards screen is hidden</style.LockContainer>
                        </ReactTooltip>
                    </style.LockIcon>
                }

                {showBackButton &&
                    <BackButton style={{ order: '1' }} containerStyle={{}}
                        onClick={onBack}
                    />
                }

                <style.Title style={{ order: '2' }}>{name}</style.Title>

                {/* {showEditButton && !mobileMode &&
                    <Button style={{ order: '3', position: 'absolute', right: '0', marginRight: '0' }}
                        onClick={setEditingDashboard}
                        secondary
                    >
                        Edit Dashboard
                </Button>
                } */}

                {showSaveButton &&
                    <>
                        <Button style={{ order: '3', minWidth: '10rem' }}
                            type='submit'
                            // disabled={saveDisabled}
                            schema="dashboards"
                            onClick={onSave}
                        >
                            Save
                    </Button>

                    </>
                }

            </style.Header>
        </style.ColumnContainer>

    )
}

export default withRouter(DashboardsHeader)
