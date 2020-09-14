import { uuidv4 } from './utils';

import { timeStringRegex, oidRegex } from './regex_utils';

export function formatScheduleItem(scheduleItem) {
  scheduleItem.id = scheduleItem._id.$oid;
  if(!scheduleItem.name) scheduleItem.name = "a";
  if(!scheduleItem.label) scheduleItem.label = "";


  // check oid
  const taskOidIsValid = oidRegex.test(scheduleItem.task_id);
  if(!taskOidIsValid) {
    scheduleItem.task_id = null;
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
