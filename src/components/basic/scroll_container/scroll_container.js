import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./scroll_container.style"
import useSize from "../../../hooks/useSize";

const ScrollContainer = (props) => {

	const {
		children
	} = props

	const containerRef = useRef(null);
	const scrollContainerRef = useRef(null);

	const containerSize = useSize(containerRef)
	const scrollContainerSize = useSize(scrollContainerRef)

	console.log("containerSize",containerSize)
	console.log("scrollContainerSize",scrollContainerSize)


	return (
		<styled.Container
			ref={containerRef}
		>
			{(scrollContainerSize.offsetHeight > containerSize.offsetHeight) &&
				<styled.Divider></styled.Divider>
			}

			<styled.ScrollContainer>
				<styled.ContentContainer
					ref={scrollContainerRef}
				>
					{children}
				</styled.ContentContainer>
			</styled.ScrollContainer>
		</styled.Container>
	);
};

ScrollContainer.propTypes = {

};

ScrollContainer.defaultProps = {

};

export default ScrollContainer;
