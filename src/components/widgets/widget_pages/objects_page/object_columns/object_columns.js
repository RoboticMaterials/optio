import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './object_columns.style'


const ObjectColumns = (props) => {

    const {
        parsedObjects
    } = props

    const locations = useSelector(state => { return state.locationsReducer.locations })
    const objects = useSelector(state => state.objectsReducer.objects)

    // const [parsedObjects, setParsedObjects] = useState({parsedObjectsProps})
    console.log('QQQQ Parsed Objecst', parsedObjects)

    if(Object.keys(parsedObjects).length === 0) return null

    /**
     * Handles all the objects arriving at the stating (unloaded objects). These objects will appear in the left column
     */
    const handleUnloadObjects = () => {

        // A list of all the unload objects ids
        const unloadObjects = Object.values(parsedObjects.unload)

        return unloadObjects.map((object, ind) => {

            const currentObject = objects[object]

            const currentObjectName = currentObject.name

            return (
                <styled.ObjectContainer key={object}>
                    <styled.ObjectName>{currentObjectName}</styled.ObjectName>
                </styled.ObjectContainer>
            )
        })
    }

    /**
     * Handles all the objects leaving the station (load objects). These objects will appear in the right column
     */
    const handleLoadObjects = () => {

    }

    return (
        <>
            <styled.LeftColumn>
                {handleUnloadObjects()}
            </styled.LeftColumn>

            <styled.RightColumn>
                {handleLoadObjects()}
            </styled.RightColumn>
        </>
    )
}

export default ObjectColumns