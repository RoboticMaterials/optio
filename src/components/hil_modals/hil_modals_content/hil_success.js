import React, { useState, useMemo, useEffect } from 'react';

// Import Styles
import * as styled from '../hil_modals.style'

const HILSuccess = (props) => {

    return(
        <styled.HilContainer style={{justifyContent: 'center', }}>
            <styled.HilIcon color='green' style={{fontSize:'6rem'}} className='fas fa-check'/>
            <styled.HilMessage>Task has been added to the Queue</styled.HilMessage>
        </styled.HilContainer>
    )
}

export default HILSuccess