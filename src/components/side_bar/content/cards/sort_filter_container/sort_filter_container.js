import React from 'react';
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
import uuid from "uuid";


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
		<BarsContainer style={containerStyle} key={uuid.v4()}>
			{/*<styled.OptionContainer>*/}
			<LotSortBar
				key={uuid.v4()}
				sortMode={sortMode}
				setSortMode={setSortMode}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
			/>
			{/*</styled.OptionContainer>*/}

			{/*<styled.OptionContainer>*/}
			{!!multipleFilters ?
				<LotFilterBar
					key={uuid.v4()}
					filters={filters}
					onAddFilter={onAddFilter}
					onRemoveFilter={onRemoveFilter}
				/>
				:
				<LotFilterBarBasic
					key={uuid.v4()}
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
