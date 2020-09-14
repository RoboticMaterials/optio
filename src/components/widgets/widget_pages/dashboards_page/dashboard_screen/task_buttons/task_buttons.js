import React from 'react';

// Import Styles
import * as style from './task_buttons.style';


const TaskButtons = React.memo(props => {
    return(
        <>
            <style.AddContainer className='container'>
                <style.AddButtonContainer className='col-lg-6 col-md-8 d-flex'>
                    <style.AddButton disabled={props.disableButton} onClick={props.addonclick} className={'btn btn-lg'} style={{background: props.buttonstyle}}>
                        {props.title}
                    </style.AddButton>
                </style.AddButtonContainer>
            </style.AddContainer>
        </>
    )

})

export default TaskButtons
