import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {useLocation, useParams} from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import * as styled from './side_bar.style'

import { DraggableCore } from "react-draggable";
import SideBarSwitcher from '../../components/side_bar/side_bar_switcher/side_bar_switcher'

import { hoverStationInfo } from '../../redux/actions/stations_actions'


import LocationsContent from '../../components/side_bar/content/locations/locations_content'
import ObjectsContent from '../../components/side_bar/content/objects/objects_content'
import TasksContent from '../../components/side_bar/content/tasks/tasks_content'
import DevicesContent from '../../components/side_bar/content/devices/devices_content'
import SchedulerContent from '../../components/side_bar/content/scheduler/scheduler_content'
import ProcessesContent from '../../components/side_bar/content/processes/processes_content'
import Settings from '../../components/side_bar/content/settings/settings'

import { setWidth, setMode } from "../../redux/actions/sidebar_actions";
import * as sidebarActions from "../../redux/actions/sidebar_actions"
import Cards from "../../components/side_bar/content/cards/cards";

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

    const [width, setWidth] = useState(450)
    const [prevWidth, setPrevWidth] = useState(width)
    const [buttonActive, setButtonActive] = useState(false)
    const [prevParams, setPrevParams] = useState(params)

    const mode = useSelector(state => state.sidebarReducer.mode)
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })


    const history = useHistory()
    const url = useLocation().pathname


    const boundToWindowSize = () => {
        const newWidth = Math.min(window.innerWidth, Math.max(360, width))
        setWidth(newWidth)
        dispatch(sidebarActions.setWidth(newWidth));
    }
    useEffect(() => {
        window.addEventListener('resize', boundToWindowSize, {passive:true})

        return () => {
            window.removeEventListener('resize', boundToWindowSize, {passive:true})
        }
    }, [])

    // sets width to full screen if card subpage is open in processes
    useEffect(() => {
        const {

        } = prevParams

        const prevPage = prevParams.page
        const prevSubpage = prevParams.subpage
        const prevId = prevParams.id


        const time = Date.now()

        if(page === "processes" && (subpage === "card")) {
            setPrevWidth(width) // store previous width to restore when card page is left
            setWidth(window.innerWidth)
        }
        else if((prevSubpage === "card" && prevPage === "processes") && (subpage !== "card") ) {
            setWidth(prevWidth)
        }

        // update prev params
        setPrevParams(params)

        return () => {}

    }, [page, subpage, id, width])

    /**
     * Handles the hamburger icon transformation
     */
    const handleSideBarOpenCloseButtonClick = () => {
        console.log("widgetPageLoaded",widgetPageLoaded)
        const hamburger = document.querySelector('.hamburger')
        hamburger.classList.toggle('is-active')

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
    console.log("page",page)
    switch (page) {
        case 'locations':
            content = <LocationsContent />
            break

        // Commented out for now
        // case '/objects':
        //     content = <ObjectsContent />
        //     break

        case 'processes':
            if(subpage === "card")   {
                content = <Cards id={id}/>
            }
            else {
                content = <ProcessesContent subpage={subpage} id={id} />
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
            console.log("DEFAULT")
            content = null
            if (showSideBar) {
                handleSideBarOpenCloseButtonClick()
            }
            break
    }



    return (
        <>
            <styled.SideBarOpenCloseButton
                className="hamburger hamburger--slider"
                type='button'
                id='sideBarButton'
                onClick={() => handleSideBarOpenCloseButtonClick()}
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
