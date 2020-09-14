import React from 'react';

// Import Styles
import * as style from './dashboard_hil_status.style';

const DashboardHILStatus = (props) => {
    return(
        <style.HilContainer >
            <style.HilBorderContainer >
                <style.HilMessage>Message</style.HilMessage>
                <style.HilTimer>Timer</style.HilTimer>

                <style.HilInputContainer>

                    <style.HilInputIcon
                        className='fas fa-plus-circle'
                        style={{color: '#1c933c'}}
                    />
                    <style.HilInput type="number"/>
                    <style.HilInputIcon
                        className='fas fa-minus-circle'
                        style={{color: '#ff1818'}}

                    />

                </style.HilInputContainer>
                
                <style.HilButtonContainer>

                    <style.HilButton color={'#90eaa8'}>
                        <style.HilIcon onClick={props.hilSuccess} className='fas fa-check' color={'#1c933c'}/>
                        <style.HilButtonText color={'#1c933c'}>Confirm</style.HilButtonText>
                    </style.HilButton>

                    <style.HilButton color={'#f7cd89'}>
                        <style.HilIcon onClick={props.hilPostpone} className='icon-postpone' color={'#ff7700'} style={{marginTop:'.5rem'}}/>
                        <style.HilButtonText color={'#ff7700'}>Postpone</style.HilButtonText>
                    </style.HilButton>

                    <style.HilButton color={'#ff9898'}>
                        <style.HilIcon onClick={props.hilFailure} className='fas fa-times' color={'#ff1818'}/>
                        <style.HilButtonText color={'#ff1818'}>Cancel</style.HilButtonText>
                    </style.HilButton>

                </style.HilButtonContainer>

            </style.HilBorderContainer>
        </style.HilContainer>
    )
}
export default DashboardHILStatus
