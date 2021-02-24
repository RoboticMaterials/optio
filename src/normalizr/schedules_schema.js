import { denormalize, schema } from "normalizr";
import { uuidv4 } from "../methods/utils/utils";

// schedule schema
export const scheduleSchema = new schema.Entity(
  // key
  "schedules",
  // definition
  {
    //condition: conditionSchema
  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value._id.$oid;
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return {
        _id: {
          $oid: value._id.$oid ? value._id.$oid : null,
        },
        id: value._id.$oid ? value._id.$oid : null,
        name: value.name ? value.name : "",

        days_on: value.days_on
          ? value.days_on
          : {
              friday: false,
              monday: false,
              saturday: false,
              sunday: false,
              thursday: false,
              tuesday: false,
              wednesday: false,
            },

        interval_on: value.interval_on ? value.interval_on : false,
        time_interval: value.time_interval ? value.time_interval : null,
        map_id: value.map_id ? value.map_id : null,

        schedule_on: value.schedule_on ? value.schedule_on : false,
        start_time: value.start_time ? value.start_time : null,

        stop_time_on: value.stop_time_on ? value.stop_time_on : false,
        stop_time: value.stop_time ? value.stop_time : null,

        task_id: value.task_id ? value.task_id : null,
      };
    },
  }
);

// schema for list of schedules
export const schedulesSchema = [scheduleSchema];
