import {SortableContainer} from "react-sortable-hoc";

import * as styled from "./shopify_column.style";

import React, {useEffect, useState} from "react";

import Column from "../column/column"

import * as order from './thor_order.json' 

import {deepCopy} from '../../../../../../methods/utils/utils'

export const ShopifyColumn = ((props) => {
	const {
		station_id,
		stationName = "Shopify",
		onCardClick,
		cards = [],
		processId,
		maxHeight,
		sortMode,
		sortDirection,
		selectedCards = [],
		setSelectedCards
	} = props

	const [stateCards, setStateCards] = useState(cards)

	useEffect(() => {
		const newCards = deepCopy(cards)
		order.default.order.line_items.forEach(lineItem => {
			newCards.push({
				station_id: "SHOPIFY",
				binId: "8127b77d-707b-4bb2-9c22-d916fd077a80",
				cardId: lineItem.id,
				count: lineItem.fulfillable_quantity,
				name: lineItem.name,
				processName: "Welder Assembly",
				lotTemplateId: "BASIC_LOT_TEMPLATE",
				// process_id: lineItem.sku,
				process_id: "61753d6e-d0f1-4778-9543-22d8f1d2f352",
				totalQuantity: lineItem.fulfillable_quantity,
				syncWithTemplate: false,
				lotNumber: 268000,
				fields: [
					{
						component: "TEXT_BOX_BIG",
						dataType: "STRING",
						fieldName: "description",
						key: 0,
						required: false,
						showInPreview: true,
						value: "",
						_id: "DEFAULT_DESCRIPTION_FIELD_ID"
					},
					{
						component: "CALENDAR_START_END",
						dataType: "DATE_RANGE",
						fieldName: "dates",
						key: 1,
						required: false,
						showInPreview: true,
						value: [null, null],
						_id: "DEFAULT_DATES_FIELD_ID"
					}
				],
				flags: []
			})
		});

		setStateCards(newCards)
		return () => {
			
		}
	}, [])



	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			setSelectedCards={() => {}}
			selectedCards={[]}
			sortDirection={sortDirection}
			maxHeight={maxHeight}
			sortMode={sortMode}
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
			station_id={station_id}
			stationName = {stationName}
			onCardClick={onCardClick}
			cards = {stateCards}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)
})
