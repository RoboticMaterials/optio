export const getMinutesFromMoment = (m) => {
    return m.minutes() + m.hours() * 60;
}

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