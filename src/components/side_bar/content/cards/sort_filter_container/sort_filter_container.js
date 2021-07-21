import React from 'react';
import PropTypes from 'prop-types';
import LotSortBar from "../lot_sort_bar/lot_sort_bar";
import {
	BarsContainer,
	columnCss,
	containerCss,
	descriptionCss,
	dropdownCss,
	reactDropdownSelectCss,
	valueCss
} from "../lot_bars.style";
import LotFilterBar from "../lot_filter_bar/lot_filter_bar";
import * as styled from "../zone_header/zone_header.style";

const SortFilterContainer = (props) => {
	const {
		sortMode,
		setSortMode,
		sortDirection,
		setSortDirection,
		
		filters,
		onAddFilter,
		onRemoveFilter,

        containerStyle,
	} = props

	return (
		<BarsContainer style={containerStyle}>
			{/*<styled.OptionContainer>*/}
			<LotSortBar
				sortMode={sortMode}
				setSortMode={setSortMode}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
			/>
			{/*</styled.OptionContainer>*/}

			{/*<styled.OptionContainer>*/}
			<LotFilterBar
				filters={filters}
				onAddFilter={onAddFilter}
				onRemoveFilter={onRemoveFilter}
			/>
			{/*</styled.OptionContainer>*/}
		</BarsContainer>
	);
};

SortFilterContainer.propTypes = {

};

export default SortFilterContainer;
