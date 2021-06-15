// import external dependencies
import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'

// import methods
import { getBatteryClassName } from '../../methods/utils/class_name_utils';
import { uuidv4, deepCopy } from '../../methods/utils/utils';
import { parseCondition } from '../../methods/utils/skills_utils.js'
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Shade } from '../../methods/utils/color_utils';

// import actions
import { postStatus } from '../../redux/actions/status_actions'
import * as taskQueueActions from '../../redux/actions/task_queue_actions'
import { setWidth, setOpen} from "../../redux/actions/sidebar_actions";

// import components
import RightMenu from '../right_menu/right_menu'

// import hooks
import useWindowSize from '../../hooks/useWindowSize'

// import logger
import log, { disableAll } from '../../logger.js';

// import styles
import * as styled from './status_header.style'
import { render } from '@testing-library/react';
import { ThemeContext } from 'styled-components'


const StatusHeader = (props) => {

    // this.logger = log.getLogger(this.constructor.name);

    //const [showRightMenu, setShowRightMenu] = useState(false)
    const [newNotification, setNewNotification] = useState(false)

    const status = useSelector(state => state.statusReducer.status)
    const displayType = useSelector(state => state.notificationsReducer.hiddenNotifications)
    const notifications = useSelector(state => state.notificationsReducer.notifications)

    const sideBarWidth = useSelector(state => state.sidebarReducer.width)
    const toggle = useSelector(state => state.notificationsReducer.toggleNotificationTaskQueue)
    const isSideBarOpen = useSelector(state => state.sidebarReducer.open)
    const taskQueueOpen = useSelector(state => state.taskQueueReducer.taskQueueOpen)
    const showConfirmDeleteModal = useSelector(state => state.sidebarReducer.showConfirmDeleteModal)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const deviceEnabled = serverSettings.deviceEnabled
    const [initialRender, setInitialRender] = useState (null)
    const [statusBarPath, setStatusBarPath] = useState(``)
    const [rightCurvePoint, setRightCurvePoint] = useState(``)
    const [overlapStatus, setOverlapStatus] = useState('')

    const prevNotificationRef = useRef()


    let params = useParams()
    const widgetPage = params.widgetPage


    const theme = useContext(ThemeContext)
    const widthBreakPoint = 1025

    const dispatch = useDispatch()
    const onHideNotifications = (displayType) => dispatch({ type: 'HIDDEN_NOTIFICATIONS', payload: displayType })
    const onTaskQueueOpen = (props) => dispatch(taskQueueActions.taskQueueOpen(props))
    const onSetWidth = (props) => dispatch (setWidth(props))
    const onSetOpen = (props) => dispatch (setOpen(props))




    // Used for determining break point of header
    const size = useWindowSize()
    const windowWidth = size.width


    const generatePath = () => {

        const pageWidth = window.innerWidth
        const windowWidth = size.width

        if (windowWidth < 800 && isSideBarOpen && taskQueueOpen) {
            setRightCurvePoint(220)
            setOverlapStatus(true)
        }
        else {
            setRightCurvePoint(320)
            setOverlapStatus(false)
        }


        let x, mergeHeight
        let leftMargin = 200

        let rightMargin = 200
        if (window.innerWidth < widthBreakPoint) {
            x = 60
            mergeHeight = 2
            leftMargin = 80
            rightMargin = !!params.widgetPage ? 80 : 160
        } else if (!taskQueueOpen && sideBarWidth + 120 > pageWidth - 320) { // No notifications, overlaping containers
            x = (pageWidth - sideBarWidth - 200) / 2
            mergeHeight = 5 + (sideBarWidth - pageWidth + 440) * 35 / 120
        } else if (taskQueueOpen && sideBarWidth + 120 > pageWidth - 440) { // W/ notifications, overlapping containers
            x = (pageWidth - sideBarWidth - 320) / 2
            mergeHeight = 5 + (sideBarWidth - pageWidth + 560) * 35 / 220
        } else {
            x = 120
            mergeHeight = 5
        }

        const path = `
                M0,0
                L0,40
                L${isSideBarOpen && !widgetPage ? sideBarWidth : leftMargin},40
                C${isSideBarOpen && !widgetPage ? sideBarWidth + x / 2 : leftMargin + x / 2},40 ${isSideBarOpen && !widgetPage ? sideBarWidth + x / 2 : leftMargin + x / 2},${Math.min(mergeHeight, 40)} ${isSideBarOpen && !widgetPage ? sideBarWidth + x : leftMargin + x},${Math.min(mergeHeight, 40)}
                L${pageWidth - (taskQueueOpen ? rightCurvePoint : rightMargin) - x},${Math.min(mergeHeight, 40)}
                C${pageWidth - (taskQueueOpen ? rightCurvePoint : rightMargin) - x / 2},${Math.min(mergeHeight, 40)} ${taskQueueOpen ? `${pageWidth - rightCurvePoint},${Math.min(mergeHeight, 40)}` : `${pageWidth - rightMargin - x / 2},40`} ${pageWidth - (taskQueueOpen ? rightCurvePoint : rightMargin)},40
                L${pageWidth},40
                L${pageWidth},0
                Z
            `


        setStatusBarPath(path)

    }

    /**
     * This handles new notifications
     * Sets the prev notification state to prevNotificationRef which is used to see if there's any new notifications
     */

    useEffect(() => {
        prevNotificationRef.current = notifications
        handleNotifications()
    })


    // useeffect is used like componentdidmount
    useEffect(() => {
        /**
         * This maps through all the notifications and groups them into types.
         * Grouping into types allows the ability to give notification type titles and be
         * able to sort notifications by their types
         *
         * Also use displayType to minimize those type groups
         */

        let types = {}
        notifications.map((notification) => {
            // If notification types does not include the specific notification type than add it to types
            if (types[notification.type] === undefined) {
                const type = notification.type;

                displayType[type] = true;

                onHideNotifications(displayType)

                types[notification.type] = [notification];

            }
        });
        window.addEventListener('resize', generatePath, {passive: true})

        return () => {
            window.removeEventListener('resize', generatePath)
        }
    }, []);

    useEffect(() => {
        generatePath()
    })
    //This should work but the header path isn't updating on windowResize with these conditions...
    // [sideBarWidth, isSideBarOpen, taskQueueOpen, window.onresize, window.innerWidth, params.widgetPage, windowWidth, sidebarOpenPath]

    // Handles the play pause button
    const handleTogglePlayPause = async () => {

        //Flip the status to the opposite of the current value when the button is pressed
        var status_clone = deepCopy(status);
        const pause_status = !status_clone.pause_status;

        //Post the status to the API
        await dispatch(postStatus({ pause_status: pause_status }));
    }


    // Renders the left side of the header
    const renderLeftHeader = useMemo(() => {

        return (
            <styled.LeftContentContainer
                windowWidth={windowWidth}
                widthBreakPoint={widthBreakPoint}
            >
                {/* <Link to='/Dashboards' style={{textDecoration:'none'}}> */}

                {/* Hides the logo on mobile mode */}



            </styled.LeftContentContainer>
        )

    }, [windowWidth])

    /**
     * Renders the right side of the header which contains:
     *
     * Play Pause Button: Used to start or stop the task queue
     * Notifications: Used for to display notifications such as device issues, HILs, etc...
     *
     */
    const renderRightContent = () => {
        let pause_status = ''

        // If there's no status available then set to blank object.
        try {
            pause_status = status.pause_status;
        } catch (e) {
            pause_status = false;
        }

        // Handles the icon type being displayed based on the pause_status in status
        var playButtonClassName = "fas fa-";
        pause_status ? playButtonClassName += 'play' : playButtonClassName += 'pause';

        return (
            <styled.RightContentContainer>

                {/* Hide play pause button if it's not MirMapEnabled */}
                {deviceEnabled &&
                    <styled.PlayButton
                        play={pause_status}
                        windowWidth={windowWidth}
                        widthBreakPoint={widthBreakPoint}
                    >
                        <styled.PlayButtonIcon play={pause_status} className={playButtonClassName} onClick={handleTogglePlayPause}></styled.PlayButtonIcon>
                    </styled.PlayButton>
                }

                {/* This hides the right menu container if the screen size is below a set point and widgets are open (params.widgetPage) */}
                {(windowWidth < widthBreakPoint && !params.widgetPage) &&
                    <>
                        <styled.RightMenuContainer checked={taskQueueOpen} onClick={() => {
                            onTaskQueueOpen(!taskQueueOpen)
                        }}>

                            {toggle === 'notifications' ?
                                <>
                                    <styled.NotificationText>2</styled.NotificationText>
                                    <styled.NotificationIcon className='far fa-bell' />
                                </>
                                :
                                <styled.NotificationIcon className='fa fa-tasks' style={{ marginBottom: '0rem' }} />

                            }


                        </styled.RightMenuContainer>

                        {(taskQueueOpen || newNotification) &&
                            <>
                                <RightMenu showRightMenu={taskQueueOpen} newNotification={newNotification} overlapStatus={overlapStatus} />
                            </>
                        }
                    </>

                }

                {/* Always renders if page is greater then break point */}
                {windowWidth > widthBreakPoint &&
                    <>
                        <styled.RightMenuContainer checked={taskQueueOpen} onClick={() =>
                            onTaskQueueOpen(!taskQueueOpen)
                        }>

                            {toggle === 'notifications' ?
                                <>
                                    <styled.NotificationText>2</styled.NotificationText>
                                    <styled.NotificationIcon className='far fa-bell' />
                                </>
                                :
                                <styled.NotificationIcon className='fa fa-tasks' style={{ marginBottom: '0rem' }} />

                            }

                        </styled.RightMenuContainer>

                        {(taskQueueOpen || newNotification) &&
                            <>
                                <RightMenu showRightMenu={taskQueueOpen} newNotification={newNotification} />
                            </>
                        }
                    </>
                }

            </styled.RightContentContainer>
        )
    }

    /**
     * Handles New Notifications as well as hidding new notifications pop up when the notification panel is open
     */
    const handleNotifications = () => {

        const prevNotifications = prevNotificationRef.current

        // If prev state of notifications doesnt match the current state of notifications then a new notification must have been added
        if (prevNotifications != notifications) {

            setNewNotification(true)

            setTimeout(() => {
                setNewNotification(false)
            }, 3000);

        }
        // If newNotification is true and showRightMenu is clicked, hide the new notifcation pop up
        else if (taskQueueOpen && newNotification) {
            setNewNotification(false)
        }
    }

    return (

        <styled.StatusHeader>
            <div
                style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    right: '0',
                    height: '5rem',
                    zIndex: '1',
                }}>
                <svg
                    fill={hexToRGBA(theme.bg.secondary, 0.97)}
                    viewBox={`0 0 ${window.innerWidth} 50`}
                    width='100%' height='100%' preserveAspectRatio="none"
                >
                    <filter id="dropshadow" height="130%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
                        <feOffset dx="0" dy="1" result="offsetblur"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <path style={{ backdropFilter: 'blur(3px)', filter:'url(#dropshadow)' }} d={statusBarPath} />
                </svg>

            </div>

            <styled.LeftContentContainer>
                {windowWidth > widthBreakPoint &&
                    <styled.Logo
                        windowWidth={windowWidth}
                        widthBreakPoint={widthBreakPoint}
                    >
                        <styled.LogoIcon className='icon-rmLogo' />
                        <styled.LogoSubtitle> Studio</styled.LogoSubtitle>
                    </styled.Logo>
                }
            </styled.LeftContentContainer>

            {renderRightContent()}
        </styled.StatusHeader>


    );
}

export default StatusHeader;
