import axios from 'axios';
import store from '../redux/store'

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

export async function getMaps() {
  console.log("Getting Maps");
  
  try {
    const response = await axios.get(apiIPAddress() + operator,{
      headers : new Headers({
        'Content-Type': 'application/json',
        Authorization: store.getState().localReducer.idToken,
      }),
     });
    
    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data);
    console.log(dataJson);
    return dataJson;


  } catch (error) {
    console.log("Problem reading maps")
    console.log(error.response)
    handleError(error);
}

/*
 //This code works, but I cannot return the data from the promise
const url = apiIPAddress() + operator;
fetch(url, {
  method: 'GET',
  headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: store.getState().localReducer.idToken,
    }),
})
.then((response) => {
       response
          .json()
          .then((data) => {
              console.log('Valid data - ', data);
          })
          .catch((err) => {
              console.log('Invalid data - ', err);
          });
  }).catch((err) => {
      console.log('Error in API - ', err);
  });
*/

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
