import moment from 'moment';

export const getMinutesFromMoment = (m) => {
    return m.minutes() + m.hours() * 60;
}

/**
 * Takes in time12h which is a string: 1:30 pm
 * Converts that string into a 24h string: 13:30
 * @param {*} time12h 
 */
export const convert12hto24h = (time12h) => {
    const [numericTime, modifier] = time12h.split(' ');

    let [hours, minutes] = numericTime.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM' || modifier === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`
}

/**
 * Takes in a string time24h: 13:30
 * Converts that string into a 12h string: 1:30 pm
 * @param {*} time24h 
 */
export const convert24hto12h = (time24h) => {
    let modifier = 'am'

    let [hours, minutes] = time24h.split(':');

    hours = parseInt(hours)

    if (hours >= 12) {
        hours = hours - 12
        modifier = 'pm'
    }

    return `${hours}:${minutes} ${modifier}`

}

/**
 * Takes in a string: 1 pm
 * Converts that string to 24 hours: 13:000
 * @param {*} string 
 */
export const convertTimeStringto24h = (string) => {
    let [hour, modifier] = string.split(' ');
    hour = parseInt(hour)

    // If pm and not 12pm then add 12
    if (modifier === 'pm' && hour !== 12) {
        hour = hour + 12
    }

    // If hour is 12pmm, then set to 0
    if (hour === 12 && modifier === 'pm') {
        hour = 0
    }

    // Convert back to string
    // Add 0 to front if need be
    if (hour < 10) {
        hour = hour.toString()
        hour = `0${hour}`
    }
    else {
        hour = hour.toString()
    }

    return `${hour}:00`

}

export const convertEpochTo12h = (epoch) => {

    let convertedTime = new Date(epoch * 1000)
    let hour = convertedTime.getHours()
    let minute = convertedTime.getMinutes()

    hour = parseInt(hour)
    minute = parseInt(minute)

    if (hour < 10) {
        hour = hour.toString()
        hour = `0${hour}`
    }
    else {
        hour = hour.toString()
    }

    if (minute < 10) {
        minute = minute.toString()
        minute = `0${minute}`
    }
    else {
        minute = minute.toString()
    }

    return `${hour}:${minute}`
}

/**
 * Converts 24h string to int
 * '13:00' is converted to 1300
 * @param {*} time24h 
 */
export const convert24htoInt = (time24h) => {
    const [hour, minute] = time24h.split(':')
    return parseInt(`${hour}${minute}`)
}

/**
 * Converts into to 24h
 * 1300 is converted to '13:00'
 * @param {*} int 
 */
export const convertIntto24h = (int) => {
    let hour
    let minute

    // If the string length is 3, then the hour must start with a 0
    if (int.toString().length === 3) {
        hour = `0${int.toString()[0]}`
        minute = `${int.toString()[1]}${int.toString()[2]}`
    }
    else {
        hour = `${int.toString()[0]}${int.toString()[1]}`
        minute = `${int.toString()[2]}${int.toString()[3]}`
    }
    return `${hour}:${minute}`
}

export const convert24htoEpch = (time24h, date) => {

}