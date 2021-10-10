import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";

import { locationsSortedAlphabetically } from '../../../methods/utils/locations_utils'

import * as styled from '../list_view.style'
import {getDashboardNameFromLocation, getDashboardDisplayName} from "../../../methods/utils/dashboards_utils";


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
    const locations = useSelector(state => state.stationsReducer.stations)
    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMapId = useSelector(state => state.settingsReducer.settings.currentMapId)
    const maps = useSelector(state => state.mapReducer.maps)
    const currentMap = Object.values(maps).find(map => map._id === currentMapId)
    const deviceEnabled = false
    const {
        _id: mapId
    } = currentMap || {}
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)

    // component state
    const [locationsArr, setLocationsArr] = useState([])
    const [dashboardsArr, setDashboardsArr] = useState([])

    // const devicesArr = Object.values(devices)

    /*
    * this effect updates locationsArr
    * locations must be sorted a-z, and filtered by map_id
    * name should be replaced with dashboard name (if it exists), otherwise default name should be made using station name
    * */
    useEffect(() => {
        // sort locations + filter by map id
        let tempLocationsArr = locationsSortedAlphabetically(Object.values(locations).filter(loc => loc.map_id === currentMap._id))

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
    }, [mapId, locations, dashboards])

    // this effect updates dashboardsArr
    useEffect(() => {
      if(!!deviceEnabled){
        setDashboardsArr([...locationsArr, ...Object.values(devices)])
      }
      else{
        setDashboardsArr([...locationsArr])
      }
    }, [locationsArr, devices])

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
                        // onMouseEnter={() => onMouseEnter(item)}
                        // onMouseLeave={() => onMouseLeave(item)}
                        >
                            <styled.ListItemRect>
                                <styled.ListItemTitle schema={"locations"}>{locations[item._id]?.name + " Dashboard"}</styled.ListItemTitle>
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
