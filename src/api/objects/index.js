/** 
 * All of the API calls for Objects
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 **/

// logging for error in API
import {logError} from "../error_log";

// GQL 
import * as queries from "./queries";
import * as mutations from "./mutations";
import * as dataTypes from "../../redux/types/data_types";
import {parseItem, RESOURCE_JSON_KEYS, stringifyItem} from "../../methods/utils/data_utils";

import {streamlinedGraphqlCall, TRANSFORMS} from "../../methods/utils/api_utils";

// Make it easier to use the helper functions
const parser = (item) => parseItem(item, RESOURCE_JSON_KEYS[dataTypes.OBJECT])
const stringifier = (item) => stringifyItem(item, RESOURCE_JSON_KEYS[dataTypes.OBJECT])

export async function getObjects() {
  try {

    return await streamlinedGraphqlCall(
        TRANSFORMS.QUERY,
        queries.listObjects,
        null,
        parser
    )
    
} catch (error) {
    // Error 😨
    logError(error)
  }
}

export async function postObject(object) {
  try{

    const {
        id,
        ...rest
    } = object || {}

    return await streamlinedGraphqlCall(
        TRANSFORMS.MUTATION,
        mutations.createObject,
        {input: stringifier(rest)},
        parser
    )

  } catch (error) {
      // Error 😨
      logError(error)
  }
}

export async function putObject(object, ID) {
  try {
  
    const {
        __typename,
        ...rest
    } = object || {}

    return await streamlinedGraphqlCall(
        TRANSFORMS.MUTATION,
        mutations.updateObject,
        {input: stringifier(rest)},
        parser
    )


  } catch (error) {
    // Error 😨
    logError(error)
  }
}

export async function deleteObject(ID) {
    try {
  
      return await streamlinedGraphqlCall(
          TRANSFORMS.MUTATION,
          mutations.deleteObject,
          {ID},
          parser
      )
      
    } catch (error) {
        // Error 😨
        logError(error)
      }
  } 