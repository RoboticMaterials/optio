export const getMessageFromError = (err) => {
    if(err) {
        let message = "";

        // handle array of errors
        if( Array.isArray(err) ) {
            const firstErr = err[0];
            if(typeof(firstErr) === "object") {
                return Object.values(firstErr);
            }
            return firstErr;
        }

        if(typeof(err) === "object") {
            return Object.values(err);
        }
        return err;
    }

    return err


}