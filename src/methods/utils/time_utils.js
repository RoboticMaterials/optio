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