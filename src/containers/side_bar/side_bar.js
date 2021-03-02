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
import { setEditingStation, setSelectedStation } from '../../redux/actions/stations_actions'
import { setEditingPosition, setSelectedPosition } from '../../redux/actions/positions_actions'
import { hoverStationInfo } from '../../redux/actions/widget_actions'
import { editingTask } from '../../redux/actions/tasks_actions'
import { editingProcess } from '../../redux/actions/processes_actions'
import { setWidth, setMode, pageDataChanged, setOpen } from "../../redux/actions/sidebar_actions";

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
    const dispatchSetOpen = (sideBarOpen) => dispatch(setOpen(sideBarOpen))
    const dispatchSetWidth = (width) => dispatch(setWidth(width))
    const onDeselectTask = () => dispatch(taskActions.deselectTask())
    const dispatchEditingTask = (bool) => dispatch(editingTask(bool))
    const dispatchEditingProcess = (bool) => dispatch(editingProcess(bool))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedPosition = (station) => dispatch(setSelectedPosition(station))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))

    const [pageWidth, setPageWidth] = useState(450)
    const [prevWidth, setPrevWidth] = useState(pageWidth)
    const [buttonActive, setButtonActive] = useState(false)
    const [prevParams, setPrevParams] = useState(params)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const mode = useSelector(state => state.sidebarReducer.mode)
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const taskEditing = useSelector(state => state.tasksReducer.editingTask)
    const processEditing = useSelector(state => state.processesReducer.editingProcess)
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)

    const history = useHistory()
    const url = useLocation().pathname

    const locationEditing = !!editingStation ? editingStation : editingPosition

    const boundToWindowSize = () => {
        const newWidth = Math.min(window.innerWidth, Math.max(360, pageWidth))
        setPageWidth(newWidth)
        dispatchSetWidth(newWidth)
    }
    useEffect(() => {
        window.addEventListener('resize', boundToWindowSize, { passive: true })

        return () => {
            window.removeEventListener('resize', boundToWindowSize, { passive: true })
        }
    }, [])

    // Useeffect for open close button, if the button is not active but there is an id in the URL, then the button should be active 
    useEffect(() => {
        const hamburger = document.querySelector('.hamburger')
        const active = hamburger.classList.contains('is-active')
        if (!active && id !== undefined) {
            hamburger.classList.toggle('is-active')
        }
    }, [params])

    useEffect(() => {
        dispatchSetOpen(sideBarOpen)
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

            if (!prevWidth) setPrevWidth(pageWidth) // store previous width to restore when card page is left
            setPageWidth(window.innerWidth)
            dispatchSetWidth(window.innerWidth)

        }
        else if ((((prevSubpage === "lots") || (prevId === "timeline") || (prevId === "summary")) && (prevPage === "processes" || prevPage === "lots")) && ((subpage !== "lots") || (id === "timeline") || (id === "summary"))) {
            setPageWidth(prevWidth)
            dispatchSetWidth(prevWidth)
            setPrevWidth(null)
        }

        setPrevParams(params)

        if (!showSideBar) {
            setPageWidth(450)
            dispatchSetWidth(450)
        }

        return () => { }

    }, [page, subpage, id, pageWidth, showSideBar])

    /**
     * Handles the hamburger icon transformation
     */
    const handleSideBarOpenCloseButtonClick = () => {

        if (!!showSideBar) {
            dispatchSetSelectedStation(null)
            dispatchSetSelectedPosition(null)
            dispatchEditingTask(false)
            dispatchEditingProcess(false)
        }

        if (!widgetPageLoaded || widgetPageLoaded && !sideBarOpen) {
            const hamburger = document.querySelector('.hamburger')
            hamburger.classList.toggle('is-active')
        }

        if (!showSideBar && url == '/') {
            history.push(`/locations`)
        }

        // If widget page is active, the toggle the widget page, else toggle the side bar
        if (widgetPageLoaded) {
            history.push('/locations')
            dispatchSetSelectedStation(null)
            dispatchSetSelectedPosition(null)
            dispatchHoverStationInfo(null)
        } else {
            const newSideBarState = !showSideBar
            setShowSideBar(newSideBarState)
            dispatchSetOpen(newSideBarState)
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
        const newWidth = Math.min(window.innerWidth, Math.max(360, pageWidth + ui.deltaX))
        setPageWidth(newWidth)
        dispatchSetWidth(newWidth)
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
                    dispatchPageDataChanged(false)
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
                    if (pageInfoChanged) {
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
                <styled.SidebarWrapper mode={mode} style={{ width: showSideBar == true ? pageWidth : 0, display: "flex", }} open={showSideBar}>

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


            {/* {handleActiveButton()} */}
        </>
    )


}

export default SideBar
