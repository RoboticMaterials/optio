import {useEffect, useState} from "react"

const SubmitErrorHandler = ({ submitCount, isValid, onSubmitError }) => {
    const [lastHandled, setLastHandled] = useState(0)
    useEffect(() => {
        if (submitCount > lastHandled && !isValid) {
            onSubmitError()
            setLastHandled(submitCount)
        }
    }, [submitCount, isValid, onSubmitError, lastHandled])

    return null
}

export default SubmitErrorHandler