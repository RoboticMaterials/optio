import { denormalize, schema } from "normalizr";
import { uuidv4 } from "../methods/utils/utils";

export const conditionSchema = new schema.Entity(
  // key
  "conditions",
  // definition
  {},
  // options
  {
    idAttribute: (value, parent, key) => {
      //const id = uuidv4();
      //return value.tempId;
      return uuidv4();
    },

    processStrategy: (value, parent, key) => {
      const entries = Object.entries(value);

      //value.tempId = uuidv4()

      var paramString = value.type + " ";
      entries.forEach((entry, index, entries) => {
        if (entry[0] != "type" && entry[0] != "id") {
          paramString += "[" + entry[0] + ": " + entry[1] + "]";
        }
      });

      //value.tempLabel = paramString

      return value;
    },
  }
);

// schema for list of conditions
export const conditionsSchema = [conditionSchema];
