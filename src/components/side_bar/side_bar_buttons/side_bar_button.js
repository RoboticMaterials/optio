import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import * as style from './side_bar_button.style'

import * as locationActions from '../../../redux/actions/locations_actions'
import * as tasksActions from '../../../redux/actions/tasks_actions'
import * as processesActions from '../../../redux/actions/processes_actions'


import ConfirmDeleteModal from '../../basic/modals/confirm_delete_modal/confirm_delete_modal'


const SideBarButton = (props) => {

    const history = useHistory()

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)
    
    const taskEditing = useSelector(state => state.tasksReducer.editingTask)
    const processEditing = useSelector(state => state.processesReducer.editingProcess)

    const dispatch = useDispatch()
    const onLocationEditing = (props) => dispatch(locationActions.editing(props))
    const onTaskEditing = (props) => dispatch(tasksActions.editingTask(props))
    const onProcessEditing = (props) => dispatch(processesActions.editingProcess(props))


    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const locationEditing = !!editingStation ? editingStation : editingPosition

    const handleConfirmationModal = () => {
        return (
            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={"Are you sure you want to leave this page? Any changes will not be saved"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => setConfirmDeleteModal(null)}
                handleOnClick1={() => {
                    if (props.mode === 'lots') {
                        const currentPath = history.location.pathname
                        history.push('/lots/summary')

                        setConfirmDeleteModal(null)
                        onLocationEditing(false)
                        onTaskEditing(false)
                        onProcessEditing(false)
                    }
                    else {
                        props.setShowSideBarPage(props.mode)
                        setConfirmDeleteModal(null)
                        onLocationEditing(false)
                        onTaskEditing(false)
                        onProcessEditing(false)
                    }

                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                }}
            />
        )
    }



    if (props.mode === 'locations') {

        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className='fas fa-map-marker-alt'
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Locations</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'devices') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className={'icon-rmLogo'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Devices</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'lots') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className={'fas fa-layer-group'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else {
                            const currentPath = history.location.pathname
                            history.push('/lots/summary')
                        }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Lot Summary</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'processes') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className={'fas fa-route'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Processes</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'scheduler') {
        return (
            <>
                <style.SideBarButtonIcon
                    className={'far fa-calendar-alt'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Schedules</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'tasks') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className={'fa fa-tasks'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}
                >
                    <style.SideBarButtonText>Routes</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else if (props.mode === 'settings') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonIcon
                    className={'fas fa-cog'}
                    onClick={() => {
                        if (locationEditing || taskEditing || processEditing) {
                            setConfirmDeleteModal(true)
                        }
                        else { props.setShowSideBarPage(props.mode) }
                    }}
                    currentMode={props.currentMode}
                    mode={props.mode}

                >
                    <style.SideBarButtonText>Settings</style.SideBarButtonText>
                </style.SideBarButtonIcon>
            </>
        )
    }

    else {
        return (
            <style.SideBarButtonIcon
                className={"icon-" + props.mode}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

}

export default SideBarButton
