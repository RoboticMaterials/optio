import React from 'react';

// Import Styles
import * as style from './dashboard_header_status.style';

const DashboardHeaderStatus = (props) => {
    return(
        <>
            <style.AddContainer className='contianer'>
                <style.Text>{props.currentTask}</style.Text>
                <style.Text>{props.taskStatus} </style.Text>
            </style.AddContainer>
        </>
    )
}
export default DashboardHeaderStatus