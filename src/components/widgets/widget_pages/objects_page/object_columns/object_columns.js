import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './object_columns.style'

import ObjectLink from '../object_link/object_link'


const ObjectColumns = (props) => {

    const {
        parsedObjects
    } = props

    const [objectLinks, setObjectLinks] = useState({})
    const [link, setLink] = useState({
        startPos: {
            id: null,
            x: null,
            y: null,
        },
        endPos: {
            id: null,
            x: null,
            y: null,
        }
    })

    const locations = useSelector(state => { return state.locationsReducer.locations })
    const objects = useSelector(state => state.objectsReducer.objects)

    // const [parsedObjects, setParsedObjects] = useState({parsedObjectsProps})
    if (Object.keys(parsedObjects).length === 0) return null

    /**
     * Handles all the objects arriving at the stating (unloaded objects). These objects will appear in the left column
     */
    const handleUnloadObjects = () => {

        // A list of all the unload objects ids
        const unloadObjects = Object.values(parsedObjects.unload)
        
        return unloadObjects.map((object, ind) => {
            if(object === undefined) return

            const currentObject = objects[object]

            const currentObjectName = currentObject.name

            return (
                <styled.ObjectContainer
                    key={`unload-${ind}`}
                    id={`unload-${ind}`}

                    onClick={() => {
                        const el = document.getElementById(`unload-${ind}`).getBoundingClientRect()

                        console.log('QQQQ X and Y', el)

                        // Have to get the widget page bounding box to get correct location of mouse
                        // Since the widget page is not 100% of the page, the cursor position is offset by the margins
                        const rect = document.getElementById('widgetPage').getBoundingClientRect()

                        const x = el.x - rect.left + el.width
                        const y = el.y - rect.top + el.height/2

                        handleObjectLinkPoints({
                            unload: true,
                            id: currentObject._id,
                            x: x,
                            y: y,
                        })

                    }}
                >
                    <styled.ObjectName>{currentObjectName}</styled.ObjectName>
                </styled.ObjectContainer>
            )
        })
    }

    /**
     * Handles all the objects leaving the station (load objects). These objects will appear in the right column
     */
    const handleLoadObjects = () => {

        // A list of all the unload objects ids
        const loadObjects = Object.values(parsedObjects.load)

        return loadObjects.map((object, ind) => {
            if(object === undefined) return
            const currentObject = objects[object]

            const currentObjectName = currentObject.name

            return (
                <styled.ObjectContainer
                    key={`load-${ind}`}
                    id={`load-${ind}`}
                    onClick={() => {
                        const el = document.getElementById(`load-${ind}`).getBoundingClientRect()

                        console.log('QQQQ X and Y', el)

                        // Have to get the widget page bounding box to get correct location of mouse
                        // Since the widget page is not 100% of the page, the cursor position is offset by the margins
                        const rect = document.getElementById('widgetPage').getBoundingClientRect()

                        const x = el.x - rect.left
                        const y = el.y - rect.top + el.height/2

                        handleObjectLinkPoints({
                            unload: false,
                            id: currentObject._id,
                            x: x,
                            y: y,
                        })
                    }}
                >
                    <styled.ObjectName>{currentObjectName}</styled.ObjectName>
                </styled.ObjectContainer>
            )
        })
    }

    const handleObjectLinks = () => {
        
    }

    /**
     * This handles link points.
     * If the selected object is loading from the station, then its an end point (on the right side of the screen)
     * If the selected object is unloading to the station, then its a start point (on the left side of the screen)
     * @param {*} point 
     */
    const handleObjectLinkPoints = (point) => {

        let editedLink = {
            ...link
        }

        if (point.unload) {
            editedLink = {
                ...link,
                startPos: {
                    id: point.id,
                    x: point.x,
                    y: point.y
                }
            }
            setLink(editedLink)
        } else {
            editedLink = {
                ...link,
                endPos: {
                    id: point.id,
                    x: point.x,
                    y: point.y
                }
            }
            setLink(editedLink)
        }

        setObjectLinks(
            // ...objectLinks,
            // [link.startPos.id]: link,
            editedLink
        )

    }

    // const handleMouseMove = (event) => {
    //     console.log('QQQQ Event', event)
    // }

    // document.onmousemove = handleMouseMove;

    return (
        <>
            <svg width="100%" height="100%">
                {Object.keys(objectLinks).length > 0 &&
                    <ObjectLink objectLinks={objectLinks} />

                }
            </svg>

            <styled.LeftColumn>
                <styled.ColumnLabel>Incoming</styled.ColumnLabel>
                {handleUnloadObjects()}
            </styled.LeftColumn>

            <styled.RightColumn>
                <styled.ColumnLabel>Outgoing</styled.ColumnLabel>
                {handleLoadObjects()}
            </styled.RightColumn>


        </>
    )
}

export default ObjectColumns