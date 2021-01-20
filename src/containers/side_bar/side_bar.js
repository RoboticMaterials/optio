import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './side_bar.style'

// Import Components
import { DraggableCore } from "react-draggable";
import SideBarSwitcher from '../../components/side_bar/side_bar_switcher/side_bar_switcher'
import LocationsContent from '../../components/side_bar/content/locations/locations_content'
import ObjectsContent from '../../components/side_bar/content/objects/objects_content'
import TasksContent from '../../components/side_bar/content/tasks/tasks_content'
import DevicesContent from '../../components/side_bar/content/devices/devices_content'
import SchedulerContent from '../../components/side_bar/content/scheduler/scheduler_content'
import ProcessesContent from '../../components/side_bar/content/processes/processes_content'
import Settings from '../../components/side_bar/content/settings/settings'
import ConfirmDeleteModal from '../../components/basic/modals/confirm_delete_modal/confirm_delete_modal'
import PageErrorBoundary from '../../containers/page_error_boundary/page_error_boundary'
import Cards from "../../components/side_bar/content/cards/cards";

// Import Actions
import { setEditingStation } from '../../redux/actions/stations_actions'
import { setEditingPosition } from '../../redux/actions/positions_actions'
import { hoverStationInfo } from '../../redux/actions/widget_actions'
import { editingTask } from '../../redux/actions/tasks_actions'
import { editingProcess } from '../../redux/actions/processes_actions'
import { setWidth, setMode } from "../../redux/actions/sidebar_actions";
import * as sidebarActions from "../../redux/actions/sidebar_actions"
import * as taskActions from '../../redux/actions/tasks_actions'

const SideBar = (props) => {

    const {
        showSideBar,
        setShowSideBar
    } = props

    let params = useParams()
    const {
        page,
        subpage,
        id
    } = params

    const dispatch = useDispatch()
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchEditingPosition = (bool) => dispatch(setEditingPosition(bool))

    const [width, setWidth] = useState(450)
    const [prevWidth, setPrevWidth] = useState(width)
    const [buttonActive, setButtonActive] = useState(false)
    const [prevParams, setPrevParams] = useState(params)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const mode = useSelector(state => state.sidebarReducer.mode)
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)

    const taskEditing = useSelector(state => state.tasksReducer.editingTask)
    const processEditing = useSelector(state => state.processesReducer.editingProcess)
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)

    const history = useHistory()
    const url = useLocation().pathname

    const locationEditing = !!editingStation ? editingStation : editingPosition

    const boundToWindowSize = () => {
        const newWidth = Math.min(window.innerWidth, Math.max(360, width))
        setWidth(newWidth)
        dispatch(sidebarActions.setWidth(newWidth));
    }
    useEffect(() => {
        window.addEventListener('resize', boundToWindowSize, { passive: true })

        return () => {
            window.removeEventListener('resize', boundToWindowSize, { passive: true })
        }
    }, [])


    useEffect(() => {
        dispatch(sidebarActions.setOpen(sideBarOpen))
    })


    // sets width to full screen if card subpage is open in processes
    useEffect(() => {
        const {

        } = prevParams

        const prevPage = prevParams.page
        const prevSubpage = prevParams.subpage
        const prevId = prevParams.id


        const time = Date.now()
        if ((page === "processes" || page === "lots") && ((subpage === "lots")) || (id === "timeline") || (id === "summary")) {

            if (!prevWidth) setPrevWidth(width) // store previous width to restore when card page is left
            setWidth(window.innerWidth)
            dispatch(sidebarActions.setWidth(window.innerWidth))

        }
        else if ((((prevSubpage === "lots") || (prevId === "timeline") || (prevId === "summary")) && (prevPage === "processes" || prevPage === "lots")) && ((subpage !== "lots") || (id === "timeline") || (id === "summary"))) {
            setWidth(prevWidth)
            dispatch(sidebarActions.setWidth(prevWidth))
            setPrevWidth(null)
        }

        setPrevParams(params)

        if (!showSideBar) {
            setWidth(450)
            dispatch(sidebarActions.setWidth(450))
        }

        return () => { }

    }, [page, subpage, id, width, showSideBar])

    /**
     * Handles the hamburger icon transformation
     */
    const handleSideBarOpenCloseButtonClick = () => {

        if (!widgetPageLoaded || widgetPageLoaded && !sideBarOpen) {
            const hamburger = document.querySelector('.hamburger')
            hamburger.classList.toggle('is-active')
        }

        // TODO: Not sure why these are here...
        // dispatchEditingStation(false)
        // dispatchEditingPosition(false)

        // dispatch(editingProcess(false))

        // dispatchSideBarBack()
        // dispatch(taskActions.deselectTask())    // Deselect

        if (!showSideBar && url == '/') {
            history.push(`/locations`)
        }

        // If widget page is active, the toggle the widget page, else toggle the side bar
        if (widgetPageLoaded) {
            history.push('/locations')
            dispatchHoverStationInfo(null)
        } else {
            const newSideBarState = !showSideBar
            setShowSideBar(newSideBarState)
            dispatch(sidebarActions.setOpen(newSideBarState))
        }

    }

    /**
     * Handles when widget pages are open
     * If open and button is not active, then activate the button
     * Else if the button is active and widget pages aren't open and side bar isnt open then disable
     */
    const handleActiveButton = () => {

        // Try catch is here because an error is thrown when the side bar is not mounted due to a full screen dashboard
        // Ugly way of handling this, but it works at the moment. The error happens becasue no elements have a class hamburger when function runs
        try {
            if (!buttonActive && widgetPageLoaded) {
                setButtonActive(true)
                const hamburger = document.querySelector('.hamburger')
                hamburger.classList.toggle('is-active')

            } else if (buttonActive && !widgetPageLoaded && !showSideBar) {
                setButtonActive(false)
            }
        } catch (error) {
            setTimeout(() => handleActiveButton(), 100)
        }

    }

    function handleDrag(e, ui) {
        const newWidth = Math.min(window.innerWidth, Math.max(360, width + ui.deltaX))
        setWidth(newWidth)
        dispatch(sidebarActions.setWidth(newWidth));
    }

    let content
    switch (page) {
        case 'locations':
            content = <LocationsContent />
            break

        // Commented out for now
        // case '/objects':
        //     content = <ObjectsContent />
        //     break

        case 'processes':
            if (subpage === "lots") {
                content = <Cards id={id} />
            }
            else {
                content = <ProcessesContent subpage={subpage} id={id} />
            }

            break

        case 'lots':
            if ((id === "summary") || (id === "timeline")) {
                content = <Cards id={id} />
            }
            break

        case 'tasks':
            content = <TasksContent />
            break

        case 'scheduler':
            content = <SchedulerContent />
            break

        case 'devices':
            content = <DevicesContent />
            break

        case 'settings':
            content = <Settings />
            break

        default:
            content = null
            if (showSideBar) {
                handleSideBarOpenCloseButtonClick()
            }
            break
    }



    return (
        <>

            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={"Are you sure you want to leave this page? Any changes will not be saved"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => setConfirmDeleteModal(null)}
                handleOnClick1={() => {
                    handleSideBarOpenCloseButtonClick()
                    setConfirmDeleteModal(null)
                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                }}
            />

            <styled.SideBarOpenCloseButton
                className="hamburger hamburger--slider"
                type='button'
                id='sideBarButton'
                onClick={() => {
                    if (locationEditing || taskEditing || processEditing) {
                        setConfirmDeleteModal(true)
                    }
                    else { handleSideBarOpenCloseButtonClick() }
                }}
            // showSideBar={showSideBar}
            >
                <span className='hamburger-box' id='sideBarButton' style={{ display: 'flex', justifyContent: 'center', width: 'auto' }}>
                    <span className='hamburger-inner' id='sideBarButton' />
                </span>
            </styled.SideBarOpenCloseButton>

            {showSideBar &&
                <styled.SidebarWrapper mode={mode} style={{ width: showSideBar == true ? width : 0, display: "flex", }} open={showSideBar}>

                    <SideBarSwitcher
                        handleClickOutside={handleSideBarOpenCloseButtonClick}
                        showSideBar={showSideBar}
                    />

                    <styled.SidebarContent
                        key="sidebar-content"
                        style={{}}
                    >
                        {content}

                        <DraggableCore key="handle" onDrag={handleDrag} >
                            <styled.ResizeBar>
                                <styled.ResizeHandle content={mode}></styled.ResizeHandle>
                            </styled.ResizeBar>
                        </DraggableCore>
                    </styled.SidebarContent>
                </styled.SidebarWrapper>
            }


            {handleActiveButton()}
        </>
    )


}

export default SideBar
