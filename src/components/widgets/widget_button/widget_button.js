import React from 'react';
import { useHistory } from 'react-router-dom'

import * as styled from './widget_button.style'
// import { styled } from '@material-ui/core';

const WidgetButton = (props) => {
    const history = useHistory()
    
    return(
        <styled.WidgetButtonButton 
            onClick={() => {
                history.push('/locations/' + props.id + '/' + props.type)
            }}
            pageID={props.type} 
            currentPage={props.currentPage}
        >
            {props.type === 'view' ?
                <styled.WidgetButtonIcon className="far fa-eye" pageID={props.type} currentPage={props.currentPage}/>
            :
                <styled.WidgetButtonIcon className={"icon-" + props.type} pageID={props.type} currentPage={props.currentPage}/>
            }
            {/* <styled.ButtonText>{props.type}</styled.ButtonText> */}
        </styled.WidgetButtonButton>
    )
}

export default WidgetButton