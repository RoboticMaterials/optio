import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import SideBarButton from '../side_bar_buttons/side_bar_button';

import * as styled from './side_bar_switcher.style'
import { setMode } from '../../../redux/actions/sidebar_actions'

import { setSelectedStation } from '../../../redux/actions/stations_actions'
import { setSelectedPosition } from '../../../redux/actions/positions_actions'
import { deselectTask } from '../../../redux/actions/tasks_actions'
import { editingTask } from '../../../redux/actions/tasks_actions'
import { editingProcess } from '../../../redux/actions/processes_actions'



const SideBarSwitcher = (props) => {

    const dispatch = useDispatch()
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))

    const dispatchTaskEditing = (props) => dispatch(editingTask(props))
    const dispatchProcessEditing = (props) => dispatch(editingProcess(props))

    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const mode = useSelector(state => state.sidebarReducer.mode)
    const wrapperRef = useRef(null)

    const history = useHistory()
    const url = useLocation().pathname.split('/')[1]

    return (
        <styled.SideBarContainer ref={wrapperRef}>

            <SideBarButton
                mode={'locations'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchTaskEditing(false)
                    dispatchProcessEditing(false)
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'tasks'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchSetSelectedStation(null)
                    dispatchSetSelectedPosition(null)
                    dispatch(deselectTask())
                    dispatchProcessEditing(false)
                    dispatchTaskEditing(false)
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'processes'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchSetSelectedStation(null)
                    dispatchSetSelectedPosition(null)
                    dispatch(deselectTask())
                    dispatchTaskEditing(false)
                    dispatchProcessEditing(false)
                }}
                currentMode={url}
            />

            {/* Commented out for now, probably going to delete */}
            {/* <SideBarButton
                mode={'objects'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchSetSelectedStation(null)
                    dispatchSetSelectedPosition(null)
                    dispatch(deselectTask())
                }}
                currentMode={url}
            /> */}
            {/* {MiRMapEnabled &&
              <SideBarButton
                  mode={'scheduler'}
                  setShowSideBarPage={(page) => {
                      dispatch(setMode(page));
                      history.push(`/${page}`)
                    dispatchSetSelectedStation(null)
                    dispatchSetSelectedPosition(null)
                      dispatch(deselectTask())
                  }}
                  currentMode={url}
              />
            } */}

            <SideBarButton
                mode={'lots'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchTaskEditing(false)
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'devices'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchTaskEditing(false)
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'settings'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatchSetSelectedStation(null)
                    dispatchSetSelectedPosition(null)
                    dispatch(deselectTask())
                    dispatchTaskEditing(false)
                }}
                currentMode={url}
            />


        </styled.SideBarContainer>
    )

}

export default SideBarSwitcher
