import React, { useRef } from 'react';

// functions extenral
import PropTypes from 'prop-types';

// hooks
import useSize from "../../../hooks/useSize";

// styles
import * as styled from "./scroll_container.style"

const ScrollContainer = (props) => {

	const {
		children
	} = props

	const containerRef = useRef(null);
	const scrollContainerRef = useRef(null);

	const containerSize = useSize(containerRef)
	const scrollContainerSize = useSize(scrollContainerRef)

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
	children: PropTypes.any
};

ScrollContainer.defaultProps = {

};

export default ScrollContainer;
