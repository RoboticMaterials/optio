import * as Yup from 'yup';

import { notBrokenRegex, notTaskDeletedRegex } from "./regex_utils";
import { isObject } from "./object_utils";
import { get } from "lodash"
import { isArray } from "./array_utils";
import { LOT_TEMPLATES_RESERVED_FIELD_NAMES } from "../../constants/form_constants";
const { object, lazy, string, number } = require('yup')
const mapValues = require('lodash/mapValues')

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
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    buttons: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required('Please enter a name.'),
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
Yup.addMethod(Yup.object, "unique", function (message, fieldPath) {
    let mapper
    if (fieldPath) mapper = x => get(x, fieldPath)

    return this.test("unique", message, function (item) {
        const { path, createError, parent } = this
        var index = path.match(/\[(.*?)\]/);

        if (index) {
            index = index[1];
        }

        let compareItem
        if (mapper) compareItem = mapper(item)


        let isUnique = true

        let currIndex = 0
        for (const currString of parent) {
            const mapped = mapper(currString)
            if (parseInt(currIndex) !== parseInt(index)) {

                if (mapper) {
                    if (compareItem === mapper(currString)) {
                        isUnique = false
                        return createError({ path: `${path}.${fieldPath}`, message })
                    }
                }
                else {
                    if (item === currString) {
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
                if (!err && mapper(item) !== set[i]) {
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
Yup.addMethod(Yup.string, "notIn", function (message, arr) {
    return this.test("notIn", message, function (value) {
        const { path, createError } = this;
        if (arr.includes(value)) return createError({ path, message })
        return true
    });
});

// returns error if value is in arr
Yup.addMethod(Yup.string, "uniqueByPath", function(message, arrPath) {
    return this.test("uniqueByPath", message, function(value) {
        const { path, createError, parent } = this;

        if(value) {
            const parentValues = parent[arrPath]


            if(isArray(parentValues)) {
                for(const currParentValue of parentValues) {

                    const {
                        name,
                        id
                    } = currParentValue

                    if(name === value && parent._id !== id) return createError({ path, message })
                }
            }
        }

        return true
    });
});

export const signUpSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email'),
    password: Yup.string()
        // .min(8, '8 character minimum')
        // .matches(
        //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        //     'Password must contain atleast 8 characters, One Uppercase, One Lowercase, and one specail character',
        // )

        .required('Please enter a password'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirm is required'),
})

export const signInSchema = Yup.object().shape({
    email: Yup.string()
        .email()
        .required('Please enter an email'),
    password: Yup.string()
        .required('Please enter a password'),

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

export const editLotSchema = Yup.object().shape({
    name: Yup.string()
        // .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .uniqueByPath("A lot with this name already exists.", "cardNames"),
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
                    .notIn("This field name is reserved.", Object.values(LOT_TEMPLATES_RESERVED_FIELD_NAMES))
                    .required('Please enter a name for this field.'),
                style: Yup.object()
            })
        )
    ).nestedUnique('Field names must be unique.', "fieldName"), //message, path
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
        }).unique("Field names must be unique", "fieldName")
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
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    obj: Yup.object().shape({
        name: Yup.string()
            .required('Please enter a name.'),
    }).nullable(),
    track_quantity: Yup.bool().required('Please select whether to use quantities or fractions.'),
    load: routeStationSchema, //.required("Required."),
    unload: routeStationSchema//.required("Required."),
})



export const routesSchema = Yup.array().of(
    routeSchema
)

export const processSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, '1 character minimum.')
        .max(50, '50 character maximum.')
        .required('Please enter a name.'),
    routes: routesSchema,
    newRoute: routeSchema.nullable(),

})

export const getProcessSchema = () => {
    return
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

export const throughputSchema =  Yup.object().shape({
            expectedOutput: Yup.number()
                .required('Required'),
            switch1: Yup.bool(),
            startOfShift: Yup.string()
                .required('Required'),
            endOfShift: Yup.string()
                .required('Required'),
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
                        .greaterThan("startOfBreak2", 'The end of the break must be before the start of the next break break'),
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
                        .lessThan("endOfBreak1", 'The start of break cannot be before the end of the previous break')
                        .greaterThan("endOfBreak2", 'The start of the break must be before the end of the break'),
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
                        .greaterThan("startOfBreak3", 'The end of the break must be before the start of the next break break'),
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
                        .lessThan("endOfBreak2", 'The start of break cannot be before the end of the previous break')
                        .greaterThan("endOfBreak3", 'The start of the break must be before the end of the break'),
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
                        .greaterThan("endOfShift", 'The end of the last break must be before the end of the shift'),
                }),

        })
