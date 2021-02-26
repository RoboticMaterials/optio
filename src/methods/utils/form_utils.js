export const getMessageFromError = (err) => {
    if(err) {

        // err is array
        if( Array.isArray(err) ) {
            const firstErr = err[0] // get first item from arr and call recursively
            return getMessageFromError(firstErr)

        }

        // err is object
        if(typeof(err) === "object") {
            const firstErr = Object.values(err) // convert to arr and call recursively
            return getMessageFromError(firstErr)
        }

        // err is string - return
        if(typeof(err) === "string") {
            return err;
        }
    }

    // default message
    return "Error."
}

export const getSubmitDisabled = ({errors, touched, isSubmitting, submitCount}) => {
    const errorCount = Object.keys(errors).length > 0 // get number of field errors
    const touchedCount = Object.values(touched).length // number of touched fields
    return ((errorCount > 0)  )
}