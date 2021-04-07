import { denormalize, schema } from 'normalizr';
import { uuidv4 } from '../methods/utils/utils';

// schedule schema
export const scheduleSchema = new schema.Entity(
  // key
  'schedules',
  // definition
  {
    //condition: conditionSchema
  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value.id
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return {
        id: {
          $oid: value.id ? value.id : null
        },
        id: value.id ? value.id : null,
        name: value.name ? value.name : '',

        days_on: value.days_on ? value.days_on : {
          friday: false,
          monday: false,
          saturday: false,
          sunday: false,
          thursday: false,
          tuesday: false,
          wednesday: false
        },

        interval_on:  value.interval_on ? value.interval_on : false,
        time_interval: value.time_interval ? value.time_interval : null,
        mapId: value.mapId ? value.mapId : null,

        schedule_on: value.schedule_on ? value.schedule_on : false,
        start_time: value.start_time ? value.start_time : null,

        stop_time_on: value.stop_time_on ? value.stop_time_on : false,
        stop_time: value.stop_time ? value.stop_time : null,

        taskId: value.taskId ? value.taskId : null,
      };
    }
  },

);

// schema for list of schedules
export const schedulesSchema = [scheduleSchema]
