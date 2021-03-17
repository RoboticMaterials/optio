import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Redirector = (props) => {
    const {
        condition,
        endpoint
    } = props

    const history = useHistory()

    useEffect(() => {
        const {
            pathname
        } = history.location

        if(condition && (endpoint !== pathname)) {
            history.push(endpoint)
        }
    }, [condition])

    return null

}

export default Redirector