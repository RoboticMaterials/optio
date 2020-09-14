import React from 'react';
import * as styled from './widget_page_header.style'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'


const WidgetPageHeader = (props) => {

    const params = useParams()
    const locations = useSelector(state => state.locationsReducer.locations)

    const locationID = params.locationID

    let widgetPage = params.widgetPage
    widgetPage = widgetPage.charAt(0).toUpperCase() + widgetPage.slice(1)

    let locationName = ''
    try {
        locationName = locations[locationID].name
        console.log('QQQQ Locations', locations[locationID].name)
        
    } catch (error) {
        
    }


    return(
        <styled.HeaderContainer>
            <styled.HeaderStation>{locationName}</styled.HeaderStation>
            <styled.HeaderText>{widgetPage}</styled.HeaderText>
        </styled.HeaderContainer>
    )
}

export default WidgetPageHeader