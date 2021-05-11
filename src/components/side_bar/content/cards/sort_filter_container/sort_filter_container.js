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
		shouldFocusLotFilter,
		setLotFilterValue,
		selectedFilterOption,
		setSelectedFilterOption,
		lotFilterValue,
        containerStyle,
	} = props

	return (
		<BarsContainer style={containerStyle}>
			{/*<styled.OptionContainer>*/}
			<LotSortBar
				columnCss={columnCss}
				containerCss={containerCss}
				descriptionCss={descriptionCss}
				dropdownCss={dropdownCss}
				valueCss={valueCss}
				reactDropdownSelectCss={reactDropdownSelectCss}
				sortMode={sortMode}
				setSortMode={setSortMode}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
			/>
			{/*</styled.OptionContainer>*/}

			{/*<styled.OptionContainer>*/}
			<LotFilterBar
				lotFilterValue={lotFilterValue}
				columnCss={columnCss}
				containerCss={containerCss}
				descriptionCss={descriptionCss}
				dropdownCss={dropdownCss}
				valueCss={valueCss}
				reactDropdownSelectCss={reactDropdownSelectCss}
				shouldFocusLotFilter={shouldFocusLotFilter}
				setLotFilterValue={setLotFilterValue}
				selectedFilterOption={selectedFilterOption}
				setSelectedFilterOption={setSelectedFilterOption}
			/>
			{/*</styled.OptionContainer>*/}
		</BarsContainer>
	);
};

SortFilterContainer.propTypes = {

};

export default SortFilterContainer;
