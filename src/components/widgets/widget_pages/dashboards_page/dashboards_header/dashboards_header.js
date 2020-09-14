import React, {useContext, useEffect, useState} from "react";

// import components
import BounceButton from "../../../../basic/bounce_button/bounce_button";
import BackButton from '../../../../basic/back_button/back_button'
import Button from '../../../../basic/button/button'


// import external funcations
import {ThemeContext} from "styled-components";
import {withRouter} from "react-router-dom";

// import constants
import { PAGES } from "../../../../../constants/dashboard_contants";

import * as style from "./dashboards_header.style";

const DashboardsHeader = (props) => {

	const {
		children,
		showTitle,
		showBackButton,
		showEditButton,
		showSaveButton,
		showSidebar,
		setShowSidebar,
		setEditingDashboard,
		page,

		saveDisabled,
		onBack,
	} = props

	const themeContext = useContext(ThemeContext);

	// extract url params
	const { stationID, dashboardID, editing } = props.match.params

	// goes to main dashboards page
	const goToMainPage = () => {
		props.history.push(`/locations/${stationID}/dashboards`)
	}

	return(
		<style.Header>

			{showBackButton &&
				<BackButton style={{dorder: '1'}} containerStyle={{marginTop: '1.8rem'}}
					onClick={onBack}
				/>
			}

			{showTitle &&
				<style.Title style={{order: '2'}}>{page}</style.Title>
			}

			{showEditButton && 
				<Button style={{order: '3', marginTop: '1.8rem'}}
					onClick={setEditingDashboard}
				>
					Edit
				</Button>
			}

			{showSaveButton && 
				<Button style={{order: '3', marginTop: '1.8rem'}}
					type="submit"
					disabled={saveDisabled}
				>
					Save
				</Button>
			}

			{children}
		</style.Header>
	)
}

export default withRouter(DashboardsHeader)