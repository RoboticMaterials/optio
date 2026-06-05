import { denormalize, schema } from 'normalizr';
import { uuidv4 } from '../methods/utils/utils';

// schema for single task
export const taskSchema = new schema.Entity(
  // key
  'tasks',
  // definition
  {
    //condition: conditionSchema
  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value._id
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return value;

    },

  },

);

// schema for list of tasks
export const tasksSchema = [taskSchema]
