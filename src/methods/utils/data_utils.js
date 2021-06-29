import { uuidv4 } from './utils';

import { timeStringRegex, oidRegex } from './regex_utils';
import * as dataTypes from "../../redux/types/data_types";

export const parseItem = (obj, keys) => {
  let tempObj = {...obj}
  let parsedObj = {}

  for(const key of keys) {
    const {
      [key]:currVal,
      ...rest
    } = tempObj || {}

    if(currVal) parsedObj[key] = JSON.parse(currVal)
    tempObj = {...rest}
  }

  return {
    ...tempObj,
    ...parsedObj
  }

}

export const stringifyItem = (obj, keys) => {
  let tempObj = {}

  console.log('datautils', obj, keys);

  for(const entry of Object.entries(obj)) {
    const [key, value] = entry

    if(keys.includes(key)) {
      tempObj[key] = JSON.stringify(value)
    }
    else {
      tempObj[key] = value
    }
  }

  return tempObj
}

// keys that are just saved as JSON chunks for each resource
export const RESOURCE_JSON_KEYS = {
  [dataTypes.PROCESS]: ["routes", "broken"],
  [dataTypes.CARD]: ["fields", "bins", "flags"],
  [dataTypes.TASK]: ["device_types", "processes", "load", "unload", "route_object"],
  [dataTypes.OBJECT]: [],
  [dataTypes.DASHBOARD]: ["data"],
  [dataTypes.LOT_TEMPLATE]: ["displayNames", "fields"],
  [dataTypes.SETTINGS]: ["loggers", "shiftDetails", "timezone"],
  [dataTypes.STATION]: ["children", "dashboards"],
  [dataTypes.REPORT_EVENT]: [],
}

// parser for each resource
export const parseLot = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.CARD])
export const parseTask = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.TASK])
export const parseProcess = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.PROCESS])
export const parseLotTemplate = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.LOT_TEMPLATE])
export const parseObject = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.OBJECT])
export const parseSettings = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.SETTINGS])
export const parseStation = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.STATION])
export const parsePosition = (data) => parseItem(data, RESOURCE_JSON_KEYS[dataTypes.POSITION])
export const parseDashboard = (dashboard) => {
  console.log('parseDashboard dashboard',dashboard)
  const {
    data,
    ...rest
  } = dashboard

  const parsedData = dashboard.data ? JSON.parse(dashboard.data) : {}
  return {
    ...rest,
    ...parsedData
  }
}

// stringifier for each resource
export const stringifyLot = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.CARD])
export const stringifyTask = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.TASK])
export const stringifyProcess = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.PROCESS])
export const stringifyLotTemplate = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.LOT_TEMPLATE])
export const stringifyObject = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.OBJECT])
export const stringifySettings = (data) => stringifyItem(data, RESOURCE_JSON_KEYS[dataTypes.SETTINGS])
export const stringifyDashboard = (dashboard) => {
  const {
    id,
    organizationId,
    ...rest
  } = dashboard || {}

  return {
    id,
    organizationId,
    data: JSON.stringify(rest),
  }
}


// put em all together
export const DATA_PARSERS = {
  [dataTypes.PROCESS]: parseProcess,
  [dataTypes.CARD]: parseLot,
  [dataTypes.TASK]: parseTask,
  [dataTypes.OBJECT]: parseObject,
  [dataTypes.DASHBOARD]: parseDashboard,
  [dataTypes.LOT_TEMPLATE]: parseLotTemplate,
  [dataTypes.SETTINGS]: parseSettings,
  [dataTypes.STATION]: parseStation
}

export const DATA_STRINGIFIERS = {
  [dataTypes.PROCESS]: stringifyProcess,
  [dataTypes.CARD]: stringifyLot,
  [dataTypes.TASK]: stringifyTask,
  [dataTypes.OBJECT]: stringifyObject,
  [dataTypes.DASHBOARD]: stringifyDashboard,
  [dataTypes.LOT_TEMPLATE]: stringifyLotTemplate,
  [dataTypes.SETTINGS]: stringifySettings,
}


export function formatScheduleItem(scheduleItem) {
  scheduleItem.id = scheduleItem.id.$oid;
  if(!scheduleItem.name) scheduleItem.name = "a";
  if(!scheduleItem.label) scheduleItem.label = "";


  // check oid
  const taskOidIsValid = oidRegex.test(scheduleItem.taskId);
  if(!taskOidIsValid) {
    scheduleItem.taskId = null;
  }



  const startTimeIsValid = timeStringRegex.test(scheduleItem.start_time);
  if(!startTimeIsValid) {
    scheduleItem.start_time = "00:00:00";
    scheduleItem.start_time_label = "NOT SET";
  } else {
    scheduleItem.start_time_label = scheduleItem.start_time;
  }
  const timeIntervalIdValid = timeStringRegex.test(scheduleItem.time_interval);
  if(!timeIntervalIdValid) {
    scheduleItem.time_interval = "00:00:00";
    scheduleItem.time_interval_label = "NOT SET";
  } else {
    scheduleItem.time_interval_label = scheduleItem.time_interval;
  }

  if(!scheduleItem.start_time_label)
    if(!scheduleItem.time_interval_label)

      return scheduleItem;
}
/*
export function formatCondition(condition) {
  if(condition._id) {
    condition.id = condition._id.$oid;
  } else {
    condition.id = null;
  }

  if(!condition.name) condition.name = "a";

}
*/

export function formatCondition(condition) {
  if(!condition.id) condition.id = condition.key;
}
