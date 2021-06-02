import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './side_bar.style'

// Import Components
import { DraggableCore } from "react-draggable";
import SideBarSwitcher from '../../components/side_bar/side_bar_switcher/side_bar_switcher'
import LocationsContent from '../../components/side_bar/content/locations/locations_content'
import TasksContent from '../../components/side_bar/content/tasks/tasks_content'
import DevicesContent from '../../components/side_bar/content/devices/devices_content'
import SchedulerContent from '../../components/side_bar/content/scheduler/scheduler_content'
import ProcessesContent from '../../components/side_bar/content/processes/processes_content'
import Settings from '../../components/side_bar/content/settings/settings'
import ConfirmDeleteModal from '../../components/basic/modals/confirm_delete_modal/confirm_delete_modal'
import Cards from "../../components/side_bar/content/cards/cards";
import Statistics from '../../components/side_bar/content/statistics/statistics'
import ScanLotModal from '../../components/basic/modals/scan_lot_modal/scan_lot_modal'
import TaskAddedAlert from "../../components/widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
import { ADD_TASK_ALERT_TYPE } from "../../constants/dashboard_constants";

// Import Actions
import { setEditingStation, setSelectedStation } from '../../redux/actions/stations_actions'
import { setEditingPosition, setSelectedPosition } from '../../redux/actions/positions_actions'
import { hoverStationInfo } from '../../redux/actions/widget_actions'
import { editingTask } from '../../redux/actions/tasks_actions'
import { editingProcess } from '../../redux/actions/processes_actions'
import { setWidth, setMode, pageDataChanged, setOpen } from "../../redux/actions/sidebar_actions";

import * as taskActions from '../../redux/actions/tasks_actions'
import * as sidebarActions from "../../redux/actions/sidebar_actions";
import {showLotScanModal} from '../../redux/actions/sidebar_actions'

import disableBrowserBackButton from 'disable-browser-back-navigation';

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
    const dispatchSetOpen = (sideBarOpen) => dispatch(setOpen(sideBarOpen))
    const dispatchSetWidth = (width) => dispatch(setWidth(width))
    const dispatchEditingTask = (bool) => dispatch(editingTask(bool))
    const dispatchEditingProcess = (bool) => dispatch(editingProcess(bool))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedPosition = (station) => dispatch(setSelectedPosition(station))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(bool))
    const dispatchSetConfirmDelete = (show, callback) => dispatch(sidebarActions.setConfirmDelete(show, callback))
    const dispatchShowLotScanModal = (bool) => dispatch(showLotScanModal(bool))

    const [pageWidth, setPageWidth] = useState(450)
    const [prevWidth, setPrevWidth] = useState(pageWidth)
    const [prevParams, setPrevParams] = useState(params)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const [barcode, setBarcode] = useState('')
    const [full, setFull] = useState('')
    const [lotID, setLotID] = useState('')
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [showSnoop, setShowSnoop] = useState(null)

    const mode = useSelector(state => state.sidebarReducer.mode)
    const widgetPageLoaded = useSelector(state => { return state.widgetReducer.widgetPageLoaded })
    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state =>state.stationsReducer.stations)
    const pageInfoChanged = useSelector(state => state.sidebarReducer.pageDataChanged)
    const sideBarOpen = useSelector(state => state.sidebarReducer.open)
    const showConfirmDeleteModal = useSelector(state => state.sidebarReducer.showConfirmDeleteModal)
    const confirmDeleteCallback = useSelector(state => state.sidebarReducer.confirmDeleteCallback)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const showScanLotModal = useSelector(state => state.sidebarReducer.showLotScanModal)


    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition
    const history = useHistory()
    const url = useLocation().pathname
    const pageNames = ['locations', 'tasks', 'routes', 'processes', 'lots', 'devices', 'settings', 'statistics']

    const boundToWindowSize = () => {
        const newWidth = Math.min(window.innerWidth, Math.max(360, pageWidth))
        setPageWidth(newWidth)
        dispatchSetWidth(newWidth)
    }

    useEffect(() => {
        disableBrowserBackButton()
        window.addEventListener('resize', boundToWindowSize, { passive: true })

        return () => {
            window.removeEventListener('resize', boundToWindowSize, { passive: true })
        }
    }, [])

    useEffect(() => {
        disableBrowserBackButton()
    }, [url])

    // useEffect(() => {
    //     document.addEventListener('keypress', logKey)
    //     return () => {
    //         document.removeEventListener('keypress', logKey)
    //     }
    // }, [])

    useEffect(() => {
        // console.log('QQQQ barcode', barcode)
        let newFull = full + barcode
        setFull(newFull)
        return () => {

        }
    }, [barcode])

    useEffect(() => {
        if(full.includes('RM-')) {
            const enter = full.substring(full.length-5)
            if(enter === 'Enter'){
                const splitLot = full.split('-')
                let lotId = parseInt(splitLot[1].slice(0,-5))
                setLotID(lotId)
                onScanLot(lotId)
                setFull('')
            }
        }
        return () => {

        }
    }, [full])

    const logKey = (e) => {
        setBarcode(e.key)
    }

    const onScanLot = (id) => {

      let binCount = 0
      let statId = ""

      Object.values(cards).forEach((card) => {
        if(card.lotNumber === id){
          Object.values(stations).forEach((station) => {
            if(!!card.bins[station._id]){
              binCount = binCount + 1
              statId = station._id
            }
          })
        if(binCount > 1){
          dispatchShowLotScanModal(true)
        }
        else{
          history.push(`/locations/${statId}/dashboards/${stations[statId].dashboards[0]}/lots/${card._id}`)
        }
      }
      if(binCount === 0){
        //  setAddTaskAlert({
          //    type: ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
        //      label: "This lot does not exist!",
        //  })

        //  return setTimeout(() => setAddTaskAlert(null), 2500)

        }
      })

      if(id === 420){
        setShowSnoop(true)
        return setTimeout(() => setShowSnoop(null), 2500)
      }
    }

    // Useeffect for open close button, if the button is not active but there is an id in the URL, then the button should be active
    // If the side bar is not active and there is no id then toggle it off
    useEffect(() => {
        const hamburger = document.querySelector('.hamburger')
        const active = hamburger.classList.contains('is-active')
        if (!active && id !== undefined && id !== 'summary') {
            hamburger.classList.toggle('is-active')
        } else if (active && id === undefined && !sideBarOpen) {
            hamburger.classList.toggle('is-active')
        }
    }, [params])

    // Useeffect for open close button
    // If this button is active, there is no ID or the id is summary (means that your where previously in lot summary tab) and the side bar is closed then toggle button off
    // Else if its not active and the side bar is open, then toggle it on
    useEffect(() => {
        const hamburger = document.querySelector('.hamburger')
        const active = hamburger.classList.contains('is-active')
        if (active && (id === undefined || id === 'summary') && !sideBarOpen) {
            hamburger.classList.toggle('is-active')
        } else if (!active && sideBarOpen) {
            hamburger.classList.toggle('is-active')
        }

        dispatchSetOpen(sideBarOpen)

    }, [sideBarOpen])


    // sets width to full screen if card subpage is open in processes
    useEffect(() => {
        const {

        } = prevParams

        const prevPage = prevParams.page
        const prevSubpage = prevParams.subpage
        const prevId = prevParams.id


        const time = Date.now()
        if ((page === "processes" || page === "lots" || page === "statistics") && ((subpage === "lots") || (subpage === 'statistics')) || (id === "timeline") || (id === "summary")) {

            if (!prevWidth) setPrevWidth(pageWidth) // store previous width to restore when card page is left
            setPageWidth(window.innerWidth)
            dispatchSetWidth(window.innerWidth)

        }
        else if ((((prevSubpage === "lots") || (prevSubpage === 'statistics') || (prevId === "timeline") || (prevId === "summary")) && (prevPage === "processes" || prevPage === "lots" || prevPage === "statistics")) && ((subpage !== "lots") || (id === "timeline") || (id === "summary"))) {
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
            if (!!selectedLocation && !selectedLocation.new) {
                dispatchSetSelectedStation(null)
                dispatchSetSelectedPosition(null)
            }

            dispatchEditingTask(false)
            dispatchEditingProcess(false)
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
        }
        // Else handle when the sidebar is closed and clicked to open
        else {

            // If the url doesnt contain a defined page then switch it back to locations
            if (!pageNames.includes(page)) {
                history.push(`/locations`)
            }
            const newSideBarState = !showSideBar
            setShowSideBar(newSideBarState)
            dispatchSetOpen(newSideBarState)
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
            else if (subpage === 'statistics') {
                content = <Statistics />
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

        case 'statistics':
            content = <Statistics />
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
                isOpen={!!confirmDeleteModal || !!showConfirmDeleteModal}
                title={"Are you sure you want to leave this page? Any changes will not be saved"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => {
                    setConfirmDeleteModal(null)
                    dispatchSetConfirmDelete(false, null)
                }}
                handleOnClick1={() => {
                    if (showConfirmDeleteModal) {
                        confirmDeleteCallback()
                    }
                    else {
                        handleSideBarOpenCloseButtonClick()
                    }

                    setConfirmDeleteModal(null)
                    dispatchPageDataChanged(false)
                    dispatchSetConfirmDelete(false, null)
                }}
                handleOnClick2={() => {
                    setConfirmDeleteModal(null)
                    dispatchSetConfirmDelete(false, null)
                }}
            />

            <ScanLotModal
                isOpen={!!showScanLotModal}
                title={"This lot is split between multiple stations. Please pick a station"}
                id = {lotID}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => {
                  dispatchShowLotScanModal(null)

                }}
                handleOnClick1={() => {

                }}
                handleOnClick2={() => {
                  dispatchShowLotScanModal(null)
                }}
            />

            {!!showSnoop &&
              <img
               src="https://i.kym-cdn.com/entries/icons/original/000/017/129/rs-10918-snoop-624-1368121236.jpg"
               alt="new"
               />
            }

            <TaskAddedAlert
                containerStyle={{
                    'position': 'absolute'
                }}
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

            <styled.SideBarOpenCloseButton
                className="hamburger hamburger--squeeze"
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
                <span className='hamburger-box' id='sideBarButton' style={{ display: 'flex', justifyContent: 'center', width: 'auto', color: 'red' }}>
                    <span className='hamburger-inner' id='sideBarButton' style={{ color: 'red' }} />
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
        </>
    )


}

export default SideBar
