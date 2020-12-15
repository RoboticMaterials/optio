import { denormalize, schema } from 'normalizr';
import { uuidv4 } from '../methods/utils/utils';
// condition schema - NOT CURRENTLY USED - condtions should probably have an id attribute / some unique identifier...


// schedule schema
export const dashboardSchema = new schema.Entity(
    // key
    'dashboards',
    // definition
    {
        //condition: conditionSchema
    },
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id.$oid
        },

    },

);

// schema for list of schedules
export const dashboardsSchema = [dashboardSchema]

// schedule schema
export const deviceSchema = new schema.Entity(
    // key
    'devices',
    // definition
    {
        //condition: conditionSchema
    },
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id
        },

    },

);

// schema for list of schedules
export const devicesSchema = [deviceSchema]

export const locationsSchema = new schema.Entity(
    // key
    'locations',
    // definition
    {},
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id.$oid
        }
    }
)

// Schema for events
export const eventsSchema = new schema.Entity(
    // key
    'events',
    // definition
    {},
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id.$oid
        }
    }
)


// process schema
export const processSchema = new schema.Entity(
    // key
    'processes',
    // definition
    {
        //condition: conditionSchema
    },
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id
        },

    },

);

export const processesSchema = [processSchema]


// sounds schema
export const soundSchema = new schema.Entity(
    // key
    'sounds',
    // definition
    {
        //condition: conditionSchema
    },
    // options
    {
        idAttribute: (value, parent, key) => {
            return value._id
        },

    },

);

export const soundsSchema = [soundSchema]


// sounds schema
export const taskAnalysisSchema = new schema.Entity(
    // key
    'taskAnalysis',
    // definition
    {
        //condition: conditionSchema
    },
    // options
    {
        idAttribute: (value, parent, key) => {
            return value.task_id
        },

    },

);

export const tasksAnalysisSchema = [taskAnalysisSchema]