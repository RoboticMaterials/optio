import React from 'react';
import PropTypes from 'prop-types';

import * as styled from './page_selector.style'

const PageSelector = (props) => {

	const {
		value,
		onBack,
		onForward,
		maxValue
	} = props

	return (
		<styled.Container>
			<styled.Selector
				className="fas fa-chevron-left"
				onClick={onBack}
				disabled={value <= 1}
			/>

			<styled.Text>
				{`${value} / ${maxValue}`}
			</styled.Text>

			<styled.Selector
				className="fas fa-chevron-right"
				onClick={onForward}
				disabled={value === maxValue}
			/>
		</styled.Container>

	);
};

PageSelector.propTypes = {

};

PageSelector.defaultProps = {

};

export default PageSelector;
