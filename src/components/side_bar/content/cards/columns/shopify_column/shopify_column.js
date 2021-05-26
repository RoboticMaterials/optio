import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./shopify_column.style";

import React, {useState} from "react";

import Column from "../column/column"

import * as order from './thor_order.json' 

export const ShopifyColumn = ((props) => {
	const {
		// station_id,
		stationName = "Shopify",
		// onCardClick,
		cards = [],
		// processId,
		// maxHeight,
		// sortMode,
		// sortDirection,
		selectedCards = [],
		setSelectedCards
	} = props

	order.default.order.line_items.forEach(lineItem => {

		cards.push({
			binId: "SHOP",
			cardId: lineItem.id,
			count: lineItem.fulfillable_quantity,
			description: "",
			end_date: null,
			name: lineItem.name,
			processName: "Main",
			process_id: lineItem.sku,
			start_date: {year: 2021, month: 2, day: 12},
			totalQuantity: lineItem.fulfillable_quantity,
		})
		
	});

	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			setSelectedCards={setSelectedCards}
			selectedCards={selectedCards}
			// sortDirection={sortDirection}
			// maxHeight={maxHeight}
			// sortMode={sortMode}
			maxWidth={"24rem"}
			HeaderContent={(numberOfLots = 0, lotQuantitySummation = 0)=>{
				if(isCollapsed) {
					return(
						<styled.StationHeader>
							<i className="fa fa-chevron-right" aria-hidden="true"
							   onClick={() => setCollapsed(false)}
								 style = {{cursor: "pointer"}}
							/>
						</styled.StationHeader>
					)
				}
				else {
					return(
						<styled.StationHeader>
							<styled.HeaderRow style={{
								marginBottom: "1rem"
							}}>
								<i className="fa fa-chevron-down" aria-hidden="true"
								   onClick={() => setCollapsed(true)}
									 style = {{cursor: "pointer"}}
								/>

								<styled.LabelContainer>

									<styled.StationTitle>{stationName}</styled.StationTitle>
								</styled.LabelContainer>

								<i className="fas fa-ellipsis-h" style={{opacity: 0}}></i>
							</styled.HeaderRow>

							<styled.HeaderRow>
								<div>
									<styled.QuantityText>Lots: </styled.QuantityText>
									<styled.QuantityText>{numberOfLots}</styled.QuantityText>
								</div>

								<div>
									<styled.QuantityText>Total Quantity: </styled.QuantityText>
									<styled.QuantityText>{lotQuantitySummation}</styled.QuantityText>
								</div>
							</styled.HeaderRow>
						</styled.StationHeader>
					)
				}
			}}
			// station_id={station_id}
			stationName = {stationName}
			// onCardClick={onCardClick}
			cards = {cards}
			// processId={processId}
			isCollapsed={isCollapsed}
		/>
	)
})