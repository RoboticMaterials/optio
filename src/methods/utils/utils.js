import { TEMP_NEW_SCHEDULE_ID, DEFAULT_TASK_ID } from '../../constants/scheduler_constants';

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function mapArrayToObjById(arr) {
    var obj = {};

    for (let i = 0; i < arr.length; i++) {
        obj[arr[i].id] = arr[i];
    }

    return obj;
}

export const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

export function clone_object(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function timeString24HrToDate(timeString) {
    if (timeString) {
        var date = Date.parse("2019-01-01T" + timeString);
        var newDate = new Date();
        newDate.setTime(date)
        return newDate
    } else {
        return null;
    }

}

export function arraysEqual(_arr1, _arr2) {

    if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
        return false;

    var arr1 = _arr1.concat().sort();
    var arr2 = _arr2.concat().sort();

    for (var i = 0; i < arr1.length; i++) {

        if (arr1[i] !== arr2[i])
            return false;

    }

    return true;

}

// checks if x is a subset of y
export function objectIsSubet(x, y) {
    console.log('inside objectIsSubet')
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    // failure point 1
    // if they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
        console.log('objectIsSubet: failed at 1')
        return false;
    }

    // failure point 2
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    if (x.constructor !== y.constructor) {
        console.log('objectIsSubet: failed at 2')
        return false;
    }


    for (var p in x) {
        console.log('var p in x', x)
        if (!x.hasOwnProperty(p)) continue;
        // other properties were tested using x.constructor === y.constructor

        // failure point 3
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
            console.log('objectIsSubet: failed at 3')
            return false;
        }


        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        // failure point 4
        if (typeof (x[p]) !== "object") {
            console.log('objectIsSubet: failure point 4:', p)
            console.log('objectIsSubet: failure point 4:', x[p])
            console.log('objectIsSubet: failure point 4:', typeof (x[p]))
            console.log('objectIsSubet: failed at 4')
            return false;
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal

        // failure point 5
        if (!objectIsSubet(x[p], y[p])) {
            console.log('objectIsSubet: failed at 5')
            return false;
        }
        // Objects and Arrays must be tested recursively
    }

    //for ( p in y ) {
    //if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
    // allows x[ p ] to be set to undefined
    //}
    return true;
}



export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export function isEquivalent(a, b) {
    // Create arrays of property names
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return a === b;
    }

    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (!isEquivalent(a[propName], b[propName])) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

export function randomHash() {
    var hash = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 16; i++) {
        hash += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return hash;
}

export const upperCaseFirstLetterInString = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}