export const isString = (value) => {
    return (typeof value) === "string"
}

/*
* Are string1 and string2 equal (Case Insensitive)
* */
export const isEqualCI = (string1, string2) => {
    return string1.toLowerCase() === string2.toLowerCase()
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const constantToPascalCase = (string => {
    return string.replace(new RegExp(/[-_]+/, 'g'),
        function(w){
        console.log("w",w)
        return w[0].toUpperCase() + w.slice(1).toLowerCase();});
})

export const toPascalCase = (string) => {
    return ` ${string}`
        .replace(new RegExp(/[-_]+/, 'g'), (a,b,c) => {
            return " "
        })
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => {
                return `${$2.toUpperCase() + $3.toLowerCase()}`
                }
        )
}


