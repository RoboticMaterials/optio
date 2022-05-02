import axios from 'axios';
import store from '../redux/store'

import {apiIPAddress} from '../settings/settings';
import { getHeaders, handleError } from './helpers';


const operator = 'site_maps';

export async function getMaps() {
  try {
    const response = await axios.get(apiIPAddress() + operator,{
      headers : new Headers({
        'Content-Type': 'application/json',
        Authorization: 'eyJraWQiOiJBcE1RVnNPcGRIUFhjTmFpc0dGNndDNXNBZ1Q1OFVqZkJ0cFdDWWRIZlNvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3M2Q5MzQ2YS1jYjgwLTQ2ZTItYmRmMS0yZDRjZmUyZmQ3ODAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl85NkhRbFVOWTEiLCJjbGllbnRfaWQiOiJrY2I5ZDVrcXAzbWVrcTRiZTZpcm1rNWxlIiwib3JpZ2luX2p0aSI6ImYzZGRhNTM3LTc3YWMtNDRmNS1hY2Y2LThjYTAwZGZiNmZhZiIsImV2ZW50X2lkIjoiMDVlYTg2MjUtNzkwOS00ZTZiLWE0YmYtMTY0YjJlNjE2NzM0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY1MTQ2MTA3OSwiZXhwIjoxNjUxNDY0Njc5LCJpYXQiOjE2NTE0NjEwNzksImp0aSI6ImJlMTMxNDA2LWZmMzMtNGJhYy1hZmFjLWE4NzgyYjg0YmE0ZiIsInVzZXJuYW1lIjoiNzNkOTM0NmEtY2I4MC00NmUyLWJkZjEtMmQ0Y2ZlMmZkNzgwIn0.p2hHs9rFG_xKL7xgoOQR3sOL2Z9AN4_sm2UCql2uTR5BH9Pw9dlTYwNwkkpeCChsiqRxeyswooPRhEv0YFWgwgm4dlAXeQh8HxyAKrlEfe5BIeylH0rwa0WQ_laZBExMFz89JW5GhfwmSGh_5xff6keq-qH6e-vVsEP0tJ2RS9t9oanRgVN3Rwm2r0BK7xPXaflz9v8QZOR3BiaJIf68Ihl_fBPLHoTOqA5ATMWa9S_pF6HdYJwWfjxnqcpREK-IV_7M53OQVeAfHDYRggOWwLGRnf0L_XzzEhbTw_dlCa8qPoXahfihu0PMvOb2XvdEoQuZQiUqkPoHipJoU7x3aA',
        //store.getState().localReducer.idToken,
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
