import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, withRouter, Route } from 'react-router-dom'

import * as styled from './widget_pages.style'

import WidgetPageHeader from './widget_page_header/widget_page_header'

import useWindowSize from '../../../hooks/useWindowSize'

import DashboardsPage from './dashboards_page/dashboards_page'
import StationStatistics from './station_statistics/station_statistics'
import TasksPage from './tasks_page/tasks_page'

import log from "../../../logger"
import { widgetPageLoaded } from '../../../redux/actions/widget_actions'

const logger = log.getLogger("WidgetPages")

const WidgetPages = (props) => {

    // Constructor
    const history = useHistory()
    const dispatch = useDispatch()

    const size = useWindowSize()
    const windowWidth = size.width
    const widthBreakPoint = 1000;
    const mobileMode = windowWidth < widthBreakPoint;

    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)

    const { locationID, widgetPage } = props.match.params
    const showWidgetPage = widgetPage

    // Tells the reducer if widget page has been loaded
    const onWidgetPageLoaded = (props) => dispatch(widgetPageLoaded(props));


    useEffect(() => {

        // On intitial widget page load, set a delay to tell redux that the widget pages have loaded
        // This happens because the statistic page on load needs to load charts which can be cumbersome on widget animation.
        // So the chart loads after the widget animation, but if widget page is already open and then a statistic page is selected,
        // there should not be a delayed chart opening. See statistics_page/statistics_overview/statistics_overview.js
        // setTimeout(() => {
        onWidgetPageLoaded(true)
        // }, 300);

        // On Unmount tell the reducer the widget pages aren't loaded anymore
        return () => {
            onWidgetPageLoaded(false)
        }
    }, [])

    // useEffect(() => {
    //     if (windowWidth < 1030) {
    //         onTaskQueueOpen(false)
    //     }
    // }, [windowWidth])


    return (
        <styled.Container taskQueueOpen={false} showWidgetPage={showWidgetPage} dashboardOpen={dashboardOpen} mobileMode={mobileMode} id={'widgetPage'}>

            <styled.WidgetPageContainer
                showWidgetPage={showWidgetPage}
            >
                <Route
                    path="/locations/:stationID/dashboards/:dashboardID?/:editing?/:lotID?/:warehouseID?"
                    render={() => <DashboardsPage onSetTitle={() => {}}/>}
                />
                <Route
                    path="/locations/:stationID/statistics"
                    component={StationStatistics}
                />
                <Route
                    path="/locations/:stationID/tasks"
                    component={TasksPage}
                />
            </styled.WidgetPageContainer>
        </styled.Container>


    )

}

export default withRouter(WidgetPages)
