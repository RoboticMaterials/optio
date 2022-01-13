import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as style from './side_bar_button.style'

import * as locationActions from '../../../redux/actions/locations_actions'
import * as tasksActions from '../../../redux/actions/tasks_actions'
import * as processesActions from '../../../redux/actions/processes_actions'

import { pageDataChanged } from '../../../redux/actions/sidebar_actions'


import ConfirmDeleteModal from '../../basic/modals/confirm_delete_modal/confirm_delete_modal'


const SideBarButton = (props) => {

    const {
        mode,
        currentMode
    } = props
    const history = useHistory()

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const taskEditing = useSelector(state => state.tasksReducer.editingTask)
    const processEditing = useSelector(state => state.processesReducer.editingProcess)

    const dispatch = useDispatch()
    const dispatchLocationEditing = (props) => dispatch(locationActions.editing(props))
    const dispatchTaskEditing = (props) => dispatch(tasksActions.editingTask(props))
    const dispatchProcessEditing = (props) => dispatch(processesActions.editingProcess(props))
    const dispatchSetPageDataChanged = (bool) => dispatch(pageDataChanged(bool))


    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const locationEditing = !!editingStation ? editingStation : editingPosition

    useEffect(() => {
        if (taskEditing !== true && processEditing !== true) {
            dispatchSetPageDataChanged(false)
        }
    }, [processEditing, taskEditing, editingStation, editingPosition])

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
                        dispatchLocationEditing(false)
                        dispatchTaskEditing(false)
                        dispatchProcessEditing(false)
                        dispatchSetPageDataChanged(false)
                    }

                    if (props.mode === 'statistics') {
                        const currentPath = history.location.pathname
                        history.push('/statistics/summary')

                        setConfirmDeleteModal(null)
                        dispatchLocationEditing(false)
                        dispatchTaskEditing(false)
                        dispatchProcessEditing(false)
                        dispatchSetPageDataChanged(false)
                    }

                    else {
                        props.setShowSideBarPage(props.mode)
                        setConfirmDeleteModal(null)
                        dispatchLocationEditing(false)
                        dispatchTaskEditing(false)
                        dispatchProcessEditing(false)
                        dispatchSetPageDataChanged(false)
                    }

                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                }}
            />
        )
    }



    if (mode === 'locations') {

        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className='fas fa-map-marker-alt'
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Locations</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'devices') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'icon-rmLogo'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Devices</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'lots') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'far fa-window-restore'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else {
                                const currentPath = history.location.pathname
                                history.push('/lots/summary')
                            }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Travelers</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'statistics') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'icon-statistics'}
                        onClick={() => {
                            if (currentMode === 'statisticcs') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else {
                                const currentPath = history.location.pathname
                                history.push('/statistics/summary')
                            }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Statistics</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }


    else if (mode === 'processes') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'fas fa-route'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Processes</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'scheduler') {
        return (
            <>
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'far fa-calendar-alt'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Schedules</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'tasks') {
        return (
            <>
                {handleConfirmationModal()}
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon
                        className={'fa fa-tasks'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}
                    >
                        <style.SideBarButtonText>Routes</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else if (mode === 'settings') {
        return (
            <>
                {handleConfirmationModal()}
                <div style={{ justifyContent: 'flex-end', flexGrow: '1' }} />
                <style.SideBarButtonWrapper
                    currentMode={currentMode}
                    mode={mode}
                >
                    <style.SideBarButtonIcon

                        className={'fas fa-cog'}
                        onClick={() => {
                            if (currentMode === 'lots') {
                                props.setShowSideBarPage(mode)
                                dispatchSetPageDataChanged(false)
                            }

                            else if (pageInfoChanged) {
                                setConfirmDeleteModal(true)
                            }
                            else { props.setShowSideBarPage(mode) }
                        }}
                        currentMode={currentMode}
                        mode={mode}

                    >
                        <style.SideBarButtonText>Settings</style.SideBarButtonText>
                    </style.SideBarButtonIcon>
                </style.SideBarButtonWrapper>
            </>
        )
    }

    else {
        return (
            <style.SideBarButtonIcon
                className={"icon-" + mode}
                onClick={() => {
                    props.setShowSideBarPage(mode)
                }}
                currentMode={currentMode}
                mode={mode}
            />
        )
    }

}

export default SideBarButton
