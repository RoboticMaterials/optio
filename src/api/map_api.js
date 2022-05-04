import axios from 'axios';
import store from '../redux/store'

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

export async function getMaps() {


  try {
    const response = await axios.get(apiIPAddress() + operator,{
        headers : getHeaders()
        
        /*{
        'Content-Type': 'application/json',
        Authorization: store.getState().localReducer.idToken,
      }*/,
     });
    
    // Success 🎉
    const dataJson = response.data;
    return dataJson;


  } catch (error) {
    console.log("Problem reading maps")
    console.log(error)
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
  const dataJson = response.data;
  //const dataJson = JSON.parse(data)
  return dataJson;


  } catch (error) {
    handleError(error);
  }
}
