import axios from 'axios';

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

export async function getMaps() {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator,
      headers: getHeaders()
    });

    // Success 🎉
    const data = response.data;
    const dataJson = JSON.parse(data);
    return dataJson;


} catch (error) {
  handleError(error);
}


}

export async function getMap(map_id) {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator + '/' + map_id,
      headers: getHeaders(),
  });

  // Success 🎉
  const data = response.data;
  const dataJson = JSON.parse(data)
  return dataJson;


  } catch (error) {
    handleError(error);
  }
}
