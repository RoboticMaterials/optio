import React, { useState, useMemo, useEffect } from 'react';

// Import Styles
import * as hilStyles from '../hil_modals.style'
import * as styled from './hil_success.style'

const HILSuccess = (props) => {

    return(
        <styled.Container
            isOpen={true}
            style={{
                overlay: {
                    zIndex: 5000,
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(5px)',
                    transition: 'backdrop-filter 3s ease',
                },
                content: {
                    zIndex: 5000,
                },
            }}
        >
            <hilStyles.HilIcon color='green' style={{fontSize:'6rem'}} className='fas fa-check'/>
            <hilStyles.HilMessage>Task has been added to the Queue</hilStyles.HilMessage>
        </styled.Container>
    )
}

export default HILSuccess