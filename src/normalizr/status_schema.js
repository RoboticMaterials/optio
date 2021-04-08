import { denormalize, schema } from 'normalizr';
import { uuidv4 } from '../methods/utils/utils';

// status schema
export const statusSchema = new schema.Entity(
  // key
  'status',
  // definition
  {
    //condition: conditionSchema
  },
  // options
  {
    idAttribute: (value, parent, key) => {
      return value.id.$oid
    },

    // processStrategy
    processStrategy: (value, parent, key) => {
      return value
    }
  },

);

// schema for list of status
export const statusesSchema = [statusSchema]
