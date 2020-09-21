import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as style from './objects_page.style'

// Import Components
import ObjectColumns from './object_columns/object_columns'

// Import utils
import { handleParseTaskBasedOnLoadUnload } from '../../../../methods/utils/object_utils'


const ObjectsPage = () => {

    const params = useParams()
    const locationID = params.locationID
    const tasks = useSelector(state => state.tasksReducer.tasks)

    const [parsedObjects, setParsedObjects] = useState({})


    /**
     * Handle associated objects on page mount
     */
    useEffect(() => {
        handleAssociatedObjects()
    }, [])

    /**
     * Finds all asociated objects for the location
     */
    const handleAssociatedObjects = () => {
        const parsedObjectsReturned = handleParseTaskBasedOnLoadUnload(tasks, locationID)

        setParsedObjects(parsedObjectsReturned)
    }

    

    return (

        <>
            <ObjectColumns parsedObjects={parsedObjects}/>
            <p>This'll Be the Objects Page</p>
        </>
    )
}

export default ObjectsPage