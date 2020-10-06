import React, { useState, useEffect } from 'react'


const ObjectLink = (props) => {
    const {
        objectLinks
    } = props

    // console.log('QQQQ Object Link Props', objectLinks)

    const [x1, setX1] = useState(0)
    const [y1, setY1] = useState(0)
    const [x2, setX2] = useState(0)
    const [y2, setY2] = useState(0)

    useEffect(() => {

        // If startPos is not null but endPos is, then set the end pos
        if (objectLinks.startPos.x !== null && objectLinks.endPos.x === null) {
            setX1(objectLinks.startPos.x)
            setY1(objectLinks.startPos.y)
            setX2(objectLinks.startPos.x)
            setY2(objectLinks.startPos.y)
            window.addEventListener('mousemove', lockToMouse, false)
        }
        // If the opposite is true, then set the start pos
        else if (objectLinks.endPos.x !== null && objectLinks.startPos.x === null) {
            setX1(objectLinks.endPos.x)
            setY1(objectLinks.endPos.y)
            setX2(objectLinks.endPos.x)
            setY2(objectLinks.endPos.y)
            window.addEventListener('mousemove', lockToMouse, false)
        }

        // Else both are defined so that's good, I guess...
        else {
            setX1(objectLinks.startPos.x)
            setY1(objectLinks.startPos.y)
            setX2(objectLinks.endPos.x)
            setY2(objectLinks.endPos.y)
            window.removeEventListener('mousemove', lockToMouse, false)

        }

        return () => {
            window.removeEventListener('mousemove', lockToMouse, false)

        }


    }, [objectLinks])

    /**
     * Locks line to cursor
     * @param {*} e 
     */
    const lockToMouse = (e) => {

        // Have to get the widget page bounding box to get correct location of mouse
        // Since the widget page is not 100% of the page, the cursor position is offset by the margins
        const rect = document.getElementById('widgetPage').getBoundingClientRect()

        setX2(e.clientX - rect.left)
        setY2(e.clientY - rect.top)
    }

    // console.log('QQQQ Y2 and X2', x2, y2)

    return (
        <>
            <g>
                <line
                    x1={`${x1}`} y1={`${y1}`}
                    x2={`${x2}`} y2={`${y2}`}
                    strokeWidth={'1rem'} stroke='rgba(95,166,236, 0.95)'
                    strokeLinecap="round"
                />
            </g>
        </>
    )
}

export default ObjectLink