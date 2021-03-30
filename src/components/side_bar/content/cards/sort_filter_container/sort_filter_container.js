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
		lotFilterValue
	} = props

	return (
		<BarsContainer>
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
		</BarsContainer>
	);
};

SortFilterContainer.propTypes = {

};

export default SortFilterContainer;
