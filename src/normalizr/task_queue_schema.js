import { denormalize, schema } from "normalizr";
import { uuidv4 } from "../methods/utils/utils";

// schema for single task queue item schema
export const taskQueueItemSchema = new schema.Entity(
  // key
  "taskQueue",
  // definition
  {
    //condition: conditionSchema
  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value._id;
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return value;
    },
  }
);

// schema for list of task queue items
export const taskQueueSchema = [taskQueueItemSchema];
