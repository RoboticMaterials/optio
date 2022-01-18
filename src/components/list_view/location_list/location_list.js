import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from "prop-types";

// Import Constants
import { StationTypes } from '../../../constants/station_constants'
import { PositionTypes } from '../../../constants/position_constants'

import { locationsSortedAlphabetically } from '../../../methods/utils/locations_utils'

import * as styled from '../list_view.style'
import {getDashboardNameFromLocation, getDashboardDisplayName} from "../../../methods/utils/dashboards_utils";
import { postLocalSettings, getLocalSettings } from '../../../redux/actions/local_actions'
import {getStations} from '../../../redux/actions/stations_actions'


const LocationList = (props) => {

    const {
        onMouseEnter,
        onMouseLeave,
        onLocationClick

    } = props

    LocationList.propTypes = {
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onLocationClick: PropTypes.func,
        onClick: PropTypes.func,
        name: PropTypes.string,

    }

    LocationList.defaultProps = {
        onMouseEnter: () => { },
        onLocationClick: () => { },
        onMouseLeave: () => { },
        onClick: () => { },
        name: ""
    }

    // redux state
    const dispatch = useDispatch()
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetStations = () => dispatch(getStations())
    const locations = useSelector(state => state.stationsReducer.stations)
    const localMapId = useSelector(state => state.localReducer.localSettings.currentMapId)
    const maps = useSelector(state => state.mapReducer.maps)
    const currentMapId = !!localMapId ? localMapId : maps[0]
    const deviceEnabled = false
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const localSettings = useSelector(state => state.localReducer.localSettings)


    // component state
    const [locationsArr, setLocationsArr] = useState([])
    const [dashboardsArr, setDashboardsArr] = useState([])

    /*
    * this effect updates locationsArr
    * locations must be sorted a-z, and filtered by map_id
    * name should be replaced with dashboard name (if it exists), otherwise default name should be made using station name
    * */
    useEffect(() => {
        // sort locations + filter by map id
        let tempLocationsArr = locationsSortedAlphabetically(Object.values(locations))

        // map through locations and update name
        tempLocationsArr = tempLocationsArr.map((currLocation) => {

            // get dashboard name
            const dashboardName = getDashboardNameFromLocation(currLocation, dashboards)

            // return currLocation with name updated for dashboard name
            return {
                ...currLocation,
                name: dashboardName
            }
        })

        // update state
        setLocationsArr(tempLocationsArr)
    }, [currentMapId, locations, dashboards])

    // this effect updates dashboardsArr
    useEffect(() => {
        setDashboardsArr([...locationsArr])
    }, [locationsArr])

    useEffect(() => {
      if(!localMapId){
        handleGetStations()
      }
    }, [])

    const handleGetStations = async () => {
      let res = dispatchPostLocalSettings({
        ...localSettings,
        currentMapId: maps[0]?._id
      })

      res.then((result) => {
        if(result) dispatchGetStations()
      })
    }

    const renderLocationTypeIcon = (element) => {


        const LocationTypes ={
            ...StationTypes,
            ...PositionTypes,
        }

        switch (element) {
            case 'warehouse':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['warehouse'].color} stroke={LocationTypes['warehouse'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['warehouse'].svgPath}
                    </styled.LocationTypeGraphic>
                )

            case 'human':
                return (
                    <styled.LocationTypeGraphic fill={LocationTypes['human'].color} stroke={LocationTypes['human'].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        {LocationTypes['human'].svgPath}
                    </styled.LocationTypeGraphic>
                )



            case 'user':
                return
        }
    }

    return (
        <styled.ListScrollContainer>
            {dashboardsArr.length > 0 ?
                dashboardsArr.map((item, index, arr) => {
                    const {
                        name,
                        device_name,
                    } = item
                    return (
                        <styled.ListItem
                            key={`li-${index}`}
                            onClick={() => {
                              onLocationClick(item)
                            }}

                        >
                            <styled.ListItemRect>
                                {renderLocationTypeIcon(locations[item._id]?.type)}
                                <styled.ListItemTitle>{locations[item._id]?.name}</styled.ListItemTitle>
                                <i className = 'fas fa-chevron-right' style = {{marginRight: '1rem', color: '#7e7e7e'}}/>
                            </styled.ListItemRect>

                        </styled.ListItem>
                    );
                })
                :
                <div></div>
            }

        </styled.ListScrollContainer>
    )
}

export default LocationList
