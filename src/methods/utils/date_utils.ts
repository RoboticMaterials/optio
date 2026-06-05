export const isValidDateString = (dateString) => {
    return (dateString !== null) && (dateString !== "Invalid Date") && (dateString !== undefined)
}

export const getDateStringFromDate = (date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`

}