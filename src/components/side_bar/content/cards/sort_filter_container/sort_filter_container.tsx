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
import LotFilterBarBasic from '../lot_filter_bar/lot_filter_bar_basic'
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
		multipleFilters,
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
			{!!multipleFilters ?
				<LotFilterBar
					filters={filters}
					onAddFilter={onAddFilter}
					onRemoveFilter={onRemoveFilter}
				/>
				:
				<LotFilterBarBasic
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
					filters={filters}
					onAddFilter={onAddFilter}
					onRemoveFilter={onRemoveFilter}
				/>
			}


			{/*</styled.OptionContainer>*/}
		</BarsContainer>
	);
};

SortFilterContainer.propTypes = {

};

export default SortFilterContainer;
