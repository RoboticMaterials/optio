import { denormalize, schema } from "normalizr";

// poses schema
export const modelSchema = new schema.Entity(
  // key
  "models",
  // definition
  {},
  // options
  {
    /*
    idAttribute: (value, parent, key) => {
      return value._id
    },
    */

    // processStrategy
    processStrategy: (value, parent, key) => {
      return value;
    },
  }
);

// schema for list of models
export const modelsSchema = [modelSchema];
