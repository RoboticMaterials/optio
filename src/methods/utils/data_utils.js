import { uuidv4 } from './utils';

import { timeStringRegex, oidRegex } from './regex_utils';
import * as dataTypes from "../../redux/types/data_types";

export const parseLot = (lot) => {
  return {
    ...lot,
    templateValues: JSON.parse(lot.templateValues),
    bins: JSON.parse(lot.bins),
    flags: JSON.parse(lot.flags)
  }
}

export const parseTask = (task) => {
  return {
    ...task,
    device_types: JSON.parse(task.device_types),
    processes: JSON.parse(task.processes),
    load: JSON.parse(task.load),
    unload: JSON.parse(task.unload),
    route_object: JSON.parse(task.route_object)
  }
}

export const parseProcess = (process) => {
  return {
    ...process,
    routes: JSON.parse(process.routes),
    broken: JSON.parse(process.broken),
  }
}

export const parseDashboard = (dashboard) => {
    const {
      data,
      ...rest
    } = dashboard

    return {
      ...rest,
      ...JSON.parse(dashboard.data)
    }

}

export const parseObject = (object) => {
  return object
}

export const parseLotTemplate = (lotTemplate) => {
  return {
    ...lotTemplate,
    displayNames: JSON.parse(lotTemplate.displayNames),
    fields: JSON.parse(lotTemplate.fields),
  }
}

export const DATA_PARSERS = {
  [dataTypes.PROCESS]: parseProcess,
  [dataTypes.CARD]: parseLot,
  [dataTypes.TASK]: parseTask,
  [dataTypes.OBJECT]: parseObject,
  [dataTypes.DASHBOARD]: parseDashboard,
  [dataTypes.LOT_TEMPLATE]: parseLotTemplate
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

  console.log('testtesttest', startTimeIsValid)
  console.log('test2test2test2test2', timeIntervalIdValid)

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
