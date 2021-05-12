/**
 * All of the API calls for Stations
 * 
 */

// logging for error in API
import errorLog from '../errorLogging'

import apolloClient from "../apollo_client";

import {StationInterface} from "./station";

import {listStations} from "../gql/queries.ts";
import {createStation} from "./mutations";

export async function getStations() {
    try {
        
        apolloClient.query({query: listStations})
            .then(result => {

                console.log("result",result.data.listStations)

            }).catch(err => {

                console.log("GET STATIONS ERR", err)

            })

        return []


    } catch (error) {

      // Error 😨
      errorLog(error)
    }
  }
  
  export async function deleteStation(ID: string) {
    try {
  
        
    } catch (error) {
      // Error 😨
      errorLog(error)
    }
  }
  
  export async function postStation(station: any) {
    try {
      
    } catch (error) {
      // Error 😨
      errorLog(error)
    }
  }
  
  export async function putStation(station: any, ID: string) {
    try {
  
      
    } catch (error) {
      // Error 😨
      errorLog(error)
    }
  }
  
  export async function getStationAnalytics(id: string, timeSpan: any) {
    try {

      
    } catch (error) {
      // Error 😨
      errorLog(error)
    }
  }