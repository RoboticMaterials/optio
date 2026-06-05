import {useEffect, useState} from "react";

const useSize = (sizeRef) => {

	const [size, setSize] = useState({
		offsetWidth: undefined,
		offsetHeight: undefined,
		offsetLeft: undefined,
		offsetTop: undefined,
	})

	const {
		offsetHeight,
		offsetWidth,
		offsetTop,
		offsetLeft
	} = size || {}

	const {
		offsetHeight: refOffsetHeight,
		offsetWidth: refOffsetWidth,
		offsetTop: refOffsetTop,
		offsetLeft: refOffsetLeft
	} = sizeRef.current || {}

	useEffect(() => {

		// if sizeRef is assigned
		if (sizeRef.current) {

			const {
				offsetHeight,
				offsetWidth,
				offsetTop,
				offsetLeft
			} = sizeRef.current || {}

			// set zoneSize
			setSize({
				offsetHeight,
				offsetWidth,
				offsetTop,
				offsetLeft
			});
		}

	}, [sizeRef, refOffsetWidth, refOffsetHeight])

	return size
}

export default useSize