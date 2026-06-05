// @ts-nocheck
import axios from 'axios';

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

const parseResponseData = (data) => {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data)
        } catch (e) {
            return data
        }
    }
    return data
}

export async function getMaps() {
  try {
    const response = await axios({
      method: 'GET',
      url: apiIPAddress() + operator,
      headers: getHeaders()
    });

    // Success 🎉
    const data = response.data;
    return parseResponseData(data);

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
    return parseResponseData(data);

  } catch (error) {
    handleError(error);
  }
}

export async function postMap(mapData) {
  try {
    const response = await axios({
      method: 'POST',
      url: apiIPAddress() + operator,
      headers: getHeaders(),
      data: JSON.stringify(mapData),
    });

    // Success 🎉
    const data = response.data;
    return parseResponseData(data);

  } catch (error) {
    handleError(error);
  }
}

export async function deleteMap(map_id) {
  try {
    await axios({
      method: 'DELETE',
      url: apiIPAddress() + operator + '/' + map_id,
      headers: getHeaders(),
    });
    return map_id;

  } catch (error) {
    handleError(error);
  }
}
