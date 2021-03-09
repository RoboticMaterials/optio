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

import axios from "axios";

import { apiIPAddress } from "../settings/settings";

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

// import the GraphQL queries, mutations and subscriptions
import { listStations } from '../graphql/queries'
import { createStation, updateStation } from '../graphql/mutations'
import { deleteStation as deleteStationByID } from '../graphql/mutations'

export async function getStations() {
  try {

    const res = await API.graphql({
      query: listStations
    })

    let GQLdata = []

    res.data.listStations.items.forEach(element => {
      GQLdata.push( {
        ...element,
        children: JSON.parse(element.children),
        dashboards: JSON.parse(element.dashboards),
      })
    });

    // Success 🎉;
    return GQLdata

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

    const input = {
      ...station,
      children: JSON.stringify(station.children),
      dashboards: JSON.stringify(station.dashboards),
      pos_x: parseFloat(station.pos_x),
      pos_y: parseFloat(station.pos_y),
      _id: station._id.toString(),
      id: station._id
    }

    delete input.neame

    const dataJson = await API.graphql({
      query: createStation,
      variables: { input: input }
    })

    return dataJson;
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
      _id: station._id.toString()
    }

    // delete input.id
    delete input.createdAt
    delete input.updatedAt

    console.log(input)

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
    const response = await axios({
      method: "PUT",
      url: apiIPAddress() + "stations/" + id + "/analysis",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "123456",
        "Accept": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
      // A timespan is {time_span: 'day', index: 0}
      data: timeSpan,
    });
    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data);
    return dataJson;
  } catch (error) {
    // Error 😨
    errorLog(error)
  }
}