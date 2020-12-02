import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import SideBarButton from '../side_bar_buttons/side_bar_button';

import * as styled from './side_bar_switcher.style'
import { setMode } from '../../../redux/actions/sidebar_actions'

import { deselectLocation, sideBarBack } from '../../../redux/actions/locations_actions'
import { deselectTask } from '../../../redux/actions/tasks_actions'
import { setSelectedDevice } from '../../../redux/actions/devices_actions'

const SideBarSwitcher = (props) => {

    const dispatch = useDispatch()
    const onSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))
    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const selectedLocationCopy = useSelector(state => state.locationsReducer.selectedLocationCopy)
    const selectedLocationChildrenCopy = useSelector(state => state.locationsReducer.selectedLocationChildrenCopy)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
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
                    onSideBarBack({ selectedLocation, selectedLocationCopy, selectedLocationChildrenCopy })

                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'tasks'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatch(deselectLocation())
                    dispatch(deselectTask())
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'processes'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatch(deselectLocation())
                    dispatch(deselectTask())
                }}
                currentMode={url}
            />

            {/* Commented out for now, probably going to delete */}
            {/* <SideBarButton
                mode={'objects'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatch(deselectLocation())
                    dispatch(deselectTask())
                }}
                currentMode={url}
            /> */}
            {MiRMapEnabled &&
              <SideBarButton
                  mode={'scheduler'}
                  setShowSideBarPage={(page) => {
                      dispatch(setMode(page));
                      history.push(`/${page}`)
                      dispatch(deselectLocation())
                      dispatch(deselectTask())
                  }}
                  currentMode={url}
              />  
            }


            <SideBarButton
                mode={'devices'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    onSideBarBack({ selectedLocation })
                }}
                currentMode={url}
            />

            <SideBarButton
                mode={'settings'}
                setShowSideBarPage={(page) => {
                    dispatch(setMode(page));
                    history.push(`/${page}`)
                    dispatch(deselectLocation())
                    dispatch(deselectTask())
                }}
                currentMode={url}
            />


        </styled.SideBarContainer>
    )

}

export default SideBarSwitcher
