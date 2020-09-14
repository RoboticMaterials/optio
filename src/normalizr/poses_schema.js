import { denormalize, schema } from 'normalizr';

// poses schema
export const poseSchema = new schema.Entity(
  // key
  'poses',
  // definition
  {

  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value._id
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return value;
    }
  },

);

// schema for list of schedules
export const posesSchema = [poseSchema];
