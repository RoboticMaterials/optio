/**
 * All of the API calls for Stations
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 9 20201
 * Edited by: Daniel Castillo
 * 
 */

// logging for error in API
import errorLog from './errorLogging'

import getUserOrgId from './user_api'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { stationsByOrgId } from '../graphql/queries'
import { createStation, updateStation, stationStats } from '../graphql/mutations'
import { deleteStation as deleteStationByID } from '../graphql/mutations'
import {streamlinedGraphqlCall, TRANSFORMS} from "../methods/utils/api_utils";
import {parseStation} from "../methods/utils/data_utils";

export async function getStations() {
  try {
    const userOrgId = await getUserOrgId()
    const stations = await streamlinedGraphqlCall(
        TRANSFORMS.QUERY,
        stationsByOrgId,
        { organizationId: userOrgId },
        parseStation
    )

    console.log("getStations stations",stations)
    // Success 🎉;
    return stations
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function deleteStation(ID) {
  try {

    const id = {id: ID}

    const dataJson = await API.graphql({
      query: deleteStationByID,
      variables: { input: id }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function postStation(station) {
  try {

    const userOrgId = await getUserOrgId()

    const input = {
      ...station,
      organizationId: userOrgId,
      children: JSON.stringify(station.children),
      dashboards: JSON.stringify(station.dashboards),
      pos_x: parseFloat(station.pos_x),
      pos_y: parseFloat(station.pos_y),
      x: parseFloat(station.x),
      y: parseFloat(station.y),
      id: station.id
    }

    delete input.neame

    const dataJson = await API.graphql({
      query: createStation,
      variables: { 
        input: input 
      }
    })

    return {
      ...dataJson.data.createStation,
      children: station.children,
      dashboards: station.dashboards,
    }
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function putStation(station, ID) {
  try {

    const input = {
      ...station,
      children: JSON.stringify(station.children),
      dashboards: JSON.stringify(station.dashboards),
      pos_x: parseFloat(station.pos_x),
      pos_y: parseFloat(station.pos_y),
      x: parseInt(station.x),
      y: parseInt(station.y),
    }

    // delete input.id
    delete input.createdAt
    delete input.updatedAt

    const dataJson = await API.graphql({
      query: updateStation,
      variables: { input: input }
    })

    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}

export async function getStationAnalytics(id, timeSpan) {
  try {

    const dataJ = await API.graphql({
      query: stationStats,
      variables: { 
          stationId: id,
          timeSpan: timeSpan.timespan, 
          index: timeSpan.index
      }
    })

    let data = {
      throughPut: JSON.parse(dataJ.data.stationStats.throughPut),
      date_title: dataJ.data.stationStats.date
    }

    // Success 🎉

    return data;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}