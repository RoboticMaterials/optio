import uuid from 'uuid'

export const isString = (value) => {
    return (typeof value) === "string"
}

/*
* Are string1 and string2 equal (Case Insensitive)
* */
export const isEqualCI = (string1, string2) => {
    return string1.toLowerCase() === string2.toLowerCase();
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const newlines = (str) => {
    if (!(typeof str === 'string')) return str
    return str.split('\\n').map(s => <span key = {uuid.v4()}>{s.replace('\\n', '')}<br/></span>)
}