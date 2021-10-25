import * as Yup from 'yup';

import { notBrokenRegex, notTaskDeletedRegex } from "./regex_utils";
import { isObject } from "./object_utils";
import { get } from "lodash"
import { isArray } from "./array_utils";
import { LOT_TEMPLATES_RESERVED_FIELD_NAMES } from "../../constants/form_constants";
import { convertCardDate } from "./card_utils";
import { isEqualCI, isString } from "./string_utils";
import { FIELD_DATA_TYPES } from "../../constants/lot_contants";

import { findProcessStartNodes, findProcessEndNodes, getNodeOutgoing, handleMergeExpression } from './processes_utils';
import { deepCopy, uuidv4 } from './utils'

const { object, lazy, string, number } = require('yup')
const mapValues = require('lodash/mapValues')

Yup.addMethod(Yup.object, 'startEndDate', function (startPath, endPath, message) {
    return this.test('startEndDate', message, function (value) {

        if (!value) return true

        const {
            path,
            createError
        } = this

        const startDate = convertCardDate(value[startPath])
        const endDate = convertCardDate(value[endPath])

        if (startDate && endDate) {
            if (endDate < startDate) {
                return this.createError({
                    path: `${path}`,
                    message,
                });
            }
        }
        return true;
    });
});

export const scheduleSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    task: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                // .min(1, '1 character minimum')
                // .max(2, '50 character maximum')
                .matches(notTaskDeletedRegex, "Task is deleted.")
                .required('Please select a task.'),
            status: Yup.string().matches(notBrokenRegex, "Task is broken."),
        })
    ).required('Required'),
    days_on: Yup.array()
        .min(1, 'Please select at least one day.')
        .required('Required'),
    start_time: Yup.string()
        .required('Required'),
    time_interval: Yup.string(), // not required
    stop_time: Yup.string() // not required
});

export const reportEventSchema = Yup.object().shape({
    label: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a label.'),
    description: Yup.string()
});

export const objectSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    description: Yup.string()
        .max(1000, '1000 character maximum.'),
    // width: Yup.number()
    //     .positive("Please enter a positive number.")
    //     .moreThan(0, "Must be greater than 0.")
    //     .required("Please enter the object's width."),
    // height: Yup.number()
    //     .positive("Please enter a positive number.")
    //     .moreThan(0, "Must be greater than 0.")
    //     .required("Please enter the object's height."),
    // length: Yup.number()
    //     .positive("Please enter a positive number.")
    //     .moreThan(0, "Must be greater than 0.")
    //     .required("Please enter the object's length."),
    // modelName: Yup.string()
    //     .required("Please select a model."),
});

// Yup.addMethod(Yup.array, 'startEndDate', function (startPath, endPath, message) {
//     return this.test('startEndDate', message, function (value) {
//
//         if(!value) return true
//
//         const {
//             path,
//             createError
//         } = this
//
//         const startDate = convertCardDate(value[startPath])
//         const endDate = convertCardDate(value[endPath])
//
//         if(startDate && endDate) {
//             if(endDate < startDate) {
//                 return this.createError({
//                     path: `${path}`,
//                     message,
//                 });
//             }
//         }
//         return true;
//     });
// });


export const hilSchema = Yup.object().shape({
    instruction: Yup.string()
        .max(20, '20 character maximum.')
        .required('Please enter instructions.'),
    position: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Position is missing name.'),
        })
    )
        .required('Please select a position.'),
    dashboard: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Dashboard is missing name.'),
        })
    )
        .required('Please select a dashboard.'),
    sound: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Sound is missing name.'),
        })
    )
        .required('Please select a sound.'),
    timeout: Yup.string()
        .nullable()
        .required('Please select timeout.'),
});

export const moveSchema = Yup.object().shape({
    location: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Location is missing name.'),
            _id: Yup.string()
                .required('Location is missing ID.'),
        })
    ).required('Please select a location.'),
});



export const nameSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
});

export const hilGoalSchema = Yup.object().shape({
    hil: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('HIL is missing name.'),
        })
    ).required('Please select a HIL.')
});

export const objectAtLocationGoalSchema = Yup.object().shape({
    quantity: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Quantity is missing name.'),
        })
    ).required('Please select a quantity.'),
    object: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Object is missing name.'),
        })
    ).min(1, "Please select an object.").nullable(),
    position: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Position is missing name.'),
        })
    ).required('Please select a position.'),
});

export const dashboardSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.'),
    buttons: Yup.array().of(
        Yup.object().shape({
            name: Yup.string(),
            // task: Yup.array().of(
            //     Yup.object().shape({
            //         Description: Yup.string()
            //             .matches(notBrokenRegex, "Task is broken.")
            //             .required('Task is missing description.'),
            //         task_id: Yup.string()
            //             .required('Task is missing ID.'),
            //     })
            // ).required('Please select a task.'),
            // banana: Yup.string()
            //     .required('Please enter a name.'),
            color: Yup.string()
                .required('Please select a color.'),

        })
    ),

});

// returns error if any item in nested array is duplicate
Yup.addMethod(Yup.object, "dopeUnique", function (message, fieldPath, pathToArr) {
    let mapper
    if (fieldPath) mapper = x => get(x, fieldPath)

    return this.test("dopeUnique", message, function (item) {
        const { path, createError, parent, options } = this
        const {
            context
        } = options || {}
        const {
            [pathToArr]: arr
        } = context || {}

        let rx = /\[(-?\d+)\]/g
        const reg2 = /[\[\]']+/g

        var index = path.match(rx);
        let megaIndex = 0
        const last = index.pop()

        index.forEach((currItem) => {
            const parsedIndex = parseInt(currItem.replace(reg2, ''))
            for (let i = 0; i < parsedIndex; i++) {
                megaIndex = megaIndex + arr[i].length
            }
        })
        megaIndex = megaIndex + parseInt(last.replace(reg2, ''))

        let compareItem
        if (mapper) compareItem = mapper(item)


        let isUnique = true

        let currIndex = 0

        for (const currItem of arr.flat()) {
            if (parseInt(currIndex) !== parseInt(megaIndex)) {
                if (mapper) {
                    if (isString(compareItem) && isString(mapper(currItem)) && isEqualCI(compareItem.trim(), mapper(currItem).trim())) {
                        isUnique = false
                        return createError({ path: `${path}.${fieldPath}`, message })
                    }
                }
                else {
                    if (isString(item) && isString(currItem) && isEqualCI(item.trim(), currItem.trim())) {
                        isUnique = false
                        return createError({ path: `${path}.${fieldPath}`, message })
                    }
                }
            }
            currIndex = currIndex + 1
        }

        if (isUnique) {
            return true;
        }
    });
});

// returns error if any item in nested array is duplicate
Yup.addMethod(Yup.object, "lotFieldRequired", function (message) {
    return this.test("lotFieldRequired", message, function (item) {
        const { path, createError, parent, options } = this

        const {
            required,
            value,
            dataType
        } = item || {}

        if (required) {
            switch (dataType) {
                case FIELD_DATA_TYPES.DATE_RANGE: {
                    if (!value || !isArray(value) || !(value[0] instanceof Date) || !(value[1] instanceof Date)) {
                        return createError({ path: `${path}.value`, message })
                    }
                    break
                }
                case FIELD_DATA_TYPES.DATE: {
                    if (!(value instanceof Date)) return createError({ path: `${path}.value`, message })
                    break
                }
                case FIELD_DATA_TYPES.INTEGER: {
                    if (!value) return createError({ path: `${path}.value`, message })
                    break
                }
                case FIELD_DATA_TYPES.STRING: {
                    if (!value) return createError({ path: `${path}.value`, message })
                    break
                }
                default: {
                    if (!value) return createError({ path: `${path}.value`, message })
                    break
                }
            }
        }

        return true
    });
});

// returns error if any item in nested array is duplicate
Yup.addMethod(Yup.array, "nestedUnique", function (message, path) {
    const mapper = x => get(x, path);
    return this.test("nestedUnique", message, function (list) {
        let set
        let totalList = []
        list.forEach((currList, currListIndex) => {
            totalList = totalList.concat(currList)
        })

        set = [...new Set(totalList.map(mapper))];
        const isUnique = totalList.length === set.length;
        if (isUnique) {
            return true;
        }

        let idx = 0
        let rowIdx = 0
        let i = 0
        let err

        for (const sublist of list) {
            idx = 0

            for (const item of sublist) {
                if (!err && isEqualCI(mapper(item).trim(), set[i].trim())) {
                    err = this.createError({ path: `fields[${rowIdx}][${idx}].${path}`, message })
                }

                idx = idx + 1
                i = i + 1
            }
            rowIdx = rowIdx + 1
        }

        return err
    });
});

// returns error if value is in arr
Yup.addMethod(Yup.string, "notIn", function (message, arr, pathToOthers) {
    return this.test("notIn", message, function (value) {
        const { path, createError, parent, options } = this
        const {
            context
        } = options || {}
        const {
            [pathToOthers]: others = []
        } = context || {}

        for (const item of arr.concat(Object.values(others))) {
            if (isString(value) && isString(item) && isEqualCI(item.trim(), value.trim())) return createError({ path, message })
        }
        return true
    });
});

// returns error if value is in arr
Yup.addMethod(Yup.string, "uniqueByPath", function (message, arrPath) {
    return this.test("uniqueByPath", message, function (value) {
        const { path, createError, parent } = this;

        if (value) {
            const parentValues = parent[arrPath]

            if (isArray(parentValues)) {
                for (const currParentValue of parentValues) {

                    const {
                        name,
                        id
                    } = currParentValue

                    if (name === value && parent._id !== id) return createError({ path, message })
                }
            }
        }

        return true
    });
});

// Checks for unique values of an array of objects
Yup.addMethod(Yup.object, 'uniqueProperty', function (propertyName, message) {
    return this.test('unique', message, function (value) {
      if (!value || !value[propertyName]) {
        return true;
      }
  
      const { path } = this;
      const options = [...this.parent];
      const currentIndex = options.indexOf(value);
  
      const subOptions = options.slice(0, currentIndex);
  
      if (subOptions.some((option) => option[propertyName] === value[propertyName])) {
        throw this.createError({
          path: `${path}.${propertyName}`,
          message,
        });
      }
  
      return true;
    });
  });

export const getSignUpSchema = (accessCode) => Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email'),

    accessCode: Yup.string()
        .required('Please enter a access code')
        .oneOf([accessCode], 'Must be a valid access code'),
        // .matches(/\b(c20513dd-a031-495e-bd38-a342128b24b9|690f5884-aef6-4f65-b098-9c9304baac48)\b/, 'Must be a valid access code'),

    password: Yup.string()
        .required('Please enter a password')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$\-!%*#?&]{8,}$/,
            "Must Contain at least 8 characters, one uppercase, one lowercase, and one number"
        ),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password field cannot be left empty')
})

export const signInSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email'),
    password: Yup.string()
        .required('Please enter a password'),

})

export const emailSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email')
})

export const passwordResetSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email'),
    verification: Yup.string()
        .required('Please enter you verification code'),
    password: Yup.string()
        .required('Please enter a password')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$\-!%*#?&]{8,}$/,
            "Must Contain 8 characters, one uppercase, one lowercase, one number and one special character"
        ),
    checkPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirm is required')
})

export const quantityOneSchema = Yup.object().shape({
    quantity: Yup.number()
        .min(1, "Must be at least 1.")
        .required('This field is required.'),
})


const binsSchema = lazy(obj => object(
    mapValues(obj, (value, key) => {
        return Yup.object().shape({
            count: Yup.number()
                .min(1, "Must be at least 1.")
                .required('This field is required.'),
        })
    })
));

export const CARD_SCHEMA_MODES = {
    EDIT_LOT: "EDIT_LOT",
    MOVE_LOT: "MOVE_LOT"
}

export const uniqueNameSchema = Yup.object().shape({
    name: Yup.string()
        .uniqueByPath("A lot with this name already exists.", "cardNames"),
})

export const editLotSchema = Yup.object().shape({
    name: Yup.string()
        // .min(1, '1 character minimum.')
        .max(50, '50 character maximum.'),
    fields: Yup.array().of(
        Yup.array().of(
            Yup.object().shape({
                // value: Yup.
            }).lotFieldRequired("This field is required.")
        )
    ),
    description: Yup.string()
        .min(1, '1 character minimum.')
        .max(250, '250 character maximum.'),
    bins: binsSchema,
    processId: Yup.string()
        .min(1, '1 character minimum.')
        .max(100, '50 character maximum.')
        .required('Please select a process.')
        .nullable(),
    // dates: Yup.object().nullable().startEndDate("start", "end", "End date must be after start date.")
})

export const getMoveLotSchema = (maxCount) => Yup.object().shape({
    moveCount: Yup.number()
        .min(1, 'Must be positive value.')
        .max(maxCount, `Only ${maxCount} items are available.`)
        .required('Please enter a quantity.'),
    moveLocation: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Please select a destination.'),
        })
    )
        .min(1, 'Please select a destination.')
        .required('Please select a destination.')
        .nullable(),
})

export const LotFormSchema = Yup.object().shape({
    fields: Yup.array().of(
        Yup.array().of(
            Yup.object().shape({
                _id: Yup.string()
                    .required('Field missing ID.'),
                fieldName: Yup.string()
                    .min(1, '1 character minimum.')
                    .max(50, '50 character maximum.')
                    .notIn("This field name is already being used.", [], "displayNames")
                    .notIn("This field name is reserved.", Object.values(LOT_TEMPLATES_RESERVED_FIELD_NAMES))
                    .required('Please enter a name for this field.'),
                style: Yup.object()
            }).dopeUnique("Field names must be unique", "fieldName", "fields")
        )
    ),
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
})

export const templateMapperSchema = Yup.object().shape({
    selectedFieldNames: Yup.array().of(
        Yup.object().shape({
            fieldName: Yup.string()
                .min(1, '1 character minimum.')
                .max(255, '50 character maximum.')
                .required('Please enter field name.'),
        }).dopeUnique("Field names must be unique", "fieldName", "selectedFieldNames")
    )
})

export const selectLotQuantitySchema = Yup.object().shape({
    items: Yup.array().of(
        Yup.object().shape({
            quantity: Yup.number()
                .min(1, 'Must be at least 1.')
                .required('Required.')
        })
    )
})


export const getCardSchema = (mode, availableBinItems) => {
    switch (mode) {
        case CARD_SCHEMA_MODES.EDIT_LOT:
            return editLotSchema
        case CARD_SCHEMA_MODES.MOVE_LOT:
            return getMoveLotSchema(availableBinItems)
        default:
            return editLotSchema

    }

}

const routeStationSchema = lazy(obj => {

    let positionSchema
    let stationSchema
    if (isObject(obj)) {
        if (!obj.position && !obj.station) {
            positionSchema = Yup.string().nullable()
            stationSchema = Yup.string().nullable().required('Please select a location.')
        }
        else if (obj.station && !obj.position) {
            positionSchema = Yup.string().nullable()
            stationSchema = Yup.string().nullable().required('Please select a location.')
        }
        else if (obj.position && !obj.station) {
            positionSchema = Yup.string().nullable().required('Please select a location.')
            stationSchema = Yup.string().nullable()
        }
        else {
            positionSchema = Yup.string().nullable().required('Please select a location.')
            stationSchema = Yup.string().nullable().required('Please select a location.')
        }
    } else {
        positionSchema = Yup.string().nullable().required('Please select a location.')
        stationSchema = Yup.string().nullable().required('Please select a location.')
    }



    return Yup.object().shape({
        instructions: Yup.string().nullable(),
        position: positionSchema,
        station: stationSchema,
        timeout: Yup.string().nullable(),
    })
});

export const routeSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(75, '75 character maximum.')
        .required('Please enter a name.'),
    load: Yup.string().required('Select a load location'),
    unload: Yup.string().required('Select an unload location')
})//.uniqueProperty('part', 'Route part names must be unique')


export const hilModalSchema = Yup.object().shape({
    quantity: Yup.number()
        .min(1, 'Minimum value of 1 required.')
})

export const routesSchema = Yup.array().of(
    routeSchema
)

// export const processSchema = Yup.object().shape({
//     name: Yup.string()
//         .min(1, '1 character minimum.')
//         .max(50, '50 character maximum.')
//         .required('Please enter a name.'),
//     routes: routesSchema,

// })

// const DFSIsCyclic = (routes, node, visited) => {
//     const outgoingRoutes = getNodeOutgoing(node, routes);

//     for (var outgoingRoute of outgoingRoutes){
//         const nextNode = outgoingRoute.unload;
//         if (visited[nextNode] === 'EXPLORING') {
//             return true
//         } else if (visited[nextNode] === false) {
//             visited[nextNode] = 'EXPLORING'
//             let isCyclic = DFSIsCyclic(routes, nextNode, deepCopy(visited));
//             if (isCyclic) return true
//         }
//     }

//     visited[node] = true;
//     return false;

// }

const findAndExpressions = (exp) => {
    let andExpressions = [];

    const recursiveFindAnd = (exp) => {
        // Recursive function to find all AND expressions (split) in the merge expression
       if (exp[0] === 'AND') {
           andExpressions.push(exp)
       };
       for (var i=1; i<exp.length; i++) {
           if (Array.isArray(exp[i])) {
               if (recursiveFindAnd(exp[i])) {
                   return true;
               }
           }
       }
       return false;
    }

    recursiveFindAnd(exp);
}

const doesExpressionConverge = (exp, routes, nodeId) => {

    if (Array.isArray(exp)) {
        if (exp[0] === 'AND') {
            for (var i=1; i<exp.length; i++) {
                if (!doesExpressionConverge(exp[i], routes, nodeId)) {
                    return false
                }
            }
            return true
        } else {
            for (var i=1; i<exp.length; i++) {
                if (doesExpressionConverge(exp[i], routes, nodeId)) {
                    return true
                }
            }
            return false;
        }
        
    } else {
        return routes[exp].unload === nodeId
    }

}


export const getProcessSchema = (stations) => Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    routes: Yup.array().of(
        routeSchema.test(
            'doesConnectWarehouses',
            'Routes cannot go between two warehouses',
            (route) => !(stations[route.load]?.type === 'warehouse' && stations[route.unload]?.type === 'warehouse')
        )
    ).test(
        'doesHaveStartNode',
        'All processes must have at least one "Kick Off" station (The beginning of this process is ambiguous).',
        (routes) => {
            const startNodes = findProcessStartNodes(routes);
            if (startNodes.length === 0) return false;
            else return true
        }
    ).test(
        'doesHaveEndNode',
        'All processes must have at least one "Finish" station. This process has no end.',
        (routes) => {
            const endNodes = findProcessEndNodes(routes);
            if (endNodes.length === 0) return false;
            else return true
        }
    ).test(
        'doRoutesConverge',
        'All split branches of the process must converge at a single station',
        function (routes) {

            const { startDivergeType } = this.parent

            const allNodes = routes.reduce((nodes, route) => {
                if (!nodes.includes(route.load)) nodes.push(route.load)
                if (!nodes.includes(route.unload)) nodes.push(route.unload)
                return nodes
            }, [])

            let normalizedRoutes = {}
            routes.forEach(route => normalizedRoutes[route._id] = route)
            let routeIds = routes.map(r=>r._id)

            // allNodes.forEach(node => {
            //     const mergeExp = handleMergeExpression(node, {startDivergeType, routes: routeIds}, normalizedRoutes, stations)
            // })

            // You can have multiple end nodes, as long as none of them are on a 'split' branch
            const endNodes = findProcessEndNodes(routes);
            for (var endNode of endNodes) {
                const mergeExp = handleMergeExpression(endNode, {startDivergeType, routes: routeIds}, normalizedRoutes, stations, false)
                if (!doesExpressionConverge(mergeExp, normalizedRoutes, endNode)) {
                    return false;
                }
            }
            return true
        }
    ).test(
        'isProcessCyclic',
        'Processes cannot contain loops. As a general rule, if your process contains a loops create a new "virtual" station to loop back to instead.',
        function (routes) {
            // const { startDivergeType } = this.parent

            // const startNodes = findProcessStartNodes(routes);
            // if (startNodes.length === 0) return false

            // for (var startNode of startNodes) {
            //     let stack = [startNode];
            //     let { isCyclic, breakingRoute } = DFSContainsCycle(routes, stack)
            //     if (isCyclic) {
            //         // Cycles are fine as long as they dont originate from a split branch. By getting the merge expression at the node where the 
            //         // breaking route (the route that makes the process cyclic) we can determine if that node is already in a split branch
            //         let normalizedRoutes = {}
            //         routes.forEach(route => normalizedRoutes[route._id] = route)
            //         const mergeExp = handleMergeExpression(breakingRoute.unload, {startDivergeType, routes: routes.map(r=>r._id)}, normalizedRoutes, stations, false)
                    
            //     }
            // }

            // return true
            return true
        }
    )

})

const DFSContainsCycle = (routes, stack) => {

    let node = stack[stack.length-1];
    let outgoingRoutes = getNodeOutgoing(node, routes);
    for (var outgoingRoute of outgoingRoutes) {
        let nextNode = outgoingRoute.unload;
        if (stack.includes(nextNode)) return { isCyclic: true, breakingRoute: outgoingRoute };
        let nextStack = deepCopy(stack);
        nextStack.push(nextNode);
        let { isCyclic, breakingRoute } = DFSContainsCycle(routes, nextStack)
        if (isCyclic) return { isCyclic, breakingRoute };
    }

    return { isCyclic: false, breakingRoute: null };

}

export const locationSchema = (stations, selectedLocation) => {

    let stationNames = []
    Object.values(stations).forEach(station => {
        if (!!selectedLocation && station._id === selectedLocation._id) {

        }
        else {
            stationNames.push(station.name)
        }
    })

    return (
        Yup.object().shape({
            locationName: Yup.string()
                .required('Please enter a name')
                .notOneOf(stationNames, 'Name already in use')
        })
    )
}


// Sees if input1 is greater than input2. If so then through error
Yup.addMethod(Yup.string, 'greaterThan', function (input2Path, message) {
    return this.test('greaterThan', message, function (input1) {
        const { parent, path, createError } = this

        const input2 = parent[input2Path]

        // Take the Hour and minute
        const [beg1, end1] = input1.split(':')
        const [beg2, end2] = input2.split(':')

        const input1Int = parseInt(`${beg1}${end1}`)
        const input2Int = parseInt(`${beg2}${end2}`)

        if (input1Int < input2Int) return true
        else {
            return this.createError({
                path: this.path,
                message: message,
            })
        }

    })
})

// Sees if input1 is less than input2. If so then through error
Yup.addMethod(Yup.string, 'lessThan', function (input2Path, message) {
    return this.test('lessThan', message, function (input1) {
        const { parent, path, createError } = this
        const input2 = parent[input2Path]

        // Take the Hour and minute
        const [beg1, end1] = input1.split(':')
        const [beg2, end2] = input2.split(':')

        const input1Int = parseInt(`${beg1}${end1}`)
        const input2Int = parseInt(`${beg2}${end2}`)

        if (input1Int > input2Int) return true
        else {
            return this.createError({
                path: this.path,
                message: message,
            })
        }

    })
})

// Sees if input1 is less than input2. If so then through error
Yup.addMethod(Yup.number, 'lessThanInt', function (input2Path, message) {
    return this.test('lessThanInt', message, function (input1) {
        const { parent, path, createError } = this
        const input2 = parent[input2Path]

        if (!input2 || !input1) return true
        if (input1 < input2) return true
        else {
            return this.createError({
                path: this.path,
                message: message,
            })
        }

    })
})

export const throughputSchema = Yup.object().shape({
    expectedOutput: Yup.number()
        .nullable(),
    switch1: Yup.bool(),
    startOfShift: Yup.string()
        .required('Required'),
    endOfShift: Yup.string()
        .required('Required')
        .lessThan("startOfShift", 'The end of the shift cannot be before the start of the shift'),
    startOfBreak1: Yup.string()
        // Only validate when true
        .when('switch1', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                // Make sure it starts before the end of the break
                .greaterThan("endOfBreak1", 'The start of the break must be before the end of the break'),
        }),

    endOfBreak1: Yup.string()
        // Only validate when true
        .when('switch1', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                .lessThan("startOfBreak1", 'The end of break cannot be before the start of the break')
                .when('switch2', {
                    is: true,
                    then: Yup.string()
                        .greaterThan("startOfBreak2", 'The end of the break must be before the start of the next break break'),
                })
        }),


    startOfBreak2: Yup.string()
        // Only validate when true
        .when('switch2', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                .greaterThan("endOfBreak2", 'The start of the break must be before the end of the break')
                .when('switch1', {
                    is: true,
                    then: Yup.string()
                        .lessThan("endOfBreak1", 'The start of break cannot be before the end of the previous break'),
                }),
        }),

    endOfBreak2: Yup.string()
        // Only validate when true
        .when('switch2', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                .lessThan("startOfBreak2", 'The end of break cannot be before the start of the break')

                .when('switch3', {
                    is: true,
                    then: Yup.string()
                        .greaterThan("startOfBreak3", 'The end of the break must be before the start of the next break break'),
                }),
        }),

    startOfBreak3: Yup.string()
        // Only validate when true
        .when('switch3', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                .greaterThan("endOfBreak3", 'The start of the break must be before the end of the break')
                .when('switch2', {
                    is: true,
                    then: Yup.string()
                        .lessThan("endOfBreak2", 'The start of break cannot be before the end of the previous break'),
                }),
        }),

    endOfBreak3: Yup.string()
        // Only validate when true
        .when('switch3', {
            is: true,
            then: Yup.string()
                .required('Required')
                // Make sure it starts after the start of shift and before the end of the shift
                .lessThan("startOfShift", 'The first break cannot be before the start of the shift')
                .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift')
                .lessThan("startOfBreak3", 'The end of break cannot be before the start of the break')
        }),

})


export const deviceSchema = Yup.object().shape({

    schedules: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required('Required').nullable(),
                position: Yup.string().required('Required').nullable(),
                time: Yup.string().required('Required').nullable()
            })
        ),

    charge_level: Yup.object().shape({
        chargeEnabled: Yup.bool(),
        min: Yup.number()
            .lessThanInt("max", 'Min Percent must be less then Max percent')
            // Only validate when true
            .when('chargeEnabled', {
                is: true,
                then: Yup.number()
                    .required('Required')
                    .nullable(),
            }),
        max: Yup.number()
            // Only validate when true
            .when('chargeEnabled', {
                is: true,
                then: Yup.number()
                    .required('Required')
                    .nullable(),
            }),

    }),
})
