import axios from 'axios';
import store from '../redux/store'

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

export async function getMaps() {


  try {
    const response = await axios.get(apiIPAddress() + operator,{
        headers : {
        'Content-Type': 'application/json',
        Authorization: store.getState().localReducer.idToken,
      },
     });
    
    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data);
    console.log(dataJson);
    return dataJson;


  } catch (error) {
    console.log("Problem reading maps")
    console.log(apiIPAddress() + operator)
    console.log(error.response)
    handleError(error);
}

}

export async function getMap(map_id) {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator + '/' + map_id,
      headers: getHeaders
     /* headers: {
        'Accept': 'application/json',
        'X-API-Key': '123456',
      }*/,
  });

  // Success 🎉
  const data = response.data;
  const dataJson = JSON.parse(data)
  return dataJson;


  } catch (error) {
    handleError(error);
  }
}
